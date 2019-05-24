import React, { Component } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import lodash from 'lodash'
import { Modal, Form, Input, Select, InputNumber, Checkbox, Cascader } from 'antd'
import {
  queryFields,
} from '../../data/graphql/module'
import {
  initModule,
  findStoreModules,
  findModule,
} from '../../utils/module'
import {
  filterOption,
} from '../../utils/galaxy'
import common from '../../constants/common'
import reduxKey from '../../constants/reduxKey'

@translate()
@Form.create()
@connect(({ galaxy }) => ({ ...galaxy }))
class MenuForm extends Component {

  state = {
    hiddenMenu: false,
    moduleAction: 'new',
    refreshData: true,
  }

  componentDidMount() {
    const {
      storeID,
      data,
    } = this.props || {};
    const {
      hidden,
    } = data;
    this.setState({ hiddenMenu: hidden })

    const moduleData = this.getModule();
    const {
      tableInfo,
      moduleParentID,
    } = moduleData;
    if (tableInfo && tableInfo.tableName) {
      this.loadTables(storeID);
    }

    if (typeof moduleParentID === 'string' && moduleParentID.length > 1) {
      this.setState({
        moduleAction: 'extends',
      })
    }
  }

  loadTables = async (storeID) => {
    const {
      dispatch,
      bindoTablesMap,
    } = this.props;

    dispatch({
      type: reduxKey.QUERY_BINDO_TABLES,
      payload: {
        storeID,
        bindoTablesMap,
        callback: () => {
          const {
            refreshData,
          } = this.state;
          this.setState({
            refreshData: !refreshData,
          })
        },
      },
    });
  }

  handleBindTableChange = (evt) => {
    const { checked } = evt.target;
    const {
      storeID,
      bindoTablesMap,
    } = this.props;

    if (checked && bindoTablesMap.size < 1) {
      this.loadTables(storeID);
    }
  }

  getModuleAction = (value) => {
    let { moduleAction } = this.state;
    moduleAction = value
    this.setState({ moduleAction })
  }

  handleOk = () => {
    const {
      form,
      storeID,
      appID,
      data,
      dispatch,
    } = this.props;
    const { hiddenMenu } = this.state
    form.validateFields(async (err, values) => {
      if (err) {
        return;
      }

      dispatch({
        type: reduxKey.UPDATE_GALAXY_REDUCER,
        payload: {
          galaxyLoading: true,
        },
      });

      const {
        name,
        type,
        embeddedType,
        embeddedUrl,
        tableauViewName,
        tableauWorkbookName,
        metabaseType,
        metabaseQuestion,
        moduleName,
        isBindTable,
        dbTable,
        moduleParentID,
        crossChain,
      } = values;

      const menuObj = {
        parentID: '0',
        name,
        type,
        appID,
        i18n: {},
        moduleID: '0',
      }

      // menu隐藏属性单独处理

      if (type === common.SUBMENU) {
        menuObj.hidden = hiddenMenu
      }

      if (embeddedType === common.URL) {
        menuObj.embeddedConfig = {
          embeddedType,
          embeddedValue: embeddedUrl,
        }
      }

      if (embeddedType === common.TABLEAU) {
        menuObj.embeddedConfig = {
          embeddedType,
          embeddedValue: JSON.stringify({
            viewName: tableauViewName,
            workbookName: tableauWorkbookName,
          }),
        }
      }

      if (embeddedType === common.METABASE) {
        let metabaseValueKey = common.METABASE_QUESTION;
        if (metabaseType === common.METABASE_DASHBOARD) {
          metabaseValueKey = common.METABASE_DASHBOARD;
        }
        menuObj.embeddedConfig = {
          embeddedType,
          embeddedValue: JSON.stringify({
            [metabaseValueKey]: metabaseQuestion,
          }),
        }
      }

      const { id } = data || {};
      const moduleObj = {};
      let moduleData = lodash.cloneDeep(this.getModule());

      if (type === common.MODULE || type === common.SETTING) {
        if (id) { // Update menu
          moduleData.name = moduleName;
        } else { // Create menu
          let fieldSet = new Set();
          if (isBindTable && dbTable && dbTable.length > 1) {
            moduleObj.tableInfo = {
              database: dbTable[0],
              tableName: dbTable[1],
            }

            const fields = await queryFields({storeID, tableInfo: moduleObj.tableInfo});
            if (fields && fields.length > 0) {
              fields.forEach(field => {
                if (field && (field.name === 'created_at' || field.name === 'updated_at')) {
                  fieldSet.add(field.name);
                }
              });
            }
          } else {
            fieldSet = new Set(['name', 'created_at', 'updated_at']);
          }
          if ((typeof moduleParentID === 'string') && moduleParentID.length > 0) {
            const fields = this.getModuleFields(moduleParentID)

            if (Array.isArray(fields)) {
              fields.forEach(item => {
                if (fieldSet.has(item.name)) {
                  fieldSet.delete(item.name);
                }
              });
            }
          }

          moduleData = initModule({
            hasName: !isBindTable,
            isBindTable,
            fieldSet,
            appID,
            storeID,
            name: moduleName,
          });
        }

        moduleObj.template = moduleData.template;
        moduleObj.name = moduleData.name;
        moduleObj.appID = appID;
        if ( typeof moduleParentID === 'string' && moduleParentID.length > 0) {
          moduleObj.moduleParentID = moduleParentID;
        }

        if (type === common.MODULE) {
          moduleObj.crossChain = crossChain || false;
        }

        if (id) { // Update module
          dispatch({
            type: reduxKey.UPDATE_MODULE,
            payload: {
              storeID,
              id: data.moduleID,
              data: moduleObj,
              callback: (newModule) => {
                if (lodash.isObject(newModule)) {
                  menuObj.moduleID = newModule.id;
                  this.createOrUpdateMenu({
                    storeID,
                    menuID: id,
                    data: menuObj,
                  });
                } else {
                  dispatch({
                    type: reduxKey.UPDATE_GALAXY_REDUCER,
                    payload: {
                      galaxyLoading: false,
                    },
                  });
                }
              },
            },
          });
        } else { // Create module
          dispatch({
            type: reduxKey.CREATE_MODULE,
            payload: {
              storeID,
              data: moduleObj,
              fields: moduleData.fields,
              callback: (newModule) => {
                if (lodash.isObject(newModule)) {
                  menuObj.moduleID = newModule.id;
                  this.createOrUpdateMenu({
                    storeID,
                    menuID: id,
                    data: menuObj,
                  });
                } else {
                  dispatch({
                    type: reduxKey.UPDATE_GALAXY_REDUCER,
                    payload: {
                      galaxyLoading: false,
                    },
                  });
                }
              },
            },
          });
        }
      } else { // wikiOnly ...

        this.createOrUpdateMenu({
          storeID,
          menuID: id,
          data: menuObj,
        });
      }
    });
  }

  createOrUpdateMenu = ({storeID, menuID, data}) => {
    const {
      dispatch,
      onCancel,
    } = this.props;

    if (menuID) {
      dispatch({
        type: reduxKey.UPDATE_MENU,
        payload: {
          storeID,
          menuID,
          data,
          callback: () => {
            dispatch({
              type: reduxKey.UPDATE_GALAXY_REDUCER,
              payload: {
                galaxyLoading: false,
              },
            });
            onCancel();
          },
        },
      });
    } else {
      dispatch({
        type: reduxKey.CREATE_MENU,
        payload: {
          storeID,
          data,
          callback: () => {
            dispatch({
              type: reduxKey.UPDATE_GALAXY_REDUCER,
              payload: {
                galaxyLoading: false,
              },
            });
            onCancel();
          },
        },
      });
    }
  }

  parseEmbeddedValue = (value) => {
    let result = value;

    if (!result) {
      result = '{}';
    }

    if (typeof result === 'string' && !result.startsWith('{')) {
      result = '{}';
    }

    return result;
  }

  handleMenuHidden = (checked) => {
    this.setState({
      hiddenMenu: checked,
    })
  }

  getModule = () => {
    let moduleData = {};
    const {
      data: {
        moduleID,
        type,
      } = {},
      storeID,
      appID,
    } = this.props || {};

    if (moduleID && (type === common.MODULE || type === common.SETTING) ) {
      moduleData = findModule({
        props: this.props,
        storeID,
        appID,
        moduleID,
      });
    }

    return moduleData;
  }

  getModuleFields = (moduleID) => {
    const {
      storeID,
      appID,
    } = this.props;

    const moduleData = findModule({
      props: this.props,
      storeID,
      appID,
      moduleID,
    });

    const fields= []

    if (lodash.isObject(moduleData) && Array.isArray(moduleData.fields)) {
      fields.push(...moduleData.fields);
    }

    return fields;
  }

  render() {

    const {
      t,
      form,
      galaxyLoading,
      data,
      storeID,
      bindoTablesMap,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;

    const {
      hiddenMenu = false,
      moduleAction,
    } = this.state;

    const tableList = [];
    if (bindoTablesMap.size > 0) {
      tableList.push(...bindoTablesMap.values())
    }
    const {
      id = null,
      name = null,
      type = common.MODULE,
      embeddedConfig,
    } = data || {};

    const moduleData = this.getModule();

    const {
      name: moduleName = null,
      moduleParentID,
      tableInfo = {},
      crossChain,
    } = moduleData;

    const {
      database = null,
      tableName = null,
    } = tableInfo || {};

    const {
      embeddedType = null,
      embeddedValue: {
        Data: embeddedValue = null,
      } = {},
    } = embeddedConfig || {};
    let disabled = false;
    if (data.id) {
      disabled = true;
    }
    let dbTable = getFieldValue('dbTable');
    if (!dbTable) {
      if (database && tableName) {
        dbTable = [database, tableName];
      }
    }
    const menuType = getFieldValue('type') || type;
    const moduleCrossChain = getFieldValue('crossChain') || crossChain;
    const isBindTable = (!!tableName) || getFieldValue('isBindTable') || false;
    let saveDisable = false
    if (data.id && (type === common.MODULE || type === common.SETTING)) {
      if (isBindTable) {
        saveDisable = !moduleData.id || tableList.length < 1
      } else {
        saveDisable = !moduleData.id
      }
    }
    let isEmbeddedType = false;
    let isMenuFolder = false;
    let embeddedTypeTemp = null;
    let embeddedUrl = null;
    let tableauWorkbookName = null;
    let tableauViewName = null;
    let metabaseQuestion = null;
    let metabaseType = common.METABASE_QUESTION;

    if (menuType === common.EMBEDDED) {
      isEmbeddedType = true;
      embeddedTypeTemp = getFieldValue('embeddedType') || embeddedType || common.URL;

      if (embeddedTypeTemp === common.URL) {
        embeddedUrl = getFieldValue('embeddedUrl') || embeddedValue;
      } else if (embeddedTypeTemp === common.TABLEAU) {
        const embeddedValueTemp = JSON.parse(this.parseEmbeddedValue(embeddedValue));
        tableauWorkbookName = getFieldValue('tableauWorkbookName') || embeddedValueTemp.workbookName;
        tableauViewName = getFieldValue('tableauViewName') || embeddedValueTemp.viewName;
      } else if (embeddedTypeTemp === common.METABASE) {
        const embeddedValueTemp = JSON.parse(this.parseEmbeddedValue(embeddedValue));
        // eslint-disable-next-line no-prototype-builtins
        if (embeddedValueTemp.hasOwnProperty(common.METABASE_QUESTION)) {
          metabaseType = getFieldValue('metabaseType') || common.METABASE_QUESTION;
          metabaseQuestion = getFieldValue('metabaseQuestion') || embeddedValueTemp[common.METABASE_QUESTION];
        } else {
          metabaseType = getFieldValue('metabaseType') || common.METABASE_DASHBOARD;
          metabaseQuestion = getFieldValue('metabaseQuestion') || embeddedValueTemp[common.METABASE_DASHBOARD];
        }
      }
    }

    if (menuType === common.SUBMENU) {
      isMenuFolder = true
    }

    const bindingModule = menuType === common.MODULE || menuType === common.SETTING;
    const onlyModule = menuType === common.MODULE;
    const showParent = moduleAction === 'extends';

    return (
      <Modal
        visible={true}
        title={id ? t('common:menu.edit') : t('common:menu.new')}
        cancelText={t('common:cancel')}
        okText={t('common:save')}
        onOk={this.handleOk}
        okButtonProps={{disabled: saveDisable}}
        confirmLoading={galaxyLoading}
        bodyStyle={{padding: '0 24px', paddingTop: '10px'}}
        width="620px"
        {...this.props}
      >
        <Form>
          <Form.Item label={t('common:name')}>
            {getFieldDecorator('name', {
              initialValue: name,
              rules: [{
                required: true, message: t('common:menu.nameInputError'),
              }],
            })(
              <Input placeholder={t('common:menu.namePlaceholder')} />
            )}
          </Form.Item>
          <Form.Item label={t('common:type')}>
          {getFieldDecorator('type', {
            initialValue: type,
            rules: [{
              required: true, message: t('common:menu.typeInputError'),
            }],
          })(
            <Select disabled={disabled} placeholder={t('common:menu.typePlaceholder')}>
              <Select.Option value={common.MODULE}>{t('common:menu.module')}</Select.Option>
              <Select.Option value={common.SUBMENU}>{t('common:menu.menuFolder')}</Select.Option>
              <Select.Option value={common.EMBEDDED}>{t('common:menu.embedded')}</Select.Option>
              <Select.Option value={common.SETTING}>{t('common:menu.settings')}</Select.Option>
              <Select.Option value={common.WIKI_ONLY}>{t('common:menu.wikiOnly')}</Select.Option>
            </Select>
          )}
          </Form.Item>
          {
            onlyModule &&
            <Form.Item label={t('common:menu:initialization')}>
              <Select
                onChange={value => this.getModuleAction(value)}
                value={moduleAction}
                disabled={disabled}
              >
                <Select.Option value='new'>{t('common:menu.newModule')}</Select.Option>
                {/* <Select.Option value='dbTable'>{t('common:module.isBindTable')}</Select.Option> */}
                <Select.Option value='extends'>{t('common:menu.inheritedModule')}</Select.Option>
              </Select>
            </Form.Item>
          }
          {
            showParent &&
            <Form.Item label={t('common:menu.moduleParentID')}>
              {getFieldDecorator('moduleParentID', {
                initialValue: moduleParentID,
                rules: [{
                  required: true, message: t('common:menu.moduleParentIDInputError'),
                }],
              })(
                <Select
                  disabled={disabled}
                  showSearch
                  optionFilterProp="children"
                  filterOption={filterOption}
                >
                 {
                    findStoreModules({
                      props: this.props,
                      storeID,
                    }).map(item =>
                      <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                    )
                 }
                </Select>
              )}
            </Form.Item>
          }
          {
            isMenuFolder &&
            <Form.Item>
              {getFieldDecorator('hidden', {
                initialValue: hiddenMenu,
              })(
                <Checkbox
                  checked={hiddenMenu}
                  onChange={({target}) => this.handleMenuHidden(target.checked)}
                >
                  {t('common:module.hidden')}
                </Checkbox>
              )}
            </Form.Item>
          }
          {
            bindingModule &&
            <Form.Item label={t('common:module.name')}>
              {getFieldDecorator('moduleName', {
                initialValue: moduleName,
                rules: [{
                  required: true, message: t('common:module.nameInputError'),
                }],
              })(
                <Input placeholder={t('common:module.namePlaceholder')} />
              )}
            </Form.Item>
          }
          {
            bindingModule &&
            <Form.Item style={{margin: 0}}>
              {getFieldDecorator('isBindTable', {
                initialValue: isBindTable,
              })(
                <Checkbox
                  disabled={disabled}
                  checked={isBindTable}
                  onChange={this.handleBindTableChange}
                >
                  {t('common:module.isBindTable')}
                </Checkbox>
              )}
            </Form.Item>
          }
          {
            bindingModule && isBindTable &&
            <Form.Item label={t('common:dbTable')}>
              {getFieldDecorator('dbTable', {
                initialValue: dbTable,
                rules: [{
                  required: true, message: t('common:module.nameInputError'),
                }],
              })(
                <Cascader
                  disabled={disabled}
                  showSearch
                  options={tableList}
                  placeholder={t('common:module.tablePlaceholder')}
                />
              )}
            </Form.Item>
          }
          {
            onlyModule &&
            <Form.Item style={{margin: 0}}>
              {getFieldDecorator('crossChain', {
                initialValue: moduleCrossChain,
              })(
                <Checkbox
                  checked={moduleCrossChain}
                >
                  {t('common:module.crossChain')}
                </Checkbox>
              )}
            </Form.Item>
          }
          {
            isEmbeddedType &&
            <Form.Item label={t('common:menu.embeddedType')}>
              {getFieldDecorator('embeddedType', {
                initialValue: embeddedTypeTemp,
                rules: [{
                  required: true, message: t('common:menu.embeddedTypeInputError'),
                }],
              })(
                <Select placeholder={t('common:menu.embeddedTypePlaceholder')}>
                  <Select.Option value={common.URL}>Url</Select.Option>
                  <Select.Option value={common.TABLEAU}>Tableau</Select.Option>
                  <Select.Option value={common.METABASE}>Metabase</Select.Option>
                </Select>
              )}
            </Form.Item>
          }
          {
            embeddedTypeTemp === common.URL &&
            <Form.Item label={t('common:menu.embeddedUrl')}>
              {getFieldDecorator('embeddedUrl', {
                initialValue: embeddedUrl,
                rules: [{
                  required: true, message: t('common:menu.embeddedUrlInputError'),
                }, {
                  type: 'url', message: t('common:menu.embeddedUrlMustError'),
                }],
              })(
                <Input.TextArea placeholder={t('common:menu.embeddedUrlPlaceholder')} />
              )}
            </Form.Item>
          }
          {
            embeddedTypeTemp === common.TABLEAU &&
            <Form.Item label={t('common:menu.tableauWorkbookName')}>
              {getFieldDecorator('tableauWorkbookName', {
                initialValue: tableauWorkbookName,
                rules: [{
                  required: true, message: t('common:menu.tableauWorkbookNameInputError'),
                }],
              })(
                <Input placeholder={t('common:menu.tableauWorkbookNamePlaceholder')} />
              )}
            </Form.Item>
          }
          {
            embeddedTypeTemp === common.TABLEAU &&
            <Form.Item label={t('common:menu.tableauViewName')}>
              {getFieldDecorator('tableauViewName', {
                initialValue: tableauViewName,
                rules: [{
                  required: true, message: t('common:menu.tableauViewNameInputError'),
                }],
              })(
                <Input placeholder={t('common:menu.tableauViewNamePlaceholder')} />
              )}
            </Form.Item>
          }
          {
            embeddedTypeTemp === common.METABASE &&
            <Form.Item label={t('common:menu.metabaseType')}>
              {getFieldDecorator('metabaseType', {
                initialValue: metabaseType,
                rules: [{
                  required: true, message: t('common:menu.metabaseTypeInputError'),
                }],
              })(
                <Select placeholder={t('common:menu.metabaseTypePlaceholder')}>
                  <Select.Option value={common.METABASE_QUESTION}>Question</Select.Option>
                  <Select.Option value={common.METABASE_DASHBOARD}>Dashboard</Select.Option>
                </Select>
              )}
            </Form.Item>
          }
          {
            embeddedTypeTemp === common.METABASE &&
            <Form.Item label={t('common:menu.metabaseID')}>
              {getFieldDecorator('metabaseQuestion', {
                initialValue: metabaseQuestion,
                rules: [{
                  required: true, message: t('common:menu.metabaseIDInputError'),
                }],
              })(
                <InputNumber />
              )}
            </Form.Item>
          }
        </Form>
      </Modal>
    );
  }
}

export default MenuForm;
