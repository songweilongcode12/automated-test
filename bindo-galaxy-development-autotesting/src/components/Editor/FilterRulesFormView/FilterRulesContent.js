/**
 * filter表单的内容
 */

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Form,
  Button,
  Input,
  Table,
  Icon,
  Modal,
  Select,
  message,
  Row,
  Col,
} from 'antd';
import lodash from 'lodash';
import Layout from '../../Layout';
import Breadcrumb from '../../Breadcrumb/Breadcrumb';
import {
  parseParams,
  createRouteUrl,
  parseStoreRoles,
} from '../../../utils/galaxy';
import routes from '../../../constants/routes';
import common from '../../../constants/common';
import {
  handleMoreBtnEvent,
  findModule,
} from '../../../utils/module';
import { createUuid } from '../../../utils';
import ActionMore from '../../ActionMore'
// import Conditional from '../components/Conditional';
import reduxKey from '../../../constants/reduxKey';
// import {
//   formulaToCst,
//   cstToFormula,
// } from '../../../data/CstParser';

const galaxyPrefix = 'bg-galaxy';

@Form.create()
class FilterRulesContent extends Component {

  state = {
    moduleEntity: {},
    rolesList: [],
    showRolesModal: false,
    showConditional: false,
    selectRole: '',
    roles: [],
    formulas: '',
    name: '',
    type: common.DEFAULT,
    uuid: '',
  }

  componentDidMount () {

    const {
      appID,
      moduleID,
      storeID,
      recordID,
    } = parseParams(this.props);

    const moduleEntity = findModule({props: this.props, appID, storeID, moduleID})

    const {
      queryConditions,
    } = moduleEntity;

    this.setState({
      moduleEntity,
    })

    if (recordID) {
    // 根据ID筛选出需要的数据, 并设置默认值
      let currentItem;
      if (recordID) {
        queryConditions.forEach(item => {
          if (item.uuid === recordID) {
            currentItem = item;
          }
        })
        if (currentItem.uuid) {
          this.setState({
            name: currentItem.name,
            type: currentItem.type,
            roles: currentItem.roles,
            uuid: currentItem.uuid,
            formulas: currentItem.formulas[0].formula,
          })
        }
      }
    }
  }

  // shouldComponentUpdate (nextProps, nextState) {
  //   const {
  //     recordID,
  //   } = parseParams(this.props);

  //   const {
  //     moduleEntity = {},
  //   } = nextProps;

  //   const {
  //     queryConditions = [],
  //   } = moduleEntity;

  //   if (recordID) {
  //   // 根据ID筛选出需要的数据, 并设置默认值
  //     let currentItem;
  //     if (recordID) {
  //       queryConditions.forEach(item => {
  //         if (item.uuid === recordID) {
  //           currentItem = item;
  //         }
  //       })
  //       if (currentItem.uuid && !nextState.uuid) {
  //         this.setState({
  //           name: currentItem.name,
  //           type: currentItem.type,
  //           roles: currentItem.roles,
  //           uuid: currentItem.uuid,
  //           formulas: formulaToCst(currentItem.formulas[0].formula),
  //         })
  //       }
  //     }
  //   }
  //   return true
  // }

  // 已经选中的roles列表数据
  getDataSource = () => {
    const {
      roles =[],
    } = this.state;
    const dataSource = [];
    roles.forEach(roleID => {
      dataSource.push({
        key: roleID,
        roleID,
      });
    });

    return dataSource;
  }

  getColumns = () => {
    const {
      t,
    } = this.props;

    const {
      galaxyState,
      storeID,
    } = parseParams(this.props);

    const storeRoles = parseStoreRoles({props: this.props, storeID})

    const columns = [
      {
        title: t('common:module.rolesTitle'),
        dataIndex: 'roleID',
        key: 'roleID',
        render: (text) => {
          for (let i = 0; i < storeRoles.length; i++) {
            const role = storeRoles[i];
            if (role && role.id === text) {
              return role.name;
            }
          }
        },
      },
    ]
    if (galaxyState === 'builder') {
      columns.push({
        title: t('common:action'),
        key: 'action',
        align: 'center',
        fixed: 'right',
        width: 180,
        render: (text, record) => (
          <span>
            <ActionMore
              dataSource={[
                {
                  title: 'delete',
                  type: common.DEFAULT,
                  status: 'active',
                  icon: 'icon-delete',
                  iconType: 'bindo',
                  scriptName: 'Delete',
                  params: {},
                  uuid: createUuid(),
                },
              ]}
              onBtnClick={(btnData) => handleMoreBtnEvent(btnData, {
                handleDeleteClick: () => this.handleDelete(record),
              })}
            />
          </span>
        ),
      });
    }
    return columns;
  }

  handleDelete = (record) => {
    const {
      roleID,
    } = record;

    let {
      roles,
    } = this.state;

    roles = roles.filter(item => item !== roleID)

    this.setState({
      roles,
    })
  }

  // 处理conditotion数据
  handleCodintionData = ({data, operate}) => {
    const {
      dispatch,
      history,
    } = this.props;

    const {
      moduleEntity,
    } = this.state;

    const {
      moduleID,
      storeID,
    } = parseParams(this.props);

    let {
      queryConditions = [],
    } = moduleEntity;

    // 后台queryConditions后台默认为null ,特殊处理
    if (lodash.isEmpty(queryConditions)) {
      queryConditions = [];
    }

    if (operate === 'create') {
      queryConditions.push(data)
    } else if (operate === 'update') {
      queryConditions = queryConditions.map(item => {
        if (item.uuid === data.uuid) {
          return {
            ...item,
            ...data,
          }
        }
        return item;
      })
    }
    moduleEntity.queryConditions = queryConditions;
    this.setState({
      moduleEntity,
    })
    dispatch({
      type: reduxKey.UPDATE_MODULE, payload: {
        storeID,
        id: moduleID,
        data: moduleEntity,
      },
    });
    const route = routes.FILTER_RULES_VIEW;
    history.push({ pathname: createRouteUrl(route, {}, this.props)});
  }

  handleSubmit = () => {

    const {
      recordID,
      storeID,
    } = parseParams(this.props);

    const {
      form,
    } = this.props;

    const storeRoles = parseStoreRoles({props: this.props, storeID})

    const {
      formulas,
      roles,
      uuid,
    } = this.state;
    form.validateFields(async (err, values) => {

      if (err) {
        return;
      }

      if (lodash.isEmpty(formulas)) {
        message.error('Filter is Empty');
        return;
      }

      const {
        type,
      } = values;

      let defaultRoles = [];
      if (type === 'DEFAULT') {
        defaultRoles = storeRoles.map(item => item.id)
      }

      const filterObj = {
        formulas: [{'formula': formulas}],
        roles: [...roles, ...defaultRoles],
        ...values,
      };

      if (recordID) { // update
        this.handleCodintionData({data: {...filterObj, uuid}, operate: 'update'})
      } else { // create
        this.handleCodintionData({data: {...filterObj, uuid: createUuid()}, operate: 'create'})
      }
    })
  }

  rolesAddClick = () => {
    // 弹出框
    this.setState({
      showRolesModal: true,
    })
  }

  getRolesId = (id) => {
    if (id) {
      this.setState({
        selectRole: id,
      })
    }
  }

  handleRolesList = () => {
    const {
      storeID,
    } = parseParams(this.props);

    const {
      roles,
    } = this.state

    const storeRoles = (parseStoreRoles({props: this.props, storeID}))

    // 过滤用户已经选择的roles
    const filterdStoreRoles = storeRoles.filter(item => !roles.includes(item.id))

    return (
      <Select
        style={{width: '100%'}}
        onChange={value => this.getRolesId(value)}
      >
      {
         filterdStoreRoles.map(item =>
          <Select.Option
            key={item.id}
            value={item.id}
          >
            {item.name}
          </Select.Option>
         )
      }
      </Select>
    )
  }

  addRoles = () => {
    const {
      selectRole,
      roles,
    } = this.state;

    this.setState({
      roles: [selectRole, ...roles],
      showRolesModal: false,
    })
  }

  // handleConditional = (cstData) => {
  //   this.setState({
  //     formulas: cstData,
  //     showConditional: false,
  //   })
  // }

  getExistingFields = () => {
    const {
      moduleEntity = {},
    } = this.state;

    const {
      fields = [],
    } = moduleEntity;

    return fields;
  }

  handleCancel = () => {
    const {
      history,
    } = this.props;
    const route = routes.FILTER_RULES_VIEW;
    history.push({ pathname: createRouteUrl(route, {}, this.props)});
  }

  render () {
    const {
      t,
      getBreadcrumbData,
      galaxyLoading,
      form,
    } = this.props;

    const {
      galaxyState,
      storeSlugs,
      menuID,
    } = parseParams(this.props);

    const {
      getFieldDecorator,
      getFieldValue,
    } = form;

    const {
      name,
      rolesList,
      showRolesModal,
      showConditional,
      formulas,
      type = common.DEFAULT,
    } = this.state;

    const { action } = parseParams(this.props);

    const actionIsEdit = action === 'edit';

    const filterType = getFieldValue('type') === common.ROLE;

    if (galaxyState === common.DASHBOARD) {
      if (menuID) {
        return (
          <Redirect
            to={createRouteUrl(routes.RECORDS, {
              page: 1,
              pageSize: 10,
            }, this.props)}
          />
        )
      } else {
        return (
          <Redirect
            to={createRouteUrl(routes.MODULES, {
              page: 1,
              pageSize: 10,
            }, this.props)}
          />
        )
      }
    }

    return (
      <Layout.Content className="column">
        <div className={`${galaxyPrefix}-header`}>
          <Breadcrumb
            galaxyState={galaxyState}
            storeSlugs={storeSlugs}
            data={getBreadcrumbData()}
            {...this.props}
          />
        </div>
        <div className={`${galaxyPrefix}-content`}>
          <Form style={{ padding: '0 10px' }}>
            <Form.Item label={t('common:module.filterName')} colon={false}>
              {getFieldDecorator('name', {
                initialValue: name,
                rules: [{
                  required: true, message: t('common:module.filterNameInputError'),
                }],
              })(
                <Input placeholder={t('common:module.filterNamePlaceholder')} disabled={actionIsEdit} />
              )}
            </Form.Item>

            <Form.Item label={t('common:module.appliedOn')} colon={false}>
                {getFieldDecorator('type', {
                  initialValue: type,
                  rules: [{
                    required: true, message: t('common:module.appliedOnInputError'),
                  }],
                })(
                  <Select placeholder={t('common:module.appliedOnPlaceholder')} disabled={actionIsEdit}>
                    <Select.Option value={common.DEFAULT}>{t('common:module.allRoles')}</Select.Option>
                    <Select.Option value={common.ROLE}>{t('common:module.onlySelectRoles')}</Select.Option>
                  </Select>
                )}
            </Form.Item>
          </Form>

          {
            filterType &&
            <Table
              dataSource={this.getDataSource(rolesList)}
              columns={this.getColumns()}
              pagination={false}
              scroll={{ x: 'max-content' }}
              footer={() => (
                <span
                  onClick={this.rolesAddClick}
                >
                  <Icon type="plus" style={{marginRight: 3, color: '#40a9ff'}} />
                  <span style={{color: '#40a9ff'}}>Add</span>
                </span>
              )}
            />
          }

          <Button
            style={{marginTop: 15, marginLeft: 10}}
            type='primary'
            onClick={() => {
              this.setState({showConditional: true})
            }}
          >
            {t('common:module.editFilter')}
          </Button>
        </div>
        <div className={`${galaxyPrefix}-footer`}>
          <span>Filter Rules</span>
          <Button
            type="primary"
            className={`${galaxyPrefix}-btn`}
            loading={galaxyLoading}
            onClick={this.handleSubmit}
          >
            {t('common:save')}
          </Button>
          <Button
            className={`${galaxyPrefix}-btn`}
            onClick={this.handleCancel}
          >
            {t('common:cancel')}
          </Button>
        </div>
        {
          showRolesModal &&
          <Modal
            visible={true}
            title={t('common:module.selectRoles')}
            okText={t('common:ok')}
            cancelText={t('common:cancel')}
            onOk={this.addRoles}
            onCancel={() => this.setState({
              showRolesModal: false,
            })}
            destroyOnClose={true}
          >
            {
              this.handleRolesList()
            }
          </Modal>
        }
        {
          showConditional &&
          <Modal
            visible={true}
            title={t('common:module.Filters')}
            onCancel={() => this.setState({ showConditional: false })}
            okText={t('common:ok')}
            cancelText={t('common:cancel')}
            onOk={() => this.setState({ showConditional: false })}
          >
            <Row>
              <Col span={6}>
                <Select
                  style={{width: '100%'}}
                >
                  {
                    this.getExistingFields().map(item =>
                      <Select.Option
                        key={item.uuid}
                      >
                        {item.name}
                      </Select.Option>
                    )
                  }
                </Select>
              </Col>
              <Col span={16}>
                  <Input.TextArea
                    style={{width: '100%', marginLeft: 15}}
                    autosize={{
                      minRows: 5,
                    }}
                    onChange={evt => {
                      this.setState({
                        formulas: evt.target.value,
                      })
                    }}
                    value={formulas}
                  />
              </Col>
            </Row>

          </Modal>
          // <Conditional
          //   getExistingFields={this.getExistingFields}
          //   onCancel={() => this.setState({ showConditional: false })}
          //   data={formulas}
          //   onSubmit={this.handleConditional}
          // />
        }
      </Layout.Content>
    )
  }
}

export default FilterRulesContent;
