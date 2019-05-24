import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { Modal, Form, Select } from 'antd'
import { filterOption } from '../../../utils/galaxy'
import { findStoreModules } from '../../../utils/module';

const FormItem = Form.Item;

const prefix = 'bg-app-form';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

@translate()
@Form.create()
class InsertManyToManyModal extends Component {
  state = {
    moduleList: [],
  }

  componentDidMount() {
    const { storeID } = this.props
    const moduleList = findStoreModules({
      props: this.props,
      storeID,
    })

    this.setState({
      moduleList,
    })
  }

  handleOk = () => {
    const { form, onSubmitData } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const {
        moduleID,
      } = values;

      if (typeof onSubmitData === 'function') {
        onSubmitData({
          linkedModuleID: moduleID,
        })
      }
    });
  }

  render() {

    const { t, form } = this.props;
    const { getFieldDecorator } = form;
    const { moduleList } = this.state;

    return (
      <Modal
        visible={true}
        title={t('common:editor.fieldProperties')}
        okText={t('common:ok')}
        cancelText={t('common:cancel')}
        onOk={this.handleOk}
        width="420px"
        {...this.props}
        bodyStyle={{ paddingBottom: '0' }}
      >
        <Form className={prefix}>
          <FormItem label={t('common:editor.module')} {...formItemLayout}>
            {getFieldDecorator('moduleID', {
              rules: [{
                required: true, message: t('common:editor.selectModuleInputError'),
              }],
            })(
              <Select
                showSearch
                optionFilterProp="children"
                filterOption={filterOption}
                placeholder={t('common:editor.selectModule')}
              >
                {
                  moduleList.map(item =>(
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default InsertManyToManyModal;
