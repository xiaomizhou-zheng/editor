import {
  schema,
  toDOM,
  fromHTML,
} from '@atlaskit/editor-test-helpers/adf-schema';

const packageName = process.env._PACKAGE_NAME_ as string;

describe(`${packageName}/schema unsupportedInline node`, () => {
  const originalValue = {
    type: 'invalidInlineNode',
  };

  it('should parse unsupported inline nodes', () => {
    const doc = fromHTML(
      `<span
        data-node-type="unsupportedInline"
        data-original-value='${JSON.stringify(originalValue)}'
      />`,
      schema,
    );
    const paragraph = doc.firstChild!;
    const unsupportedInlineNode = paragraph.firstChild!;

    expect(unsupportedInlineNode.type).toEqual(schema.nodes.unsupportedInline);
    expect(unsupportedInlineNode.attrs.originalValue).toEqual(originalValue);
  });

  it('should encode unsupported inline nodes to html', () => {
    const unsupportedInlineNode = schema.nodes.unsupportedInline.create({
      originalValue,
    });
    const domNode = toDOM(unsupportedInlineNode, schema)
      .firstChild as HTMLElement;

    expect(domNode.getAttribute('data-original-value')).toEqual(
      JSON.stringify(originalValue),
    );
  });
});
