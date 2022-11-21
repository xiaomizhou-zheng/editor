import React from 'react';

import rafSchedule from 'raf-schd';
import { createPortal } from 'react-dom';

import { akEditorFloatingPanelZIndex } from '@atlaskit/editor-shared-styles';

import {
  calculatePlacement,
  calculatePosition,
  findOverflowScrollParent,
  Position,
  validatePosition,
} from './utils';
export interface Props {
  zIndex?: number;
  // The alignments are using the same placements from Popper
  // https://popper.js.org/popper-documentation.html#Popper.placements
  alignX?: 'left' | 'right' | 'center' | 'end';
  alignY?: 'top' | 'bottom' | 'start';
  target?: HTMLElement;
  fitHeight?: number;
  fitWidth?: number;
  boundariesElement?: HTMLElement;
  mountTo?: HTMLElement;
  // horizontal offset, vertical offset
  offset?: number[];
  onPositionCalculated?: (position: Position) => Position;
  onPlacementChanged?: (placement: [string, string]) => void;
  shouldRenderPopup?: (position: Position) => boolean;
  scrollableElement?: HTMLElement;
  stick?: boolean;
  ariaLabel?: string;
  forcePlacement?: boolean;
  allowOutOfBounds?: boolean; // Allow to correct position elements inside table: https://product-fabric.atlassian.net/browse/ED-7191
  rect?: DOMRect;
  style?: React.CSSProperties;
}

export interface State {
  // Popup Html element reference
  popup?: HTMLElement;

  position?: Position;
  validPosition: boolean;
}

export default class Popup extends React.Component<Props, State> {
  scrollElement: undefined | false | HTMLElement;
  scrollParentElement: undefined | false | HTMLElement;
  rafIds: Set<number> = new Set();
  static defaultProps = {
    offset: [0, 0],
    allowOutOfBound: false,
  };

  state: State = {
    validPosition: true,
  };

  private placement: [string, string] = ['', ''];

  /**
   * Calculates new popup position
   */
  private calculatePosition(props: Props, popup?: HTMLElement) {
    const {
      target,
      fitHeight,
      fitWidth,
      boundariesElement,
      offset,
      onPositionCalculated,
      onPlacementChanged,
      alignX,
      alignY,
      stick,
      forcePlacement,
      allowOutOfBounds,
      rect,
    } = props;

    if (!target || !popup) {
      return {};
    }

    const placement = calculatePlacement(
      target,
      boundariesElement || document.body,
      fitWidth,
      fitHeight,
      alignX,
      alignY,
      forcePlacement,
    );

    if (onPlacementChanged && this.placement.join('') !== placement.join('')) {
      onPlacementChanged(placement);
      this.placement = placement;
    }

    let position = calculatePosition({
      placement,
      popup,
      target,
      stick,
      offset: offset!,
      allowOutOfBounds,
      rect,
    });
    position = onPositionCalculated ? onPositionCalculated(position) : position;

    return {
      position,
      validPosition: validatePosition(target),
    };
  }

  private updatePosition(props = this.props, state = this.state) {
    const { popup } = state;
    const { position, validPosition } = this.calculatePosition(props, popup);

    if (position && validPosition) {
      this.setState({
        position,
        validPosition,
      });
    }
  }

  private cannotSetPopup(
    popup: HTMLElement,
    target?: HTMLElement,
    overflowScrollParent?: HTMLElement | false,
  ) {
    /**
     * Check whether:
     * 1. Popup's offset targets which means whether or not its possible to correctly position popup along with given target.
     * 2. Popup is inside "overflow: scroll" container, but its offset parent isn't.
     *
     * Currently Popup isn't capable of position itself correctly in case 2,
     * Add "position: relative" to "overflow: scroll" container or to some other FloatingPanel wrapper inside it.
     */
    return (
      !target ||
      (document.body.contains(target) &&
        popup.offsetParent &&
        !popup.offsetParent.contains(target!)) ||
      (overflowScrollParent &&
        !overflowScrollParent.contains(popup.offsetParent))
    );
  }

  /**
   * Popup initialization.
   * Checks whether it's possible to position popup along given target, and if it's not throws an error.
   */
  private initPopup(popup: HTMLElement) {
    const { target } = this.props;
    const overflowScrollParent = findOverflowScrollParent(popup);

    if (this.cannotSetPopup(popup, target, overflowScrollParent)) {
      return;
    }

    this.setState({
      popup,
    });
    /**
     * Some plugins (like image) have async rendering of component in floating toolbar(which is popup).
     * Now, floating toolbar position depends on it's size.
     * Size of floating toolbar changes, when async component renders.
     * There is currently, no way to re position floating toolbar or
     *  better to not show floating toolbar till all the async component are ready to render.
     * Also, it is not even Popup's responsibility to take care of it as popup's children are passed
     *  as a prop.
     * So, calling scheduledUpdatePosition to position popup on next request animation frame,
     * which is currently working for most of the floating toolbar and other popups.
     */
    this.scheduledUpdatePosition(this.props);
  }

  private handleRef = (popup: HTMLDivElement) => {
    if (!popup) {
      return;
    }

    this.initPopup(popup);
  };

  private scheduledUpdatePosition = rafSchedule((props: Props) => {
    this.updatePosition(this.props);
  });

  onResize = () => this.scheduledUpdatePosition(this.props);

  UNSAFE_componentWillReceiveProps(newProps: Props) {
    // We are delaying `updatePosition` otherwise it happens before the children
    // get rendered and we end up with a wrong position
    this.scheduledUpdatePosition(newProps);
  }

  resizeObserver = window?.ResizeObserver
    ? new ResizeObserver(() => {
        this.scheduledUpdatePosition(this.props);
      })
    : undefined;

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    const { stick } = this.props;

    this.scrollParentElement = findOverflowScrollParent(this.props.target!);
    if (this.scrollParentElement && this.resizeObserver) {
      this.resizeObserver.observe(this.scrollParentElement);
    }

    if (stick) {
      this.scrollElement = this.scrollParentElement;
    } else {
      this.scrollElement = this.props.scrollableElement;
    }
    if (this.scrollElement) {
      this.scrollElement.addEventListener('scroll', this.onResize);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    if (this.scrollElement) {
      this.scrollElement.removeEventListener('scroll', this.onResize);
    }

    if (this.scrollParentElement && this.resizeObserver) {
      this.resizeObserver.unobserve(this.scrollParentElement);
    }
    this.scheduledUpdatePosition.cancel();
  }

  private renderPopup() {
    const { position } = this.state;
    const { shouldRenderPopup } = this.props;

    if (shouldRenderPopup && !shouldRenderPopup(position || {})) {
      return null;
    }

    return (
      <div
        ref={this.handleRef}
        style={{
          position: 'absolute',
          zIndex: this.props.zIndex || akEditorFloatingPanelZIndex,
          ...position,
          ...this.props.style,
        }}
        aria-label={this.props.ariaLabel || 'Popup'}
        // Indicates component is an editor pop. Required for focus handling in Message.tsx
        data-editor-popup
      >
        {this.props.children}
      </div>
    );
  }

  render() {
    const { target, mountTo } = this.props;
    const { validPosition } = this.state;

    if (!target || !validPosition) {
      return null;
    }

    if (mountTo) {
      return createPortal(this.renderPopup(), mountTo);
    }

    // Without mountTo property renders popup as is,
    // which means it will be cropped by "overflow: hidden" container.
    return this.renderPopup();
  }
}

export { findOverflowScrollParent } from './utils';
export type { Position } from './utils';
