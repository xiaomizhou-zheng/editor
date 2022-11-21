import { OptionData } from '@atlaskit/smart-user-picker';
import { layers } from '@atlaskit/theme/constants';

// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { ConfigResponse, User, UserWithEmail } from '../types';
import type { IntegrationMode } from '../types/ShareEntities';

/**
 * We need to generate correct zIndex, for the PopUp and for the Select inside it.
 * The PopUp's defaults to `layers.layer()` from @atlaskit/theme. But if user provides
 * a different value, we need check it, and in case of Select Portal z-index, we need to
 * top it, so it's visible in the popup.
 */

export const zIndexAddition: number = 10;

export const generateSelectZIndex = (dialogZIndex?: number): number => {
  // If user provided non-number value for zIndex, ignore and return undefined,
  // which will default to `layers.layer()` inside PopUp
  if (typeof dialogZIndex !== 'number' || !dialogZIndex) {
    return layers.modal() + zIndexAddition;
  }
  return dialogZIndex + zIndexAddition;
};

/**
 * Helper to get around TS error of property `current` not being
 * part of React's `ref` object.
 */
export const getMenuPortalTargetCurrentHTML = (
  ref?: React.Ref<HTMLDivElement>,
): HTMLDivElement | null => {
  if (!ref) {
    return null;
  }
  if (!Object.prototype.hasOwnProperty.call(ref, 'current')) {
    return null;
  }
  // @ts-ignore ts(2339) - ref not having property current
  return ref.current as HTMLDivElement | null;
};

export const optionDataToUsers = (optionDataArray: OptionData[]): User[] =>
  optionDataArray.map((optionData: OptionData) => {
    switch (optionData.type) {
      case 'email':
        const user: UserWithEmail = {
          type: 'user',
          email: optionData.id,
        };
        return user;
      default:
        return {
          type: optionData.type || 'user',
          id: optionData.id,
        };
    }
  });

export const allowEmails = (config?: ConfigResponse): boolean =>
  !(config && config.disableSharingToEmails);

export const resolveShareFooter = (
  integrationMode: IntegrationMode | undefined,
  tabIndex: number,
  customFooter: React.ReactNode,
): React.ReactNode | undefined => {
  if (customFooter) {
    if (integrationMode !== 'tabs' || tabIndex === 0) {
      return customFooter;
    }
  }
};
