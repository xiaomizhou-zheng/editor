import React from 'react';
import { MediaInlineCardInternal as MediaInlineCard } from '../../mediaInlineCard';
import { mount } from 'enzyme';
import {
  FileIdentifier,
  FileState,
  createMediaSubject,
  ErrorFileState,
} from '@atlaskit/media-client';
import {
  fakeMediaClient,
  fakeIntl,
  asMock,
} from '@atlaskit/media-test-helpers';
import { MediaInlineCardLoadingView } from '@atlaskit/media-ui';
import { render, waitFor } from '@testing-library/react';

describe('<MediaInlineCard />', () => {
  const identifier: FileIdentifier = {
    id: '1234',
    mediaItemType: 'file',
  };
  const mediaClient = fakeMediaClient();
  const mockFileState: FileState = {
    status: 'processing',
    id: '1234',
    name: 'file_name',
    size: 1024,
    mediaType: 'image',
    mimeType: 'image/png',
  };

  beforeEach(() => {
    asMock(mediaClient.file.getFileState).mockReturnValue(
      createMediaSubject(mockFileState),
    );
  });

  it('should render loading view while loading media file', () => {
    const mediaInlineCard = mount(
      <MediaInlineCard
        intl={fakeIntl}
        identifier={identifier}
        mediaClient={fakeMediaClient()}
      />,
    );
    expect(mediaInlineCard.find(MediaInlineCardLoadingView)).toHaveLength(1);
  });

  it('should render loaded view when media loads successfully', async () => {
    const { getByTestId, getByText } = render(
      <MediaInlineCard
        intl={fakeIntl}
        identifier={identifier}
        mediaClient={mediaClient}
      />,
    );
    const loadedView = await waitFor(() =>
      getByTestId('media-inline-card-loaded-view'),
    );
    const title = await waitFor(() => getByText('file_name'));

    expect(loadedView).toBeTruthy();
    expect(title).toBeTruthy();
  });

  it('should render MediaViewer when shouldOpenMediaViewer=true and clicked', async () => {
    const { getByTestId } = render(
      <MediaInlineCard
        intl={fakeIntl}
        identifier={identifier}
        mediaClient={mediaClient}
        shouldOpenMediaViewer
      />,
    );
    const loadedView = await waitFor(() =>
      getByTestId('media-inline-card-loaded-view'),
    );

    loadedView.click();

    const mediaViewer = await waitFor(() => getByTestId('media-viewer-popup'));

    expect(mediaViewer).toBeTruthy();
  });

  it('should call onClick callback when provided', async () => {
    const onClick = jest.fn();
    const { getByTestId } = render(
      <MediaInlineCard
        intl={fakeIntl}
        identifier={identifier}
        mediaClient={mediaClient}
        onClick={onClick}
      />,
    );
    const loadedView = await waitFor(() =>
      getByTestId('media-inline-card-loaded-view'),
    );

    loadedView.click();

    expect(onClick).toBeCalledTimes(1);
  });

  it('should render right media file type icon', async () => {
    const { getByTestId } = render(
      <MediaInlineCard
        intl={fakeIntl}
        identifier={identifier}
        mediaClient={mediaClient}
      />,
    );
    const fileTypeIcon = await waitFor(() =>
      getByTestId('media-inline-card-file-type-icon'),
    );
    expect(fileTypeIcon.getAttribute('data-type')).toEqual('image');
    expect(fileTypeIcon).toBeTruthy();
  });

  it('should render right icon when mimeType is more specific than media type', async () => {
    const mockFileState: FileState = {
      status: 'processing',
      id: '1234',
      name: 'file_name',
      size: 1024,
      mediaType: 'doc',
      mimeType: 'text/csv',
    };

    asMock(mediaClient.file.getFileState).mockReturnValue(
      createMediaSubject(mockFileState),
    );

    const { getByTestId } = render(
      <MediaInlineCard
        intl={fakeIntl}
        identifier={identifier}
        mediaClient={mediaClient}
      />,
    );
    const fileTypeIcon = await waitFor(() =>
      getByTestId('media-inline-card-file-type-icon'),
    );
    expect(fileTypeIcon.getAttribute('data-type')).toEqual('spreadsheet');
  });

  it('should render error view', async () => {
    asMock(mediaClient.file.getFileState).mockReturnValueOnce(
      createMediaSubject({ status: 'error' } as ErrorFileState),
    );
    const { getByTestId } = render(
      <MediaInlineCard
        intl={fakeIntl}
        identifier={identifier}
        mediaClient={mediaClient}
      />,
    );
    const erroredView = await waitFor(() =>
      getByTestId('media-inline-card-errored-view'),
    );

    expect(erroredView).toBeTruthy();
  });
});
