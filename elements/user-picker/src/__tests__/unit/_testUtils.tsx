import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import {
  UFOExperienceState,
  UFOExperience,
  ExperienceTypes,
  ExperiencePerformanceTypes,
} from '@atlaskit/ufo';
import { ExusUserSourceProvider } from '../../clients/UserSourceProvider';
import { LoadUserSource, User } from '../../types';

export const renderProp = (
  wrapper: ShallowWrapper<any>,
  renderProp: string,
  ...args: any[]
) => {
  const prop = wrapper.prop(renderProp);
  if (prop && typeof prop === 'function') {
    const Wrapper = () => prop(...args);
    return shallow(<Wrapper />);
  }
  throw new Error('renderProp is not a function');
};

export const testUser: User = {
  id: 'abc-123',
  name: 'Jace Beleren',
  publicName: 'jbeleren',
  avatarUrl: 'http://avatars.atlassian.com/jace.png',
};

export const flushPromises = () => {
  return new Promise((resolve) => setImmediate(resolve));
};

export const createMockedSourceProvider = (
  mockFetch: LoadUserSource,
): React.ComponentType => ({ children }) => (
  <ExusUserSourceProvider fetchUserSource={mockFetch}>
    {children}
  </ExusUserSourceProvider>
);

export class MockConcurrentExperienceInstance extends UFOExperience {
  startSpy: jest.Mock;
  successSpy: jest.Mock;
  failureSpy: jest.Mock;
  abortSpy: jest.Mock;
  transitions: string[];

  constructor(id: string) {
    super(
      id,
      {
        type: ExperienceTypes.Load,
        performanceType: ExperiencePerformanceTypes.PageSegmentLoad,
      },
      `${id}-instance`,
    );
    this.startSpy = jest.fn();
    this.successSpy = jest.fn();
    this.failureSpy = jest.fn();
    this.abortSpy = jest.fn();
    this.transitions = [UFOExperienceState.NOT_STARTED.id];
  }

  async start() {
    super.start();
    this.startSpy();
    this.transitions.push(this.state.id);
  }

  async success() {
    super.success();
    this.successSpy();
    this.transitions.push(this.state.id);
    return null;
  }

  async failure() {
    super.failure();
    this.failureSpy();
    this.transitions.push(this.state.id);
    return null;
  }

  async abort() {
    super.abort();
    this.abortSpy();
    this.transitions.push(this.state.id);
    return null;
  }

  mockReset() {
    this.startSpy.mockReset();
    this.successSpy.mockReset();
    this.failureSpy.mockReset();
    this.abortSpy.mockReset();
    this.transitions = [UFOExperienceState.NOT_STARTED.id];
  }
}
