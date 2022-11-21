import { NodePath } from 'ast-types/lib/node-path';
import core, {
  API,
  ASTPath,
  FileInfo,
  ImportDeclaration,
  ImportSpecifier,
  Options,
} from 'jscodeshift';

import {
  addCommentBeforeJSX,
  getDefaultSpecifierName,
} from './helpers/generic';

function getJSXAttributesByName(
  j: core.JSCodeshift,
  element: ASTPath<any>,
  attributeName: string,
) {
  return j(element)
    .find(j.JSXOpeningElement)
    .find(j.JSXAttribute)
    .filter((attribute) => {
      const matches = j(attribute)
        .find(j.JSXIdentifier)
        .filter((identifier) => identifier.value.name === attributeName);
      return Boolean(matches.length);
    });
}

function getImportSpecifier(
  j: core.JSCodeshift,
  source: ReturnType<typeof j>,
  specifier: string,
  imported: string,
) {
  const specifiers = source
    .find(j.ImportDeclaration)
    .filter(
      (path: ASTPath<ImportDeclaration>) =>
        path.node.source.value === specifier,
    )
    .find(j.ImportSpecifier)
    .filter(
      (path: ASTPath<ImportSpecifier>) => path.value.imported.name === imported,
    );

  if (!specifiers.length) {
    return null;
  }

  return specifiers.nodes()[0]!.local!.name;
}

function updateCssFnProp(
  j: core.JSCodeshift,
  source: ReturnType<typeof j>,
  specifier: string,
) {
  source.findJSXElements(specifier).forEach((element) => {
    const cssFnPropCollection = getJSXAttributesByName(j, element, 'cssFn');

    // no cssProp usage for this element
    if (!cssFnPropCollection.length) {
      return;
    }

    const cssFnProp = cssFnPropCollection.get();

    const cssFnExpression: NodePath = j(cssFnProp)
      .find(j.JSXExpressionContainer)
      .find(j.Expression)
      .get();

    if (cssFnExpression) {
      // just remove the state styles param
      try {
        const [stylePropName] = cssFnExpression!.value.params;
        j(cssFnExpression)
          .find(j.SpreadElement)
          .forEach((n) => {
            // discerns whether there are multiple identifiers here
            const isComplexIdentifier = j(n).find(j.Identifier).length > 1;

            if (isComplexIdentifier) {
              throw new Error(
                'CSSFn Prop codemod: Unable to parse spread element',
              );
            }

            const hasStyleProp = !!j(n)
              .find(j.Identifier)
              .filter((node) => node.value.name === stylePropName.name).length;
            if (hasStyleProp) {
              j(n).remove();
            }
          });

        cssFnExpression!.value.params.shift();
      } catch (e) {
        addCommentBeforeJSX(
          j,
          cssFnProp,
          `
        The usage of the 'cssFn' prop in this component could not be transformed and requires manual intervention.
        The 'cssFn' prop has been simplified so that users no longer need to merge the inherited styles with their own overrides.
        For more info please reach out to #help-design-system-code.
        `,
        );
      }
    }
  });
}

function hasImportDeclaration(
  j: core.JSCodeshift,
  source: ReturnType<typeof j>,
  importPath: string,
) {
  return !!source
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === importPath).length;
}

export default function transformer(
  fileInfo: FileInfo,
  { jscodeshift: j }: API,
  options: Options,
) {
  const source = j(fileInfo.source);

  if (hasImportDeclaration(j, source, '@atlaskit/menu')) {
    const defaultSpecifier = getDefaultSpecifierName({
      j,
      base: source,
      packageName: '@atlaskit/menu',
    });

    if (defaultSpecifier != null) {
      updateCssFnProp(j, source, defaultSpecifier);
    }

    [
      'ButtonItem',
      'LinkItem',
      'CustomItem',
      'HeadingItem',
      'SkeletonItem',
      'SkeletonHeadingItem',
      'MenuGroup',
      'PopupMenuGroup',
      'Section',
    ].forEach((pkg) => {
      const importSpecifier = getImportSpecifier(
        j,
        source,
        '@atlaskit/menu',
        pkg,
      );

      if (importSpecifier != null) {
        updateCssFnProp(j, source, importSpecifier);
      }
    });

    return source.toSource(
      options.printOptions || {
        quote: 'single',
        trailingComma: true,
      },
    );
  }

  return fileInfo.source;
}
