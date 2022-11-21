import React, { useState, FC } from 'react';
import ReactDOM from 'react-dom';
import { FileIdentifier } from '@atlaskit/media-client';
import { MediaViewer, MediaViewerDataSource } from '@atlaskit/media-viewer';
import { messages } from '@atlaskit/media-ui';
import FilePreviewIcon from '@atlaskit/icon/glyph/editor/file-preview';
import ToolbarButton from '../../floating-toolbar/ui/Button';
import { MediaPluginState } from '../pm-plugins/types';
import { getSelectedMediaContainerNodeAttrs } from './utils';
import { IntlShape } from 'react-intl-next';

interface FilePreviewProps {
  mediaPluginState: MediaPluginState;
  intl: IntlShape;
}

export const FilePreviewItem: FC<FilePreviewProps> = ({
  mediaPluginState,
  intl,
}) => {
  const [isMediaViewerVisible, setMediaViewerVisible] = useState(false);
  const openMediaViewer = () => {
    setMediaViewerVisible(true);
  };
  const onMediaViewerClose = () => {
    setMediaViewerVisible(false);
  };

  const renderMediaViewer = () => {
    if (isMediaViewerVisible) {
      const dataSource: MediaViewerDataSource = {
        list: [],
      };
      const selectedNodeAttrs = getSelectedMediaContainerNodeAttrs(
        mediaPluginState,
      );
      if (selectedNodeAttrs && mediaPluginState.mediaClientConfig) {
        const { id, collection = '' } = selectedNodeAttrs;
        const identifier: FileIdentifier = {
          id,
          mediaItemType: 'file',
          collectionName: collection,
        };
        return ReactDOM.createPortal(
          <MediaViewer
            collectionName={collection}
            dataSource={dataSource}
            mediaClientConfig={mediaPluginState.mediaClientConfig}
            selectedItem={identifier}
            onClose={onMediaViewerClose}
          />,
          document.body,
        );
      }
    }
    return null;
  };
  const mediaViewer = renderMediaViewer();
  const tooltipContent = intl.formatMessage(messages.preview);
  return (
    <div>
      <ToolbarButton
        testId="file-preview-toolbar-button"
        key="editor.media.card.preview"
        onClick={openMediaViewer}
        icon={<FilePreviewIcon label="file preview" />}
        tooltipContent={tooltipContent}
      />
      {mediaViewer}
    </div>
  );
};
