## API Report File for "@atlaskit/media-image"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

<!--
	Generated API Report version: 2.0
-->

[Learn more about API reports](https://hello.atlassian.net/wiki/spaces/UR/pages/1825484529/Package+API+Reports)

```ts
import { FileIdentifier } from '@atlaskit/media-client';
import { MediaClient } from '@atlaskit/media-client';
import { MediaStoreGetFileImageParams } from '@atlaskit/media-client';
import { default as React_2 } from 'react';
import { ReactNode } from 'react';
import { WithMediaClientConfig } from '@atlaskit/media-client';
import { WithMediaClientConfigProps } from '@atlaskit/media-client';

// @public (undocumented)
interface AsyncMediaImageState {
  // (undocumented)
  MediaImage?: MediaImageWithMediaClientConfigComponent;
}

// @public (undocumented)
class MediaImage_2 extends React_2.PureComponent<
  MediaImageLoaderProps,
  AsyncMediaImageState
> {
  // (undocumented)
  componentDidMount(): Promise<void>;
  // (undocumented)
  static displayName: string;
  // (undocumented)
  static MediaImage?: MediaImageWithMediaClientConfigComponent;
  // (undocumented)
  render(): React_2.ReactNode;
  // (undocumented)
  state: AsyncMediaImageState;
}
export { MediaImage_2 as MediaImage };

// @public (undocumented)
interface MediaImageChildrenProps {
  data: MediaImageState | undefined;
  error: boolean;
  loading: boolean;
}

// @public (undocumented)
interface MediaImageInternalProps {
  apiConfig?: MediaStoreGetFileImageParams;
  children: (props: MediaImageChildrenProps) => ReactNode;
  identifier: FileIdentifier;
  mediaClient: MediaClient;
}

// @public (undocumented)
interface MediaImageLoaderChildrenProps {
  // (undocumented)
  data: MediaImageState | undefined;
  // (undocumented)
  error: boolean;
  // (undocumented)
  loading: boolean;
}

// @public (undocumented)
type MediaImageLoaderProps = MediaImageWithMediaClientConfigProps &
  AsyncMediaImageState & {
    children: (props: MediaImageLoaderChildrenProps) => ReactNode;
  };

// @public (undocumented)
export type MediaImageProps = MediaImageInternalProps & WithMediaClientConfig;

// @public (undocumented)
interface MediaImageState {
  src?: string;
  status: 'loading' | 'error' | 'processed' | 'succeeded';
}

// @public (undocumented)
type MediaImageWithMediaClientConfigComponent = React_2.ComponentType<
  MediaImageWithMediaClientConfigProps
>;

// @public (undocumented)
type MediaImageWithMediaClientConfigProps = WithMediaClientConfigProps<
  MediaImageInternalProps
>;

// (No @packageDocumentation comment for this package)
```