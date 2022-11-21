/** @jsx jsx */
import React, { ReactElement } from 'react';

import { css, jsx } from '@emotion/react';

import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import LinkFilledIcon from '@atlaskit/icon/glyph/link-filled';
import Popup, { TriggerProps } from '@atlaskit/popup';
import { G300 } from '@atlaskit/theme/colors';
import { layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { InlineDialogContentWrapper } from './ShareFormWrapper/styled';
import Button from './styles';

const Z_INDEX = layers.modal();

const AUTO_DISMISS_SECONDS = 8;

export const AUTO_DISMISS_MS = AUTO_DISMISS_SECONDS * 1000;

export const messageContainerStyle = css`
  display: flex;
  align-items: center;
  margin: -8px -16px;
`;

const messageTextStyle = css`
  text-indent: 6px;
`;

const isSafari = navigator.userAgent.indexOf('Safari');

type InputProps = {
  text: string;
};

export const HiddenInput = React.forwardRef<HTMLInputElement, InputProps>(
  // we need a hidden input to reliably copy to clipboard across all browsers.
  (props, ref) => (
    <input
      style={{ position: 'absolute', left: '-9999px' }}
      tabIndex={-1}
      aria-hidden={true}
      ref={ref}
      value={props.text}
      readOnly
    />
  ),
);

export type Props = {
  onLinkCopy?: (link: string) => void;
  link: string;
  isDisabled?: boolean;
  copyTooltipText?: string;
  children?: string | ReactElement;
  copyLinkButtonText: string;
  copiedToClipboardText: string;
  iconBefore?: ReactElement;
};

export type State = {
  shouldShowCopiedMessage: boolean;
};

// eslint-disable-next-line @repo/internal/react/no-class-components
export class CopyLinkButton extends React.Component<Props, State> {
  private autoDismiss: ReturnType<typeof setTimeout> | undefined;
  private inputRef: React.RefObject<HTMLInputElement> = React.createRef();

  state = {
    shouldShowCopiedMessage: false,
  };

  componentWillUnmount() {
    this.clearAutoDismiss();
  }

  private clearAutoDismiss = () => {
    if (this.autoDismiss) {
      clearTimeout(this.autoDismiss);
      this.autoDismiss = undefined;
    }
  };

  private handleClick = () => {
    this.inputRef.current!.select();
    document.execCommand('copy');

    if (this.props.onLinkCopy) {
      this.props.onLinkCopy!(this.props.link);
    }

    this.setState({ shouldShowCopiedMessage: true }, () => {
      this.clearAutoDismiss();
      this.autoDismiss = setTimeout(() => {
        this.setState({ shouldShowCopiedMessage: false });
      }, AUTO_DISMISS_MS);
    });
  };

  private handleDismissCopiedMessage = () => {
    this.clearAutoDismiss();
    this.setState({ shouldShowCopiedMessage: false });
  };

  renderTriggerButton = (triggerProps: TriggerProps) => {
    const { isDisabled, copyLinkButtonText, children, iconBefore } = this.props;
    return (
      <Button
        aria-label={copyLinkButtonText}
        isDisabled={isDisabled}
        appearance="subtle-link"
        iconBefore={iconBefore || <LinkFilledIcon label="" size="medium" />}
        onClick={this.handleClick}
        {...triggerProps}
      >
        {children || copyLinkButtonText}
      </Button>
    );
  };

  render() {
    const { shouldShowCopiedMessage } = this.state;
    const { copyTooltipText, copiedToClipboardText } = this.props;

    return (
      <React.Fragment>
        {/* Added ARIA live region specifically for VoiceOver + Safari since the status */}
        {/* message 'Link copied to clipboard' is not announced by VO */}
        {isSafari && (
          <div className="assistive" aria-live="assertive">
            {shouldShowCopiedMessage && copiedToClipboardText}
          </div>
        )}
        <HiddenInput ref={this.inputRef} text={this.props.link} />
        <Popup
          zIndex={Z_INDEX}
          content={() => (
            <InlineDialogContentWrapper>
              <div css={messageContainerStyle} data-testid="message-container">
                <React.Fragment>
                  <CheckCircleIcon
                    label=""
                    primaryColor={token('color.icon.success', G300)}
                  />
                  <div css={messageTextStyle}>{copiedToClipboardText}</div>
                </React.Fragment>
              </div>
            </InlineDialogContentWrapper>
          )}
          isOpen={shouldShowCopiedMessage}
          onClose={this.handleDismissCopiedMessage}
          placement="top-start"
          trigger={(triggerProps: TriggerProps) =>
            copyTooltipText ? (
              <Tooltip content={copyTooltipText} position="bottom-start">
                {this.renderTriggerButton(triggerProps)}
              </Tooltip>
            ) : (
              this.renderTriggerButton(triggerProps)
            )
          }
        />
      </React.Fragment>
    );
  }
}

export default CopyLinkButton;
