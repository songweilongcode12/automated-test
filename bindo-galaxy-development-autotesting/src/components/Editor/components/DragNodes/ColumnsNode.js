import React, { Component } from 'react'
import { Row, Col } from 'antd'
import Sortable from '../../Sortable'
import hocNode from './hocNode'

const prefix = 'bindo-galaxy-editor-formview-columns';
const name = 'formview-columns-view';
const options = {
  group: {
    name,
    put: [
      'formview-layout-widgets',
      'formview-base-widgets',
      'formview-relation-widgets',
      // 'formview-container',
      // 'formview-tabs-view',
    ],
  },
};

const ColumnNode = ({
  span = 1,
  view: {
    uuid,
    children = [],
  },
  fields = [],
  sortableDisabled = false,
}) => (
  <Col span={span} className={`${prefix}-col`}>
    <Sortable
      data={children}
      uuid={uuid}
      type={name}
      options={options}
      fields={fields}
      sortableDisabled={sortableDisabled}
      className={`${prefix}-panel`}
    />
  </Col>
);

@hocNode()
class ColumnsNode extends Component {
  render() {
    const {
      view,
      sortableDisabled = false,
      fields = [],
    } = this.props;
    const {
      children = [],
    } = view || {};

    const len = children.length;

    return (
      <Row>
        {
          children.map(item => {
            const span = parseInt(24/len, 10);
            return (
              <ColumnNode
                key={item.uuid}
                view={item}
                span={span}
                fields={fields}
                sortableDisabled={sortableDisabled}
              />
            )
          })
        }
      </Row>
    );
  }
}

export default ColumnsNode;
