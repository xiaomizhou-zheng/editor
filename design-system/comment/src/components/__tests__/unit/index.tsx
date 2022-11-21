import React from 'react';

import { mount, shallow } from 'enzyme';

import Avatar from '@atlaskit/avatar';
import Button from '@atlaskit/button/custom-theme-button';
import __noop from '@atlaskit/ds-lib/noop';
import LockFilledIcon from '@atlaskit/icon/glyph/lock-filled';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import Lozenge from '@atlaskit/lozenge';

import Comment, {
  CommentAction,
  CommentAuthor,
  CommentEdited,
  CommentLayout,
  CommentTime,
} from '../../../index';
import Content from '../../content';
import HeaderItems from '../../header';

describe('@atlaskit comments', () => {
  describe('Comment', () => {
    describe('exports', () => {
      it('the Comment component', () => {
        expect(Comment).not.toBe(undefined);
      });
    });

    describe('construction', () => {
      it('should be able to create a component', () => {
        const wrapper = shallow(<Comment avatar="" />);
        expect(wrapper).not.toBe(undefined);
      });
    });

    describe('props', () => {
      describe('actions prop', () => {
        it('should render action items in the correct container', () => {
          const actions = [
            <CommentAction />,
            <CommentAction>action content</CommentAction>,
            <CommentAction onClick={__noop}>action content</CommentAction>,
          ];
          const wrapper = mount(<Comment avatar="" actions={actions} />);
          const container = wrapper.find(CommentAction);
          expect(container.find(CommentAction).length).toBe(actions.length);
          actions.forEach((action) => {
            expect(container.contains(action)).toBe(true);
          });
        });
      });

      describe('author prop', () => {
        it('should render the author in the correct container', () => {
          const author = <CommentAuthor>Joshua Nelson</CommentAuthor>;
          const wrapper = mount(<Comment avatar="" author={author} />);
          expect(wrapper.find(Comment).contains(author)).toBe(true);
        });
      });

      describe('avatar prop', () => {
        it('should be reflected to the CommentLayout', () => {
          const avatar = <Avatar src="test/src" />;
          const wrapper = shallow(<Comment avatar={avatar} />);
          expect(wrapper.find(CommentLayout).prop('avatar')).toBe(avatar);
        });
      });

      describe('content prop', () => {
        it('should render the provided content in the correct container', () => {
          const content = <p>My sample content</p>;
          const wrapper = mount(<Comment avatar="" content={content} />);
          expect(wrapper.find(Content).contains(content)).toBe(true);
        });

        it('can render string content', () => {
          const textContent = 'My sample content';
          const wrapper = mount(<Comment avatar="" content={textContent} />);
          expect(wrapper.find(Content).text()).toBe(textContent);
        });
      });

      describe('afterContent prop', () => {
        it('should render "after content" when provided', () => {
          const content = <p>My sample content</p>;
          const afterContent = (
            <button type="button">My sample after content</button>
          );
          const wrapper = mount(
            <Comment avatar="" content={content} afterContent={afterContent} />,
          );
          expect(wrapper.contains(content)).toBe(true);
          expect(wrapper.contains(afterContent)).toBe(true);
        });
      });

      describe('time prop', () => {
        it('should render the time in the correct container', () => {
          const time = <CommentTime>30 August, 2016</CommentTime>;
          const wrapper = mount(<Comment avatar="" time={time} />);
          expect(wrapper.find(Comment).contains(time)).toBe(true);
        });
      });

      describe('edited prop', () => {
        it('should render edited correctly', () => {
          const edited = <CommentEdited>Edited</CommentEdited>;
          const wrapper = mount(<Comment avatar="" edited={edited} />);
          expect(wrapper.find(Comment).contains(edited)).toBe(true);
        });
      });

      describe('type prop', () => {
        it('should render a Lozenge with the type in the correct container', () => {
          const type = 'type';
          const wrapper = mount(<Comment avatar="" type={type} />);
          expect(wrapper.find(HeaderItems).find(Lozenge).length).toBe(1);
        });
      });

      describe('restrictedTo prop', () => {
        it('should render a Lock icon and restrictedTo text when supplied', () => {
          const wrapper = mount(
            <Comment avatar="" restrictedTo="atlassian-staff" />,
          );
          expect(wrapper.find(LockFilledIcon).length).toBe(1);
          expect(wrapper.text()).toEqual(
            expect.stringMatching('atlassian-staff'),
          );
        });

        it('should not render a Lock icon if restrictedTo prop is not set', () => {
          const wrapper = mount(<Comment avatar="" />);
          expect(wrapper.find(LockFilledIcon).length).toBe(0);
        });
      });

      describe('isSaving and savingText props', () => {
        describe('if isSaving prop is set', () => {
          it('should render the default savingText if no savingText is set', () => {
            const wrapper = mount(<Comment avatar="" isSaving />);
            expect(wrapper.text()).toEqual(
              expect.stringContaining('Sending...'),
            );
          });

          it('should render the savingText text if it is set', () => {
            const wrapper = mount(
              <Comment avatar="" isSaving savingText="Saving..." />,
            );
            expect(wrapper.text()).toEqual(
              expect.stringContaining('Saving...'),
            );
          });

          it('should not render CommentActions', () => {
            const actions = [
              <CommentAction />,
              <CommentAction>action content</CommentAction>,
              <CommentAction onClick={__noop}>action content</CommentAction>,
            ];
            const wrapper = mount(
              <Comment
                avatar=""
                actions={actions}
                isSaving
                savingText="Saving..."
                isError
                errorActions={actions}
              />,
            );
            expect(wrapper.find(CommentAction).length).toBe(0);
          });

          it('should apply .optimistic-saving-content styles', () => {
            const wrapper = mount(
              <Comment avatar="" isSaving savingText="Saving..." />,
            );
            expect(wrapper.find(Content).prop('isDisabled')).toBe(true);
          });
        });

        describe('if isSaving prop is not set', () => {
          it('should not render savingText', () => {
            const wrapper = mount(<Comment avatar="" savingText="Saving..." />);
            expect(wrapper.text()).not.toEqual(
              expect.stringContaining('Saving...'),
            );
          });

          it('should not apply .optimistic-saving-content styles', () => {
            const wrapper = mount(<Comment avatar="" savingText="Saving..." />);
            expect(wrapper.find(Content).prop('isDisabled')).toBe(false);
          });
        });
      });

      describe('isError, errorActions and errorLabel props', () => {
        const errorActions = [
          <CommentAction>Retry</CommentAction>,
          <CommentAction onClick={__noop}>Cancel</CommentAction>,
        ];

        describe('if isError prop is set', () => {
          it('should render the default (empty) if no errorIconLabel is set', () => {
            const wrapper = mount(
              <Comment avatar="" isError errorActions={errorActions} />,
            );
            expect(wrapper.find(WarningIcon).length).toBe(1);
            expect(wrapper.find(WarningIcon).at(0).prop('label')).toBe('');
          });

          it('should render the errorIconLabel text if it is set', () => {
            const label = 'Error';
            const wrapper = mount(
              <Comment
                avatar=""
                isError
                errorActions={errorActions}
                errorIconLabel={label}
              />,
            );
            expect(wrapper.find(WarningIcon).length).toBe(1);
            expect(wrapper.find(WarningIcon).at(0).prop('label')).toBe(label);
          });

          it('should render the icon and errorActions instead of the actions', () => {
            const actions = [
              <CommentAction />,
              <CommentAction>action content</CommentAction>,
              <CommentAction onClick={__noop}>action content</CommentAction>,
            ];
            const wrapper = mount(
              <Comment
                avatar=""
                actions={actions}
                isError
                errorActions={errorActions}
              />,
            );
            const actionItems = wrapper.find(CommentAction);
            expect(actionItems).toHaveLength(2);
            expect(wrapper.find(WarningIcon)).toHaveLength(1);
            expect(actionItems.find(Button).at(0).text()).toContain('Retry');
            expect(actionItems.find(Button).at(1).text()).toBe('Cancel');
          });

          it('should apply .optimistic-saving-content styles', () => {
            const wrapper = mount(<Comment avatar="" isError />);
            expect(wrapper.find(Content).prop('isDisabled')).toBe(true);
          });
        });

        describe('if isError prop is not set', () => {
          it('should not render the icon and errorActions', () => {
            const wrapper = mount(
              <Comment avatar="" errorActions={errorActions} />,
            );
            expect(wrapper.find(WarningIcon).length).toBe(0);
            expect(wrapper.find(CommentAction).length).toBe(0);
          });

          it('should not apply .optimistic-saving-content styles', () => {
            const wrapper = mount(<Comment avatar="" />);
            expect(wrapper.find(Content).prop('isDisabled')).toBe(false);
          });
        });
      });

      describe('headingLevel prop', () => {
        it('should add aria heading role and level', () => {
          const wrapper = mount(
            <Comment avatar="" headingLevel="3" type="hello" />,
          );

          expect(wrapper.find(HeaderItems).prop('headingLevel')).toBe('3');

          const divHeading = wrapper.find(HeaderItems).find('div').first();
          expect(divHeading.prop('role')).toBe('heading');
          expect(divHeading.prop('aria-level')).toBe(3);
        });
      });

      describe('Top items', () => {
        it('Should render in the order author, type, time, restrictedTo', () => {
          const time = <CommentTime>30 August, 2016</CommentTime>;
          const wrapper = mount(
            <Comment
              author="Mary"
              avatar=""
              type="Type"
              time={time}
              restrictedTo="atlassian-staff"
            />,
          );
          const headerItems = wrapper.find(HeaderItems);
          expect(headerItems.props().author).toBe('Mary');
          expect(headerItems.props().restrictedTo).toBe('atlassian-staff');
          expect(headerItems.props().type).toContain('Type');
          expect(headerItems.find(CommentTime).text()).toContain(
            '30 August, 2016',
          );
        });

        it('Should render in the order author, type, savingText, restrictedTo', () => {
          const wrapper = mount(
            <Comment
              author="Mary"
              avatar=""
              type="Type"
              restrictedTo="atlassian-staff"
              isSaving
              savingText="Saving..."
            />,
          );
          expect(wrapper.find(CommentLayout).text()).toEqual(
            expect.stringContaining('Saving...'),
          );
        });

        it('should not render time if isSaving is set', () => {
          const time = <CommentTime>30 August, 2016</CommentTime>;
          const wrapper = mount(
            <Comment
              avatar=""
              author="Mary"
              type="Type"
              time={time}
              restrictedTo="atlassian-staff"
              isSaving
              savingText="Saving..."
            />,
          );
          expect(wrapper.find(CommentTime).length).toBe(0);
          expect(wrapper.text()).toEqual(expect.stringContaining('Saving...'));
        });
      });
    });

    describe('nesting', () => {
      it('should reflect children to the CommentLayout', () => {
        const childComment = <Comment avatar="" content="child" />;
        const wrapper = shallow(
          <Comment avatar="" content="parent'">
            {childComment}
          </Comment>,
        );
        expect(wrapper.find(CommentLayout).prop('children')).toBe(childComment);
      });
    });
  });
});
