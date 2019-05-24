import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { Modal, Form, Input, Checkbox, Cascader } from 'antd';
import { initModule, parseFields } from '../../utils/module';
import reduxKey from '../../constants/reduxKey';
import { updateModule, createModule, saveModuleFields, queryTables} from '../../data/graphql/module';
import './ModuleForm.less';

const prefix = 'bindo-galaxy-app-form';

@translate()
@Form.create()
class ModuleForm extends Component {

  state = {
    tableList: [],
  }

  loadTables = async (storeID) => {
    const map = new Map();

    const result = await queryTables({storeID});

    result.forEach(table => {
      const { database } = table;
      if (!map.has(database)) {
        map.set(database, {
          value: database,
          label: database,
          children: [],
        });
      }

      map.get(database).children.push({
        ...table,
        value: table.name,
        label: table.name,
      });
    });

    this.setState({
      tableList: [...map.values()],
    });
  }

  handleBindTableChange = (evt) => {
    const { checked } = evt.target;
    const { storeID } = this.props;
    const { tableList } = this.state;

    if (checked && tableList.length < 1) {
      this.loadTables(storeID);
    }
  }

  handleAppOk = () => {
    const { dispatch, onCallback, form } = this.props;

    form.validateFields(async (err, values) => {
      if (err) {
        return;
      }

      const { data } = this.props;
      let moduleData = data || {};

      const {
        moduleName,
        isBindTable,
        dbTable,
      } = values;

      let {
        appID,
        storeID,
      } = this.props;

      const moduleObj = {};

      if (moduleData.id) {
        moduleData.name = moduleName;
        ({appID, storeID} = moduleData);
      } else {
        moduleData = initModule({
          hasName: !isBindTable,
          isBindTable,
          appID,
          storeID,
          name: moduleName,
        });
      }

      moduleObj.template = moduleData.template;
      moduleObj.name = moduleData.name;
      moduleObj.appID = appID;

      if (isBindTable && dbTable && dbTable.length > 1) {
        moduleObj.tableInfo = {
          database: dbTable[0],
          tableName: dbTable[1],
        }
      }

      dispatch({
        type: reduxKey.UPDATE_GALAXY_REDUCER,
        payload: {
          galaxyLoading: true,
        },
      });

      try {
        if (moduleData.id) {
          await updateModule({
            storeID,
            id: data.id,
            input: moduleObj,
          });
        } else {
          const { id: moduleID } = await createModule({ storeID, input: moduleObj });
          const fields = parseFields(moduleData.fields);
          await saveModuleFields({storeID, moduleID, input: fields});
        }
        if (typeof onCallback === 'function') {
          onCallback();
        }
      } catch (error) {
        log.error(error);
        dispatch({
          type: reduxKey.UPDATE_GALAXY_REDUCER,
          payload: {
            galaxyLoading: false,
          },
        });
      }
    });
  }

  render() {

    const { t, form, data, tableList = [], appList= [], storeID} = this.props;
    const { getFieldDecorator, getFieldValue } = form;

    const {
      id: moduleID,
      name = null,
      tableInfo = {},
      // storeID = null,
      // appID = null,
    } = data || {};

    const {
      database = null,
      tableName = null,
    } = tableInfo || {};

    const isBindTable = (!!tableName) || getFieldValue('isBindTable') || false;
    const initStoreID = getFieldValue('storeID') || storeID;

    let editModule = false;
    if (moduleID) {
      editModule = true;
    }

    const apps = [];
    appList.forEach(app => {
      if (app.storeID === initStoreID) {
        apps.push(app);
      }
    });

    let dbTable = getFieldValue('dbTable');
    if (!dbTable) {
      if (database && tableName) {
        dbTable = [database, tableName];
      }
    }

    return (
      <Modal
        visible={true}
        title={moduleID ? t('common:module.edit') : t('common:module.new')}
        okText={t('common:ok')}
        cancelText={t('common:cancel')}
        onOk={this.handleAppOk}
        width="520px"
        {...this.props}
        bodyStyle={{padding: '0 24px', paddingTop: '10px'}}
      >
        <Form className={prefix}>
          <Form.Item label={t('common:module.name')}>
            {getFieldDecorator('moduleName', {
              initialValue: name,
              rules: [{
                required: true, message: t('common:module.nameInputError'),
              }],
            })(
              <Input placeholder={t('common:module.namePlaceholder')} />
            )}
          </Form.Item>
          {
            !editModule &&
            <Form.Item style={{margin: 0}}>
              {getFieldDecorator('isBindTable', {
                initialValue: isBindTable,
              })(
                <Checkbox
                  disabled={editModule}
                  checked={isBindTable}
                  onChange={this.handleBindTableChange}
                >
                {t('common:module.isBindTable')}
                </Checkbox>
              )}
            </Form.Item>
          }
          {
            !editModule && isBindTable &&
            <Form.Item label={t('common:dbTable')}>
              {getFieldDecorator('dbTable', {
                initialValue: dbTable,
                rules: [{
                  required: true, message: t('common:module.nameInputError'),
                }],
              })(
                <Cascader
                  showSearch
                  disabled={editModule}
                  options={tableList}
                  placeholder={t('common:module.tablePlaceholder')}
                />
              )}
            </Form.Item>
          }
        </Form>
      </Modal>
    );
  }
}

export default ModuleForm;
