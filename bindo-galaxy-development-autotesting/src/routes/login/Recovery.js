import React from 'react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { Form, Button, Icon, Input, Checkbox } from 'antd';
import reduxKey from '../../constants/reduxKey'
import Wrapper from './Wrapper'

import './Login.less';

const prefix = 'bg-r-login';

@Form.create()
@translate()
@connect(({ user }) => ({ ...user }))
class Recovery extends React.Component {
  handleSubmit = (evt) => {
    evt.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      dispatch({
        type: reduxKey.LOGIN,
        payload: {
          values,
        },
      });
    });
  }

  render() {
    const {
      t,
      form,
      signingIn,
    } = this.props;

    const {
      getFieldDecorator,
    } = form;

    return (
      <Wrapper>
        <Form onSubmit={this.handleSubmit} className={`${prefix}-form`}>
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: t('common:login.usernameRequiredTip') }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder={t('common:login.usernamePlaceholder')}
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: t('common:login.passwordRequiredTip') }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder={t('common:login.passwordPlaceholder')}
              />
            )}
          </Form.Item>
          <div>
            <Checkbox>
              {t('common:login.rememberMe')}
            </Checkbox>
            <Link
              to="sdf"
              style={{float: 'right'}}
            >
              {t('common:login.forgotPassword')}
            </Link>
          </div>
          <Button
            block
            type="primary"
            loading={signingIn}
            htmlType="submit"
            className={`${prefix}-btn`}
          >
            {t('common:login.signIn')}
          </Button>
          <Button
            block
            disabled={true}
          >
            {t('common:login.signUp')}
          </Button>
        </Form>
      </Wrapper>
    );
  }
}

export default Recovery;
