import React, { Component, ComponentType } from 'react';
import Select, { mergeStyles } from 'react-select';
import memoizeOne from 'memoize-one';
import isEqual from 'react-fast-compare';

import { SelectProps, SelectComponentsConfig, OptionType } from './types';
import * as defaultComponents from './components';
import baseStyles from './styles';

export default function createSelect(WrappedComponent: ComponentType<any>) {
  return class AtlaskitSelect<
    Option = OptionType,
    IsMulti extends boolean = false
  > extends Component<SelectProps<Option, IsMulti>> {
    components: SelectComponentsConfig<Option, IsMulti> = {};

    select: Select<Option> | null = null;

    constructor(props: SelectProps<Option, IsMulti>) {
      super(props);
      this.cacheComponents = memoizeOne(this.cacheComponents, isEqual).bind(
        this,
      );
      this.cacheComponents(props.components || {});
    }

    static defaultProps = {
      validationState: 'default',
      // TODO: uncomment the next line when cleaning up validationState prop so it has a default value
      // isInvalid: false,
      spacing: 'default',
      onClickPreventDefault: true,
      tabSelectsValue: false,
      components: {},
      styles: {},
    };

    UNSAFE_componentWillReceiveProps(nextProps: SelectProps<Option, IsMulti>) {
      this.cacheComponents(nextProps.components!);
    }

    cacheComponents = (components: SelectComponentsConfig<Option, IsMulti>) => {
      this.components = {
        ...defaultComponents,
        ...components,
      };
    };

    focus() {
      if (this.select) {
        this.select.focus();
      }
    }

    blur() {
      if (this.select) {
        this.select.blur();
      }
    }

    onSelectRef = (ref: Select<Option>) => {
      this.select = ref;

      const { innerRef } = this.props;

      if (typeof innerRef === 'object') {
        innerRef.current = ref;
      }
      if (typeof innerRef === 'function') {
        innerRef(ref);
      }
    };

    render() {
      const {
        styles,
        validationState,
        isInvalid,
        spacing,
        isMulti,
        appearance,
        ...props
      } = this.props;
      const isCompact = spacing === 'compact';

      // props must be spread first to stop `components` being overridden
      return (
        <WrappedComponent
          ref={this.onSelectRef}
          isMulti={isMulti}
          aria-live="assertive"
          {...props}
          components={this.components}
          styles={mergeStyles(
            baseStyles<Option, IsMulti>(
              // This will cover both props for invalid state while giving priority to isInvalid. When cleaning up validationState, we can just keep the inner condition.
              typeof isInvalid !== 'undefined'
                ? isInvalid
                  ? 'error'
                  : 'default'
                : validationState!,
              isCompact,
              this.props.appearance || 'default',
            ),
            styles!,
          )}
        />
      );
    }
  };
}
