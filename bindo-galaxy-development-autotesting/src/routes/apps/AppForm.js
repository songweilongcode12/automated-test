import React, { Component } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { Modal, Form, Input, Cascader, Row, Col, Icon as AntdIcon, Select } from 'antd'
import Icon from '../../components/Icon'
import iconsData from '../../data/IconsData'
import common from '../../constants/common'
import reduxKey from '../../constants/reduxKey'
import './AppForm.less'

const FormItem = Form.Item;

const prefix = 'bg-app-form';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

@translate()
@Form.create()
@connect(({ galaxy, app }) => ({ ...galaxy, ...app }))
class AppForm extends Component {
  state = {
    iconObj: [],
  }

  handleIconChange = value => {
    this.setState({
      iconObj: value,
    });
  }

  filterIcons = (value, path) => path.some(
    option => (option.label).toLowerCase().indexOf(value.toLowerCase()) > -1
  );

  handleAppOk = () => {
    const {
      form,
      dispatch,
      storeID,
      data,
      onCancel,
    } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const {
        icon_obj: iconObj,
        name,
        type,
      } = values;
      let icon = '';
      let iconType = '';
      if (iconObj && iconObj.length > 1) {
        iconType = iconObj[0] || '';
        icon = iconObj[1] || '';
      }

      const newData = {
        name,
        type,
        icon,
        iconType,
      };

      if (data.id) {
        dispatch({
          type: reduxKey.UPDATE_APP,
          payload: {
            storeID,
            id: data.id,
            data: {
              ...newData,
              i18n: data.i18n || {},
            },
            callback: () => onCancel(),
          },
        });
      } else {
        dispatch({
          type: reduxKey.CREATE_APP,
          payload: {
            storeID,
            data: {
              ...newData,
              i18n: {},
            },
            callback: () => onCancel(),
          },
        });
      }
    });
  }

  render() {

    const {
      t,
      form,
      galaxyLoading,
      data,
    } = this.props;
    const { getFieldDecorator } = form;

    const {
      id = null,
      name = null,
      icon = null,
      iconType = null,
      type = common.DEFAULT,
    } = data || {};

    let { iconObj: [ iconTypeValue, iconValue ] } = this.state;

    if (!iconValue) { iconValue = icon }
    if (!iconTypeValue) { iconTypeValue = iconType }

    let iconInitialValue = null;
    if (icon && iconType) {
      iconInitialValue = [iconType, icon];
    }

    return (
      <Modal
        visible={true}
        title={id ? t('common:app.edit') : t('common:app.new')}
        okText={t('common:ok')}
        cancelText={t('common:cancel')}
        onOk={this.handleAppOk}
        confirmLoading={galaxyLoading}
        width="420px"
        {...this.props}
        bodyStyle={{ paddingBottom: '0' }}
      >
        <Form className={prefix}>
          <FormItem label={t('common:name')} {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: name,
              rules: [{
                required: true, message: t('common:app.nameInputError'),
              }],
            })(
              <Input placeholder={t('common:app.namePlaceholder')} />
            )}
          </FormItem>
          <Form.Item label={t('common:type')} {...formItemLayout}>
            {getFieldDecorator('type', {
              initialValue: type,
              rules: [{
                required: true, message: t('common:menu.typeInputError'),
              }],
            })(
              <Select placeholder={t('common:menu.typePlaceholder')}>
                <Select.Option value={common.DEFAULT}>{t('common:appStore')}</Select.Option>
                <Select.Option value={common.SYSTEM}>{t('common:system')}</Select.Option>
                <Select.Option value={common.ENTERPRISE}>{t('common:enterprise')}</Select.Option>
              </Select>
            )}
          </Form.Item>
          <FormItem label={t('common:icon')} {...formItemLayout}>
            <Row>
              <Col span={18}>
                {getFieldDecorator('icon_obj', {
                  initialValue: iconInitialValue,
                  rules: [{
                    required: true, type: 'array', message: t('common:app.iconInputError'),
                  }],
                })(
                  <Cascader
                    options={iconsData}
                    showSearch={{ filter: this.filterIcons }}
                    placeholder={t('common:app.iconPlaceholder')}
                    onChange={this.handleIconChange}
                  />
                )}
              </Col>
              <Col span={6}>
                {
                  iconValue && iconTypeValue === 'antd' &&
                  <AntdIcon style={{ fontSize: '36px', marginLeft: '15px', marginTop: '2px' }} type={iconValue} />
                }
                {
                  iconValue && iconTypeValue === 'bindo' &&
                  <Icon style={{ fontSize: '36px', marginLeft: '15px', marginTop: '2px' }} type={iconValue} />
                }
              </Col>
            </Row>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default AppForm;
