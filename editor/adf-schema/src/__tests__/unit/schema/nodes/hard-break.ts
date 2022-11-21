import { createSchema } from '../../../../schema/create-schema';
import { toHTML, fromHTML } from '@atlaskit/editor-test-helpers/adf-schema';

const schema = makeSchema();
const packageName = process.env._PACKAGE_NAME_ as string;

describe(`${packageName}/schema hardBreak node`, () => {
  it('serializes to <br>', () => {
    const html = toHTML(schema.nodes.hardBreak.create(), schema);
    expect(html).toContain('<br>');
  });

  it('matches <br>', () => {
    const doc = fromHTML('<br>', schema);
    const br = doc.firstChild!.firstChild!;
    expect(br.type.name).toEqual('hardBreak');
  });
});

function makeSchema() {
  return createSchema({
    nodes: ['doc', 'paragraph', 'text', 'hardBreak'],
  });
}
