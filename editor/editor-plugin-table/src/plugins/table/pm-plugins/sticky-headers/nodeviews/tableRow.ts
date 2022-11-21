import { Node as PmNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';

import { findOverflowScrollParent } from '@atlaskit/editor-common/ui';

import { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';

import { mapChildren } from '@atlaskit/editor-common/utils';
import {
  TableCssClassName as ClassName,
  TableCssClassName,
  TablePluginState,
} from '../../../types';
import {
  stickyHeaderBorderBottomWidth,
  stickyRowOffsetTop,
  tableControlsSpacing,
  tableScrollbarOffset,
} from '../../../ui/consts';
import { pluginKey as tablePluginKey } from '../../plugin-key';
import {
  syncStickyRowToTable,
  updateStickyMargins as updateTableMargin,
} from '../../table-resizing/utils/dom';
import { updateStickyState } from '../commands';
import { getTop, getTree, TableDOMElements } from './dom';
import type { GetEditorFeatureFlags } from '@atlaskit/editor-common/types';

import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';

// limit scroll event calls
const HEADER_ROW_SCROLL_THROTTLE_TIMEOUT = 200;

// timeout for resetting the scroll class - if it’s too long then users won’t be able to click on the header cells,
// if too short it would trigger too many dom udpates.
const HEADER_ROW_SCROLL_RESET_DEBOUNCE_TIMEOUT = 400;

export const supportedHeaderRow = (node: PmNode) => {
  const allHeaders = mapChildren(
    node,
    (child) => child.type.name === 'tableHeader',
  ).every(Boolean);

  const someMerged = mapChildren(
    node,
    (child) => child.attrs.rowspan || 0,
  ).some((rowspan) => rowspan > 1);

  return allHeaders && !someMerged;
};

export class TableRowNodeView implements NodeView {
  view: EditorView;
  node: PmNode;
  getPos: () => number;
  eventDispatcher: EventDispatcher;

  dom: HTMLTableRowElement; // this is the sticky header table row
  contentDOM: HTMLElement;

  isHeaderRow: boolean;
  editorScrollableElement?: HTMLElement | Window;
  colControlsOffset = 0;
  focused = false;
  topPosEditorElement = 0;
  isSticky: boolean;
  isTableInit: boolean;
  lastTimePainted: number;

  private intersectionObserver?: IntersectionObserver;
  private resizeObserver?: ResizeObserver;
  private stickyHeadersOptimization = false;
  private sentinels: {
    top?: HTMLElement | null;
    bottom?: HTMLElement | null;
  } = {};
  private stickyRowHeight?: number;

  get tree(): TableDOMElements | null | undefined {
    return getTree(this.dom);
  }

  constructor(
    node: PmNode,
    view: EditorView,
    getPos: any,
    eventDispatcher: EventDispatcher,
    getEditorFeatureFlags: GetEditorFeatureFlags,
  ) {
    this.view = view;
    this.node = node;
    this.getPos = getPos;
    this.eventDispatcher = eventDispatcher;

    this.dom = document.createElement('tr');
    this.contentDOM = this.dom;

    const featureFlags = getEditorFeatureFlags();
    const { stickyHeadersOptimization } = featureFlags;
    this.stickyHeadersOptimization = !!stickyHeadersOptimization;
    this.lastTimePainted = 0;
    this.isHeaderRow = supportedHeaderRow(node);
    this.isSticky = false;
    this.isTableInit = false;

    if (this.isHeaderRow) {
      this.dom.setAttribute('data-header-row', 'true');
      this.subscribe();
    }
  }

  /* external events */
  listening = false;

  headerRowMouseScrollEnd = debounce(() => {
    this.dom.classList.remove('no-pointer-events');
  }, HEADER_ROW_SCROLL_RESET_DEBOUNCE_TIMEOUT);

  // When the header is sticky, the header row is set to position: fixed
  // This prevents mouse wheel scrolling on the scroll-parent div when user's mouse is hovering the header row.
  // This fix sets pointer-events: none on the header row briefly to avoid this behaviour
  headerRowMouseScroll = throttle(() => {
    if (this.isSticky) {
      this.dom.classList.add('no-pointer-events');
      this.headerRowMouseScrollEnd();
    }
  }, HEADER_ROW_SCROLL_THROTTLE_TIMEOUT);

  subscribe() {
    this.editorScrollableElement =
      findOverflowScrollParent(this.view.dom as HTMLElement) || window;

    if (this.editorScrollableElement) {
      if (this.stickyHeadersOptimization) {
        this.initObservers();
      } else {
        this.editorScrollableElement.addEventListener('scroll', this.onScroll);
      }
      this.topPosEditorElement = getTop(this.editorScrollableElement);
    }

    this.eventDispatcher.on('widthPlugin', this.onWidthPluginState);

    this.eventDispatcher.on(
      (tablePluginKey as any).key,
      this.onTablePluginState,
    );

    this.listening = true;

    this.dom.addEventListener('wheel', this.headerRowMouseScroll.bind(this));
    this.dom.addEventListener(
      'touchmove',
      this.headerRowMouseScroll.bind(this),
    );
  }

  unsubscribe() {
    if (!this.listening) {
      return;
    }

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    if (this.editorScrollableElement && !this.stickyHeadersOptimization) {
      this.editorScrollableElement.removeEventListener('scroll', this.onScroll);
    }

    this.eventDispatcher.off('widthPlugin', this.onWidthPluginState);
    this.eventDispatcher.off(
      (tablePluginKey as any).key,
      this.onTablePluginState,
    );

    this.listening = false;

    this.dom.removeEventListener('wheel', this.headerRowMouseScroll);
    this.dom.removeEventListener('touchmove', this.headerRowMouseScroll);
  }

  // initialize intersection observer to track if table is within scroll area
  private initObservers() {
    if (!this.dom || this.dom.dataset.isObserved) {
      return;
    }
    this.dom.dataset.isObserved = 'true';
    this.createIntersectionObserver();
    this.createResizeObserver();

    if (!this.intersectionObserver || !this.resizeObserver) {
      return;
    }

    this.resizeObserver.observe(this.dom);

    window.requestAnimationFrame(() => {
      // we expect tree to be defined after animation frame
      const tableContainer = this.tree?.wrapper.closest(
        `.${TableCssClassName.NODEVIEW_WRAPPER}`,
      );
      if (tableContainer) {
        this.sentinels.top = tableContainer
          .getElementsByClassName(ClassName.TABLE_STICKY_SENTINEL_TOP)
          .item(0) as HTMLElement;
        this.sentinels.bottom = tableContainer
          .getElementsByClassName(ClassName.TABLE_STICKY_SENTINEL_BOTTOM)
          .item(0) as HTMLElement;
        [this.sentinels.top, this.sentinels.bottom].forEach((el) => {
          // skip if already observed for another row on this table
          if (el && !el.dataset.isObserved) {
            el.dataset.isObserved = 'true';
            this.intersectionObserver!.observe(el);
          }
        });
      }
    });
  }

  // updating bottom sentinel position if sticky header height changes
  // to allocate for new header height
  private createResizeObserver() {
    this.resizeObserver = new ResizeObserver((entries) => {
      if (!this.tree) {
        return;
      }
      const { table } = this.tree;
      entries.forEach((entry) => {
        const newHeight = entry.contentRect
          ? entry.contentRect.height
          : (entry.target as HTMLElement).offsetHeight;

        if (
          this.sentinels.bottom &&
          // When the table header is sticky, it would be taller by a 1px (border-bottom),
          // So we adding this check to allow a 1px difference.
          Math.abs(newHeight - (this.stickyRowHeight || 0)) >
            stickyHeaderBorderBottomWidth
        ) {
          this.stickyRowHeight = newHeight;
          this.sentinels.bottom.style.bottom = `${
            tableScrollbarOffset + stickyRowOffsetTop + newHeight
          }px`;
          updateTableMargin(table);
        }
      });
    });
  }

  private createIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver(
      (entries: IntersectionObserverEntry[], _: IntersectionObserver) => {
        if (!this.tree) {
          return;
        }
        const { table } = this.tree;
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;

          // if the rootBounds has 0 height, e.g. confluence preview mode, we do nothing.
          if (entry.rootBounds?.height === 0) {
            return;
          }

          if (target.classList.contains(ClassName.TABLE_STICKY_SENTINEL_TOP)) {
            const sentinelIsBelowScrollArea =
              (entry.rootBounds?.bottom || 0) < entry.boundingClientRect.bottom;

            if (!entry.isIntersecting && !sentinelIsBelowScrollArea) {
              this.tree && this.makeHeaderRowSticky(this.tree);
            } else {
              table && this.makeRowHeaderNotSticky(table);
            }
          }

          if (
            target.classList.contains(ClassName.TABLE_STICKY_SENTINEL_BOTTOM)
          ) {
            const sentinelIsAboveScrollArea =
              entry.boundingClientRect.top - this.dom.offsetHeight <
              (entry.rootBounds?.top || 0);

            if (table && !entry.isIntersecting && sentinelIsAboveScrollArea) {
              this.makeRowHeaderNotSticky(table);
            } else if (entry.isIntersecting && sentinelIsAboveScrollArea) {
              this.tree && this.makeHeaderRowSticky(this.tree);
            }
          }
        });
      },
      { root: this.editorScrollableElement as Element },
    );
  }
  /* paint/update loop */

  previousDomTop: number | undefined;
  previousPadding: number | undefined;

  latestDomTop: number | undefined;

  nextFrame: number | undefined;

  onScroll = () => {
    if (!this.tree) {
      return;
    }

    this.latestDomTop = getTop(this.tree.wrapper);

    // kick off rAF loop again if it hasn't already happened
    if (!this.nextFrame) {
      this.loop();
    }
  };

  loop = () => {
    this.nextFrame = window.requestAnimationFrame(() => {
      if (
        this.previousDomTop === this.latestDomTop &&
        this.previousPadding === this.padding
      ) {
        this.nextFrame = undefined;
        return;
      }

      // can't store these since React might re-render at any time
      const tree = this.tree;
      if (!tree) {
        this.nextFrame = undefined;
        return;
      }

      this.paint(tree);

      // run again on next frame
      this.previousPadding = this.padding;
      this.previousDomTop = this.latestDomTop;
      this.loop();
    });
  };

  paint = (tree: TableDOMElements) => {
    const { table, wrapper } = tree;

    // If the previous refresh is less than 10ms then don't do anything.
    // The jumpiness happen under that time and this is to avoid it.
    const timelapse = Math.abs(performance.now() - this.lastTimePainted);
    if (timelapse < 10) {
      return;
    }

    if (this.shouldHeaderStick(tree)) {
      this.makeHeaderRowSticky(tree);
    } else {
      this.makeRowHeaderNotSticky(table);
    }

    // ensure scroll positions are locked
    this.dom.scrollLeft = wrapper.scrollLeft;
    this.lastTimePainted = performance.now();
  };

  /* nodeview lifecycle */

  update(node: PmNode, ..._args: any[]) {
    // do nothing if nodes were identical
    if (node === this.node) {
      return true;
    }

    // see if we're changing into a header row or
    // changing away from one
    const newNodeisHeaderRow = supportedHeaderRow(node);
    if (this.isHeaderRow !== newNodeisHeaderRow) {
      return false; // re-create nodeview
    }

    // node is different but no need to re-create nodeview
    this.node = node;

    // don't do anything if we're just a regular tr
    if (!this.isHeaderRow) {
      return true;
    }

    // something changed, sync widths
    const tbody = this.dom.parentElement;
    const table = tbody && tbody.parentElement;
    syncStickyRowToTable(table);

    return true;
  }

  destroy() {
    this.unsubscribe();

    if (this.tree) {
      this.makeRowHeaderNotSticky(this.tree.table, true);
    }

    this.emitOff(true);
  }

  ignoreMutation(
    mutationRecord: MutationRecord | { type: 'selection'; target: Element },
  ) {
    /* tableRows are not directly editable by the user
     * so it should be safe to ignore mutations that we cause
     * by updating styles and classnames on this DOM element
     *
     * Update: should not ignore mutations for row selection to avoid known issue with table selection highlight in firefox
     * Related bug report: https://bugzilla.mozilla.org/show_bug.cgi?id=1289673
     * */
    const isTableSelection =
      mutationRecord.type === 'selection' &&
      mutationRecord.target.nodeName === 'TR';
    /**
     * Update: should not ignore mutations when an node is added, as this interferes with
     * prosemirrors handling of some language inputs in Safari (ie. Pinyin, Hiragana).
     *
     * In paticular, when a composition occurs at the start of the first node inside a table cell, if the resulting mutation
     * from the composition end is ignored than prosemirror will end up with; invalid table markup nesting and a misplaced
     * selection and insertion.
     */
    const isNodeInsertion =
      mutationRecord.type === 'childList' &&
      mutationRecord.target.nodeName === 'TR' &&
      mutationRecord.addedNodes.length;

    if (isTableSelection || isNodeInsertion) {
      return false;
    }

    return true;
  }

  /* receive external events */

  onTablePluginState = (state: TablePluginState) => {
    const tableRef = state.tableRef;
    let focusChanged = false;

    const tree = this.tree;
    if (!tree) {
      return;
    }

    // make it non-sticky initially to avoid making it look separated
    if (!this.isTableInit) {
      if (this.tree) {
        this.makeRowHeaderNotSticky(this.tree.table);
        this.isTableInit = true;
      }
    }

    // when header rows are toggled off - mark sentinels as unobserved
    if (!state.isHeaderRowEnabled) {
      [this.sentinels.top, this.sentinels.bottom].forEach((el) => {
        if (el) {
          delete el.dataset.isObserved;
        }
      });
    }

    const isCurrentTableSelected = tableRef === tree.table;
    if (isCurrentTableSelected !== this.focused) {
      focusChanged = true;
    }
    this.focused = isCurrentTableSelected;

    const { wrapper } = tree;

    const tableContainer = wrapper.parentElement!;
    const tableContentWrapper = tableContainer.parentElement;

    const layoutContainer =
      tableContentWrapper && tableContentWrapper.parentElement;

    if (isCurrentTableSelected) {
      this.colControlsOffset = tableControlsSpacing;

      if (
        layoutContainer &&
        layoutContainer.getAttribute('data-layout-content')
      ) {
        // move table a little out of the way
        // to provide spacing for table controls
        tableContentWrapper!.style.paddingLeft = '11px';
      }
    } else {
      this.colControlsOffset = 0;
      if (
        layoutContainer &&
        layoutContainer.getAttribute('data-layout-content')
      ) {
        tableContentWrapper!.style.removeProperty('padding-left');
      }
    }

    // run after table style changes have been committed
    setTimeout(() => {
      // if focus changed while header is sticky - still repaint the positions will shift
      if (!this.stickyHeadersOptimization || (focusChanged && this.isSticky)) {
        this.paint(tree);
      }
      syncStickyRowToTable(tree.table);
    }, 0);
  };

  onWidthPluginState = () => {
    // table width might have changed, sync that back to sticky row
    const tree = this.tree;
    if (!tree) {
      return;
    }

    syncStickyRowToTable(tree.table);
  };

  shouldHeaderStick = (tree: TableDOMElements): boolean => {
    const { wrapper } = tree;
    const tableWrapperRect = wrapper.getBoundingClientRect();
    const editorAreaRect = (this
      .editorScrollableElement as HTMLElement).getBoundingClientRect();

    const stickyHeaderRect = this.contentDOM.getBoundingClientRect();
    const firstHeaderRow = !this.dom.previousElementSibling;
    const subsequentRows = !!this.dom.nextElementSibling;
    const isHeaderValid = firstHeaderRow && subsequentRows;

    // if the table wrapper is less than the editor top pos then make it sticky
    // Make header sticky if table wrapper top is outside viewport
    //  but bottom is still in the viewport.
    if (
      tableWrapperRect.top < editorAreaRect.top &&
      tableWrapperRect.bottom > editorAreaRect.top &&
      isHeaderValid
    ) {
      return true;
    }

    // if the sticky header is below the editor area make it non-sticky
    if (stickyHeaderRect.top > editorAreaRect.top) {
      return false;
    }

    // otherwise make it non-sticky
    return false;
  };

  makeHeaderRowSticky = (tree: TableDOMElements) => {
    // If header row height is more than 50% of viewport height don't do this
    if (this.stickyRowHeight && this.stickyRowHeight > window.innerHeight / 2) {
      return;
    }

    const { table } = tree;

    const currentTableTop = this.getCurrentTableTop(tree);
    const domTop =
      currentTableTop > 0
        ? this.topPosEditorElement
        : this.topPosEditorElement + currentTableTop;

    if (!this.isSticky) {
      syncStickyRowToTable(table);
      this.dom.classList.add('sticky');
      table.classList.add(ClassName.TABLE_STICKY);

      this.isSticky = true;
    }

    this.dom.style.top = `${domTop}px`;
    updateTableMargin(table);

    this.emitOn(domTop, this.colControlsOffset);
  };

  makeRowHeaderNotSticky = (
    table: HTMLElement,
    isEditorDestroyed: boolean = false,
  ) => {
    if (!this.isSticky || !table || !this.dom) {
      return;
    }

    this.dom.style.removeProperty('width');
    this.dom.classList.remove('sticky');
    table.classList.remove(ClassName.TABLE_STICKY);

    this.isSticky = false;

    this.dom.style.top = '';
    table.style.removeProperty('margin-top');

    this.emitOff(isEditorDestroyed);
  };

  getWrapperoffset = (inverse: boolean = false): number => {
    const focusValue = inverse ? !this.focused : this.focused;
    return focusValue ? 0 : tableControlsSpacing;
  };

  getWrapperRefTop = (wrapper: HTMLElement): number =>
    Math.round(getTop(wrapper)) + this.getWrapperoffset();

  // TODO: rename!
  getScrolledTableTop = (wrapper: HTMLElement): number =>
    this.getWrapperRefTop(wrapper) - this.topPosEditorElement;

  getCurrentTableTop = (tree: TableDOMElements): number =>
    this.getScrolledTableTop(tree.wrapper) + tree.table.clientHeight;

  /* emit external events */

  padding = 0;
  top = 0;

  emitOn = (top: number, padding: number) => {
    if (top === this.top && padding === this.padding) {
      return;
    }

    this.top = top;
    this.padding = padding;

    updateStickyState({
      pos: this.getPos(),
      top,
      sticky: true,
      padding,
    })(this.view.state, this.view.dispatch, this.view);
  };

  emitOff = (isEditorDestroyed: boolean) => {
    if (this.top === 0 && this.padding === 0) {
      return;
    }

    this.top = 0;
    this.padding = 0;

    if (!isEditorDestroyed) {
      updateStickyState({
        pos: this.getPos(),
        sticky: false,
        top: this.top,
        padding: this.padding,
      })(this.view.state, this.view.dispatch, this.view);
    }
  };
}
