/* eslint-disable camelcase */
import React, { Component } from 'react'
import {
  Button,
} from 'antd'
import axios from 'axios'
import urls from '../../../constants/urls'
import {
  parseParams,
} from '../../../utils/galaxy'
import initGeetest from './js/gt'
import { queryGeetestRecords } from '../../../data/graphql/geetest'

class Liquid extends Component {
  state = {
    captchaObj: {},
    offline: false,
  }

  componentDidMount() {
    this.initGeetest()
  }

  // 初始化极验
  initGeetest = async ()=> {
    const slug = 'dwt'
    try {
      const {
        challenge,
        gt,
        offline,
        success,
      } = await axios.get(urls.initGeetestUrl.replace('{slug}', slug));

      this.setState({
        offline,
      })

      if (success) {
        initGeetest({
          challenge,
          gt,
          offline,
          product: 'bind',
          new_captcha: true,
          timeout: '5000',
        },this.handleGeetest)
      }
    } catch (e) {
      console.info(e)
    }
  }

  // 极验回调
  handleGeetest = (captchaObj) => {
    this.setState({
      captchaObj,
    })
    captchaObj.onReady(() => {
    }).onSuccess(() => {
      const result = captchaObj.getValidate();
      if(!result) {
        console.info('please verify frist')
        return
      }

      this.handleGeetestSec(result)

    })
  }

  handleClick = () => {
    const {
      captchaObj,
    } = this.state;

    if (captchaObj) {
      captchaObj.verify();
    }
  }

  handleGeetestSec = async (result) => {
    const {
      geetest_challenge,
      geetest_seccode,
      geetest_validate,
    } = result

    const {
      offline,
    } = this.state

    const {
      slug,
      // storeID,
      // moduleID,
    } = parseParams(this.props);

    console.info(slug)

    const records = await queryGeetestRecords({
      search: {
        page: 1,
        perPage: 1,
        // formulas,
      },
      storeID: 7135,
      moduleID: '1017790652466889728',
      associates: ['*'],
      header: {
        'X-PUBLIC-MODE': true,
        'X-POST-VERIFY-CHALLENGE': geetest_challenge,
        'X-POST-VERIFY-VALIDATE': geetest_validate,
        'X-POST-VERIFY-SECCODE': geetest_seccode,
        'X-POST-VERIFY-OFFLINE': offline,
        'X-STORE-SLUG': 'dwt',
      },
    })

    console.info(records, '------')
  }

  render(){
    return(
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          right: 0,
        }}
      >
        {
          <Button
            type='primary'
            onClick={this.handleClick}
          >
            Submit
          </Button>
        }
      </div>
    )
  }
}

export default Liquid
