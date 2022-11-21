import {
  snapshot,
  initEditorWithAdf,
  initFullPageEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import {
  getSelectorForTableCell,
  clickFirstCell,
  mergeCells,
  splitCells,
} from '@atlaskit/editor-test-helpers/page-objects/table';
import { pressKeyCombo } from '@atlaskit/editor-test-helpers/page-objects/keyboard';
import adf from './__fixtures__/default-table.adf.json';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { waitForFloatingControl } from '@atlaskit/editor-test-helpers/page-objects/toolbar';

describe('Table context menu: merge-split cells', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  describe('with table cell optimization on', () => {
    beforeEach(async () => {
      await initFullPageEditorWithAdf(page, adf, undefined, undefined, {
        allowTables: {
          advanced: true,
          tableCellOptimization: true,
          stickyHeaders: true,
        },
      });
      await clickFirstCell(page);
    });

    // FIXME: This test was automatically skipped due to failure on 30/09/2022: https://product-fabric.atlassian.net/browse/ED-15751
    it.skip('ensures table looks ok after merging cells and undo', async () => {
      const from = getSelectorForTableCell({
        row: 1,
        cell: 1,
      });
      const to = getSelectorForTableCell({ row: 2, cell: 1 });
      await mergeCells(page, from, to);
      await snapshot(page);
      // undo the merge
      // Meta key doesnt work here
      await pressKeyCombo(page, ['Control', 'KeyZ']);
      await snapshot(page);
    });
  });

  const tableMergeAndSplitCells = async (
    firstCell: string,
    lastCell: string,
  ) => {
    await mergeCells(page, firstCell, lastCell);
    await waitForFloatingControl(page, 'Table floating controls');
    await snapshot(page);
    await splitCells(page, firstCell);
    await waitForFloatingControl(page, 'Table floating controls');
    await snapshot(page);
  };

  describe('should merge and split cell', () => {
    beforeEach(async () => {
      await initEditorWithAdf(page, {
        adf,
        appearance: Appearance.fullPage,
        viewport: { width: 1280, height: 600 },
      });
      await clickFirstCell(page, true);
    });

    it(`for row`, async () => {
      const firstCell = getSelectorForTableCell({
        row: 1,
        cell: 1,
      });
      let lastCell = getSelectorForTableCell({ row: 3, cell: 1 });
      await tableMergeAndSplitCells(firstCell, lastCell);
    });

    it(`for column`, async () => {
      const firstCell = getSelectorForTableCell({ row: 2, cell: 1 });
      const lastCell = getSelectorForTableCell({ row: 2, cell: 3 });
      await tableMergeAndSplitCells(firstCell, lastCell);
    });

    it(`for row+col`, async () => {
      const firstCell = getSelectorForTableCell({ row: 2, cell: 1 });
      const lastCell = getSelectorForTableCell({ row: 3, cell: 2 });
      await tableMergeAndSplitCells(firstCell, lastCell);
    });
  });
});
