import core from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import {
  addCommentToStartOfFile,
  getDefaultSpecifier,
  getJSXAttributesByName,
} from '@atlaskit/codemod-utils';

export const createRemoveFuncWithDefaultSpecifierFor = (
  component: string,
  prop: string,
  comment?: string,
) => (j: core.JSCodeshift, source: Collection<Node>) => {
  const specifier = getDefaultSpecifier(j, source, component);

  if (!specifier) {
    return;
  }

  source.findJSXElements(specifier).forEach((element) => {
    getJSXAttributesByName(j, element, prop).forEach((attribute: any) => {
      if (comment) {
        addCommentToStartOfFile({ j, base: source, message: comment });
      }
      j(attribute).remove();
    });
  });
};

export function doesIdentifierExist({
  j,
  base,
  name,
}: {
  j: core.JSCodeshift;
  base: Collection<any>;
  name: string;
}): boolean {
  return (
    base.find(j.Identifier).filter((identifer) => identifer.value.name === name)
      .length > 0
  );
}
