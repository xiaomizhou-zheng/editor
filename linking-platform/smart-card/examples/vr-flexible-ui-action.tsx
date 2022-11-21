/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { VRTestWrapper } from './utils/vr-test';
import { FlexibleUiContext } from '../src/state/flexible-ui-context';
import { SmartLinkSize } from '../src/constants';
import { exampleTokens, getContext } from './utils/flexible-ui';
import { DeleteAction } from '../src/view/FlexibleCard/components/actions';
import TrashIcon from '@atlaskit/icon/glyph/trash';

const containerStyles = css`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding: 5px;
`;

const context = getContext();
let onClick = () => {
  console.log('Testing Delete Action...');
};

export default () => (
  <VRTestWrapper title="Flexible UI: Action">
    <FlexibleUiContext.Provider value={context}>
      <table>
        <thead>
          <tr>
            <th>Size</th>
            <th>Default</th>
            <th>No content</th>
            <th>No icon</th>
            <th>Custom icon</th>
            <th>Custom text</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(SmartLinkSize).map((size) => {
            return (
              <tr>
                <td>{size}</td>
                <td>
                  <div css={containerStyles}>
                    <DeleteAction
                      size={size}
                      onClick={onClick}
                      testId="vr-test-delete-action"
                    />
                    <DeleteAction
                      size={size}
                      onClick={onClick}
                      appearance="default"
                      testId="vr-test-delete-action"
                    />
                  </div>
                </td>
                <td>
                  <div css={containerStyles}>
                    <DeleteAction
                      size={size}
                      onClick={onClick}
                      content={undefined}
                      testId="vr-test-delete-action"
                    />
                    <DeleteAction
                      size={size}
                      onClick={onClick}
                      content={undefined}
                      appearance="default"
                      testId="vr-test-delete-action"
                    />
                  </div>
                </td>
                <td>
                  <div css={containerStyles}>
                    <DeleteAction
                      size={size}
                      onClick={onClick}
                      icon={undefined}
                      testId="vr-test-delete-action"
                    />
                    <DeleteAction
                      size={size}
                      onClick={onClick}
                      icon={undefined}
                      appearance="default"
                      testId="vr-test-delete-action"
                    />
                  </div>
                </td>
                <td>
                  <div css={containerStyles}>
                    <DeleteAction
                      size={size}
                      onClick={onClick}
                      icon={<TrashIcon label="Trash" />}
                      testId="vr-test-delete-action"
                    />
                    <DeleteAction
                      size={size}
                      onClick={onClick}
                      icon={<TrashIcon label="Trash" />}
                      appearance="default"
                      testId="vr-test-delete-action"
                    />
                  </div>
                </td>
                <td>
                  <div css={containerStyles}>
                    <DeleteAction
                      size={size}
                      onClick={onClick}
                      content="Remove"
                      testId="vr-test-delete-action"
                    />
                    <DeleteAction
                      size={size}
                      onClick={onClick}
                      content="Remove"
                      appearance="default"
                      testId="vr-test-delete-action"
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <h5>Override CSS</h5>
      <div css={containerStyles}>
        <DeleteAction
          appearance="default"
          content="Bold"
          onClick={onClick}
          overrideCss={css`
            span {
              font-weight: bold;
            }
          `}
        />
        <DeleteAction
          appearance="default"
          content="Italic"
          onClick={onClick}
          overrideCss={css`
            span {
              font-style: italic;
            }
          `}
        />
        <DeleteAction
          appearance="default"
          content="Color"
          onClick={onClick}
          overrideCss={css`
            button {
              background-color: ${exampleTokens.iconBackgroundColor};
            }
            span {
              color: ${exampleTokens.iconColor};
            }
          `}
        />
      </div>
    </FlexibleUiContext.Provider>
  </VRTestWrapper>
);
