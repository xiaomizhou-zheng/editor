jest.mock('../../utils/checkWebpSupport');
jest.mock('../../client/media-store/resolveAuth');
import {
  CreatedTouchedFile,
  MediaStore,
  MediaUpload,
  MediaChunksProbe,
  MediaFile,
  MediaCollectionItems,
  MediaStoreGetFileParams,
  ItemsPayload,
  ImageMetadata,
  MediaStoreTouchFileBody,
  TouchFileDescriptor,
  TouchedFiles,
  MediaStoreTouchFileParams,
  MediaFileArtifacts,
  checkWebpSupport,
  isRequestError,
  isMediaStoreError,
  MediaStoreError,
  getMediaEnvironment,
  getMediaRegion,
} from '../..';
import { FILE_CACHE_MAX_AGE } from '../../constants';
import {
  resolveAuth,
  resolveInitialAuth,
} from '../../client/media-store/resolveAuth';
import { Auth } from '@atlaskit/media-core';
import { ZipkinHeaderKeys } from '../../client/media-store';

const baseUrl = 'http://some-host';
const clientId = 'some-client-id';
const token = 'some-token';
const auth = {
  baseUrl,
  clientId,
  token,
};
(resolveAuth as jest.Mock).mockResolvedValue(auth);
(resolveInitialAuth as jest.Mock).mockImplementation((auth: Auth) => auth);
const authProvider = jest.fn();
let mediaStore: MediaStore;

describe('MediaStore', () => {
  const checkWebpSupportMock = checkWebpSupport as jest.Mock;

  afterEach(() => {
    fetchMock.resetMocks();
  });

  describe('given auth provider resolves', () => {
    const setup = async (headers: any) => {
      const collectionName = 'some-collection-name';
      const data: MediaCollectionItems = {
        nextInclusiveStartKey: '121',
        contents: [],
      };

      fetchMock.once(JSON.stringify({ data }), {
        status: 201,
        statusText: 'Created',
        headers,
      });

      await mediaStore.getCollectionItems(collectionName, {
        limit: 10,
        details: 'full',
        inclusiveStartKey: 'some-inclusive-start-key',
        sortDirection: 'desc',
      });
    };

    const data: MediaFile = {
      id: 'faee2a3a-f37d-11e4-aae2-3c15c2c70ce6',
      mediaType: 'doc',
      mimeType: 'application/pdf',
      name: 'example document.pdf',
      processingStatus: 'pending',
      size: 231392,
      artifacts: {},
      representations: {},
    };

    beforeEach(() => {
      jest.clearAllMocks();
      mediaStore = new MediaStore({ authProvider });
    });

    describe('fetch media environment', () => {
      it('should give media environment as undefined if not received', async () => {
        await setup({});

        const receivedMediaEnv = getMediaEnvironment();

        expect(receivedMediaEnv).toEqual(undefined);
      });

      it('should get media environment from header', async () => {
        await setup({ 'x-media-env': 'mediaRegion' });

        const receivedMediaEnv = getMediaEnvironment();

        expect(receivedMediaEnv).toEqual('mediaRegion');
      });
    });

    describe('fetch media region', () => {
      it('should return media region as undefined if not set', () => {
        const receivedMediaRegion = getMediaRegion();

        expect(receivedMediaRegion).toBe(undefined);
      });

      it('should store region from header in sessionStorage', async () => {
        await setup({ 'x-media-region': 'someRegion' });

        expect(window.sessionStorage.getItem('media-api-region')).toEqual(
          'someRegion',
        );
        expect(getMediaRegion()).toEqual('someRegion');
      });
    });

    describe('createUpload', () => {
      it('should POST to /upload endpoint with correct options', async () => {
        const createUpTo = 1;
        const data: MediaUpload[] = [
          { id: 'some-upload-id', created: 123, expires: 456 },
        ];

        fetchMock.once(JSON.stringify({ data }), {
          status: 201,
          statusText: 'Created',
        });

        const response = await mediaStore.createUpload(createUpTo);
        expect(response).toEqual({ data });

        expect(fetchMock).toHaveBeenCalledWith(
          `${baseUrl}/upload?createUpTo=${createUpTo}`,
          {
            method: 'POST',
            headers: {
              'X-Client-Id': clientId,
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          },
        );
      });

      it('should pass collection name to the authContext', async () => {
        mediaStore.request = jest
          .fn()
          .mockReturnValue(Promise.resolve({ json() {} }));
        await mediaStore.createUpload(undefined, 'my-collection');

        expect(mediaStore.request).toBeCalledWith('/upload', {
          method: 'POST',
          endpoint: '/upload',
          authContext: {
            collectionName: 'my-collection',
          },
          params: { createUpTo: 1 },
          headers: {
            Accept: 'application/json',
          },
        });
      });

      it('should fail if response is malformed JSON', async () => {
        const createUpTo = 1;

        fetchMock.once('Invalid Body', {
          status: 201,
          statusText: 'Created',
          headers: { 'x-media-region': 'ap-southeast-2' },
        });

        try {
          await mediaStore.createUpload(createUpTo);
        } catch (err) {
          // @ts-expect-error
          if (!isRequestError(err)) {
            // @ts-expect-error
            return expect(isRequestError(err)).toBeTruthy();
          }

          expect(err.attributes).toMatchObject({
            reason: 'serverInvalidBody',
            method: 'POST',
            endpoint: '/upload',
            mediaRegion: 'ap-southeast-2',
            mediaEnv: 'unknown',
            statusCode: 201,
            innerError: expect.any(Error),
          });
        }

        expect.assertions(1);
      });
    });

    describe('uploadChunk', () => {
      const testUploadId = 'test-upload-id';
      const testPartNumber = 191;

      it.each([
        ['', undefined, undefined],
        [
          `?partNumber=${testPartNumber}&uploadId=${testUploadId}`,
          testUploadId,
          testPartNumber,
        ],
        [`?partNumber=${testPartNumber}`, undefined, testPartNumber],
        [`?uploadId=${testUploadId}`, testUploadId, undefined],
      ])(
        'should PUT to /chunk/:etag endpoint with correct query %s',

        async (query, uploadId, partNumber) => {
          const etag = 'some-etag';
          const blob = new Blob(['some-blob']);

          fetchMock.once('', {
            status: 201,
            statusText: 'Created',
          });

          await mediaStore.uploadChunk(etag, blob, {
            uploadId,
            partNumber,
          });

          expect(fetchMock).toHaveBeenCalledWith(
            `${baseUrl}/chunk/${etag}${query}`,
            {
              method: 'PUT',
              headers: {
                'X-Client-Id': clientId,
                Authorization: `Bearer ${token}`,
              },
              body: blob,
            },
          );
        },
      );
    });

    describe('probeChunks', () => {
      const testUploadId = 'test-upload-id';

      it.each([
        ['', undefined],
        [`?uploadId=${testUploadId}`, testUploadId],
      ])(
        'should POST to /chunk/probe endpoint with correct query %s',
        async (query, uploadId) => {
          const etag = 'some-etag';
          const chunks = [etag];
          const data: MediaChunksProbe = {
            results: {
              [etag]: {
                exists: true,
              },
            },
          };

          fetchMock.once(JSON.stringify({ data }), {
            status: 200,
            statusText: 'Ok',
          });

          const response = await mediaStore.probeChunks(chunks, { uploadId });

          expect(response).toEqual({ data });

          expect(fetchMock).toHaveBeenCalledWith(
            `${baseUrl}/chunk/probe${query}`,
            {
              method: 'POST',
              headers: {
                'X-Client-Id': clientId,
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ chunks }),
            },
          );
        },
      );

      it('should fail if response is malformed JSON', async () => {
        const etag = 'some-etag';
        const chunks = [etag];

        fetchMock.once('Invalid Body', {
          status: 200,
          statusText: 'Ok',
        });

        try {
          await mediaStore.probeChunks(chunks);
        } catch (err) {
          // @ts-expect-error
          if (!isRequestError(err)) {
            // @ts-expect-error
            return expect(isRequestError(err)).toBeTruthy();
          }

          expect(err.attributes).toMatchObject({
            reason: 'serverInvalidBody',
            method: 'POST',
            endpoint: '/chunk/probe',
            statusCode: 200,
            innerError: expect.any(Error),
          });
        }

        expect.assertions(1);
      });
    });

    describe('createFileFromUpload', () => {
      it('should POST to /file/upload endpoint with correct options', async () => {
        const body = {
          uploadId: 'some-upload-id',
          name: 'some-name',
          mimeType: 'application/pdf',
          conditions: {
            hash: 'sha1:da39a3ee5e6b4b0d3255bfef95601890afd80709',
            size: 42,
          },
        };
        const params = {
          collection: 'some-collection',
          occurrenceKey: 'some-occurrence-key',
          expireAfter: 123,
          replaceFileId: 'some-replace-file-id',
          skipConversions: true,
        };

        fetchMock.once(JSON.stringify({ data }), {
          status: 201,
          statusText: 'Created',
        });

        const response = await mediaStore.createFileFromUpload(body, params);
        const expectedQueryParams =
          'collection=some-collection&expireAfter=123&occurrenceKey=some-occurrence-key&replaceFileId=some-replace-file-id&skipConversions=true';
        expect(response).toEqual({ data });
        expect(fetchMock).toHaveBeenCalledWith(
          `${baseUrl}/file/upload?${expectedQueryParams}`,
          {
            method: 'POST',
            headers: {
              'X-Client-Id': clientId,
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          },
        );
      });

      it('should fail if response is malformed JSON', async () => {
        const body = {
          uploadId: 'some-upload-id',
          name: 'some-name',
          mimeType: 'application/pdf',
          conditions: {
            hash: 'sha1:da39a3ee5e6b4b0d3255bfef95601890afd80709',
            size: 42,
          },
        };
        const params = {
          collection: 'some-collection',
          occurrenceKey: 'some-occurrence-key',
          expireAfter: 123,
          replaceFileId: 'some-replace-file-id',
          skipConversions: true,
        };

        fetchMock.once('Invalid Body', {
          status: 201,
          statusText: 'Created',
        });

        try {
          await mediaStore.createFileFromUpload(body, params);
        } catch (err) {
          // @ts-expect-error
          if (!isRequestError(err)) {
            // @ts-expect-error
            return expect(isRequestError(err)).toBeTruthy();
          }

          expect(err.attributes).toMatchObject({
            reason: 'serverInvalidBody',
            method: 'POST',
            endpoint: '/file/upload',
            statusCode: 201,
            innerError: expect.any(Error),
          });
        }

        expect.assertions(1);
      });
    });

    describe('getFile', () => {
      it('should GET to /file/{fileId} endpoint with correct options', async () => {
        const collectionName = 'some-collection-name';
        const fileId = 'faee2a3a-f37d-11e4-aae2-3c15c2c70ce6';
        const params: MediaStoreGetFileParams = {
          collection: collectionName,
        };

        fetchMock.once(JSON.stringify({ data }), {
          status: 200,
          statusText: 'Ok',
        });

        const response = await mediaStore.getFile(fileId, params);

        expect(response).toEqual({ data });
        expect(fetchMock).toHaveBeenCalledWith(
          `${baseUrl}/file/${fileId}?collection=${collectionName}`,
          {
            method: 'GET',
            headers: {
              'X-Client-Id': clientId,
              Authorization: `Bearer ${token}`,
            },
          },
        );
        expect(resolveAuth).toHaveBeenCalledWith(authProvider, {
          collectionName,
        });
      });

      it('should fail if response is malformed JSON', async () => {
        const collectionName = 'some-collection-name';
        const fileId = 'faee2a3a-f37d-11e4-aae2-3c15c2c70ce6';
        const params: MediaStoreGetFileParams = {
          collection: collectionName,
        };

        fetchMock.once('Invalid Body', {
          status: 200,
          statusText: 'Ok',
        });

        try {
          await mediaStore.getFile(fileId, params);
        } catch (err) {
          // @ts-expect-error
          if (!isRequestError(err)) {
            // @ts-expect-error
            return expect(isRequestError(err)).toBeTruthy();
          }

          expect(err.attributes).toMatchObject({
            reason: 'serverInvalidBody',
            method: 'GET',
            endpoint: '/file/{fileId}',
            statusCode: 200,
            innerError: expect.any(Error),
          });
        }

        expect.assertions(1);
      });
    });

    describe('appendChunksToUpload', () => {
      it('should PUT to /upload/{uploadId}/chunks endpoint with correct options', async () => {
        const uploadId = '29c49470-adac-4b16-82ec-301340c7b16a';
        const body = {
          chunks: [
            '0675a983536736a69f835438bcf8629e044f190d-4096',
            'e6295a0966535d295582670afeeb14059969d359-209',
          ],
          hash: 'sha1:b0edf951dd0c86f80d989e20b9dc3060c53d66a6',
          offset: 0,
        };

        fetchMock.once('', {
          status: 200,
          statusText: 'Ok',
        });

        await mediaStore.appendChunksToUpload(uploadId, body);

        expect(fetchMock).toHaveBeenCalledWith(
          `${baseUrl}/upload/${uploadId}/chunks`,
          {
            method: 'PUT',
            headers: {
              'X-Client-Id': clientId,
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          },
        );
      });
    });

    describe('getCollectionItems', () => {
      it('should GET to /collection/{collectionName} endpoint with correct options', async () => {
        const collectionName = 'some-collection-name';
        const data: MediaCollectionItems = {
          nextInclusiveStartKey: '121',
          contents: [],
        };

        fetchMock.once(JSON.stringify({ data }), {
          status: 201,
          statusText: 'Created',
        });

        const response = await mediaStore.getCollectionItems(collectionName, {
          limit: 10,
          details: 'full',
          inclusiveStartKey: 'some-inclusive-start-key',
          sortDirection: 'desc',
        });

        expect(response).toEqual({ data });
        expect(fetchMock).toHaveBeenCalledWith(
          `${baseUrl}/collection/some-collection-name/items?details=full&inclusiveStartKey=some-inclusive-start-key&limit=10&sortDirection=desc`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'X-Client-Id': clientId,
              Authorization: `Bearer ${token}`,
            },
          },
        );
        expect(resolveAuth).toHaveBeenCalledWith(authProvider, {
          collectionName,
        });
      });

      it('should not return empty files', async () => {
        const collectionName = 'some-collection-name';
        const data: MediaCollectionItems = {
          nextInclusiveStartKey: '121',
          contents: [
            {
              id: '1',
              insertedAt: 1,
              occurrenceKey: 'key-1',
              details: {
                size: 1,
                artifacts: {},
                mediaType: 'image',
                mimeType: '',
                name: 'file',
              },
            },
            {
              id: '2',
              insertedAt: 1,
              occurrenceKey: 'key-2',
              details: {
                size: 0,
                artifacts: {},
                mediaType: 'image',
                mimeType: '',
                name: 'file',
              },
            },
            {
              id: '3',
              insertedAt: 1,
              occurrenceKey: 'key-3',
              details: {} as any,
            },
          ],
        };

        fetchMock.once(JSON.stringify({ data }), {
          status: 201,
          statusText: 'Created',
        });

        const response = await mediaStore.getCollectionItems(collectionName, {
          limit: 10,
          details: 'full',
          inclusiveStartKey: 'some-inclusive-start-key',
          sortDirection: 'desc',
        });

        // We want to exclude all files without size. Contents contains 3 files, 2 of them empty, so we only care about the first one
        expect(response.data.contents).toHaveLength(1);
        expect(response.data.contents).toEqual([data.contents[0]]);
      });
    });

    describe('touchFiles', () => {
      const createdTouchedFile1: CreatedTouchedFile = {
        fileId: 'some-file-id',
        uploadId: 'some-upload-id',
      };
      const createdTouchedFile2: CreatedTouchedFile = {
        fileId: 'some-other-file-id',
        uploadId: 'some-other-upload-id',
      };
      const params: MediaStoreTouchFileParams = {
        collection: 'some-collection-name',
      };

      const descriptor1: TouchFileDescriptor = {
        fileId: 'some-file-id',
      };
      const descriptor2: TouchFileDescriptor = {
        fileId: 'some-other-file-id',
        occurrenceKey: 'some-occurrence-key',
        collection: 'some-collection',
        deletable: false,
        expireAfter: 42,
      };

      it('should POST to /upload/createWithFiles', async () => {
        const data: TouchedFiles = {
          created: [createdTouchedFile1, createdTouchedFile2],
        };

        fetchMock.once(JSON.stringify({ data }), {
          status: 201,
          statusText: 'Created',
        });

        const body: MediaStoreTouchFileBody = {
          descriptors: [descriptor1, descriptor2],
        };

        const response = await mediaStore.touchFiles(body, params);

        expect(response).toEqual({ data });
        expect(fetchMock).toHaveBeenCalledWith(
          `${baseUrl}/upload/createWithFiles`,
          {
            method: 'POST',
            headers: {
              'X-Client-Id': clientId,
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          },
        );
        expect(resolveAuth).toHaveBeenCalledWith(authProvider, {
          collectionName: params.collection,
        });
      });

      it('should fail if error status is returned', async () => {
        fetchMock.once('something went wrong', {
          status: 403,
          statusText: 'Forbidden',
        });

        const body: MediaStoreTouchFileBody = {
          descriptors: [descriptor1],
        };
        try {
          await mediaStore.touchFiles(body, params);
        } catch (err) {
          // @ts-expect-error
          if (!isRequestError(err)) {
            // @ts-expect-error
            return expect(isRequestError(err)).toBeTruthy();
          }

          expect(err.attributes).toMatchObject({
            reason: 'serverForbidden',
            method: 'POST',
            endpoint: '/upload/createWithFiles',
            statusCode: 403,
          });
        }

        expect.assertions(1);
      });

      it('should fail if response is malformed JSON', async () => {
        fetchMock.once('Invalid Body', {
          status: 201,
          statusText: 'Created',
        });

        const body: MediaStoreTouchFileBody = {
          descriptors: [descriptor1],
        };

        try {
          await mediaStore.touchFiles(body, params);
        } catch (err) {
          // @ts-expect-error
          if (!isRequestError(err)) {
            // @ts-expect-error
            return expect(isRequestError(err)).toBeTruthy();
          }

          expect(err.attributes).toMatchObject({
            reason: 'serverInvalidBody',
            method: 'POST',
            endpoint: '/upload/createWithFiles',
            statusCode: 201,
            innerError: expect.any(Error),
          });
        }

        expect.assertions(1);
      });
    });

    describe('getFileImageURL', () => {
      it('should return the file image preview url based on the file id', async () => {
        const collection = 'some-collection';
        const url = await mediaStore.getFileImageURL('1234', { collection });
        expect(resolveAuth).toHaveBeenCalledWith(authProvider, {
          collectionName: collection,
        });
        expect(url).toEqual(
          `${baseUrl}/file/1234/image?allowAnimated=true&client=some-client-id&collection=${collection}&max-age=${FILE_CACHE_MAX_AGE}&mode=crop&token=${token}`,
        );
      });
    });

    describe('getImage', () => {
      it('should return file image preview', async () => {
        fetchMock.once(JSON.stringify({ data }), {
          status: 201,
          statusText: 'Created',
        });

        const image = await mediaStore.getImage('123');

        expect(image).toBeInstanceOf(Blob);
        expect(fetchMock).toHaveBeenCalledWith(
          `${baseUrl}/file/123/image?allowAnimated=true&max-age=${FILE_CACHE_MAX_AGE}&mode=crop`,
          {
            method: 'GET',
            headers: {
              'X-Client-Id': clientId,
              Authorization: `Bearer ${token}`,
            },
          },
        );
      });

      it('should merge default params with given ones', async () => {
        fetchMock.once(JSON.stringify({ data }), {
          status: 201,
          statusText: 'Created',
        });

        await mediaStore.getImage('123', {
          mode: 'full-fit',
          version: 2,
          upscale: true,
        });

        expect(fetchMock).toHaveBeenCalledWith(
          `${baseUrl}/file/123/image?allowAnimated=true&max-age=${FILE_CACHE_MAX_AGE}&mode=full-fit&upscale=true&version=2`,
          {
            method: 'GET',
            headers: {
              'X-Client-Id': clientId,
              Authorization: `Bearer ${token}`,
            },
          },
        );
      });

      it('should append traceId and spanId if traceId is passed', async () => {
        fetchMock.once(JSON.stringify({ data }), {
          status: 201,
          statusText: 'Created',
        });

        await mediaStore.getImage(
          '123',
          {
            mode: 'full-fit',
            version: 2,
            upscale: true,
          },
          undefined,
          true,
          'some-trace-id',
        );

        expect(fetchMock).toHaveBeenCalledWith(
          `${baseUrl}/file/123/image?allowAnimated=true&height=4096&max-age=${FILE_CACHE_MAX_AGE}&mode=full-fit&upscale=true&version=2&width=4096`,
          {
            method: 'GET',
            headers: {
              'X-Client-Id': clientId,
              Authorization: `Bearer ${token}`,
              [ZipkinHeaderKeys.traceId]: 'some-trace-id',
              [ZipkinHeaderKeys.spanId]: expect.any(String),
            },
          },
        );
      });

      it('should append width and height params if fetchMaxRes', async () => {
        fetchMock.once(JSON.stringify({ data }), {
          status: 201,
          statusText: 'Created',
        });

        await mediaStore.getImage(
          '123',
          {
            mode: 'full-fit',
            version: 2,
            upscale: true,
          },
          undefined,
          true,
        );

        expect(fetchMock).toHaveBeenCalledWith(
          `${baseUrl}/file/123/image?allowAnimated=true&height=4096&max-age=${FILE_CACHE_MAX_AGE}&mode=full-fit&upscale=true&version=2&width=4096`,
          {
            method: 'GET',
            headers: {
              'X-Client-Id': clientId,
              Authorization: `Bearer ${token}`,
            },
          },
        );
      });

      it('should override width and height params if fetchMaxRes', async () => {
        fetchMock.once(JSON.stringify({ data }), {
          status: 201,
          statusText: 'Created',
        });

        await mediaStore.getImage(
          '123',
          {
            mode: 'crop',
            version: 2,
            upscale: true,
            width: 1000,
            height: 1000,
          },
          undefined,
          true,
        );

        expect(fetchMock).toHaveBeenCalledWith(
          `${baseUrl}/file/123/image?allowAnimated=true&height=4096&max-age=${FILE_CACHE_MAX_AGE}&mode=crop&upscale=true&version=2&width=4096`,
          {
            method: 'GET',
            headers: {
              'X-Client-Id': clientId,
              Authorization: `Bearer ${token}`,
            },
          },
        );
      });

      it('should not request webp content when not supported', async () => {
        fetchMock.once(JSON.stringify({ data }), {
          status: 201,
          statusText: 'Created',
        });

        checkWebpSupportMock.mockResolvedValueOnce(false);

        await mediaStore.getImage('123');

        expect(fetchMock).toHaveBeenCalledWith(
          `${baseUrl}/file/123/image?allowAnimated=true&max-age=${FILE_CACHE_MAX_AGE}&mode=crop`,
          {
            method: 'GET',
            headers: {
              'X-Client-Id': clientId,
              Authorization: `Bearer ${token}`,
            },
          },
        );
      });
    });

    describe('getItems', () => {
      it('should POST to /items endpoint with correct options', async () => {
        const items = ['1', '2'];
        const data: ItemsPayload[] = [
          {
            items: [
              {
                id: '1',
                collection: 'collection-1',
                type: 'file',
                details: {
                  artifacts: {} as any,
                  mediaType: 'image',
                  mimeType: 'png',
                  name: 'file-1',
                  processingStatus: 'succeeded',
                  size: 1,
                  representations: {},
                },
              },
            ],
          },
        ];

        fetchMock.once(JSON.stringify({ data }), {
          status: 200,
          statusText: 'Ok',
        });

        const response = await mediaStore.getItems(items, 'collection-1');

        expect(response).toEqual({ data });
        expect(fetchMock).toHaveBeenCalledWith(`${baseUrl}/items`, {
          method: 'POST',
          headers: {
            'X-Client-Id': clientId,
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            descriptors: [
              {
                type: 'file',
                id: '1',
                collection: 'collection-1',
              },
              {
                type: 'file',
                id: '2',
                collection: 'collection-1',
              },
            ],
          }),
        });
      });

      it('should fail if response is malformed JSON', async () => {
        const items = ['1', '2'];

        fetchMock.once('Invalid Body', {
          status: 200,
          statusText: 'Ok',
        });

        try {
          await mediaStore.getItems(items, 'collection-1');
        } catch (err) {
          // @ts-expect-error
          if (!isRequestError(err)) {
            // @ts-expect-error
            return expect(isRequestError(err)).toBeTruthy();
          }

          expect(err.attributes).toMatchObject({
            reason: 'serverInvalidBody',
            method: 'POST',
            endpoint: '/items',
            statusCode: 200,
            innerError: expect.any(Error),
          });
        }

        expect.assertions(1);
      });
    });

    describe('getImageMetadata()', () => {
      it('should return image metadata for the given id', async () => {
        const data: ImageMetadata = {
          pending: false,
          original: {
            height: 10,
            width: 10,
            url: 'some-preview',
          },
        };

        fetchMock.once(JSON.stringify({ data }), {
          status: 200,
          statusText: 'Ok',
        });

        const image = await mediaStore.getImageMetadata('123');

        expect(image).toEqual({ data });
        expect(fetchMock).toHaveBeenCalledWith(
          `${baseUrl}/file/123/image/metadata`,
          {
            method: 'GET',
            headers: {
              'X-Client-Id': clientId,
              Authorization: `Bearer ${token}`,
            },
          },
        );
      });

      it('should generate right url based on params', async () => {
        const data: ImageMetadata = {
          pending: false,
        };

        fetchMock.once(JSON.stringify({ data }), {
          status: 200,
          statusText: 'Ok',
        });

        await mediaStore.getImageMetadata('123', {
          collection: 'my-collection',
        });

        expect(fetchMock).toHaveBeenCalledWith(
          `${baseUrl}/file/123/image/metadata?collection=my-collection`,
          {
            method: 'GET',
            headers: {
              'X-Client-Id': clientId,
              Authorization: `Bearer ${token}`,
            },
          },
        );
      });

      it('should fail if response is malformed JSON', async () => {
        fetchMock.once('Invalid Body', {
          status: 200,
          statusText: 'Ok',
        });

        try {
          await mediaStore.getImageMetadata('123');
        } catch (err) {
          // @ts-expect-error
          if (!isRequestError(err)) {
            // @ts-expect-error
            return expect(isRequestError(err)).toBeTruthy();
          }

          expect(err.attributes).toMatchObject({
            reason: 'serverInvalidBody',
            method: 'GET',
            endpoint: '/file/{fileId}/image/metadata',
            statusCode: 200,
            innerError: expect.any(Error),
          });
        }

        expect.assertions(1);
      });
    });

    describe('getFileBinaryURL', () => {
      let url = '';

      beforeEach(async () => {
        url = await mediaStore.getFileBinaryURL('1234', 'some-collection-name');
      });

      it('should return file url', () => {
        expect(url).toEqual(
          `${baseUrl}/file/1234/binary?client=some-client-id&collection=some-collection-name&dl=true&max-age=${FILE_CACHE_MAX_AGE}&token=${token}`,
        );
      });

      it('should call resolveAuth with authProvider and given collection name', async () => {
        expect(resolveAuth).toHaveBeenCalledWith(authProvider, {
          collectionName: 'some-collection-name',
        });
      });
    });

    describe('getArtifactURL()', () => {
      it('should return the right artifact url', async () => {
        const url = await mediaStore.getArtifactURL(
          {
            'video_640.mp4': {
              processingStatus: 'succeeded',
              url: '/sd-video',
            },
          },
          'video_640.mp4',
          'some-collection',
        );

        expect(url).toEqual(
          `${baseUrl}/sd-video?client=some-client-id&collection=some-collection&max-age=${FILE_CACHE_MAX_AGE}&token=${token}`,
        );
        expect(resolveAuth).toHaveBeenCalledWith(authProvider, {
          collectionName: 'some-collection',
        });
      });

      it('should throw if artifact cant be found', async () => {
        const artifacts = {
          'audio.mp3': {},
        } as MediaFileArtifacts;

        await expect(
          mediaStore.getArtifactURL(artifacts, 'video_640.mp4'),
        ).rejects.toThrow('artifact video_640.mp4 not found');
        await expect(
          mediaStore.getArtifactURL(artifacts, 'audio.mp3'),
        ).rejects.toThrow('artifact audio.mp3 not found');
      });
    });

    describe('copyFileWithToken', () => {
      const body = {
        sourceFile: {
          id: 'some-id',
          owner: {
            id: 'owner-id',
            token,
            baseUrl,
          },
          collection: 'some-collection',
        },
      };
      const params = {
        collection: 'some-collection',
        replaceFileId: 'some-replace-file-id',
        occurrenceKey: 'some-occurrence-key',
      };

      it('should POST to /file/copy/withToken endpoint with correct options', async () => {
        fetchMock.once(JSON.stringify({ data }), {
          status: 201,
          statusText: 'Created',
        });

        const response = await mediaStore.copyFileWithToken(body, params);

        expect(response).toEqual({ data });
        expect(fetchMock).toHaveBeenCalledWith(
          `${baseUrl}/file/copy/withToken?collection=some-collection&occurrenceKey=some-occurrence-key&replaceFileId=some-replace-file-id`,
          {
            method: 'POST',
            headers: {
              'X-Client-Id': clientId,
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          },
        );
      });

      it('should fail if response is malformed JSON', async () => {
        fetchMock.once('Invalid Body', {
          status: 201,
          statusText: 'Created',
        });

        try {
          await mediaStore.copyFileWithToken(body, params);
        } catch (err) {
          // @ts-expect-error
          if (!isRequestError(err)) {
            // @ts-expect-error
            return expect(isRequestError(err)).toBeTruthy();
          }

          expect(err.attributes).toMatchObject({
            reason: 'serverInvalidBody',
            method: 'POST',
            endpoint: '/file/copy/withToken',
            statusCode: 201,
            innerError: expect.any(Error),
          });
        }

        expect.assertions(1);
      });
    });

    describe('Sync Operations', () => {
      let mediaStoreSync: MediaStore;

      beforeEach(() => {
        mediaStoreSync = new MediaStore({
          authProvider,
          initialAuth: auth,
        });
      });

      describe('getFileImageURLSync', () => {
        it('should return the file image preview url based on the file id', () => {
          const collection = 'some-collection';
          const url = mediaStoreSync.getFileImageURLSync('1234', {
            collection,
          });
          expect(resolveInitialAuth).toHaveBeenCalledWith(auth);
          expect(url).toEqual(
            `${baseUrl}/file/1234/image?allowAnimated=true&client=some-client-id&collection=${collection}&max-age=${FILE_CACHE_MAX_AGE}&mode=crop&token=${token}`,
          );
        });
      });
    });
  });

  describe('MediaStoreError', () => {
    it('should be identifiable', () => {
      const unknownError = new Error('unknown error');
      expect(isMediaStoreError(unknownError)).toBeFalsy();
      const mediaStoreError = new MediaStoreError('failedAuthProvider');
      expect(isMediaStoreError(mediaStoreError)).toBeTruthy();
    });

    it('should return the right arguments', () => {
      const error = new Error('error');
      const mediaStoreError = new MediaStoreError('failedAuthProvider', error);
      expect(mediaStoreError.attributes).toMatchObject({
        reason: 'failedAuthProvider',
        innerError: error,
      });
    });
  });
});
