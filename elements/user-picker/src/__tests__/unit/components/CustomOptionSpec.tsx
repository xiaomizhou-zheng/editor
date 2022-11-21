import { shallow } from 'enzyme';
import React, { ReactElement } from 'react';
import {
  AvatarItemOption,
  textWrapper,
} from '../../../components/AvatarItemOption';
import { SizeableAvatar } from '../../../components/SizeableAvatar';
import {
  CustomOption,
  CustomOptionProps,
} from '../../../components/CustomOption/main';
import { Custom } from '../../../types';
import { token } from '@atlaskit/tokens';
import * as colors from '@atlaskit/theme/colors';

jest.mock('../../../components/AvatarItemOption', () => ({
  ...(jest.requireActual('../../../components/AvatarItemOption') as any),
  textWrapper: jest.fn(),
}));

describe('Custom Option', () => {
  const mockTextWrapper = textWrapper as jest.Mock;

  afterEach(() => {
    jest.resetAllMocks();
  });

  const byline = 'A custom byline';
  const basicCustomOption: Custom = {
    id: 'custom-option-1',
    name: 'Custom-Option-1',
    avatarUrl: 'https://avatars.atlassian.com/team-1.png',
    type: 'custom',
    byline,
  };

  const shallowOption = (
    props: Partial<CustomOptionProps> = {},
    data: Custom,
  ) => shallow(<CustomOption data={data} isSelected={false} {...props} />);

  it('should render avatarUrl', () => {
    const component = shallowOption({ isSelected: true }, basicCustomOption);
    const avatarOptionProps = component.find(AvatarItemOption);

    expect(avatarOptionProps.props().avatar).toEqual(
      <SizeableAvatar
        appearance="big"
        src="https://avatars.atlassian.com/team-1.png"
        name="Custom-Option-1"
      />,
    );
  });

  it('should render the byline', () => {
    const component = shallowOption({ isSelected: true }, basicCustomOption);
    const avatarOptionProps = component.find(AvatarItemOption);
    expect(mockTextWrapper).toHaveBeenCalledWith(
      token('color.text.selected', colors.B400),
    );

    const secondaryText = avatarOptionProps.props()
      .secondaryText as ReactElement;

    expect(secondaryText.props.children).toEqual(byline);
  });
});
