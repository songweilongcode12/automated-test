/**
 * action表单的内容
 */

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Form,
  Button,
  Input,
  Select,
  Checkbox,
  Tooltip,
  Icon as AntdIcon,
} from 'antd';
import Layout from '../../Layout';
import Breadcrumb from '../../Breadcrumb';
import {
  parseParams,
  createRouteUrl,
} from '../../../utils/galaxy';
import {
  findModule,
} from '../../../utils/module';
import routes from '../../../constants/routes';
import common from '../../../constants/common';
import reduxKey from '../../../constants/reduxKey';
import ActionTodoArea from './ActionTodoArea';
import { createScript, updateScript, queryScript } from '../../../data/graphql/action';
import actionConstans from '../../../constants/action';

const galaxyPrefix = 'bg-galaxy';

@Form.create()
class ActionContent extends Component {

  state = {
    actionValue: {},
    content: '',
    module,
  }

  componentDidMount () {
    const {
      action,
      storeID,
      appID,
      moduleID,
    } = parseParams(this.props);

    if (action !== 'new') {
      this.loadRecord({
        props: this.props,
      });
    }

    const module = findModule({
      props: this.props,
      storeID,
      appID,
      moduleID,
    });

    this.setState({
      module,
    })
  }

  loadRecord = async ({ props }) => {
    const {
      dispatch,
    } = props;

    const { recordID, storeID } = parseParams(props);

    if (recordID) {
      dispatch({
        type: reduxKey.UPDATE_GALAXY_REDUCER,
        payload: {
          galaxyLoading: true,
        },
      });

      try {
        const actionValue = await queryScript({
          storeID,
          scriptID: recordID,
        })

        this.setState({
          actionValue,
          content: actionValue.content,
        })
      } catch (e) {
        log.error(e)
      }

      dispatch({
        type: reduxKey.UPDATE_GALAXY_REDUCER,
        payload: {
          galaxyLoading: false,
        },
      });
    }
  }

  getCodeContent = (value) => {
    this.setState({
      content: value,
    })
  }

  handleSubmit = () => {
    const { storeID } = parseParams(this.props);

    const {
      moduleID,
      appID,
    } = parseParams(this.props);

    const {
      form,
      history,
    } = this.props;

    const {
      actionValue,
      content,
    } = this.state;

    form.validateFields(async (err, values) => {

      if (err) {
        return;
      }

      const { id } = actionValue || {};

      // action 现在无需export template类型, 应为buttonType: 'customEvent',
      values.buttonType = 'customEvent'

      const scriptObj = {
        moduleID,
        appID,
        content,
        ...values,
      };

      if (id) { // update script
        const { id: scriptId } = await updateScript({
          id,
          storeID,
          input: scriptObj,
        });
        if (typeof scriptId === 'string' && scriptId.length > 0) {
          history.push({
            pathname: createRouteUrl(
              routes.ACTION,
              {},
              this.props
            ),
          });
        }
      } else { // create script
        const { id: scriptId } = await createScript({
          storeID,
          input: scriptObj,
        });
        if (typeof scriptId === 'string' && scriptId.length > 0) {
          history.push({
            pathname: createRouteUrl(
              routes.ACTION,
              {},
              this.props
            ),
          });
        }
      }
    })
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
      actionValue,
      content,
      module,
    } = this.state;

    const {
      actionName,
      actionType,
      triggerCondition,
      enabled,
      cronSchedule,
    } = actionValue || {};

    let {
      actionToDo = actionConstans.EXECUTEPYTHONCODE,
    } = actionValue || {};

    const cronHelp = (
      <div>
        <p>0 0 12 * * ?--每天中午12点触发</p>
        <p> 0 15 10 ? * MON-FRI--周一至周五的上午10:15触发</p>
        <p>0 15 10 15 * ?--每月15日上午10:15触发</p>
        <p> 0 15 10 ? * 6L 2002-2005--2002年至2005年的每月的最后一个星期五上午10:15触发</p>
      </div>
    )

    const actionTypeIsAutomated = getFieldValue('actionType') === actionConstans.AUTOMATED || false;

    const actionTypeIsScheduled = getFieldValue('actionType') === actionConstans.SCHEDULE || false;

    const actionTypeIsPopOver = getFieldValue('actionType') === actionConstans.POPOVER || false;

    let chooseActionToDoType = getFieldValue('actionToDo') || actionConstans.EXECUTEPYTHONCODE;

    // 若为popOver 则固定actionTodo的类型
    if (actionTypeIsPopOver) {
      actionToDo = 'liquidTemplate';
      chooseActionToDoType = actionConstans.LIQUIDTEMPLATE;
    }

    const { action } = parseParams(this.props);

    const actionIsEdit = action === 'edit';

    const {
      fields = [],
    } = module;

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
            <Form.Item label={t('common:module.actionName')} colon={false}>
              {getFieldDecorator('actionName', {
                initialValue: actionName,
                rules: [{
                  required: true, message: t('common:module.actionNameInputError'),
                }],
              })(
                <Input placeholder={t('common:module.actionNamePlaceholder')} disabled={actionIsEdit} />
              )}
            </Form.Item>

            <Form.Item label={t('common:module.actionType')} colon={false}>
              {getFieldDecorator('actionType', {
                initialValue: actionType,
                rules: [{
                  required: true, message: t('common:module.actionTypeInputError'),
                }],
              })(
                <Select placeholder={t('common:module.actionTypePlaceholder')} disabled={actionIsEdit}>
                  <Select.Option key={actionConstans.AUTOMATED} value={actionConstans.AUTOMATED}>{t('common:module.automated')}</Select.Option>
                  <Select.Option key={actionConstans.SCHEDULE} value={actionConstans.SCHEDULE}>{t('common:module.scheduled')}</Select.Option>
                  <Select.Option key={actionConstans.MANUALLY} value={actionConstans.MANUALLY}>{t('common:module.manually')}</Select.Option>
                  <Select.Option key={actionConstans.POPOVER} value={actionConstans.POPOVER}>{t('common:module.popOver')}</Select.Option>
                </Select>
              )}
            </Form.Item>

            {
              actionTypeIsScheduled &&
              <Form.Item
                label={
                  <Tooltip key="tooltip" title={cronHelp} placement='rightTop'>
                    <span>{t('common:module.cronSchedule')}</span>
                    <AntdIcon
                      type="info-circle"
                      style={{marginLeft: 4, color: '#40a9ff'}}
                    />
                  </Tooltip>
                }
                colon={false}
              >
                {getFieldDecorator('cronSchedule', {
                  initialValue: cronSchedule,
                  rules: [{
                    required: true, message: t('common:module.cronScheduleInputError'),
                  }],
                })(
                  <Input placeholder={t('common:module.cronSchedulePlaceholder')} />
                )}
              </Form.Item>
            }

            {
              actionTypeIsAutomated &&
              <Form.Item label={t('common:module.triggerCondition')} colon={false}>
                {getFieldDecorator('triggerCondition', {
                  initialValue: triggerCondition,
                  rules: [{
                    required: true, message: t('common:module.triggerConditionInputError'),
                  }],
                })(
                  <Select placeholder={t('common:module.triggerConditionPlaceholder')}>
                    <Select.Option key={actionConstans.BEFORECREATE} value={actionConstans.BEFORECREATE}>{t('common:module.beforeCreate')}</Select.Option>
                    <Select.Option key={actionConstans.AFTERCREATE} value={actionConstans.AFTERCREATE}>{t('common:module.afterCreate')}</Select.Option>
                    <Select.Option key={actionConstans.BEFOREUPDATE} value={actionConstans.BEFOREUPDATE}>{t('common:module.beforeUpdate')}</Select.Option>
                    <Select.Option key={actionConstans.AFTERUPDATE} value={actionConstans.AFTERUPDATE}>{t('common:module.afterUpdate')}</Select.Option>
                    <Select.Option key={actionConstans.BEFOREDELETE} value={actionConstans.BEFOREDELETE}>{t('common:module.beforeDelete')}</Select.Option>
                    <Select.Option key={actionConstans.AFTERDELETE} value={actionConstans.AFTERDELETE}>{t('common:module.afterDelete')}</Select.Option>
                    <Select.Option key={actionConstans.BEFOREIMPORT} value={actionConstans.BEFOREIMPORT}>{t('common:module.beforeImport')}</Select.Option>
                    <Select.Option key={actionConstans.AFTERIMPORT} value={actionConstans.AFTERIMPORT}>{t('common:module.afterImport')}</Select.Option>
                    <Select.Option key={actionConstans.BEFOREQUERY} value={actionConstans.BEFOREQUERY}>{t('common:module.beforeQuery')}</Select.Option>
                    <Select.Option key={actionConstans.AFTERQUERY} value={actionConstans.AFTERQUERY}>{t('common:module.afterQuery')}</Select.Option>
                  </Select>
                )}
              </Form.Item>
            }

            <Form.Item>
              {getFieldDecorator('enabled', {
                initialValue: enabled || false,
                // rules: [{
                //   required: true, message: t('common:module.actionTodoInputError'),
                // }],
              })(
                <Checkbox>
                  {t('common:module.enabled')}
                </Checkbox>
              )}
            </Form.Item>

            <Form.Item label={t('common:module.actionTodo')} colon={false}>
              {getFieldDecorator('actionToDo', {
                initialValue: actionToDo,
                rules: [{
                  required: true, message: t('common:module.actionTodoInputError'),
                }],
              })(
                <Select
                  placeholder={t('common:module.actionTodoPlaceholder')}
                  disabled={actionTypeIsPopOver}
                >
                  <Select.Option key={actionConstans.EXECUTEPYTHONCODE} value={actionConstans.EXECUTEPYTHONCODE}>{t('common:module.executePythonCode')}</Select.Option>
                  <Select.Option key={actionConstans.CREATENEWRECORD} value={actionConstans.CREATENEWRECORD}>{t('common:module.createNewRecord')}</Select.Option>
                  <Select.Option key={actionConstans.UPDATENEWRECORD} value={actionConstans.UPDATENEWRECORD}>{t('common:module.updateNewRecord')}</Select.Option>
                  <Select.Option key={actionConstans.SENDEMAIL} value={actionConstans.SENDEMAIL}>{t('common:module.sendEmail')}</Select.Option>
                  <Select.Option key={actionConstans.ADDFOLLOWERS} value={actionConstans.ADDFOLLOWERS}>{t('common:module.addFollowers')}</Select.Option>
                  <Select.Option key={actionConstans.CREATENEWACTIVITY} value={actionConstans.CREATENEWACTIVITY}>{t('common:module.createNewActivity')}</Select.Option>
                  <Select.Option key={actionConstans.LIQUIDTEMPLATE} value={actionConstans.LIQUIDTEMPLATE}>{t('common:module.liquidTemplate')}</Select.Option>
                  <Select.Option key={actionConstans.OPENUPSTREAMING} value={actionConstans.OPENUPSTREAMING}>{t('common:module.openUpStreaming')}</Select.Option>
                </Select>
              )}
            </Form.Item>
            {
              (chooseActionToDoType === actionConstans.EXECUTEPYTHONCODE || chooseActionToDoType === actionConstans.LIQUIDTEMPLATE) &&
              <Form.Item>
                <span>{chooseActionToDoType}</span>
                <ActionTodoArea
                  getCodeContent={this.getCodeContent}
                  value={content}
                  chooseActionToDoType={chooseActionToDoType}
                  {...this.props}
                />
              </Form.Item>
            }
            {
              chooseActionToDoType === actionConstans.OPENUPSTREAMING &&
              <Form.Item
                label={t('common:module.streamingUrl')}
                colon={false}
              >
                <Select
                  placeholder={t('common:module.streamingUrlPlaceholder')}
                  onChange={value => {this.setState({
                    content: value,
                  })}}
                  value={content}
                >
                  {
                    fields.map(item => (
                      <Select.Option
                        key={item.uuid}
                        value={item.name}
                      >
                        {item.name}
                      </Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
            }
          </Form>
        </div>
        <div className={`${galaxyPrefix}-footer`}>
          <span>Overview</span>
          <Button
            type="primary"
            className={`${galaxyPrefix}-btn`}
            loading={galaxyLoading}
            onClick={this.handleSubmit}
          >
            {t('common:save')}
          </Button>
        </div>
      </Layout.Content>
    )
  }
}

export default ActionContent
