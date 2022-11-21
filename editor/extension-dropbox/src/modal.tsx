/** @jsx jsx */
import React, { useState } from 'react';
import { jsx, css } from '@emotion/react';

import ModalDialog, {
  ModalTransition,
  useModal,
  ModalBody as AKModalBody,
} from '@atlaskit/modal-dialog';

import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import Button from '@atlaskit/button/custom-theme-button';

import { DROPBOX_IFRAME_NAME } from './constants';

const ModalBody = React.forwardRef<
  HTMLDivElement,
  React.AllHTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <div ref={ref} style={{ height: '100%' }}>
      {props.children}
    </div>
  );
});

const iframeStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0 0 3px 3px',
};

const bottomShadow = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
});

const spacingDivStyle = { width: '28px' };
const headingStyle = { marginTop: '8px' };

const Header = () => {
  const { onClose, titleId } = useModal();
  return (
    <div css={bottomShadow}>
      {/* This div is offsetting the button to the right */}
      <div css={spacingDivStyle} />
      <h5 id={titleId} css={headingStyle}>
        Dropbox
      </h5>
      <div>
        <Button
          appearance="subtle"
          iconBefore={<EditorCloseIcon label="close dropbox modal" />}
          onClick={onClose}
        />
      </div>
    </div>
  );
};

const Modal = ({
  onClose,
  TEST_ONLY_src,
  showModal,
}: {
  onClose: () => any;
  TEST_ONLY_src?: string;
  showModal?: boolean;
}) => {
  let [isOpen, setIsOpen] = useState(true);

  if (typeof showModal === 'boolean' && isOpen !== showModal) {
    setIsOpen(showModal);
  }

  return (
    <ModalTransition>
      {isOpen && (
        <ModalDialog
          height="100%"
          width="large"
          onClose={() => {
            setIsOpen(false);
            onClose();
          }}
        >
          <Header />
          <AKModalBody>
            <ModalBody>
              {TEST_ONLY_src ? (
                <iframe
                  css={iframeStyle}
                  name={DROPBOX_IFRAME_NAME}
                  frameBorder={0}
                  src={TEST_ONLY_src}
                />
              ) : (
                <iframe
                  css={iframeStyle}
                  name={DROPBOX_IFRAME_NAME}
                  frameBorder={0}
                />
              )}
            </ModalBody>
          </AKModalBody>
        </ModalDialog>
      )}
    </ModalTransition>
  );
};

export default Modal;
