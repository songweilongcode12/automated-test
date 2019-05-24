import React, { Component }from 'react';
import { Modal, Select, Form } from 'antd';
import { filterOption } from '../../utils/galaxy'

@Form.create()
class SelectStoreAndApp extends Component {

  handleSelecteChange = (key, value) => {
    const { onSelecteChange } = this.props
    onSelecteChange(key, value)
  }

  handleClickOk = () => {
    const { onOkClick, form} = this.props
    form.validateFields(async (err, values) => {
      if (err) {
        return;
      }

      const {storeID, appID} = values
      if (storeID && appID) {
        onOkClick()
      }
    })
  }

  render () {
    const {
      t,
      stores,
      appList,
      storeID,
      appID,
      onCancelClick,
      form,
    } = this.props

    const apps = [];
    appList.forEach(app => {
      if (app.inStoreID === storeID) {
        apps.push(app);
      }
    });
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={true}
        title={t('common:module.selectStoreAndApp')}
        okText={t('common:yes')}
        cancelText={t('common:no')}
        okButtonProps={{ disabled: !storeID }}
        onOk={this.handleClickOk}
        onCancel={onCancelClick}
      >
        <Form>
          <Form.Item label={t('common:app.store')}>
          {getFieldDecorator('storeID',{
            initialValue: storeID,
            rules: [{
              required: true, message: t('common:menu.storeInputError'),
            }],
          })(
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={filterOption}
              onChange={value => this.handleSelecteChange('storeID', value)}
              placeholder={t('common:menu.storePlaceholder')}
            >
              {
                stores.map(store => (
                  <Select.Option
                    key={store.id}
                    value={store.id}
                  >
                    {store.title}
                  </Select.Option>
                ))
              }
            </Select>
          )}
          </Form.Item>
          <Form.Item label={t('common:app.name')}>
          {getFieldDecorator('appID',{
            initialValue: appID,
            rules: [{
              required: true, message: t('common:app.nameInputError'),
            }],
          })(
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={filterOption}
              onChange={value => this.handleSelecteChange('appID', value)}
              placeholder={t('common:app.namePlaceholder')}
            >
            {
            apps.map(app => (
            <Select.Option
              key={app.id}
              value={app.id}
            >
              {app.name}
            </Select.Option>
            ))
            }
            </Select>
          )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
export default SelectStoreAndApp
