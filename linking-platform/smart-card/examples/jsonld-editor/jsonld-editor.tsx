import React, { useCallback, useMemo, useRef, useState } from 'react';
import { JsonLd } from 'json-ld-types';
import { getDefaultResponse, getDefaultUrl } from './utils';
import {
  extractPreview,
  extractUrlFromLinkJsonLd,
} from '@atlaskit/linking-common';
const stringify = (obj: object) => JSON.stringify(obj, null, 2);

const initialJson = getDefaultResponse();
const initialText = stringify(initialJson);
const initialUrl = getDefaultUrl();
const temporaryUrl = 'https://json-ld-editor-temporary-url';

type JsonldEditorOpts = {
  ari?: string;
  initialJson: JsonLd.Response;
  isEmbedSupported: boolean;
  json?: JsonLd.Response;
  jsonError?: string;
  onJsonChange: (json: JsonLd.Response) => void;
  onSubmitUrl: (url: string, ari?: string) => void;
  onTextChange: (str: string) => void;
  onUrlError: (error: Error) => void;
  onUrlResolve: (json: JsonLd.Response) => void;
  text: string;
  url: string;
  urlError?: string;
};
const JsonldEditor: React.FC<{
  children: (opts: JsonldEditorOpts) => React.ReactNode;
}> = ({ children }) => {
  const [json, setJson] = useState<JsonLd.Response | undefined>(initialJson);
  const [jsonError, setJsonError] = useState<string | undefined>();
  const [text, setText] = useState<string>(initialText);
  const [url, setUrl] = useState<string>(initialUrl);
  const [ari, setAri] = useState<string>();
  const [urlError, setUrlError] = useState<string | undefined>();
  const [isEmbedSupported, setIsEmbedSupported] = useState<boolean>(false);

  // Maintain previously successful json
  const prevJson = useRef(initialJson);

  const updateViewSupport = useCallback((response: JsonLd.Response) => {
    // Check if json has embed
    const data = response?.data as JsonLd.Data.BaseData;
    const preview = extractPreview(data, 'web'); // Hardcode it to 'web' for now.
    setIsEmbedSupported(Boolean(preview));
  }, []);

  const updateJson = useCallback(
    (response: JsonLd.Response) => {
      setJson(response);

      // Force change url to trigger provider to fetch json data.
      // Performance isn't great but at least we are able to use CardWithUrl
      // and able to show hover preview on inline card (without code change).
      // We can remove this workaround if Provider can avoid action with empty
      // `status` or inline and block card can render cardState without status
      // and not throwing error, e.g. render fallback view.
      setUrl(temporaryUrl);

      // Set new url from json response or fixed url. Url cannot be empty.
      const data = response?.data as JsonLd.Data.BaseData;
      const responseUrl =
        extractUrlFromLinkJsonLd(data?.url || temporaryUrl) || temporaryUrl;
      setUrl(responseUrl);

      // Keep track of last successful json
      prevJson.current = response;

      // Set support flag for specific card views.
      updateViewSupport(response);
    },
    [updateViewSupport],
  );

  /**
   * Load preset json responses to editor and set it to provider.
   * Triggered JsonldExample.
   */
  const onJsonChange = useCallback(
    (newJson: JsonLd.Response) => {
      try {
        // Replace text in editor.
        const str = stringify(newJson);
        setText(str);

        // Set json response for client to fake fetch.
        updateJson(newJson);

        // Clear any conversion error if any.
        setJsonError(undefined);
      } catch (err) {
        setJsonError(err instanceof Error ? err.message : String(err));
      }
    },
    [updateJson],
  );

  /**
   * Text change inside editor.
   * Update provider and force fetch new response to update card.
   * Triggered by JsonldEditorInput.
   */
  const onTextChange = useCallback(
    (str: string) => {
      try {
        // Update text in editor.
        setText(str);

        // Attempt to convert text to JSON.
        const updatedJson = JSON.parse(str);

        // Set json response for client to fake fetch.
        updateJson(updatedJson);

        // Clear any conversion error if any.
        setJsonError(undefined);
      } catch (err) {
        setJsonError(err instanceof Error ? err.message : String(err));
      }
    },
    [updateJson],
  );

  /**
   * Load actual URL and ARI.
   * Triggered by LoadLinkForm.
   */
  const onSubmitUrl = useCallback((newUrl: string, newAri?: string) => {
    // Set new url and ari to provider.
    setAri(newAri);
    setUrl(newUrl);

    setUrlError(undefined);

    // Clear json so client would fetch actual url.
    setJson(undefined);
  }, []);

  /**
   * URL is resolved successfully, including unauth and forbidden status.
   * Update editor with the json response.
   * Triggered by JsonldEditorClient via JsonldEditorProvider.
   */
  const onUrlResolve = useCallback(
    (response: JsonLd.Response) => {
      try {
        // Attempt to convert json to string.
        const str = stringify(response);

        // Clear any previous json error.
        setJsonError(undefined);

        // Set new text to editor.
        setText(str);

        // Keep track of last successful json.
        prevJson.current = response;

        // Set support flag for specific card views.
        updateViewSupport(response);
      } catch (err) {
        setJsonError(err instanceof Error ? err.message : String(err));
      }
    },
    [updateViewSupport],
  );

  /**
   * URL failed to resolved with 500 error code.
   */
  const onUrlError = useCallback(
    (error) => {
      setUrlError(
        `${error.message}. Revert to the last successful JSON-LD content.`,
      );

      // Revert to last successful json
      onJsonChange(prevJson.current);
    },
    [onJsonChange],
  );

  const options = useMemo(
    () => ({
      ari,
      initialJson,
      isEmbedSupported,
      json,
      jsonError,
      onJsonChange,
      onSubmitUrl,
      onTextChange,
      onUrlError,
      onUrlResolve,
      text,
      url,
      setAri,
      urlError,
    }),
    [
      ari,
      isEmbedSupported,
      json,
      jsonError,
      onJsonChange,
      onSubmitUrl,
      onTextChange,
      onUrlError,
      onUrlResolve,
      text,
      url,
      setAri,
      urlError,
    ],
  );

  return <React.Fragment>{children(options)}</React.Fragment>;
};

export default JsonldEditor;
