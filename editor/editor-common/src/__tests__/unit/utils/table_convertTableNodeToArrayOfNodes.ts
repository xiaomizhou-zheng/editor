import { defaultSchema as schema } from '@atlaskit/adf-schema/schema-default';
import {
  p,
  tr as row,
  table,
  td,
  th,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { convertProsemirrorTableNodeToArrayOfRows } from '../../../utils/table';

describe('@atlaskit/editor-common table utils 2', () => {
  const normalTable = table()(
    row(
      th()(p('Header content 1')),
      th()(p('Header content 2')),
      th()(p('Header content 3')),
    ),
    row(
      td()(p('Body content 1')),
      td()(p('Body content 2')),
      td()(p('Body content 3')),
    ),
    row(
      td()(p('Body content 1')),
      td()(p('Body content 2')),
      td()(p('Body content 3')),
    ),
  );

  it('should returns array of rows', () => {
    const defaultTableFromSchema = normalTable(schema);
    const result = convertProsemirrorTableNodeToArrayOfRows(
      defaultTableFromSchema,
    );

    expect(result).toEqual([
      [
        th()(p('Header content 1'))(schema),
        th()(p('Header content 2'))(schema),
        th()(p('Header content 3'))(schema),
      ],
      [
        td()(p('Body content 1'))(schema),
        td()(p('Body content 2'))(schema),
        td()(p('Body content 3'))(schema),
      ],
      [
        td()(p('Body content 1'))(schema),
        td()(p('Body content 2'))(schema),
        td()(p('Body content 3'))(schema),
      ],
    ]);
  });
});
