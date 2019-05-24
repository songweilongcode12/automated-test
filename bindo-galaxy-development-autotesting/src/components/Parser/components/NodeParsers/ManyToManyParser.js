import React,{ Component } from 'react'
import { Form, Table, Button, Tooltip } from 'antd'
import lodash from 'lodash'
import hocParser from './hocParser'
import Icon from '../../../Icon'
import {
  parseTableData,
  listToColumns,
  findModuleByID,
} from '../../../../utils/module'
import {
  queryRelationRecords,
} from '../../../../data/graphql/record'
import BindingDataModal from '../BindingDataModal';

@hocParser()
class ManyToManyParser extends Component {

  state = {
    records: [],
    visibleBindingModal: false,
    relatedModule: {},
  }

  componentDidMount() {
    const { recordData } = this.props;

    this.loadRelationModule();

    if (recordData && recordData.id) {
      this.loadRelationRecords(recordData.id);
    }
  }

  loadRelationModule = async () => {

    const {
      relatedModuleID,
    } = this.getFieldRelation();

    const {
      storeID,
    } = this.props;

    const module = findModuleByID({
      props: this.props,
      storeID,
      moduleID: relatedModuleID,
    });

    this.setState({
      relatedModule: module || {},
    });
  }

  loadRelationRecords = async (recordID) => {
    const {
      storeID,
      moduleID,
      field,
      setFieldsValue,
    } = this.props;

    const {
      name,
    } = field;

    const {
      records = [],
    } = await queryRelationRecords({
      storeID,
      moduleID,
      recordID,
      fieldName: name,
    });

    const ids = [];
    records.forEach(item => {
      ids.push(item.record.id);
    });

    if (typeof setFieldsValue === 'function' && ids.length > 0) {
      setFieldsValue({[name]: ids});
    }

    this.setState({
      records,
    });
  }

  getFieldRelation = () => {
    const {
      field,
    } = this.props;
    const {
      relation = {},
    } = field || {};
    const {
      relatedModuleID,
    } = relation || {};

    return {
      relatedModuleID,
    };
  }

  handleDelete = (record) => {
    const {
      field: { name },
      setFieldsValue,
      getFieldValue,
    } = this.props;

    const fieldValue = getFieldValue(name);
    const fieldValueSet = new Set(fieldValue);
    fieldValueSet.delete(record.id);

    const { records } = this.state;
    const newRecords = [];
    records.forEach(item => {
      if (item.id !== record.id) {
        newRecords.push(item);
      }
    });

    setFieldsValue({[name]: [...fieldValueSet]});

    this.setState({
      records: newRecords,
    })
  }

  getDataSource = () => {
    const { records = [] } = this.state;
    const dataSource = [];
    records.forEach(item => {
      dataSource.push(parseTableData({data: item}));
    });

    return dataSource;
  }

  getColumns = () => {
    const { t } = this.props;
    const { relatedModule } = this.state;
    const columns = listToColumns(relatedModule);

    columns.push({
      title: t('common:action'),
      key: 'action',
      align: 'center',
      fixed: 'right',
      width: 250,
      render: (text, record) => (
        <Tooltip placement="bottom" title={t('common:delete')}>
          <Button
            key="delete"
            size="small"
            style={{border: 0}}
            onClick={(evt) => {
              evt.stopPropagation();
              this.handleDelete(record)
            }}
          >
            <Icon type="icon-delete" />
          </Button>
        </Tooltip>
      ),
    });

    return columns;
  }

  handleBinding = ({selectedIds = [], selectedData = []} = {}) => {
    if (
      selectedIds
      && selectedData
      && selectedIds.length > 0
      && selectedIds.length === selectedData.length
    ) {
      const {
        records,
      } = this.state;

      const {
        field: { name },
        setFieldsValue,
        getFieldValue,
      } = this.props;

      let fieldValue = getFieldValue(name);
      if (!lodash.isArray(fieldValue)) {
        fieldValue = [];
      }

      const newRecords = [
        ...records,
        ...selectedData,
      ];

      const ids = [
        ...fieldValue,
        ...selectedIds,
      ];

      setFieldsValue({[name]: ids});

      this.setState({
        records: newRecords,
        visibleBindingModal: false,
      });
    }
  }

  render () {
    const {
      t,
      field = {},
      view = {},
      storeID,
      getViewProps,
      getFieldDecorator,
      getInitialValue,
      getRules,
      getFieldValue,
      getFormItemProps,
    } = this.props;

    const viewProps = {
      ...getViewProps(),
      pagination: false,
      dataSource: this.getDataSource(),
      columns: this.getColumns(),
    };

    const {
      name,
    } = field;

    const {
      visibleBindingModal,
      relatedModule,
    } = this.state;

    const {
      relatedModuleID,
    } = this.getFieldRelation();

    const {
      searchableFields = [],
    } = view;

    return (
      <Form.Item {...getFormItemProps()}>
        {getFieldDecorator(name, {
          initialValue: getInitialValue(),
          rules: getRules(),
        })(
          <div style={{border: '1px solid #d9d9d9'}}>
            <Table {...viewProps} />
            <div style={{display: 'flex', padding: 5}}>
              <Button
                icon="plus"
                type="primary"
                onClick={() => this.setState({ visibleBindingModal: true })}
                disabled={getFormItemProps().disabled}
              >
                { t('common:add') }
              </Button>
            </div>
            {
              visibleBindingModal &&
              <BindingDataModal
                title={name}
                storeID={storeID}
                moduleID={relatedModuleID}
                relatedModule={relatedModule}
                searchableFields={searchableFields || []}
                onBinding={this.handleBinding}
                boundRecords={getFieldValue(name) || []}
                onCancel={() => this.setState({ visibleBindingModal: false })}
              />
            }
          </div>
        )}
      </Form.Item>
    );
  }
}

export default ManyToManyParser
