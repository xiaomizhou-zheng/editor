/** @jsx jsx */
import { jsx } from '@emotion/react';
import { Appearance } from '@atlaskit/button/types';
import Button from '@atlaskit/button/custom-theme-button';
import { fontSize } from '@atlaskit/theme/constants';
import { FormattedMessage } from 'react-intl-next';
import { FC } from 'react';

import { messages, MessageKey } from '../../../messages';
import { gs as gridSize } from '../../common/utils';

export interface ButtonProps {
  appearance: Appearance;
  text: MessageKey;
  testId?: string;
}

export interface EmbedCardUnresolvedViewProps {
  image: string;
  context?: string;
  title: MessageKey;
  description: MessageKey;
  button?: ButtonProps;
  onClick?: () => void;
  testId?: string;
}

export const EmbedCardUnresolvedView: FC<EmbedCardUnresolvedViewProps> = ({
  image,
  title,
  description,
  button,
  context,
  onClick,
  testId,
  children,
}) => {
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: gridSize(4.5),
        paddingBottom: gridSize(6),
      }}
      data-testid={`${testId}-unresolved-container`}
    >
      <img
        src={image}
        css={{ height: gridSize(14), marginBottom: gridSize(4) }}
        data-testid={`${testId}-unresolved-image`}
      />
      <span
        css={{
          fontSize: gridSize(2.5),
          marginBottom: gridSize(1.5),
          width: gridSize(50),
          textAlign: 'center',
        }}
        data-testid={`${testId}-unresolved-title`}
      >
        <FormattedMessage {...messages[title]} values={{ context }} />
      </span>
      <span
        css={{
          fontSize: fontSize(),
          marginBottom: gridSize(2.5),
          textAlign: 'center',
          width: gridSize(50),
          lineHeight: gridSize(3),
        }}
        data-testid={`${testId}-unresolved-description`}
      >
        {children ?? (
          <FormattedMessage {...messages[description]} values={{ context }} />
        )}
      </span>
      {button && (
        <Button
          testId={`button-${button.testId || testId}`}
          appearance={button.appearance}
          onClick={onClick}
        >
          <FormattedMessage {...messages[button.text]} values={{ context }} />
        </Button>
      )}
    </div>
  );
};
