import { useMemo } from 'react';
import { useSmartLinkContext, CardContext } from '@atlaskit/link-provider';

export const useSmartLinkRenderers = ():
  | CardContext['renderers']
  | undefined => {
  const context = useSmartLinkContext();
  let renderers = context?.renderers;
  renderers = useMemo(() => renderers, [renderers]);

  return renderers;
};
