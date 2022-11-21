import React, { Component } from 'react';

import { MediaClient, FileState } from '@atlaskit/media-client';

import { SpinnerWrapper } from '../../styleWrappers';
import { ArchiveSidebar } from './archive-sidebar';
import { getArchiveEntriesFromFileState } from './archive';
import { Spinner } from '../../loading';
import { ArchiveViewerError } from '../../errors';
import { ArchiveSideBar } from './styleWrappers';
import { ZipEntry } from 'unzipit';

export interface ArchiveSidebarRendererProps {
  selectedFileState: FileState;
  mediaClient: MediaClient;
  onSelectedArchiveEntryChange: (archiveEntry: ZipEntry) => void;
  onHeaderClicked: () => void;
  isArchiveEntryLoading: boolean;
  collectionName?: string;
  onError: (error: ArchiveViewerError, entry?: ZipEntry) => void;
  onSuccess: () => void;
}

interface ArchiveSidebarRendererState {
  entries: { [key: string]: ZipEntry };
  status: 'loading' | 'loaded';
}

export default class ArchiveSidebarRenderer extends Component<
  ArchiveSidebarRendererProps,
  ArchiveSidebarRendererState
> {
  state: ArchiveSidebarRendererState = {
    entries: {},
    status: 'loading',
  };

  async componentDidMount() {
    const {
      selectedFileState,
      mediaClient,
      collectionName,
      onError,
      onSuccess,
    } = this.props;

    try {
      const archive = await getArchiveEntriesFromFileState(
        selectedFileState,
        mediaClient,
        collectionName,
      );
      const entries = archive.entries;
      this.setState({ entries, status: 'loaded' });
      onSuccess();
    } catch (error) {
      this.setState({ status: 'loaded' });
      onError(
        new ArchiveViewerError(
          'archiveviewer-read-binary',
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }

  render() {
    const { entries, status } = this.state;
    const {
      mediaClient,
      onHeaderClicked,
      isArchiveEntryLoading,
      onSelectedArchiveEntryChange,
      onError,
    } = this.props;
    return (
      <>
        {(status === 'loading' && (
          <ArchiveSideBar>
            <SpinnerWrapper>
              <Spinner />
            </SpinnerWrapper>
          </ArchiveSideBar>
        )) || (
          <ArchiveSidebar
            entries={entries}
            onEntrySelected={onSelectedArchiveEntryChange}
            onHeaderClicked={onHeaderClicked}
            mediaClient={mediaClient}
            isArchiveEntryLoading={isArchiveEntryLoading}
            onError={onError}
          />
        )}
      </>
    );
  }
}
