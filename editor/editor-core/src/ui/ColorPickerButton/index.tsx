/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';

import { Popup, withOuterListeners } from '@atlaskit/editor-common/ui';
import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';
import { N60A } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';

import ColorPalette from '../ColorPalette';
import { DEFAULT_BORDER_COLOR } from '../ColorPalette/Palettes/common';
import { PaletteColor } from '../ColorPalette/Palettes';
import {
  withAnalyticsContext,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { ColorPickerAEP } from '../../plugins/analytics/types/general-events';
import { editorAnalyticsChannel } from '../../plugins/analytics/consts';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '../../plugins/analytics/types';

// helps adjusts position of popup
const colorPickerButtonWrapper = css`
  position: relative;
`;

// Control the size of color picker buttons and preview
const colorPickerWrapper = css`
  border-radius: ${borderRadius()}px;
  background-color: white;
  box-shadow: 0 4px 8px -2px ${N60A}, 0 0 1px ${N60A};
  padding: 8px 0px;
`;

type Props = WithAnalyticsEventsProps & {
  currentColor?: string;
  title?: string;
  onChange?: (color: PaletteColor) => void;
  colorPalette: PaletteColor[];
  placement: string;
  cols?: number;
  alignX?: 'left' | 'right' | 'center' | 'end';
  size?: {
    width: number;
    height: number;
  };
  mountPoint?: HTMLElement;
  setDisableParentScroll?: (disable: boolean) => void;
};

const ColorPickerButton = (props: Props) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  React.useEffect(() => {
    if (props.setDisableParentScroll) {
      props.setDisableParentScroll(isPopupOpen);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPopupOpen]);

  const ColorPaletteWithListeners = withOuterListeners(ColorPalette);

  const onColorSelected = (color: string, label: string) => {
    setIsPopupOpen(false);
    if (props.onChange) {
      if (props.createAnalyticsEvent) {
        // fire analytics
        const payload: ColorPickerAEP = {
          action: ACTION.UPDATED,
          actionSubject: ACTION_SUBJECT.PICKER,
          actionSubjectId: ACTION_SUBJECT_ID.PICKER_COLOR,
          attributes: {
            color,
            label,
            placement: props.placement,
          },
          eventType: EVENT_TYPE.TRACK,
        };
        props.createAnalyticsEvent(payload).fire(editorAnalyticsChannel);
      }

      const newPalette = props.colorPalette.find(
        (colorPalette) => colorPalette.value === color,
      );
      newPalette && props.onChange(newPalette);
    }
  };

  const renderPopup = () => {
    if (!isPopupOpen || !buttonRef.current) {
      return;
    }

    return (
      <Popup
        target={buttonRef.current}
        fitHeight={350}
        fitWidth={350}
        offset={[0, 10]}
        alignX={props.alignX}
        mountTo={props.setDisableParentScroll ? props.mountPoint : undefined}
        // Confluence inline comment editor has z-index: 500
        // if the toolbar is scrollable, this will be mounted in the root editor
        // we need an index of > 500 to display over it
        zIndex={props.setDisableParentScroll ? 600 : undefined}
        ariaLabel="Color picker popup"
      >
        <div css={colorPickerWrapper}>
          <ColorPaletteWithListeners
            palette={props.colorPalette}
            cols={props.cols}
            selectedColor={props.currentColor || null}
            onClick={onColorSelected}
            handleClickOutside={togglePopup}
          />
        </div>
      </Popup>
    );
  };

  const title = props.title || '';

  return (
    <div css={colorPickerButtonWrapper}>
      <Tooltip content={title} position="top">
        <Button
          ref={buttonRef}
          aria-label={title}
          spacing="compact"
          onClick={togglePopup}
          style={{
            backgroundColor: props.currentColor || 'transparent',
            border: `1px solid ${DEFAULT_BORDER_COLOR}`,
            width: `${props.size?.width || 20}px`,
            height: `${props.size?.height || 20}px`,
            padding: 0,
          }}
        />
      </Tooltip>
      {renderPopup()}
    </div>
  );
};

export default withAnalyticsContext({ source: 'ConfigPanel' })(
  withAnalyticsEvents()(ColorPickerButton),
);
