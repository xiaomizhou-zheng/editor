/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import type { LoadOptions } from '@atlaskit/smart-user-picker';
import { gridSize } from '@atlaskit/theme/constants';

import type {
  ShareData,
  ShareDialogWithTriggerProps,
  ShareDialogWithTriggerStates,
} from '../../types';
import { INTEGRATION_MODAL_SOURCE } from '../analytics/analytics';
import { IntegrationForm, IntegrationFormProps } from '../IntegrationForm';
import { ShareForm } from '../ShareForm';
import { ShareFormWrapper } from '../ShareFormWrapper';

export type LazyShareFormProps = Pick<
  ShareDialogWithTriggerProps,
  | 'copyLink'
  | 'config'
  | 'isFetchingConfig'
  | 'loadUserOptions'
  | 'shareFormTitle'
  | 'shareFormHelperMessage'
  | 'bottomMessage'
  | 'submitButtonLabel'
  | 'product'
  | 'customFooter'
  | 'enableSmartUserPicker'
  | 'loggedInAccountId'
  | 'cloudId'
  | 'shareFieldsFooter'
  | 'onUserSelectionChange'
  | 'isPublicLink'
  | 'copyTooltipText'
  | 'shareIntegrations'
  | 'integrationMode'
  | 'onDialogClose'
  | 'orgId'
> &
  Pick<
    ShareDialogWithTriggerStates,
    | 'showIntegrationForm'
    | 'selectedIntegration'
    | 'isSharing'
    | 'shareError'
    | 'defaultValue'
  > &
  Pick<IntegrationFormProps, 'Content'> & {
    // actions
    onLinkCopy: () => void;
    onDismiss: (data: ShareData) => void;
    onSubmit: (data: ShareData) => void;
    onTabChange: (index: number) => void;
    loadOptions?: LoadOptions;

    // ref
    selectPortalRef: any;

    // others
    showTitle: boolean;
    setIsLoading: (isLoading: boolean) => void;
  };

/**
 * A Share form content which is lazy-loaded.
 * Make sure this component is not exported inside main entry points `src/index.ts`
 */
function LazyShareForm(props: LazyShareFormProps) {
  const {
    copyLink,
    config,
    isFetchingConfig,
    setIsLoading,
    loadOptions,
    shareFormTitle,
    shareFormHelperMessage,
    bottomMessage,
    submitButtonLabel,
    product,
    customFooter,
    enableSmartUserPicker,
    loggedInAccountId,
    cloudId,
    shareFieldsFooter,
    onUserSelectionChange,
    isPublicLink,
    copyTooltipText,
    shareIntegrations,
    integrationMode,
    // actions
    onLinkCopy,
    onDismiss,
    onSubmit,
    onDialogClose,
    onTabChange,
    // ref
    selectPortalRef,
    // props from states of parent:
    showIntegrationForm,
    selectedIntegration,
    isSharing,
    shareError,
    defaultValue,
    showTitle,
    orgId,
  } = props;

  const footer = (
    <div>
      {bottomMessage ? (
        <div css={{ width: `${gridSize() * 44}px` }}>{bottomMessage}</div>
      ) : null}
      {customFooter && selectedIntegration === null && (
        <div
          css={{
            margin: `0 ${-gridSize() * 3}px ${-gridSize() * 2}px ${
              -gridSize() * 3
            }px`,
          }}
        >
          {customFooter}
        </div>
      )}
    </div>
  );

  React.useEffect(() => {
    setIsLoading(false);
  });

  return (
    <ShareFormWrapper
      footer={footer}
      // form title will be determined by `title` and `showTitle` prop passed to `ShareForm`,
      // so we don't need to show title via ShareFormWrapper
      shouldShowTitle={false}
    >
      {showIntegrationForm && selectedIntegration !== null ? (
        <AnalyticsContext data={{ source: INTEGRATION_MODAL_SOURCE }}>
          <IntegrationForm
            Content={selectedIntegration.Content}
            onIntegrationClose={onDialogClose}
          />
        </AnalyticsContext>
      ) : (
        <ShareForm
          copyLink={copyLink}
          loadOptions={loadOptions}
          title={shareFormTitle}
          showTitle={showTitle}
          helperMessage={shareFormHelperMessage}
          shareError={shareError}
          defaultValue={defaultValue}
          config={config}
          submitButtonLabel={submitButtonLabel}
          product={product}
          enableSmartUserPicker={enableSmartUserPicker}
          loggedInAccountId={loggedInAccountId}
          cloudId={cloudId}
          fieldsFooter={shareFieldsFooter}
          selectPortalRef={selectPortalRef}
          copyTooltipText={copyTooltipText}
          integrationMode={integrationMode}
          shareIntegrations={shareIntegrations}
          isSharing={isSharing}
          isFetchingConfig={isFetchingConfig}
          isPublicLink={isPublicLink}
          orgId={orgId}
          onSubmit={onSubmit}
          onDismiss={onDismiss}
          onLinkCopy={onLinkCopy}
          onUserSelectionChange={onUserSelectionChange}
          handleCloseDialog={onDialogClose}
          onTabChange={onTabChange}
        />
      )}
    </ShareFormWrapper>
  );
}

export default LazyShareForm;
