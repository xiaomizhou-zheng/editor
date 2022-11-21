import { createSchema } from '../../../../schema/create-schema';
import { codeBlock } from '../../../../schema/nodes/code-block';
import { fromHTML, toHTML } from '@atlaskit/editor-test-helpers/adf-schema';

const packageName = process.env._PACKAGE_NAME_ as string;

describe(`${packageName}/schema codeBlock node`, () => {
  const schema = makeSchema();

  it('should have code property to be true', () => {
    expect(schema.nodes.codeBlock.spec.code).toEqual(true);
  });

  describe('parse from html', () => {
    describe('parse from editor encoded HTML', () => {
      describe('when language is not set', () => {
        it('converts to block code node', () => {
          const doc = fromHTML(
            '<pre><span>window.alert("hello");<span></pre>',
            schema,
          );

          expect(doc.firstChild!.type.name).toEqual('codeBlock');
        });

        it('has language attribute as null', () => {
          const doc = fromHTML(
            '<pre><span>window.alert("hello");<span></pre>',
            schema,
          );

          expect(doc.firstChild!.attrs['language']).toEqual(null);
        });
      });

      describe('when language is set', () => {
        it('converts to block code node', () => {
          const doc = fromHTML(
            '<pre data-language="javascript"><span>window.alert("hello");<span></pre>',
            schema,
          );

          expect(doc.firstChild!.type.spec).toEqual(codeBlock);
        });

        it(`extracts language "python" from data-language attribute`, () => {
          const doc = fromHTML(
            `<pre data-language='python'><span>window.alert("hello");<span></pre>`,
            schema,
          );

          expect(doc.firstChild!.attrs['language']).toEqual('python');
        });
      });

      it('preserves all newlines and whitespace', () => {
        const doc = fromHTML(
          '<pre><span></span>    bar\n       baz\n</pre>',
          schema,
        );

        expect(doc.firstChild!.textContent).toEqual('    bar\n       baz\n');
      });
    });

    describe('parse from Bitbucket', () => {
      describe('when language is not set', () => {
        it('converts to block code node', () => {
          const doc = fromHTML(
            '<div class="codehilite"><pre><span>window.alert("hello");<span></pre></div>',
            schema,
          );

          expect(doc.firstChild!.type.spec).toEqual(codeBlock);
        });

        it('has language attribute as null', () => {
          const doc = fromHTML(
            '<div class="codehilite"><pre><span>window.alert("hello");<span></pre></div>',
            schema,
          );
          const codeBlock = doc.firstChild!;

          expect(codeBlock.attrs.language).toEqual(null);
        });
      });

      describe('when other class similar to language is set', () => {
        it('has language attribute as null', () => {
          const doc = fromHTML(
            '<div class="codehilite nolanguage-javascript"><pre><span>window.alert("hello");<span></pre></div>',
            schema,
          );
          const codeBlock = doc.firstChild!;

          expect(codeBlock.attrs.language).toEqual(null);
        });
      });
    });

    it('should parse code block from tag with font-family monospace css', () => {
      const doc = fromHTML(
        `<meta charset="utf-8"><div style="font-family: Menlo, Monaco, 'Courier New', monospace;">Code :D</div>`,
        schema,
      );
      expect(doc.firstChild!.type.spec).toEqual(codeBlock);
    });

    it('should parse code block from tag with `whitespace: pre` css', () => {
      const doc = fromHTML(
        '<meta charset="utf-8"><div style="white-space: pre;">Hello</div>',
        schema,
      );
      expect(doc.firstChild!.type.name).toEqual('codeBlock');
    });

    it('should not create code block for `whitespace pre-wrap` css', () => {
      const doc = fromHTML(
        '<meta charset="utf-8"><div style="white-space: pre-wrap;">Hello</div>',
        schema,
      );
      expect(doc.firstChild!.type.name).toEqual('paragraph');
    });

    describe('when language is set', () => {
      it('converts to block code node', () => {
        const doc = fromHTML(
          '<div class="codehilite language-javascript"><pre><span>window.alert("hello");<span></pre></div>',
          schema,
        );

        expect(doc.firstChild!.type.spec).toEqual(codeBlock);
      });

      it(`extracts language attribute from class "language-python"`, () => {
        const doc = fromHTML(
          `<div class="codehilite language-python"><pre><span>window.alert("hello");<span></pre></div>`,
          schema,
        );
        const codeBlock = doc.firstChild!;

        expect(codeBlock.attrs.language).toEqual('python');
      });

      it('removes last new line', () => {
        const doc = fromHTML(
          '<div class="codehilite"><pre><span>hello world;<span><span>\n<span></pre></div>',
          schema,
        );

        expect(doc.firstChild!.textContent).toEqual('hello world;');
      });

      it('preserves newlines in the middle and whitespace', () => {
        const doc = fromHTML(
          '<div class="codehilite"><pre><span></span>    bar\n       baz</pre></div>',
          schema,
        );

        expect(doc.firstChild!.textContent).toEqual('    bar\n       baz');
      });
    });
  });

  describe('convert to HTML', () => {
    const schema = makeSchema();

    describe('when language is not set', () => {
      it('converts to pre tag', () => {
        const codeBlock = schema.nodes.codeBlock.create();
        expect(toHTML(codeBlock, schema)).toContain('<pre');
      });

      it('does not set data-language attributes', () => {
        const codeBlock = schema.nodes.codeBlock.create();
        expect(toHTML(codeBlock, schema)).not.toContain('data-language');
      });
    });

    describe('when language is set to null', () => {
      it('does not set data-language attributes', () => {
        const codeBlock = schema.nodes.codeBlock.create({ language: null });
        expect(toHTML(codeBlock, schema)).not.toContain('data-language');
      });
    });

    describe('when language is set to undefined', () => {
      it('does not set data-language attributes', () => {
        const codeBlock = schema.nodes.codeBlock.create({
          language: undefined,
        });
        expect(toHTML(codeBlock, schema)).not.toContain('data-language');
      });
    });

    describe('when language is set to a value', () => {
      it('converts to pre tag', () => {
        const codeBlock = schema.nodes.codeBlock.create({
          language: 'javascript',
        });
        expect(toHTML(codeBlock, schema)).toContain('<pre');
      });

      it('sets data-language attributes', () => {
        const codeBlock = schema.nodes.codeBlock.create({
          language: 'javascript',
        });
        expect(toHTML(codeBlock, schema)).toContain(
          'data-language="javascript"',
        );
      });
    });
  });
});

function makeSchema() {
  return createSchema({
    nodes: ['doc', 'paragraph', 'text', 'codeBlock', 'unsupportedInline'],
    marks: ['unsupportedMark', 'unsupportedNodeAttribute'],
  });
}
