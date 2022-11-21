jest.mock('../../utils/getElementDimension');
jest.mock('../../card/ui/styles', () => {
  const original = jest.requireActual('../../card/ui/styles');
  return {
    ...original,
    calcBreakpointSize: jest.fn(original.calcBreakpointSize),
  };
});

import React from 'react';
import { shallow, mount } from 'enzyme';
import { CardViewBase, CardViewOwnProps } from '../../card/cardView';
import { CardStatus } from '../../types';
import { FileDetails } from '@atlaskit/media-client';
import { PlayButton } from '../../card/ui/playButton/playButton';
import { Blanket } from '../../card/ui/blanket/blanket';
import { TitleBox } from '../../card/ui/titleBox/titleBox';
import { ProgressBar } from '../../card/ui/progressBar/progressBar';
import { ImageRenderer } from '../../card/ui/imageRenderer/imageRenderer';
import { TickBox } from '../../card/ui/tickBox/tickBox';
import { MimeTypeIcon } from '@atlaskit/media-ui/mime-type-icon';
import { FailedTitleBox } from '../../card/ui/titleBox/failedTitleBox';
import { calcBreakpointSize } from '../../card/ui/styles';
import { getDefaultCardDimensions } from '../../utils/cardDimensions';
import { getElementDimension } from '../../utils/getElementDimension';
import Tooltip from '@atlaskit/tooltip';
import SpinnerIcon from '@atlaskit/spinner';
import { IconWrapper } from '../../card/ui/iconWrapper/iconWrapper';
import {
  PreviewUnavailable,
  PreviewCurrentlyUnavailable,
  CreatingPreview,
  FailedToUpload,
} from '../../card/ui/iconMessage';
import { createPollingMaxAttemptsError } from '@atlaskit/media-test-helpers';
import { MediaCardError } from '../../errors';
import { NewFileExperienceWrapper } from '../../card/ui/newFileExperience/newFileExperienceWrapper';

const cardPreview = {
  dataURI: 'some-data',
  orientation: 6,
  source: 'remote',
} as const;

const containerWidth = 150;
(getElementDimension as jest.Mock).mockReturnValue(containerWidth);

const errorStatuses: Array<CardStatus> = ['failed-processing', 'error'];

const nonErrorOrLoadingStatuses: Array<CardStatus> = [
  'uploading',
  'processing',
  'complete',
];

const nonErrorStatuses: Array<CardStatus> = [
  ...nonErrorOrLoadingStatuses,
  'loading-preview',
  'loading',
];

const nonLoadingStatuses: Array<CardStatus> = [
  ...nonErrorOrLoadingStatuses,
  ...errorStatuses,
];

const shallowCardViewBase = (
  props: Partial<CardViewOwnProps> = {},
  renderOptions = {},
) =>
  shallow(
    <CardViewBase
      status="loading"
      featureFlags={{ newCardExperience: true }}
      {...props}
    />,
    renderOptions,
  );

describe('CardView New Experience', () => {
  it(`should render NewFileExperienceWrapper with props`, () => {
    const width = 100;
    const metadata: FileDetails = {
      id: 'some-id',
      name: 'some-name',
      mediaType: 'image',
    };
    const cardProps: CardViewOwnProps = {
      testId: 'some-test-id',
      cardPreview,
      status: 'complete',
      mediaItemType: 'file',
      progress: 0.5,
      selected: true,
      metadata,
      alt: 'some-image',
      resizeMode: 'crop',
      onDisplayImage: () => {},
      dimensions: { width, height: 100 },
      appearance: 'auto',
      onClick: () => {},
      onMouseEnter: () => {},
      onImageLoad: () => {},
      onImageError: () => {},
    };

    const component = shallowCardViewBase(cardProps);
    const wrapper = component.find(NewFileExperienceWrapper);
    expect(wrapper).toHaveLength(1);
    expect(wrapper.props()).toEqual(
      expect.objectContaining({
        testId: cardProps.testId,
        dimensions: cardProps.dimensions,
        appearance: cardProps.appearance,
        onClick: cardProps.onClick,
        onMouseEnter: cardProps.onMouseEnter,
        disableOverlay: expect.any(Boolean),
        selected: expect.any(Boolean),
        displayBackground: expect.any(Boolean),
        isPlayButtonClickable: expect.any(Boolean),
        isTickBoxSelectable: expect.any(Boolean),
        breakpoint: calcBreakpointSize(width),
      }),
    );
    const subWrapper = wrapper.find('.media-file-card-view');
    expect(subWrapper.props()).toEqual(
      expect.objectContaining({
        'data-test-media-name': metadata.name,
        'data-test-status': cardProps.status,
        'data-test-progress': cardProps.progress,
        'data-test-selected': cardProps.selected,
      }),
    );
  });

  describe('On Image Load/Error', () => {
    it.each(nonErrorStatuses)(
      'should initialise didImageRender to false when status is %s',
      (status) => {
        const component = shallowCardViewBase({
          status,
          cardPreview,
        });
        expect(component.state('didImageRender')).toBe(false);
      },
    );

    it.each(nonErrorStatuses)(
      'should set didImageRender to true if the image succeded rendering when status is %s',
      (status) => {
        const component = shallowCardViewBase({
          status,
          cardPreview,
        });
        const imageRenderer = component.find(ImageRenderer);
        expect(imageRenderer).toHaveLength(1);
        const onImageLoad = imageRenderer.prop('onImageLoad');
        expect(onImageLoad).toBeDefined();
        onImageLoad && onImageLoad(cardPreview);
        expect(component.state('didImageRender')).toBe(true);
      },
    );

    it.each(nonErrorStatuses)(
      'should set didImageRender to false if the image failed rendering when status is %s',
      (status) => {
        const component = shallowCardViewBase({
          status,
          cardPreview,
        });
        const imageRenderer = component.find(ImageRenderer);
        expect(imageRenderer).toHaveLength(1);
        const onImageLoad = imageRenderer.prop('onImageLoad');
        expect(onImageLoad).toBeDefined();
        onImageLoad && onImageLoad(cardPreview);
        expect(component.state('didImageRender')).toBe(true);
      },
    );

    it.each(nonErrorStatuses)(
      'should set didImageRender to false if the image goes undefined when status is %s',
      (status) => {
        const component = shallowCardViewBase({
          status,
          cardPreview,
        });
        component.setState({ didImageRender: true });
        expect(component.state('didImageRender')).toBe(true);
        component.setProps({ cardPreview: undefined });
        expect(component.state('didImageRender')).toBe(false);
      },
    );

    it.each(nonErrorStatuses)(
      'should not change didImageRender when the image is updated when status is %s',
      (status) => {
        const component = shallowCardViewBase({
          status,
          cardPreview,
        });
        // when didImageRender = false
        component.setState({ didImageRender: false });
        expect(component.state('didImageRender')).toBe(false);
        component.setProps({ cardPreview: { dataURI: 'second-data-uri' } });
        expect(component.state('didImageRender')).toBe(false);

        // when didImageRender = true
        component.setState({ didImageRender: true });
        expect(component.state('didImageRender')).toBe(true);
        component.setProps({ cardPreview: { dataURI: 'third-data-uri' } });
        expect(component.state('didImageRender')).toBe(true);
      },
    );
  });

  describe('Dimensions and Breakpoint', () => {
    const defaultCardDimensionsWidth = parseInt(
      `${getDefaultCardDimensions().width}`,
      10,
    );

    [
      { width: 100, expectedBreakpointInput: 100 },
      { width: '135px', expectedBreakpointInput: 135 },
      { width: '80%', expectedBreakpointInput: containerWidth },
      { expectedBreakpointInput: defaultCardDimensionsWidth }, //intentionally undefined width
    ].map(({ width, expectedBreakpointInput }) =>
      it(`should pass the correct breakpoint to the Wrapper when dimension width is ${width}`, () => {
        const component = mount(
          <CardViewBase
            status="complete"
            mediaItemType="file"
            featureFlags={{ newCardExperience: true }}
            dimensions={{ width }}
          />,
        );
        const wrapper = component.find(NewFileExperienceWrapper);
        expect(calcBreakpointSize).toHaveBeenLastCalledWith(
          expectedBreakpointInput,
        );
        expect(wrapper).toHaveLength(1);
        expect(wrapper.props().breakpoint).toBe(
          calcBreakpointSize(expectedBreakpointInput),
        );
      }),
    );
  });

  describe('Render Layers', () => {
    it(`should render Spinner when status is ${status}`, () => {
      const component = shallowCardViewBase({ status: 'loading' });
      expect(component.find(SpinnerIcon)).toHaveLength(1);
      expect(component.find(IconWrapper)).toHaveLength(1);

      const componentB = shallowCardViewBase({
        cardPreview,
        status: 'loading',
      });
      expect(componentB.find(SpinnerIcon)).toHaveLength(1);
      expect(componentB.find(IconWrapper)).toHaveLength(1);
    });

    it(`should render Spinner when status is loading-preview`, () => {
      const component = shallowCardViewBase({ status: 'loading-preview' });
      expect(component.find(SpinnerIcon)).toHaveLength(1);
      expect(component.find(IconWrapper)).toHaveLength(1);

      const componentB = shallowCardViewBase({
        cardPreview,
        status: 'loading-preview',
      });
      expect(componentB.find(SpinnerIcon)).toHaveLength(1);
      expect(componentB.find(IconWrapper)).toHaveLength(1);
    });

    it(`should not render Spinner when status is loading and image succeeded rendering`, () => {
      const component = shallowCardViewBase({
        status: 'loading',
        cardPreview,
      });
      component.setState({ didImageRender: true });

      expect(component.find(SpinnerIcon)).toHaveLength(0);
      expect(component.find(IconWrapper)).toHaveLength(0);
    });

    it.each(nonLoadingStatuses)(
      `should not render Spinner when status is %s`,
      (status: CardStatus) => {
        const component = shallowCardViewBase({ status });
        expect(component.find(SpinnerIcon)).toHaveLength(0);
      },
    );

    it(`should render PlayButton when dataURI is defined`, () => {
      const metadata: FileDetails = { id: 'some-id', mediaType: 'video' };
      const component = shallowCardViewBase({
        metadata,
        status: 'complete',
        cardPreview,
      });
      expect(component.find(PlayButton)).toHaveLength(1);
    });

    it(`should not render PlayButton when mediaType is not video`, () => {
      const metadata: FileDetails = { id: 'some-id', mediaType: 'image' };
      const component = shallowCardViewBase({ metadata });
      expect(component.find(PlayButton)).toHaveLength(0);
    });

    it(`should not render a MediaTypeIcon when the status is loading`, () => {
      const metadata: FileDetails = { id: 'some-id', mediaType: 'video' };
      const component = shallowCardViewBase({
        metadata,
      });
      expect(component.find(MimeTypeIcon)).toHaveLength(0);

      component.setProps({ dataURI: 'some-data-uri' });
      expect(component.find(MimeTypeIcon)).toHaveLength(0);
    });

    it.each(nonLoadingStatuses)(
      `should render a MediaTypeIcon when the status is %s`,
      (status) => {
        const metadata: FileDetails = { id: 'some-id', mediaType: 'video' };
        const component = shallowCardViewBase({
          metadata,
          cardPreview,
          status,
        });
        expect(component.find(MimeTypeIcon)).toHaveLength(1);
        expect(component.find(MimeTypeIcon).prop('mediaType')).toEqual('video');

        component.setProps({ dataURI: 'some-data-uri' });
        expect(component.find(MimeTypeIcon)).toHaveLength(1);
        expect(component.find(MimeTypeIcon).prop('mediaType')).toEqual('video');
      },
    );

    it.each(errorStatuses)(
      `should render a MediaTypeIcon when the status is %s and image succeeded rendering`,
      (status) => {
        const metadata: FileDetails = { id: 'some-id', mediaType: 'video' };
        const component = shallowCardViewBase({
          metadata,
          cardPreview,
          status,
        });
        component.setState({ didImageRender: true });
        expect(component.find(MimeTypeIcon)).toHaveLength(1);
        expect(component.find(MimeTypeIcon).prop('mediaType')).toEqual('video');
      },
    );

    it.each(nonErrorOrLoadingStatuses)(
      `should not render a MediaTypeIcon when the status is %s and image succeeded rendering`,
      (status) => {
        const metadata: FileDetails = { id: 'some-id', mediaType: 'video' };
        const component = shallowCardViewBase({
          metadata,
          cardPreview,
          status,
        });
        component.setState({ didImageRender: true });
        expect(component.find(MimeTypeIcon)).toHaveLength(0);
      },
    );

    it(`should render Blanket when overlay is enabled or status is uploading (except for video)`, () => {
      // Hoverable blanket
      const componentA = shallowCardViewBase();
      const blanketA = componentA.find(Blanket);
      expect(blanketA).toHaveLength(1);
      expect(blanketA.prop('isFixed')).toBeFalsy();

      // Fixed blanket
      const componentB = shallowCardViewBase({
        metadata: { id: 'some-id', mediaType: 'image' },
        status: 'uploading',
        disableOverlay: true,
      });
      const blanketB = componentB.find(Blanket);
      expect(blanketB).toHaveLength(1);
      expect(blanketB.prop('isFixed')).toBe(true);

      //Disabled blanket
      const componentC = shallowCardViewBase({
        metadata: { id: 'some-id', mediaType: 'video' },
        status: 'uploading',
        disableOverlay: true,
      });
      expect(componentC.find(Blanket)).toHaveLength(0);
    });

    it(`should render TitleBox when has filename and overlay is enabled`, () => {
      const metadata: FileDetails = {
        id: 'some-id',
        name: 'some-file-name',
        createdAt: 123456,
      };

      // With metadata
      const componentA = shallowCardViewBase({ metadata });
      const titleBoxA = componentA.find(TitleBox);
      expect(titleBoxA).toHaveLength(1);
      expect(titleBoxA.props().breakpoint).toBeDefined();
      expect(titleBoxA.props().name).toBe(metadata.name);
      expect(titleBoxA.props().createdAt).toBe(metadata.createdAt);

      // Uploading and disabled overlay, no metadata
      const componentC = shallowCardViewBase({
        disableOverlay: true,
        status: 'uploading',
      });
      const titleBoxC = componentC.find(TitleBox);
      expect(titleBoxC).toHaveLength(0);

      // Disabled overlay with metadata
      const componentD = shallowCardViewBase({
        metadata,
        disableOverlay: true,
      });
      const titleBoxD = componentD.find(TitleBox);
      expect(titleBoxD).toHaveLength(0);

      // Enabled overlay with no metadata
      const componentE = shallowCardViewBase();
      const titleBoxE = componentE.find(TitleBox);
      expect(titleBoxE).toHaveLength(0);
    });

    it(`should not render FailedTitleBox when there is an error state or dataURI fails to load`, () => {
      const metadata: FileDetails = {
        id: 'some-id',
        name: 'some-file-name',
        createdAt: 123456,
      };

      // No dataURI + Error status
      const componentA = shallowCardViewBase({
        metadata,
        status: 'error',
      });
      const failedTitleBoxA = componentA.find(FailedTitleBox);
      expect(failedTitleBoxA).toHaveLength(0);
    });

    it(`should not render FailedTitleBox when there is PollingMaxAttemptsError"`, () => {
      const error = new MediaCardError(
        'error-file-state',
        createPollingMaxAttemptsError(),
      );
      const metadata: FileDetails = {
        id: 'some-id',
        name: 'some-file-name',
        createdAt: 123456,
      };
      const componentB = shallowCardViewBase({
        metadata,
        status: 'error',
        cardPreview,
        error,
      });

      const failedTitleBoxB = componentB.find(FailedTitleBox);
      expect(failedTitleBoxB).toHaveLength(0);
    });

    it(`should render ProgressBar when status is uploading`, () => {
      const progress = 0.6;
      const component = shallowCardViewBase({ status: 'uploading', progress });
      const progressBar = component.find(ProgressBar);
      expect(progressBar).toHaveLength(1);
      expect(progressBar.props().breakpoint).toBeDefined();
      expect(progressBar.props().progress).toBe(progress);
    });

    it(`should render CreatingPreview when status is processing`, () => {
      const component = shallowCardViewBase({ status: 'processing' });
      const creatingPreview = component.find(CreatingPreview);
      expect(creatingPreview).toHaveLength(1);
    });

    it(`should not render CreatingPreview when file size is zero`, () => {
      const component = shallowCardViewBase({
        status: 'complete',
        metadata: {
          id: 'some-id',
          createdAt: 1608505590086,
          mediaType: 'unknown',
          mimeType: 'inode/x-empty',
          name: 'zero-length-file',
          processingStatus: 'succeeded',
          size: 0,
        },
      });
      const creatingPreview = component.find(CreatingPreview);
      expect(creatingPreview).toHaveLength(0);
    });

    it(`should render Preview RateLimited Error message when there is upload error and overlay is disabled`, () => {
      const error = new MediaCardError('upload');

      const component = shallowCardViewBase({
        error,
        // CardView replies on the status more than the error passed. TODO: fix this?
        status: 'error',
        disableOverlay: true,
      });
      const rateLimitedUI = component.find(FailedToUpload);
      expect(rateLimitedUI).toHaveLength(1);
    });

    it(`should render PreviewUnavailable when status is failed-processing`, () => {
      const metadata: FileDetails = {
        id: 'some-id',
        name: 'some-name',
        mediaType: 'image',
      };

      const component = shallowCardViewBase({
        status: 'failed-processing',
        metadata: metadata,
      });
      const previewUnavailable = component.find(PreviewUnavailable);
      expect(previewUnavailable).toHaveLength(1);

      // With broken dataURI
      const componentB = shallowCardViewBase({
        status: 'failed-processing',
        metadata: metadata,
        cardPreview,
      });

      expect(componentB.find(PreviewUnavailable)).toHaveLength(1);
    });

    it(`should render PreviewCurrentlyUnavailable when there is PollingMaxAttemptsError`, () => {
      const error = new MediaCardError(
        'error-file-state',
        createPollingMaxAttemptsError(),
      );
      const metadata: FileDetails = {
        id: 'some-id',
        name: 'some-name',
        mediaType: 'image',
      };

      const component = shallowCardViewBase({
        status: 'error',
        metadata: metadata,
        error,
      });
      const previewCurrentlyUnavailable = component.find(
        PreviewCurrentlyUnavailable,
      );
      expect(previewCurrentlyUnavailable).toHaveLength(1);
    });

    it(`should render ImageRenderer when preview is defined`, () => {
      const metadata: FileDetails = {
        id: 'some-id',
        mediaType: 'image',
      };
      const cardProps: CardViewOwnProps = {
        cardPreview,
        status: 'complete',
        mediaItemType: 'file',
        metadata,
        alt: 'some-image',
        resizeMode: 'crop',
        onDisplayImage: () => {},
        onImageError: jest.fn(),
        onImageLoad: jest.fn(),
        nativeLazyLoad: true,
        forceSyncDisplay: true,
      };
      const component = shallowCardViewBase(cardProps);
      const imageRenderer = component.find(ImageRenderer);
      expect(imageRenderer).toHaveLength(1);
      expect(imageRenderer.props()).toEqual(
        expect.objectContaining({
          cardPreview,
          mediaType: metadata.mediaType,
          alt: cardProps.alt,
          resizeMode: cardProps.resizeMode,
          onDisplayImage: cardProps.onDisplayImage,
          onImageError: expect.any(Function),
          onImageLoad: expect.any(Function),
          nativeLazyLoad: true,
          forceSyncDisplay: true,
        }),
      );
    });

    it(`should render TickBox when overlay is enabled and card is selectable`, () => {
      // Selected tickbox
      const componentA = shallowCardViewBase({
        selected: true,
        selectable: true,
      });
      const tickBoxA = componentA.find(TickBox);
      expect(tickBoxA).toHaveLength(1);
      expect(tickBoxA.props().selected).toBe(true);

      // Unselected tickbox
      const componentB = shallowCardViewBase({ selectable: true });
      const tickBoxB = componentB.find(TickBox);
      expect(tickBoxB).toHaveLength(1);
      expect(tickBoxB.props().selected).toBeFalsy();

      // Disabled overlay
      const componentC = shallowCardViewBase({
        disableOverlay: true,
        selectable: true,
      });
      expect(componentC.find(TickBox)).toHaveLength(0);

      // Card not selectable
      const componentD = shallowCardViewBase();
      expect(componentD.find(TickBox)).toHaveLength(0);
    });

    it('should render the tooltip when overlay is enabled and there is filename', () => {
      // With filename and overlay enabled
      const component = shallowCardViewBase({
        metadata: { name: 'charlie.jpg' } as any,
      });
      const tooltip = component.find(Tooltip);
      expect(tooltip).toHaveLength(1);
      // This is how we ensure that the attached wrapper by Tooltip is a div element,
      // which we resize according to the input dimensions
      expect(tooltip.prop('tag')).toBe('div');
    });

    it('should not render the tooltip when overlay is disabled and there is filename', () => {
      // With filename and overlay disabled
      const component = shallowCardViewBase({
        metadata: { name: 'charlie.jpg' } as any,
        disableOverlay: true,
      });

      const tooltip = component.find(Tooltip);
      expect(tooltip).toHaveLength(0);
    });

    // Tooltip should not rely on metadata. That causes flicker
    // on the image when metadata is fetched.
    it('should render the tooltip if there is no filename', () => {
      // Without filename and overlay enabled
      const componentA = shallowCardViewBase();
      expect(componentA.find(Tooltip)).toHaveLength(1);
    });
  });
});
