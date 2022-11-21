import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import { animationFrame } from '@atlaskit/editor-test-helpers/page-objects/editor';
import {
  getSelectorForTableCell,
  selectCellOption,
  tableSelectors,
  selectColumn,
  clickFirstCell,
  grabResizeHandle,
  hoverColumnControls,
} from '@atlaskit/editor-test-helpers/page-objects/table';
import {
  pressKeyDown,
  pressKeyUp,
} from '@atlaskit/editor-test-helpers/page-objects/keyboard';
import adf from './__fixtures__/default-table.adf.json';
import adfTableWithoutTableHeader from './__fixtures__/table-without-table-header.adf.json';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';

describe('Table context menu: merge-split cells', () => {
  let page: PuppeteerPage;

  const initEditor = async (adf: Object) => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf,
      viewport: { width: 1040, height: 400 },
      editorProps: {
        allowTables: {
          advanced: true,
        },
      },
    });
    await clickFirstCell(page);
  };

  const tableMergeCells = async (fromCell: string, toCell: string) => {
    await page.click(fromCell);
    await pressKeyDown(page, 'Shift');
    await page.click(toCell);
    await pressKeyUp(page, 'Shift');
    await page.waitForSelector(tableSelectors.selectedCell);
    await selectCellOption(page, tableSelectors.mergeCellsText);
    await page.mouse.move(200, 200);
    await snapshot(page, undefined, undefined, {
      captureBeyondViewport: false,
    });
  };

  beforeAll(async () => {
    page = global.page;
  });

  beforeEach(async () => {
    await initEditor(adf);
  });

  // FIXME: This test was automatically skipped due to failure on 11/11/2022: https://product-fabric.atlassian.net/browse/ED-16154
  it.skip(`should render column controls for each column regardless of merged cells in the first row`, async () => {
    const from = getSelectorForTableCell({
      row: 1,
      cell: 1,
    });
    const to = getSelectorForTableCell({ row: 1, cell: 3 });
    await tableMergeCells(from, to);
  });

  it('should display the borders when the column controls are selected', async () => {
    await selectColumn(1);

    await snapshot(page, { tolerance: 0 }, tableSelectors.nthColumnControl(1), {
      captureBeyondViewport: false,
    });
  });

  it('should display column resizer handler on top of the column controls', async () => {
    await grabResizeHandle(page, { colIdx: 1, row: 2 });
    await animationFrame(page);
    await snapshot(page, { tolerance: 0 }, tableSelectors.nthColumnControl(1), {
      captureBeyondViewport: false,
    });
  });

  describe('when there is no table header', () => {
    beforeEach(async () => {
      await initEditor(adfTableWithoutTableHeader);
    });

    it('should display hover effect', async () => {
      await hoverColumnControls(page, 1, 'right');
      await snapshot(page, undefined, undefined, {
        captureBeyondViewport: false,
      });
    });

    it('should display selected effect', async () => {
      await selectColumn(1);
      await snapshot(page, undefined, undefined, {
        captureBeyondViewport: false,
      });
    });
  });
});
