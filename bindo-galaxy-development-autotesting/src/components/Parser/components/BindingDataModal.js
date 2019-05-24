import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { Modal, Table, Input } from 'antd';
import lodash from 'lodash';
import { parseTableData, listToColumns } from '../../../utils/module'
// import filtersConstant from '../../../constants/filters'
import {
  queryRecords,
} from '../../../data/graphql/record'

const currentPage = 1;
const pageSize = 30;

@translate()
class BindingDataModal extends Component {
  state = {
    loading: false,
    selectedIds: [],
    selectedData: [],
    records: [],
  }

  componentDidMount () {
    this.loadRecords([]);
  }

  loadRecords = async (formulas) => {
    try {
      const { storeID, moduleID } = this.props;

      const {
        recordLists = [],
      } = await queryRecords({
        storeID,
        moduleID,
        search: {
          page: currentPage,
          perPage: pageSize,
          formulas,
        },
        associates: ['*'],
      });

      this.setState({
        records: recordLists,
      });
    } catch (error) {
      log.error(error);
    }
  }

  handleSearch = (key) => {
    const { searchableFields } = this.props;

    if (!searchableFields && searchableFields.length < 0) {
      return;
    }

    const formulas = [];
    const arr = []
    searchableFields.forEach(item => {
      // filters.push({
      //   fieldName: item,
      //   fieldType: 'string',
      //   condition: filtersConstant.LIKE,
      //   values: [key],
      // });
      arr.push(`CONTAIN($.self.${item},["${key}"])`)
    });

    formulas.push({
      formula: arr.join('||'),
    });

    this.loadRecords(formulas)
  }

  handleBindingClick = () => {
    const { onBinding } = this.props;

    if (typeof onBinding === 'function') {
      const {
        selectedIds,
        selectedData,
      } = this.state;

      onBinding({
        selectedIds,
        selectedData,
      });
    }
  }

  handleSelectedChange = (selectedRowKeys, selectedRows) => {
    const selectedIds = [];
    const selectedData = [];
    selectedRows.forEach(item => {
      if (item && item.id) {
        selectedIds.push(item.key);
        selectedData.push(item);
      }
    });

    this.setState({
      selectedIds,
      selectedData,
    });
  }

  getDataSource = () => {
    let { boundRecords } = this.props;
    if (!lodash.isArray(boundRecords)) {
      boundRecords = [];
    }
    const boundRecordsIds = boundRecords.map(item => item.id);
    const boundRecordSet = new Set(boundRecordsIds);
    const { records = [] } = this.state;
    const dataSource = [];
    records.forEach(item => {
      if (!boundRecordSet.has(item.id)) {
        dataSource.push(parseTableData({data: item}));
      }
    });

    return dataSource;
  }

  getColumns = () => {
    const {
      relatedModule,
    } = this.props;

    return listToColumns(relatedModule);
  }

  render () {
    const { t, title, onCancel } = this.props;
    const { loading, selectedData, selectedIds } = this.state;

    return (
      <Modal
        visible={true}
        centered={true}
        closable={false}
        width="60%"
        title={<div style={{ textAlign: 'center' }}>{title}</div>}
        onOk={this.handleBindingClick}
        okButtonProps={{
          disabled: selectedData.length < 1 && selectedIds.length < 1,
        }}
        bodyStyle={{ padding: '12px 24px' }}
        onCancel={onCancel}
      >
        <Input.Search
          placeholder={`${t('common:module.search')} ${title}`}
          onSearch={this.handleSearch}
          style={{ marginBottom: 12 }}
        />
        <Table
          loading={loading}
          dataSource={this.getDataSource()}
          columns={this.getColumns()}
          pagination={false}
          rowSelection={{
            onChange: this.handleSelectedChange,
          }}
          scroll={{ y: 360 }}
        />
      </Modal>
    );
  }
}

export default BindingDataModal;
