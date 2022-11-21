/* eslint-disable @atlaskit/design-system/use-visually-hidden */
import type { Rule } from 'eslint';
import {
  closestOfType,
  hasImportDeclaration,
  ImportSpecifier,
  isNodeOfType,
} from 'eslint-codemod-utils';

import { isStyledObjectNode, isStyledTemplateNode } from '../utils/is-node';

import fixJsx from './fix-jsx';
import fixVanilla from './fix-vanilla';
import {
  countMatchingKeyValues,
  getObjectLikeness,
  makeTemplateLiteralIntoEntries,
} from './utils';

const THEME_IMPORT_NAMES = ['visuallyHidden', 'assistive'];

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description:
        'Suggest usage of the `@atlaskit/visually-hidden` component instead of either the `@atlaskit/theme` mixins or just something the user has rolled themselves.',
      recommended: true,
    },
    messages: {
      noDeprecatedUsage:
        'Using the export `{{local}}` from `{{import}}` as a mixin is discouraged. Please use `@atlaskit/visually-hidden` instead.',
      noDeprecated:
        'The export `{{local}}` from `{{import}}` is deprecated. Please use `@atlaskit/visually-hidden` instead.',
      suggestion:
        'This CSS closely matches the implementation of a visually hidden element. You should consider using the `@atlaskit/visually-hidden` component instead.',
    },
  },

  create(context) {
    const source = context.getSourceCode();

    return {
      ImportDeclaration(node) {
        const isThemeNode =
          hasImportDeclaration(node, '@atlaskit/theme') ||
          hasImportDeclaration(node, '@atlaskit/theme/constants');

        if (!isThemeNode) {
          return;
        }

        const visuallyHiddenOrAssistive = node.specifiers
          .filter(
            (specifier): specifier is ImportSpecifier =>
              specifier.type === 'ImportSpecifier',
          )
          .find((specifier) =>
            THEME_IMPORT_NAMES.includes(specifier.imported.name),
          );

        if (!visuallyHiddenOrAssistive) {
          return;
        }

        context
          .getDeclaredVariables(visuallyHiddenOrAssistive)
          .forEach((someNode) => {
            someNode.references
              .map((innerNode) => innerNode.identifier as Rule.Node)
              .forEach((idNode) => {
                // @ts-ignore JSX is not typed correctly in eslint
                if (idNode?.parent.type === 'JSXExpressionContainer') {
                  context.report({
                    node: idNode.parent,
                    messageId: 'noDeprecatedUsage',
                    data: {
                      import: `${node.source.value}`,
                      local: visuallyHiddenOrAssistive.local.name,
                    },
                    fix: fixJsx(source, idNode),
                  });
                  // this is either a styled usage OR mixin usage in a styled usage
                } else if (idNode.parent.type === 'CallExpression') {
                  if (
                    isStyledObjectNode(idNode.parent) ||
                    isStyledTemplateNode(idNode.parent)
                  ) {
                    context.report({
                      node: idNode.parent,
                      messageId: 'noDeprecatedUsage',
                      data: {
                        import: `${node.source.value}`,
                        local: visuallyHiddenOrAssistive.local.name,
                      },
                      fix: fixVanilla(source, idNode.parent),
                    });
                  }

                  if (idNode.parent.callee === idNode) {
                    context.report({
                      node: idNode.parent,
                      messageId: 'noDeprecatedUsage',
                      data: {
                        import: `${node.source.value}`,
                        local: visuallyHiddenOrAssistive.local.name,
                      },
                      fix: fixVanilla(
                        source,
                        closestOfType(
                          idNode.parent,
                          'TaggedTemplateExpression',
                        ) as Rule.Node,
                      ),
                    });
                  }
                }
              });
          });

        return context.report({
          node: visuallyHiddenOrAssistive,
          messageId: 'noDeprecated',
          data: {
            import: `${node.source.value}`,
            local: visuallyHiddenOrAssistive.local.name,
          },
        });
      },

      CallExpression(node) {
        if (node.type !== 'CallExpression') {
          return;
        }

        if (
          !(
            node.callee.type === 'MemberExpression' ||
            node.callee.type === 'Identifier'
          )
        ) {
          return;
        }

        const isStyled = isStyledObjectNode(node);

        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.type === 'Identifier' &&
          node.callee.object.name !== 'styled'
        ) {
          return;
        }

        if (node.callee.type === 'Identifier' && node.callee.name !== 'css') {
          return;
        }

        // This is an object style (probably)
        if (node.arguments && node.arguments[0]?.type === 'ObjectExpression') {
          const matchingScore = getObjectLikeness(node.arguments[0]);

          if (matchingScore > 0.8) {
            return context.report({
              node: node.parent,
              messageId: 'suggestion',
              fix: isStyled ? fixVanilla(source, node) : undefined,
            });
          }
        }

        return null;
      },

      ObjectExpression(node) {
        if (node.parent.type === 'CallExpression') {
          return;
        }
        const matchingScore = getObjectLikeness(node);

        if (matchingScore > 0.8) {
          return context.report({
            node: node,
            messageId: 'suggestion',
          });
        }
      },

      'TaggedTemplateExpression[tag.name="css"],TaggedTemplateExpression[tag.object.name="styled"]': (
        node: Rule.Node,
      ) => {
        if (!isNodeOfType(node, 'TaggedTemplateExpression')) {
          return;
        }

        const templateString = node.quasi.quasis
          .map((q) => q.value.raw)
          .join('');
        const styleEntries = makeTemplateLiteralIntoEntries(templateString);

        if (!styleEntries) {
          return;
        }

        const count = countMatchingKeyValues(
          styleEntries.map(([key, value]) => ({ key, value })),
        );

        if (count > 0.8) {
          return context.report({
            node,
            messageId: 'suggestion',
            fix:
              node.tag.type !== 'Identifier'
                ? fixVanilla(source, node)
                : undefined,
          });
        }
      },
    };
  },
};

export default rule;
