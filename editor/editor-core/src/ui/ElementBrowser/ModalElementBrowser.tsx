/** @jsx jsx */
import React, { useState, useCallback } from 'react';
import { css, jsx } from '@emotion/react';
import { injectIntl, WrappedComponentProps } from 'react-intl-next';

import { DN50, N0 } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { borderRadius } from '@atlaskit/theme/constants';
import { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';

import Button from '@atlaskit/button/custom-theme-button';
import Modal, { ModalTransition, useModal } from '@atlaskit/modal-dialog';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';

import ElementBrowser from './components/ElementBrowserLoader';
import { getCategories } from './categories';
import { MODAL_WRAPPER_PADDING } from './constants';
import { messages } from './messages';
import { EmptyStateHandler } from '../../types/empty-state-handler';
import { token } from '@atlaskit/tokens';
export interface State {
  isOpen: boolean;
}

export interface Props {
  getItems: (query?: string, category?: string) => QuickInsertItem[];
  onInsertItem: (item: QuickInsertItem) => void;
  isOpen?: boolean;
  onClose: () => void;
  helpUrl?: string | undefined;
  emptyStateHandler?: EmptyStateHandler;
}

const actions = css`
  display: inline-flex;
  margin: 0 -4px;
`;

const actionItem = css`
  flex: 1 0 auto;
  margin: 0 4px;
`;

const wrapper = css`
  display: flex;
  flex: 1 1 auto;
  box-sizing: border-box;
  padding: ${MODAL_WRAPPER_PADDING}px ${MODAL_WRAPPER_PADDING}px 0 10px;
  overflow: hidden;
  background-color: ${themed({
    light: token('elevation.surface.overlay', N0),
    dark: token('elevation.surface.overlay', DN50),
  })()};
  border-radius: ${borderRadius()}px;
`;

const modalFooter = css`
  display: flex;
  padding: ${MODAL_WRAPPER_PADDING}px;

  position: relative;
  align-items: center;
  justify-content: space-between;
`;

const ModalElementBrowser = (props: Props & WrappedComponentProps) => {
  const [selectedItem, setSelectedItem] = useState<QuickInsertItem>();
  const { helpUrl, intl } = props;

  const onSelectItem = useCallback(
    (item: QuickInsertItem) => {
      setSelectedItem(item);
    },
    [setSelectedItem],
  );

  const onInsertItem = useCallback(
    (item: QuickInsertItem) => {
      props.onInsertItem(item);
    },
    [props],
  );

  const RenderFooter = useCallback(
    () => (
      <Footer
        onInsert={() => onInsertItem(selectedItem!)}
        beforeElement={
          helpUrl
            ? HelpLink(helpUrl, intl.formatMessage(messages.help))
            : undefined
        }
      />
    ),
    [onInsertItem, selectedItem, helpUrl, intl],
  );

  // Since Modal uses stackIndex it's shouldCloseOnEscapePress prop doesn't work.
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        props.onClose();
      }
    },
    [props],
  );

  const RenderBody = useCallback(
    () => (
      <div css={wrapper}>
        <ElementBrowser
          categories={getCategories(props.intl)}
          getItems={props.getItems}
          showSearch={true}
          showCategories
          mode="full"
          onSelectItem={onSelectItem}
          onInsertItem={onInsertItem}
          emptyStateHandler={props.emptyStateHandler}
        />
      </div>
    ),
    [
      props.intl,
      props.getItems,
      onSelectItem,
      onInsertItem,
      props.emptyStateHandler,
    ],
  );

  return (
    <div data-editor-popup={true} onClick={onModalClick} onKeyDown={onKeyDown}>
      <ModalTransition>
        {props.isOpen && (
          <Modal
            testId="element-browser-modal-dialog"
            stackIndex={0}
            key="element-browser-modal"
            onClose={props.onClose}
            height="664px"
            width="x-large"
            autoFocus={false}
            // defaults to true and doesn't work along with stackIndex=1.
            // packages/design-system/modal-dialog/src/components/Content.tsx Line 287
            shouldCloseOnEscapePress={false}
          >
            <RenderBody />
            <RenderFooter />
          </Modal>
        )}
      </ModalTransition>
    </div>
  );
};

ModalElementBrowser.displayName = 'ModalElementBrowser';

// Prevent ModalElementBrowser click propagation through to the editor.
const onModalClick = (e: React.MouseEvent) => e.stopPropagation();

const Footer = ({
  onInsert,
  beforeElement,
}: {
  onInsert: () => void;
  beforeElement?: JSX.Element;
}) => {
  const { onClose } = useModal();
  return (
    <div css={modalFooter}>
      {beforeElement ? beforeElement : <span />}
      <div css={actions}>
        <div css={actionItem}>
          <Button
            appearance="primary"
            onClick={onInsert}
            testId="ModalElementBrowser__insert-button"
          >
            Insert
          </Button>
        </div>
        <div css={actionItem}>
          <Button
            appearance="subtle"
            onClick={onClose}
            testId="ModalElementBrowser__close-button"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

const HelpLink = (url: string, helpText: string) => (
  <Button
    iconBefore={<QuestionCircleIcon label="help" size="medium" />}
    appearance="subtle-link"
    href={url}
    target="_blank"
    testId="ModalElementBrowser__help-button"
  >
    {helpText}
  </Button>
);

export default injectIntl(ModalElementBrowser);
