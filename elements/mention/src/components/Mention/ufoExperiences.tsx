import React from 'react';

import {
  ExperiencePerformanceTypes,
  ExperienceTypes,
  ConcurrentExperience,
} from '@atlaskit/ufo';

export const mentionRenderedUfoExperience = new ConcurrentExperience(
  'mention-rendered',
  {
    platform: { component: 'mention' },
    type: ExperienceTypes.Load,
    performanceType: ExperiencePerformanceTypes.PageSegmentLoad,
  },
);

export class UfoErrorBoundary extends React.Component<{ id: string }> {
  componentDidCatch() {
    mentionRenderedUfoExperience.getInstance(this.props.id).failure();
  }

  render() {
    return this.props.children;
  }
}
