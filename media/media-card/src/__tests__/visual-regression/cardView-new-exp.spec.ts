import {
  getExampleUrl,
  pageSelector,
} from '@atlaskit/visual-regression/helper';

function getURL(params: string): string {
  return (
    getExampleUrl('media', 'media-card', 'card-view-vr', global.__BASEURL__) +
    params
  );
}

async function setup(url: string) {
  const { page } = global;
  await page.goto(url);
  await page.waitForSelector(pageSelector);
  const image = await page.screenshot();
  return { image };
}

describe('Media Card New Experience', () => {
  describe('has data URI', () => {
    describe('and metadata', () => {
      it.each([
        'uploading',
        'processing',
        'complete',
        'failed-processing',
        'error',
      ])('with filestate %s', async (status) => {
        const url = getURL(`&dataUri=true&status=${status}`);
        const { image } = await setup(url);
        expect(image).toMatchProdImageSnapshot();
      });

      it.each([
        'uploading',
        'processing',
        'complete',
        'failed-processing',
        'error',
      ])('and is selected with filestate %s', async (status) => {
        const url = getURL(`&dataUri=true&status=${status}&selected=true`);
        const { image } = await setup(url);
        expect(image).toMatchProdImageSnapshot();
      });
    });

    describe('and without metadata', () => {
      it.each([
        'uploading',
        'processing',
        'complete',
        'failed-processing',
        'error',
      ])('with filestate %s', async (status) => {
        const url = getURL(
          `&dataUri=true&disableMetadata=true&status=${status}`,
        );
        const { image } = await setup(url);
        expect(image).toMatchProdImageSnapshot();
      });

      it.each([
        'uploading',
        'processing',
        'complete',
        'failed-processing',
        'error',
      ])('and is selected with filestate %s', async (status) => {
        const url = getURL(
          `&dataUri=true&disableMetadata=true&status=${status}&selected=true`,
        );

        const { image } = await setup(url);
        expect(image).toMatchProdImageSnapshot();
      });
    });
  });

  // CardView does not handle broken dataURI internally. It passes
  // the error to the consumer and awaits for an error status.
  // The resulting views in this test should be equivalent to
  // "no dataURI" on each status
  describe('has broken data URI', () => {
    describe('and metadata', () => {
      it.each([
        'uploading',
        'processing',
        'complete',
        'failed-processing',
        'error',
      ])('with filestate %s', async (status) => {
        const url = getURL(`&brokenDataUri=true&status=${status}`);
        const { image } = await setup(url);
        expect(image).toMatchProdImageSnapshot();
      });
    });

    describe('and without metadata', () => {
      it.each([
        'uploading',
        'processing',
        'complete',
        'failed-processing',
        'error',
      ])('with filestate %s', async (status) => {
        const url = getURL(
          `&brokenDataUri=true&disableMetadata=true&status=${status}`,
        );
        const { image } = await setup(url);
        expect(image).toMatchProdImageSnapshot();
      });
    });
  });

  describe('has a transparent image preview', () => {
    describe('and metadata', () => {
      it.each([
        'uploading',
        'processing',
        'complete',
        'failed-processing',
        'error',
      ])('with filestate %s', async (status) => {
        const url = getURL(`&isTransparent=true&status=${status}`);
        const { image } = await setup(url);
        expect(image).toMatchProdImageSnapshot();
      });
    });

    describe('and without metadata', () => {
      it.each([
        'uploading',
        'processing',
        'complete',
        'failed-processing',
        'error',
      ])('with filestate %s', async (status) => {
        const url = getURL(
          `&isTransparent=true&disableMetadata=true&status=${status}`,
        );
        const { image } = await setup(url);
        expect(image).toMatchProdImageSnapshot();
      });
    });
    describe('and disableOverlay', () => {
      it.each([
        'uploading',
        'processing',
        'complete',
        'failed-processing',
        'error',
      ])('with filestate %s', async (status) => {
        const url = getURL(
          `&disableOverlay=true&isTransparent=true&status=${status}`,
        );
        const { image } = await setup(url);
        expect(image).toMatchProdImageSnapshot();
      });
    });

    describe('and without disableOverlay', () => {
      it.each([
        'uploading',
        'processing',
        'complete',
        'failed-processing',
        'error',
      ])('with filestate %s', async (status) => {
        const url = getURL(`&isTransparent=true&status=${status}`);
        const { image } = await setup(url);
        expect(image).toMatchProdImageSnapshot();
      });
    });
  });

  describe('does not have the data URI', () => {
    describe('but has the metadata', () => {
      it.each([
        'uploading',
        'processing',
        'complete',
        'failed-processing',
        'error',
      ])('with filestate %s', async (status) => {
        const url = getURL(`&status=${status}`);

        const { image } = await setup(url);
        expect(image).toMatchProdImageSnapshot();
      });

      it.each([
        'uploading',
        'processing',
        'complete',
        'failed-processing',
        'error',
      ])('with disableOverlay and  filestate %s', async (status) => {
        const url = getURL(`&disableOverlay=true&status=${status}`);

        const { image } = await setup(url);
        expect(image).toMatchProdImageSnapshot();
      });

      it.each([
        'uploading',
        'processing',
        'complete',
        'failed-processing',
        'error',
      ])('and is selected with filestate %s', async (status) => {
        const url = getURL(`&status=${status}&selected=true`);

        const { image } = await setup(url);
        expect(image).toMatchProdImageSnapshot();
      });
    });

    describe('and has no metadata', () => {
      it.each([
        'uploading',
        'processing',
        'complete',
        'failed-processing',
        'error',
      ])('with filestate %s', async (status) => {
        const url = getURL(`&disableMetadata=true&status=${status}`);

        const { image } = await setup(url);
        expect(image).toMatchProdImageSnapshot();
      });

      it.each([
        'uploading',
        'processing',
        'complete',
        'failed-processing',
        'error',
      ])('with disableOverlay and filestate %s', async (status) => {
        const url = getURL(
          `&disableOverlay=true&disableMetadata=true&status=${status}`,
        );

        const { image } = await setup(url);
        expect(image).toMatchProdImageSnapshot();
      });

      it.each([
        'uploading',
        'processing',
        'complete',
        'failed-processing',
        'error',
      ])('and is selected with filestate %s', async (status) => {
        const url = getURL(
          `&disableMetadata=true&status=${status}&selected=true`,
        );

        const { image } = await setup(url);
        expect(image).toMatchProdImageSnapshot();
      });
    });
  });
  describe('is rate limited', () => {
    describe('has metadata', () => {
      it('renders the we could not create a preview card state', async () => {
        const url = getURL(
          `&status=error&dataUri=true&isRateLimited=true&disableOverlay=false&status=error`,
        );
        const { image } = await setup(url);
        expect(image).toMatchProdImageSnapshot();
      });
      it('renders error state when disableOverlay', async () => {
        const url = getURL(
          `&isRateLimited=true&disableOverlay=true&status=error`,
        );
        const { image } = await setup(url);
        expect(image).toMatchProdImageSnapshot();
      });
    });
    describe('no metadata', () => {
      it('renders a borked state with no retry button with dataUri', async () => {
        const url = getURL(
          `&disableMetadata=true&dataUri=true&isRateLimited=true&disableOverlay=false&status=error`,
        );
        const { image } = await setup(url);
        expect(image).toMatchProdImageSnapshot();
      });
      it('renders a borked state with no retry button without dataUri', async () => {
        const url = getURL(
          `&disableMetadata=true&dataUri=false&isRateLimited=true&disableOverlay=false&status=error`,
        );
        const { image } = await setup(url);
        expect(image).toMatchProdImageSnapshot();
      });
      it('renders error state when disableOverlay', async () => {
        const url = getURL(
          `&disableMetadata=true&isRateLimited=true&disableOverlay=true&status=error`,
        );
        const { image } = await setup(url);
        expect(image).toMatchProdImageSnapshot();
      });
    });
  });

  describe('is polling error', () => {
    it('has metadata', async () => {
      const url = getURL(`&isPollingMaxAttemptsExceeded=true&status=error`);
      const { image } = await setup(url);
      expect(image).toMatchProdImageSnapshot();
    });

    it('has metadata and dataUri', async () => {
      const url = getURL(
        `&isPollingMaxAttemptsExceeded=true&status=error&dataUri=true`,
      );
      const { image } = await setup(url);
      expect(image).toMatchProdImageSnapshot();
    });
  });

  describe('is upload error', () => {
    it('has metadata', async () => {
      const url = getURL(`&isUploadError=true&status=error`);
      const { image } = await setup(url);
      expect(image).toMatchProdImageSnapshot();
    });

    it('has metadata with disableOverlay', async () => {
      const url = getURL(
        `&isUploadError=true&status=error&disableOverlay=true`,
      );
      const { image } = await setup(url);
      expect(image).toMatchProdImageSnapshot();
    });

    it('no metadata', async () => {
      const url = getURL(
        `&isUploadError=true&status=error&disableMetadata=true`,
      );
      const { image } = await setup(url);
      expect(image).toMatchProdImageSnapshot();
    });

    it('no metadata with disableOverlay', async () => {
      const url = getURL(
        `&isUploadError=true&status=error&disableMetadata=true&disableOverlay=true`,
      );
      const { image } = await setup(url);
      expect(image).toMatchProdImageSnapshot();
    });
  });

  describe('with width less than 100 percent', () => {
    it('still occupies the total width of the container', async () => {
      const url = getURL(`&width=50%`);
      const { image } = await setup(url);
      expect(image).toMatchProdImageSnapshot();
    });

    it('has valid dataURI', async () => {
      const url = getURL(`&dataUri=true&width=50%`);
      const { image } = await setup(url);
      expect(image).toMatchProdImageSnapshot();
    });

    it('has error status', async () => {
      const url = getURL(`&status=error&width=50%`);
      const { image } = await setup(url);
      expect(image).toMatchProdImageSnapshot();
    });
  });
});
