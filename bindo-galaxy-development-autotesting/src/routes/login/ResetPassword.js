import React from 'react'
import { Link } from 'react-router-dom'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { Form, Button, Icon, Input, message } from 'antd'
import Wrapper from './Wrapper'
import Routes from '../../constants/routes'
import BindoLogo from './BindoLogo'
import SuccessSvg from './success.svg'
import { getSearchParams } from '../../utils/index'
import reduxKey from '../../constants/reduxKey'

import './Login.less';

const prefix = 'bg-r-login';
const forgotPrefix = 'bg-r-forgot-password'

@Form.create()
@translate()
@connect(({ user }) => ({ ...user }))
class ResetPassword extends React.Component {
  state={
    updated: false,
  }

  handleSubmit = (evt) => {
    evt.preventDefault();

    const { dispatch, form, t } = this.props;

    const searchParams = getSearchParams(this.props)
    /* eslint-disable */
    const {
      reset_password_token='',
    } = searchParams || {};
    /* eslint-able */
    if (reset_password_token === undefined || reset_password_token.length < 1){
      message.error(t('common:login.reRequestForEmail'));
      return;
    }

    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const {
        password,
        password2,
      } = values;
      if (!password || !password2 || password !== password2){
        message.error(t('common:login.passwordsDifferent'))
        return;
      }

      dispatch({
        type: reduxKey.RESET_PASSWORD,
        payload: {
          password,
          reset_password_token,
          callback: (data)=>{
            if (data.message === 'Password reset successfully'){
              message.success(t('common:login.passwordResetSucess'));
              this.setState({
                updated: true,
              });
            } else {
              message.success(t('common:login.passwordResetFailed'));
            }
          }
        }});
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
    const {
      updated,
    } = this.state;

    return (
      <Wrapper>
        {
          updated
            ?
            <div className={`${forgotPrefix}`}>
              <img className={`${forgotPrefix}-email-image`} alt='success' src={SuccessSvg} />
              <div className={`${forgotPrefix}-email-sent`}>{t('common:login.congratulations')}</div>
              <div className={`${forgotPrefix}-email-sent-info`}>{t('common:login.passwordUpdated')}</div>
              <Button href='/login' type='primary' className={`${forgotPrefix}-back-to-dashboard`}>{t('common:login.backToDashboard')}</Button>
            </div>
            :
            <div className={`${prefix}-bindo-logo`}>
              <BindoLogo />
              <Form onSubmit={this.handleSubmit} className={`${prefix}-form`}>
                <div
                  style={{
                    marginBottom: '30px',
                    textAlign: 'center',
                    fontSize: '16px',
                  }}
                >
                  {t('common:login.resetPassword')}
                </div>
                <Form.Item>
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: t('common:login.resetPasswordPlaceholderTip') }],
                  })(
                    <Input
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder={t('common:login.resetPasswordPlaceholder')}
                      type='password'
                    />
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('password2', {
                    rules: [{ required: true, message: t('common:login.resetPasswordPlaceholderTip') }],
                  })(
                    <Input
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder={t('common:login.resetPassword2Placeholder')}
                      type='password'
                    />
                  )}
                </Form.Item>
                <div style={{ display: 'flex', margin: '20px 0' }}>
                  <Button
                    style={{ flex: 1 }}
                  >
                    <Link to={Routes.LOGIN}>
                      {t('common:cancel')}
                    </Link>
                  </Button>
                  <div style={{ width: '20px' }} />
                  <Button
                    type="primary"
                    loading={signingIn}
                    htmlType="submit"
                    style={{ flex: 1 }}
                  >
                    {t('common:module.reset')}
                  </Button>
                </div>
              </Form>
            </div>
        }

      </Wrapper>
    );
  }
}

export default ResetPassword;
