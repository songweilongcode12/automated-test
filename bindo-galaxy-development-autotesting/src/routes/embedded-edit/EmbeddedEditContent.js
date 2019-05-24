import React, { Component } from 'react'
import {
  Form,
  Input,
  Select,
  InputNumber,
} from 'antd'
import {
  parseParams,
} from '../../utils/galaxy'
import common from '../../constants/common'
import { findMenu } from '../../utils/menu';

const prefix = 'bg-r-embedded-edit';
const galaxyPrefix = 'bg-galaxy';

class EmbeddedEditContent extends Component {
  state = {
    menuData: null,
  }

  componentDidMount() {
    this.queryMenuData(this.props);
  }

  shouldComponentUpdate(nextProps) {
    const { menuID } = parseParams(this.props);
    const { menuID: nextMenuID } = parseParams(nextProps);

    if (menuID !== nextMenuID) {
      this.queryMenuData(nextProps);
    }

    return true;
  }

  queryMenuData = async props => {
    const {
      storeID,
      appID,
      menuID,
    } = parseParams(props);

    const {
      onResetState,
    } = props;
    onResetState({
      loadingContent: true,
    });

    let menuData = null;
    try {
      menuData = findMenu({
        props: this.props,
        storeID,
        appID,
        menuID,
      })

      this.setFieldsValue(menuData);
      this.setState({ menuData });
    } catch (error) {
      log.error(error);
    }

    onResetState({
      menuData,
      loadingContent: false,
    });
  }

  setFieldsValue = (menuData) => {
    const { form } = this.props;
    const { embeddedConfig } = menuData;
    const {
      embeddedType = null,
      embeddedValue: {
        Data: embeddedValue = null,
      } = {},
    } = embeddedConfig || {};

    if (embeddedType === common.URL) {
      form.setFieldsValue({embeddedType});
      form.setFieldsValue({embeddedUrl: embeddedValue});
    }

    if (embeddedType === common.TABLEAU) {
      form.setFieldsValue({embeddedType});

      if (embeddedValue) {
        const {workbookName, viewName} = JSON.parse(this.parseEmbeddedValue(embeddedValue));
        form.setFieldsValue({tableauWorkbookName: workbookName});
        form.setFieldsValue({tableauViewName: viewName});
      }
    }

    if (embeddedType === common.METABASE) {
      form.setFieldsValue({embeddedType});

      const paramsData = JSON.parse(this.parseEmbeddedValue(embeddedValue));

      // eslint-disable-next-line no-prototype-builtins
      if (paramsData.hasOwnProperty(common.METABASE_QUESTION)) {
        form.setFieldsValue({metabaseType: common.METABASE_QUESTION});
        form.setFieldsValue({metabaseQuestion: paramsData[common.METABASE_QUESTION]});
      // eslint-disable-next-line no-prototype-builtins
      } else if (paramsData.hasOwnProperty(common.METABASE_DASHBOARD)) {
        form.setFieldsValue({metabaseType: common.METABASE_DASHBOARD});
        form.setFieldsValue({metabaseQuestion: paramsData[common.METABASE_DASHBOARD]});
      }
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

  render() {
    const {
      t,
      form,
    } = this.props;

    const { menuData } = this.state;
    const { getFieldDecorator, getFieldValue } = form;

    const { embeddedConfig } = menuData || {};

    let embeddedUrl = null;
    let tableauWorkbookName = null;
    let tableauViewName = null;
    let metabaseQuestion = null;
    let metabaseType = common.METABASE_QUESTION;

    const {
      embeddedType = null,
      embeddedValue: {
        Data: embeddedValue = null,
      } = {},
    } = embeddedConfig || {};

    const embeddedTypeTemp = getFieldValue('embeddedType') || embeddedType || common.URL;

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

    return (
      <div className={`${galaxyPrefix}-content ${prefix}-content`}>
        {
          menuData &&
          <Form>
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
        }
      </div>
    );
  }
}

export default EmbeddedEditContent;
