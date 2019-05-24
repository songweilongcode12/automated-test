import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Input, Icon, message } from 'antd';
import { translate } from 'react-i18next';

const FormItem = Form.Item;

@translate()
@Form.create()
@connect(({ user }) => ({ ...user }))
class SignUpForm extends Component {

  handleOk = () => {
    const { form, dispatch, t } = this.props;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      dispatch({ type: 'REGISTER_USER', payload: {
        values,
        callback: result => {
          if (result) {
            const url = localStorage.getItem('redirect_url');
            localStorage.setItem('redirect_url', '');

            if (url) {
              window.location.href = url;
            } else {
              window.location.href = `${window.location.origin}/app`;
            }
          } else {
            message.error(t('common:login.registrationFailed'), 1);
          }
        },
      }});
    });
  }

  render() {

    const { t, form, registering } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Modal
        title={t('common:login.registered')}
        cancelText={t('common:cancelText')}
        okText={t('common:ok')}
        onOk={this.handleOk}
        confirmLoading={registering}
        width="420px"
        {...this.props}
        bodyStyle={{ paddingBottom: '0' }}
      >
        <Form>
          <FormItem>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: t('common:login.usernameRequiredTip') }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder={t('common:login.usernamePlaceholder')}
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: t('common:login.passwordRequiredTip') }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder={t('common:login.passwordPlaceholder')}
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default SignUpForm;
