/** @jsx jsx */
import React, { useEffect, useState } from 'react';

import { css, jsx } from '@emotion/react';

import Avatar from '@atlaskit/avatar';
import Button from '@atlaskit/button/standard-button';
import { ExitingPersistence, FadeIn } from '@atlaskit/motion';
import { token } from '@atlaskit/tokens';

import Spinner from '../src';

type Phase = 'stopped' | 'loading' | 'ready';

const layoutStyles = css({
  display: 'flex',
  justifyContent: 'center',
});

const columnStyles = css({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
});

const headingStyles = css({
  // TODO Delete this comment after verifying spacing token -> previous value `grid * 2`
  marginBottom: token('spacing.scale.200', '16px'),
});

const loadingContainerStyles = css({
  display: 'flex',
  width: 200,
  height: 200,
  alignItems: 'center',
  justifyContent: 'center',
});

const spinnerStyles = css({ position: 'absolute' });

function Harness({
  children,
  title,
}: {
  children: (phase: Phase) => React.ReactElement;
  title: string;
}) {
  const [phase, setPhase] = useState<Phase>('stopped');

  useEffect(
    function onPhaseChange() {
      if (phase === 'loading') {
        const id = window.setTimeout(() => setPhase('ready'), 2000);
        return () => window.clearTimeout(id);
      }
    },
    [phase],
  );

  return (
    <div css={columnStyles}>
      <h4 css={headingStyles}>{title}</h4>
      <Button
        onClick={() => setPhase('loading')}
        isDisabled={phase === 'loading'}
      >
        {phase === 'loading' ? 'running' : 'start'}
      </Button>
      <div css={loadingContainerStyles}>{children(phase)}</div>
    </div>
  );
}

function NotAnimated() {
  return (
    <Harness title="No exit animation">
      {(phase: Phase) => (
        <React.Fragment>
          {phase === 'ready' && <Avatar size="xlarge" />}
          {phase === 'loading' && (
            <span css={spinnerStyles}>
              <Spinner size="xlarge" />
            </span>
          )}
        </React.Fragment>
      )}
    </Harness>
  );
}

function Animated() {
  return (
    <Harness title="With cross fading">
      {(phase: Phase) => (
        <React.Fragment>
          <ExitingPersistence appear>
            {phase === 'ready' && (
              <FadeIn>
                {(props) => (
                  <span {...props}>
                    <Avatar size="xlarge" />
                  </span>
                )}
              </FadeIn>
            )}
          </ExitingPersistence>
          <ExitingPersistence>
            {phase === 'loading' && (
              <FadeIn
                onFinish={(value) => console.log('fade in finished', value)}
              >
                {(props) => (
                  <span {...props} css={spinnerStyles}>
                    <Spinner size="xlarge" />
                  </span>
                )}
              </FadeIn>
            )}
          </ExitingPersistence>
        </React.Fragment>
      )}
    </Harness>
  );
}

export default function Example() {
  return (
    <div css={layoutStyles}>
      <NotAnimated />
      <Animated />
    </div>
  );
}
