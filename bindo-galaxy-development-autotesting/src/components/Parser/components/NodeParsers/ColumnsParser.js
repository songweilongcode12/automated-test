import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { createFormItem } from './ParserFactory';

class ColumnsParser extends Component {
  getCol = ({item, columnSpan}) => {
    const { span, uuid, children =[] } = item;

    const {
      form,
      fields,
      storeID,
      moduleID,
      appID,
      action,
      dispatch,
      prefix,
      recordData,
      editableData,
      relationRecords = {},
      uniqueFieldNamesSet = new Set(),
      storesAppsModulesMap = new Map(),
      storesAppsMap = new Map(),
    } = this.props;

    const params = {
      form,
      fields,
      storeID,
      moduleID,
      appID,
      action,
      dispatch,
      prefix,
      recordData,
      editableData,
      relationRecords,
      uniqueFieldNamesSet,
      storesAppsModulesMap,
      storesAppsMap,
    };

    return (
      <Col span={span || columnSpan} key={uuid} style={{paddingRight: '10px'}}>
        { children.map(view => createFormItem({...params, view})) }
      </Col>
    );
  }

  render() {
    const { view } = this.props;
    const { children = [] } = view || {};

    const columnSpan = parseInt(24/children.length, 10);

    return (
      <Row>
        { children.map(item => this.getCol({item, columnSpan})) }
      </Row>
    );
  }
}
export default ColumnsParser
