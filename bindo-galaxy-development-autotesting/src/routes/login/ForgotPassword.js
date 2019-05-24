import React from 'react'
import { Link } from 'react-router-dom'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { Form, Button, Icon, Input, message } from 'antd'
import Wrapper from './Wrapper'
import Routes from '../../constants/routes'
import EmailSvg from './email.svg'
import BindoLogo from './BindoLogo'
import common from '../../constants/common'
import reduxKey from '../../constants/reduxKey'

import './Login.less';

const prefix = 'bg-r-login';
const forgotPrefix = 'bg-r-forgot-password'

@Form.create()
@translate()
@connect(({ user }) => ({ ...user }))
class ForgotPassword extends React.Component {
  state = {
    emailSent: false,
  }

  handleSubmit = (evt) => {
    this.setState({
      emailSent: true,
    })
    evt.preventDefault();
    const { dispatch, form, t} = this.props;
    const {
      emailSent = false,
    } = this.state;

    let lastTime = localStorage.getItem('email_sent_info');
    if(lastTime!== null){
      lastTime = JSON.parse(lastTime);
    } else {
      lastTime = {
        time: '',
        email: '',
      }
    }
    const time = new Date();
    if(!emailSent){
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        if(time - lastTime.time < common.ONE_HOUR && lastTime.email === values.email){
          message.success(t('common:module.emailSentAlready'));
          this.setState({
            emailSent: true,
          });
          return;
        }

        dispatch({
          type: reduxKey.FORGOT_PASSWORD,
          payload: {
            ...values,
            callback: (data) => {
              if (data.message === 'You should receive an email for the password reset instructions.'){
                message.success(t('common:login.emailSentSuccess'));
                this.setState({
                  emailSent: true,
                });
                localStorage.setItem('email_sent_info', JSON.stringify({
                  ...values,
                  time: time.getTime(),
                }));
              } else {
                this.setState({
                  emailSent: false,
                });
                message.success(t('common:login.emailSentFailed'));
              }
            },
          }});
      });
    }
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
      emailSent=false,
      // data=[],
    } = this.state;

    return (
      <Wrapper>
        {
          emailSent
            ?
            <div className={`${forgotPrefix}`}>
              <img className={`${forgotPrefix}-email-image`} alt='email' src={EmailSvg} />
              <div className={`${forgotPrefix}-email-sent`}>{t('common:login.recoveryEmailSent')}</div>
              <div className={`${forgotPrefix}-email-sent-info`}>{t('common:login.checkResetEmail')}</div>
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
                  {t('common:login.emailPlaceholder')}
                </div>
                <Form.Item>
                  {getFieldDecorator('email', {
                    rules: [{ required: true, message: t('common:login.emailRequiredTip') }],
                  })(
                    <Input
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder={t('common:login.emailPlaceholder')}
                      type='email'
                    />
                  )}
                </Form.Item>
                {/* <Form.Item>
                  {getFieldDecorator('store', {
                    rules: [{ required: true, message: t('common:login.storeRequiredTip') }],
                  })(
                    <Select
                      placeholder={t('common:login.storeRequired')}
                    >
                      {
                        data.map(item =>
                          <Select.Option key={item.id} value={item.id}>{item.title}</Select.Option>
                        )
                      }
                    </Select>
                  )}
                </Form.Item> */}
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
                    {t('common:recover')}
                  </Button>
                </div>
              </Form>
            </div>
        }
      </Wrapper>
    )
  }
}

export default ForgotPassword;
