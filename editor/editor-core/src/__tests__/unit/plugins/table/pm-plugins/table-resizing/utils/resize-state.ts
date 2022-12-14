// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { updateColgroup } from '@atlaskit/editor-plugin-table/src/plugins/table/pm-plugins/table-resizing/utils/resize-state';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { ResizeState } from '@atlaskit/editor-plugin-table/src/plugins/table/pm-plugins/table-resizing/utils/types';

describe('table-resizing/utils/resize-state', () => {
  describe('#updateColgroup', () => {
    it('should not throw exception when the dom cols does not exist', () => {
      const state = {
        cols: [{ width: 100 }],
      };
      const tableRef = document.createElement('div');

      const func = () => {
        updateColgroup(state as ResizeState, tableRef);
      };

      expect(func).not.toThrow();
    });

    it('should not throw exception when the column is null', () => {
      const state = {
        cols: [null],
      };
      const tableRef = document.createElement('div');

      const func = () => {
        // @ts-ignore
        updateColgroup(state, tableRef);
      };

      expect(func).not.toThrow();
    });
  });
});
