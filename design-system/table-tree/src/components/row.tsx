/* eslint-disable @repo/internal/react/no-clone-element */
import React, { Component, Fragment } from 'react';

import {
  createAndFireEvent,
  withAnalyticsContext,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';

import toItemId from '../utils/to-item-id';

import Chevron from './internal/chevron';
import { TreeRowContainer } from './internal/styled';

const packageName = process.env._PACKAGE_NAME_;
const packageVersion = process.env._PACKAGE_VERSION_;

class Row extends Component<any, any> {
  state = { isExpanded: this.props.isDefaultExpanded || false };

  componentDidUpdate(prevProps: any) {
    const { isDefaultExpanded, isExpanded } = this.props;

    if (
      isExpanded === undefined &&
      isDefaultExpanded !== undefined &&
      prevProps.isDefaultExpanded !== isDefaultExpanded &&
      this.state.isExpanded !== isDefaultExpanded
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ isExpanded: isDefaultExpanded });
    }
  }

  onExpandStateChange(isExpanded: boolean) {
    if (this.props.data) {
      if (isExpanded && this.props.onExpand) {
        this.props.onExpand(this.props.data);
      } else if (!isExpanded && this.props.onCollapse) {
        this.props.onCollapse(this.props.data);
      }
    }
  }

  onExpandToggle = () => {
    const { isExpanded } = this.props;

    if (isExpanded !== undefined) {
      this.onExpandStateChange(!isExpanded);
    } else {
      this.setState({ isExpanded: !this.state.isExpanded });
      this.onExpandStateChange(!this.state.isExpanded);
    }
  };

  isExpanded() {
    const { isExpanded } = this.props;

    return isExpanded !== undefined ? isExpanded : this.state.isExpanded;
  }

  renderCell(cell: any, cellIndex: number) {
    const { props } = this;
    const isExpanded = this.isExpanded();
    const { hasChildren, depth } = props;
    const isFirstCell = cellIndex === 0;
    const indentLevel = isFirstCell ? depth : 0;
    let cellContent = cell.props.children || [];
    if (isFirstCell && hasChildren) {
      cellContent = [
        <Chevron
          key="chevron"
          expandLabel={props.expandLabel}
          collapseLabel={props.collapseLabel}
          isExpanded={isExpanded}
          onExpandToggle={this.onExpandToggle}
          ariaControls={toItemId(props.itemId)}
        />,
      ].concat(cellContent);
    }
    return React.cloneElement(
      cell,
      {
        key: cellIndex,
        columnIndex: cellIndex,
        indentLevel,
      },
      cellContent,
    );
  }

  render() {
    const { hasChildren, depth, renderChildren } = this.props;
    const isExpanded = this.isExpanded();
    const ariaAttrs = {} as any;
    if (hasChildren) {
      ariaAttrs['aria-expanded'] = isExpanded;
    }
    if (depth !== undefined) {
      ariaAttrs['aria-level'] = depth;
    }
    return (
      <Fragment>
        <TreeRowContainer role="row" {...ariaAttrs}>
          {React.Children.map(this.props.children, (cell, index) =>
            this.renderCell(cell, index),
          )}
        </TreeRowContainer>
        {hasChildren && isExpanded && renderChildren && renderChildren()}
      </Fragment>
    );
  }
}

export { Row as RowWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'row',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onExpand: createAndFireEventOnAtlaskit({
      action: 'expanded',
      actionSubject: 'tableTree',

      attributes: {
        componentName: 'row',
        packageName,
        packageVersion,
      },
    }),

    onCollapse: createAndFireEventOnAtlaskit({
      action: 'collapsed',
      actionSubject: 'tableTree',

      attributes: {
        componentName: 'row',
        packageName,
        packageVersion,
      },
    }),
  })(Row),
);
