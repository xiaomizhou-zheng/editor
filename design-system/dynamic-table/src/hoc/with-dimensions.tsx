import React, { LegacyRef } from 'react';

export interface State {
  refWidth: number;
  refHeight: number;
}

export interface WithDimensionsProps {
  innerRef?: LegacyRef<HTMLTableCellElement | HTMLTableRowElement>;
  isRanking: boolean;
  refWidth: number;
  refHeight: number;
}

// Compute height and width of wrapped component before ranking
export default function withDimensions<
  WrappedComponentProps extends WithDimensionsProps
>(
  WrappedComponent: React.ComponentType<WrappedComponentProps>,
): React.ComponentClass<
  Omit<WrappedComponentProps, 'refWidth' | 'refHeight' | 'innerRef'>,
  State
> {
  type WrappedProps = Omit<
    WrappedComponentProps,
    'refWidth' | 'refHeight' | 'innerRef'
  >;
  return class WithDimensions extends React.Component<WrappedProps, State> {
    ref?: HTMLElement;

    state = {
      refWidth: 0,
      refHeight: 0,
    };

    innerRef = (ref?: HTMLElement) => {
      if (ref && !this.props.isRanking) {
        this.ref = ref;
      }
    };

    UNSAFE_componentWillReceiveProps(nextProps: WrappedProps) {
      const wasRanking = this.props.isRanking;
      const willRanking = nextProps.isRanking;

      if (willRanking && !wasRanking) {
        this.updateDimensions();
      }
    }

    updateDimensions = () => {
      if (!this.ref) {
        return;
      }

      const clientRect = this.ref.getBoundingClientRect();

      const { width } = clientRect;
      const { height } = clientRect;

      if (width !== this.state.refWidth || height !== this.state.refHeight) {
        this.setState({ refWidth: width, refHeight: height });
      }
    };

    render() {
      const { refWidth, refHeight } = this.state;

      return (
        <WrappedComponent
          //@ts-expect-error TODO Fix legit TypeScript 3.9.6 improved inference error
          refWidth={refWidth}
          //@ts-expect-error TODO Fix legit TypeScript 3.9.6 improved inference error
          refHeight={refHeight}
          innerRef={this.innerRef}
          {...(this.props as WrappedComponentProps)}
        />
      );
    }
  };
}
