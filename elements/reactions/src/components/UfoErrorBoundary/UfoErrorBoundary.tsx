import React, { ErrorInfo } from 'react';
import { UFOExperience } from '@atlaskit/ufo';
import { WithSamplingUFOExperience } from '@atlaskit/emoji';

export interface UfoErrorBoundaryProps {
  /**
   * UFO Experiences to notify failure when the children components fail on rendering
   */
  experiences: UFOExperience[] | WithSamplingUFOExperience[];
}

/**
 * Error boundary wrapper to notify "failure" for UFO events of components when there was a re-rendering exception caught inside the `componentDidCatch` event handler
 */
export class UfoErrorBoundary extends React.Component<UfoErrorBoundaryProps> {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    for (const exp of this.props.experiences) {
      exp.failure({
        metadata: {
          source: 'UfoErrorBoundary',
          reason: 'error',
          error: {
            name: error.name,
            message: error.message,
            infoStack: errorInfo.componentStack,
          },
        },
      });
    }
  }

  render() {
    return this.props.children;
  }
}
