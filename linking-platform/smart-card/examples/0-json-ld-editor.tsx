/** @jsx jsx */
import React from 'react';
import { JsonLd } from 'json-ld-types';
import { css, jsx } from '@emotion/react';
import CardExample from './jsonld-editor/card-example';
import JsonldExample from './jsonld-editor/jsonld-example';
import LoadLinkForm from './jsonld-editor/load-link-form';
import JsonldEditorInput from './jsonld-editor/jsonld-editor-input';
import JsonldEditor from './jsonld-editor/jsonld-editor';

const styles = css`
  display: flex;
  gap: 1rem;
  height: fit-content;
  padding: 2rem;

  > div {
    width: 50%;
  }
`;

const Example: React.FC = () => {
  return (
    <JsonldEditor>
      {({
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
        urlError,
      }) => (
        <div css={styles}>
          <div>
            <CardExample
              ari={ari}
              isEmbedSupported={isEmbedSupported}
              json={json}
              onError={onUrlError}
              onResolve={onUrlResolve}
              url={url}
            />
          </div>
          <div>
            <h6>JSON-LD</h6>
            <LoadLinkForm onSubmit={onSubmitUrl} error={urlError} />
            <JsonldExample
              defaultValue={initialJson.data as JsonLd.Data.BaseData}
              onSelect={onJsonChange}
            />
            <JsonldEditorInput
              error={jsonError}
              onChange={onTextChange}
              value={text}
            />
          </div>
        </div>
      )}
    </JsonldEditor>
  );
};

export default Example;
