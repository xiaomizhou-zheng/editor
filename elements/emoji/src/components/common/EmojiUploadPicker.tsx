/** @jsx jsx */
import React, {
  FC,
  Fragment,
  KeyboardEventHandler,
  useEffect,
  useState,
  ChangeEvent,
  ChangeEventHandler,
} from 'react';
import { jsx } from '@emotion/react';
import {
  FormattedMessage,
  injectIntl,
  MessageDescriptor,
  WrappedComponentProps,
} from 'react-intl-next';
import TextField from '@atlaskit/textfield';

import { EmojiUpload, Message } from '../../types';
import * as ImageUtil from '../../util/image';
import debug from '../../util/logger';
import { messages } from '../i18n';
import EmojiErrorMessage from './EmojiErrorMessage';
import EmojiUploadPreview from './EmojiUploadPreview';
import FileChooser from './FileChooser';
import { UploadStatus } from './internal-types';
import {
  emojiChooseFileErrorMessage,
  emojiUpload,
  emojiUploadBottom,
  uploadChooseFileBrowse,
  uploadChooseFileEmojiName,
  uploadChooseFileMessage,
  uploadChooseFileRow,
} from './styles';

export interface OnUploadEmoji {
  (upload: EmojiUpload, retry: boolean, onSuccessHandler?: () => void): void;
}

export interface Props {
  onUploadEmoji: OnUploadEmoji;
  onUploadCancelled: () => void;
  onFileChooserClicked?: () => void;
  errorMessage?: Message;
  initialUploadName?: string;
}

const disallowedReplacementsMap = new Map([
  [':', ''],
  ['!', ''],
  ['@', ''],
  ['#', ''],
  ['%', ''],
  ['^', ''],
  ['&', ''],
  ['*', ''],
  ['(', ''],
  [')', ''],
  [' ', '_'],
]);

const sanitizeName = (name: string): string => {
  // prevent / replace certain characters, allow others
  disallowedReplacementsMap.forEach((replaceWith, exclude) => {
    name = name.split(exclude).join(replaceWith);
  });
  return name;
};

const maxNameLength = 50;

const toEmojiName = (uploadName: string): string => {
  const name = uploadName.split('_').join(' ');
  return `${name.substr(0, 1).toLocaleUpperCase()}${name.substr(1)}`;
};

interface ChooseEmojiFileProps {
  name?: string;
  onChooseFile: ChangeEventHandler<any>;
  onClick?: () => void;
  onNameChange: ChangeEventHandler<any>;
  onUploadCancelled: () => void;
  errorMessage?: Message;
}

type ChooseEmojiFilePropsType = ChooseEmojiFileProps & WrappedComponentProps;
const ChooseEmojiFile: FC<ChooseEmojiFilePropsType> = (props) => {
  const {
    name = '',
    onChooseFile,
    onClick,
    onNameChange,
    onUploadCancelled,
    errorMessage,
    intl,
  } = props;
  const { formatMessage } = intl;
  const disableChooser = !name;
  const fileChooserButtonDescriptionId =
    'choose.emoji.file.button.screen.reader.description.id';

  const onKeyDownHandler: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Escape') {
      onUploadCancelled();
    }
  };

  return (
    <div css={emojiUpload}>
      <div css={uploadChooseFileMessage}>
        <FormattedMessage {...messages.addCustomEmojiLabel}>
          {(message) => <h5>{message}</h5>}
        </FormattedMessage>
      </div>
      <div css={uploadChooseFileRow}>
        <span css={uploadChooseFileEmojiName}>
          <TextField
            placeholder={formatMessage(messages.emojiPlaceholder)}
            aria-label={formatMessage(messages.emojiNameAriaLabel)}
            maxLength={maxNameLength}
            onChange={onNameChange}
            onKeyDown={onKeyDownHandler}
            value={name}
            isCompact
            autoFocus
          />
        </span>
        <span css={uploadChooseFileBrowse}>
          <FormattedMessage
            {...messages.emojiChooseFileScreenReaderDescription}
          >
            {(screenReaderDescription) => (
              <Fragment>
                <span hidden id={fileChooserButtonDescriptionId}>
                  {screenReaderDescription}
                </span>
                <FileChooser
                  label={formatMessage(messages.emojiChooseFileTitle)}
                  onChange={onChooseFile}
                  onClick={onClick}
                  accept="image/png,image/jpeg,image/gif"
                  ariaDescribedBy={fileChooserButtonDescriptionId}
                  isDisabled={disableChooser}
                />
              </Fragment>
            )}
          </FormattedMessage>
        </span>
      </div>
      <div css={emojiUploadBottom}>
        {!errorMessage ? (
          <p>
            <FormattedMessage {...messages.emojiImageRequirements} />
          </p>
        ) : (
          <EmojiErrorMessage
            messageStyles={emojiChooseFileErrorMessage}
            message={errorMessage}
          />
        )}
      </div>
    </div>
  );
};

const EmojiUploadPicker: FC<Props & WrappedComponentProps> = (props) => {
  const {
    errorMessage,
    initialUploadName,
    onUploadEmoji,
    onFileChooserClicked,
    onUploadCancelled,
    intl,
  } = props;
  const [uploadStatus, setUploadStatus] = useState(
    errorMessage ? UploadStatus.Error : UploadStatus.Waiting,
  );
  const [chooseEmojiErrorMessage, setChooseEmojiErrorMessage] = useState<
    MessageDescriptor
  >();
  const [name, setName] = useState(
    initialUploadName && sanitizeName(initialUploadName),
  );
  const [filename, setFilename] = useState<string>();
  const [previewImage, setPreviewImage] = useState<string>();

  useEffect(() => {
    if (errorMessage) {
      setUploadStatus(UploadStatus.Error);
      return;
    } else {
      if (uploadStatus === UploadStatus.Error) {
        setUploadStatus(UploadStatus.Waiting);
      }
    }
  }, [errorMessage, uploadStatus]);

  useEffect(() => {
    if (initialUploadName) {
      setName(sanitizeName(initialUploadName));
    }
  }, [initialUploadName]);

  const onNameChange = (event: ChangeEvent<any>) => {
    let newName = sanitizeName(event.target.value);
    if (name !== newName) {
      setName(newName);
    }
  };

  const onAddEmoji = () => {
    if (uploadStatus === UploadStatus.Uploading) {
      return;
    }

    if (filename && name && previewImage) {
      const notifyUpload = (size: { width: number; height: number }) => {
        const { width, height } = size;
        setUploadStatus(UploadStatus.Uploading);

        onUploadEmoji(
          {
            name: toEmojiName(name),
            shortName: `:${name}:`,
            filename,
            dataURL: previewImage,
            width,
            height,
          },
          uploadStatus === UploadStatus.Error,
          clearUploadPicker,
        );
      };
      ImageUtil.getNaturalImageSize(previewImage)
        .then((size) => {
          notifyUpload(size);
        })
        .catch((error) => {
          debug('getNaturalImageSize error', error);
          // Just set arbitrary size, worse case is it may render
          // in wrong aspect ratio in some circumstances.
          notifyUpload({
            width: 32,
            height: 32,
          });
        });
    }
  };
  const errorOnUpload = (event: any): void => {
    debug('File load error: ', event);
    setChooseEmojiErrorMessage(messages.emojiUploadFailed);
    cancelChooseFile();
  };
  const onFileLoad = (file: File) => async (f: any): Promise<any> => {
    try {
      setFilename(file.name);
      await ImageUtil.parseImage(f.target.result);
      setPreviewImage(f.target.result);
    } catch {
      setChooseEmojiErrorMessage(messages.emojiInvalidImage);
      cancelChooseFile();
    }
  };
  const cancelChooseFile = () => {
    setPreviewImage(undefined);
  };
  const onChooseFile = (event: ChangeEvent<any>): void => {
    const files = event.target.files;

    if (files.length) {
      const reader = new FileReader();
      const file: File = files[0];

      if (ImageUtil.hasFileExceededSize(file)) {
        setChooseEmojiErrorMessage(messages.emojiImageTooBig);
        cancelChooseFile();
        return;
      }

      reader.addEventListener('load', onFileLoad(file));
      reader.addEventListener('abort', errorOnUpload);
      reader.addEventListener('error', errorOnUpload);
      reader.readAsDataURL(file);
    } else {
      cancelChooseFile();
    }
  };
  const clearUploadPicker = () => {
    setName(undefined);
    setPreviewImage(undefined);
    setUploadStatus(UploadStatus.Waiting);
  };
  const cancelUpload = () => {
    clearUploadPicker();
    onUploadCancelled();
  };

  return (
    <React.Fragment>
      {name && previewImage ? (
        <EmojiUploadPreview
          errorMessage={errorMessage}
          name={name}
          onAddEmoji={onAddEmoji}
          onUploadCancelled={cancelUpload}
          previewImage={previewImage}
          uploadStatus={uploadStatus}
        />
      ) : (
        <ChooseEmojiFile
          name={name}
          onChooseFile={onChooseFile}
          onClick={onFileChooserClicked}
          onNameChange={onNameChange}
          onUploadCancelled={cancelUpload}
          errorMessage={
            chooseEmojiErrorMessage ? (
              <FormattedMessage {...chooseEmojiErrorMessage} />
            ) : undefined
          }
          intl={intl}
        />
      )}
    </React.Fragment>
  );
};

export default injectIntl(EmojiUploadPicker);
