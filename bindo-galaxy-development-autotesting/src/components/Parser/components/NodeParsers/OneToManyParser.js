import React,{ Component } from 'react'
import lodash from 'lodash'
import { Form, Table, Button, Pagination, Tooltip, Divider, Modal } from 'antd'
import hocParser from './hocParser'
import Icon from '../../../Icon'
import { createUuid } from '../../../../utils'
import {
  parseTableData,
  listToColumns,
  findModuleByID,
} from '../../../../utils/module'
import {
  queryRelationRecords,
  deleteRecord,
  updateRecord,
} from '../../../../data/graphql/record'
import ModuleFormModal from '../ModuleFormModal';
import reduxKey from '../../../../constants/reduxKey';

@hocParser()
class OneToManyParser extends Component {
  state = {
    records: [],
    currentPage: 1,
    pageSize: 10,
    total: 0,
    visibleModuleModal: false,
    editRecord: {},
    relatedModule: {},
    relatedModuleParent: {
      fields: [],
      template: {
        form: [],
      },
    },
  }

  componentDidMount() {
    const { recordData } = this.props;

    this.loadRelationModule();

    if (recordData && recordData.id) {
      this.loadRelationRecords({
        recordID: recordData.id,
        currentPage: 1,
        pageSize: 10,
      });
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
    })

    const {
      moduleParentID = '',
    } = module || {};

    let moduleParent;
    if (lodash.isString(moduleParentID) && moduleParentID.length > 1) {
      moduleParent = findModuleByID({
        props: this.props,
        storeID,
        moduleID: moduleParentID,
      })
    }

    if (lodash.isEmpty(moduleParent)) {
      moduleParent = {
        fields: [],
        template: {
          form: [],
        },
      }
    }

    this.setState({
      relatedModule: module,
      relatedModuleParent: moduleParent,
    });
  }

  loadRelationRecords = async ({recordID, currentPage, pageSize}) => {
    const {
      storeID,
      moduleID,
      field,
    } = this.props;

    const {
      name,
    } = field;

    const {
      records = [],
      pageInfo = {},
    } = await queryRelationRecords({
      storeID,
      moduleID,
      recordID,
      fieldName: name,
      search: {
        page: currentPage,
        perPage: pageSize,
      },
    });

    const { total } = pageInfo;

    this.setState({
      records,
      total,
    });
  }

  handleEdit = (record) => {
    this.setState({
      visibleModuleModal: true,
      editRecord: record,
    });
  }

  handleAdd = () => {
    this.setState({
      visibleModuleModal: true,
      editRecord: {},
    });
  }

  handleDelete = (record) => {
    const { t } = this.props;

    Modal.confirm({
      title: t('common:module.deletePrompt'),
      content: record.name,
      okText: t('common:yes'),
      okType: 'danger',
      cancelText: t('common:no'),
      onOk: async () => {
        this.deleteRecord(record);
      },
    });
  }

  deleteRecord = async (record) => {
    try {
      const {
        field: { name },
        relationRecords = {},
        dispatch,
        moduleID,
      } = this.props;

      if (record.$id) {
        const moduleRelationRecords = relationRecords[moduleID] || {};
        const newRecords = moduleRelationRecords[`${moduleID}_${name}`] || [];
        const newDataTemp = [];
        newRecords.forEach(item => {
          if (item.$id !== record.$id) {
            newDataTemp.push(item);
          }
        });

        dispatch({
          type: reduxKey.UPDATE_RELATION_RECORDS,
          payload: {
            [moduleID]: {
              ...moduleRelationRecords,
              [`${moduleID}_${name}`]: newDataTemp,
            },
          },
        });
      } else {
        const { storeID } = this.props;
        const { records } = this.state;
        const {
          relatedModuleID,
        } = this.getFieldRelation();
        await deleteRecord({
          storeID,
          moduleID: relatedModuleID,
          recordID: record.id,
        });

        const newRecords = [];
        records.forEach(item => {
          if (item.id !== record.id) {
            newRecords.push(item);
          }
        })

        this.setState({
          records: newRecords,
        });
      }
    } catch (error) {
      log.error(error);
    }
  }

  handleRecordEdit = async (record) => {
    // todo 编辑数据库记录
    let newRecord = {}
    try {
      const { storeID } = this.props;
      const {
        editRecord,
        records,
      } = this.state;

      const {
        relatedModuleID,
      } = this.getFieldRelation();
      newRecord = await updateRecord({
        storeID,
        moduleID: relatedModuleID,
        input: {
          id: editRecord.id,
          formRecord: record,
        },
      });

      const newRecords = [];
      records.forEach(item => {
        if (item.id === editRecord.id) {
          newRecords.push(newRecord.record);
        } else {
          newRecords.push(item);
        }
      })

      this.setState({
        records: newRecords,
        visibleModuleModal: false,
      });
    } catch (error) {
      log.error(error);
    }
  }

  handleRecordSave = (record) => {
    const {
      field: { name },
      relationRecords = {},
      dispatch,
      moduleID,
    } = this.props;

    try {
      const moduleRelationRecords = relationRecords[moduleID] || {};
      let newRecords = moduleRelationRecords[`${moduleID}_${name}`] || [];
      if (record.$id) {
        const newDataTemp = [];
        newRecords.forEach(item => {
          if (item.$id === record.$id) {
            newDataTemp.push(record);
          } else {
            newDataTemp.push(item);
          }
        });

        newRecords = newDataTemp;
      } else {
        record.key = createUuid();
        record.$id = record.key;
        newRecords = [
          ...newRecords,
          record,
        ]
      }

      dispatch({
        type: reduxKey.UPDATE_RELATION_RECORDS,
        payload: {
          [moduleID]: {
            ...moduleRelationRecords,
            [`${moduleID}_${name}`]: newRecords,
          },
        },
      });
    } catch(error) {
      log.error(error);
    }
    this.setState({
      visibleModuleModal: false,
      editRecord: {},
    });
  }

  getDataSource = () => {
    const {
      relationRecords = {},
      moduleID,
      field: { name },
    } = this.props;
    const { records = [] } = this.state;
    const dataSource = [];
    const moduleRelationRecords = relationRecords[moduleID] || {};
    const newRecords = moduleRelationRecords[`${moduleID}_${name}`] || [];
    [...newRecords, ...records].forEach(item => {
      dataSource.push(parseTableData({data: item}));
    });

    return dataSource;
  }

  getColumns = ({
    disabled,
  }) => {
    const { t } = this.props;
    const { relatedModule } = this.state;
    const columns = listToColumns(relatedModule);

    if(!disabled) {
      columns.push({
        title: t('common:action'),
        key: 'action',
        align: 'center',
        fixed: 'right',
        width: 250,
        render: (text, record) => (
          <span>
            <Tooltip placement="bottom" title={t('common:edit')}>
              <Button
                key="edit"
                size="small"
                style={{border: 0}}
                onClick={(evt) => {
                  evt.stopPropagation();
                  this.handleEdit(record)
                }}
              >
                <Icon type="icon-edit" />
              </Button>
            </Tooltip>
            <Divider type="vertical" />
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
          </span>
        ),
      });
    }

    return columns;
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

  render () {
    const {
      t,
      field = {},
      getViewProps,
      getFieldDecorator,
      getInitialValue,
      getRules,
      relationRecords = {},
      storeID,
      appID,
      getFormItemProps,
      storesAppsModulesMap,
    } = this.props;
    const newProps = getFormItemProps();

    const viewProps = {
      ...getViewProps(),
      pagination: false,
      dataSource: this.getDataSource(),
      columns: this.getColumns({
        disabled: newProps.disabled,
      }),
    };

    const {
      name,
      label,
    } = field;

    const {
      total,
      currentPage,
      pageSize,
      visibleModuleModal = false,
      editRecord,
      relatedModule,
      relatedModuleParent,
    } = this.state;

    const {
      relatedModuleID,
    } = this.getFieldRelation();

    return (
      <Form.Item {...newProps}>
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
                style={{marginTop: '8px'}}
                onClick={this.handleAdd}
                disabled={newProps.disabled}
              >
                { t('common:add') }
              </Button>
              <Pagination
                style={{ margin: '8px 0', textAlign: 'right', flex: 1}}
                total={total}
                current={currentPage}
                pageSize={pageSize}
                showSizeChanger
                showQuickJumper
                onChange={this.handlePageChange}
                onShowSizeChange={this.handleShowSizeChange}
              />
            </div>
          </div>
        )}
        {
          visibleModuleModal &&
          <ModuleFormModal
            {...this.props}
            module={relatedModule}
            moduleParent={relatedModuleParent}
            moduleID={relatedModuleID}
            recordData={editRecord}
            relationRecords={relationRecords}
            storesAppsModulesMap={storesAppsModulesMap}
            storeID={storeID}
            appID={appID}
            title={label}
            disabled={newProps.disabled}
            onSave={this.handleRecordSave}
            onEdit={this.handleRecordEdit}
            onCancel={() => this.setState({ visibleModuleModal: false })}
          />
        }
      </Form.Item>
    );
  }
}

export default OneToManyParser
