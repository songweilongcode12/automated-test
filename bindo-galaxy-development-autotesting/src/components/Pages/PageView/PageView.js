/* eslint-disable camelcase */
import React, { Component } from 'react'
import lodash from 'lodash'
import Liquidjs from 'liquidjs'
import jquery from 'jquery'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min'
import './PageView.less'
import initGeetest from './gt'
import urls from '../../../constants/urls'
import {
  parseParams,
} from '../../../utils/galaxy'
import {
  queryRecords,
} from '../../../data/graphql/page'

const prefix = 'bg-c-page-view';

const engine = new Liquidjs();

window.jQuery = jquery;
window.$ = jquery;

/**
 * 根据route和params创建url, 如果存在props, 缺省值从props中取
 * @param {String} liquidTemplate Liquid模板
 * @param {Object} liquidData Liquid模板使用的数据对象
 * @param {Array} jsStringArray JavaScirpt脚本字符串
 */
class PageView extends Component {
  state = {
    innerHtml: '',
    offline: false,
    captchaObj: {},
  }

  componentDidMount() {
    window.queryRecords = this.queryRecords;
    this.initView(this.props);
    this.transactionQueueSet = new Set();
  }

  queryRecords = async ({
    search = {},
    callback = () => {},
  }) => {
    this.createTransaction(async (result) => {
      // const {
      //   storeID,
      //   moduleID,
      // } = parseParams(this.props);

      const records = await queryRecords({
        search: {
          ...search,
        },
        storeID: '7135',
        moduleID: '1017790652466889728',
        associates: ['*'],
        headers: this.getGeetestHeaders(result),
      })

      callback(records);
    });
    this.runTransaction();
  }

  /**
   * 执行事务，通过Geetest校验
   */
  runTransaction = () => {
    const {
      captchaObj,
    } = this.state;

    if (captchaObj) {
      captchaObj.verify();
    }
  }

  /**
   * 创建事务，清空队列里其他事务的function
   */
  createTransaction = (func) => {
    this.clearTransaction();

    this.addTransaction(func);
  }

  /**
   * 通过改方法，可添加多个function，组合成一个事务执行
   */
  addTransaction = (func) => {
    if (lodash.isSet(this.transactionQueueSet) && typeof func === 'function') {
      this.transactionQueueSet.add(func);
    }
  }

  /**
   * 清空事务中的function
   */
  clearTransaction = () => {
    if (lodash.isSet(this.transactionQueueSet)) {
      this.transactionQueueSet.clear();
    }
  }

  setStateAsync = (state) => new Promise((resolve) => {
    this.setState(state, resolve)
  })

  initView = async (props) => {
    await this.parseLiquidTemplate(props);
    await this.parseJavaScript(props);
    await this.initGeetest(props);
  }

  // 初始化极验
  initGeetest = async (props)=> {
    try {
      const {
        challenge,
        gt,
        offline,
        success,
      } = await axios.get(urls.initGeetestUrl.replace('{slug}', this.getSlug(props)));

      await this.setStateAsync({
        offline,
      });

      const lang = navigator.language.toLowerCase();

      if (success) {
        initGeetest({
          challenge,
          gt,
          offline,
          product: 'bind',
          new_captcha: true,
          lang,
          timeout: '5000',
        }, this.handleInitGeetestSuccess)
      }
    } catch (e) {
      console.info(e)
    }
  }

  handleInitGeetestSuccess = (captchaObj) => {
    captchaObj.onReady(() => {
      this.setState({
        captchaObj,
      });
    }).onSuccess(async () => {
      const result = captchaObj.getValidate();
      if(!result) {
        console.info('please verify frist')
        return
      }

      this.transactionQueueSet.forEach(func => func(result));
    })
  }

  getSlug = (props) => {
    const {
      slug,
    } = parseParams(props);
    console.info(slug);

    return 'dwt';
  }

  getGeetestHeaders = (result) => {
    const {
      geetest_challenge,
      geetest_seccode,
      geetest_validate,
    } = result || {};

    const {
      offline,
    } = this.state;

    return {
      'X-PUBLIC-MODE': true,
      'X-POST-VERIFY-CHALLENGE': geetest_challenge,
      'X-POST-VERIFY-VALIDATE': geetest_validate,
      'X-POST-VERIFY-SECCODE': geetest_seccode,
      'X-POST-VERIFY-OFFLINE': offline,
      'X-STORE-SLUG': this.getSlug(this.props),
    }
  }

  parseLiquidTemplate = async (props) => {
    const {
      liquidTemplate = '',
      liquidData = {},
    } = props;

    try {
      const template = engine.parse(liquidTemplate);
      const innerHtml = await engine.render(template, liquidData);
      await this.setStateAsync({
        innerHtml,
      });
    } catch (error) {
      console.error(error)
    }
  }

  parseJavaScript = async (props) => {
    const {
      jsStringArray = [],
    } = props;

    try {
      if (lodash.isArray(jsStringArray)) {
        jsStringArray.forEach(jsString => {
          if (lodash.isString(jsString)) {
            // eslint-disable-next-line
            const fun = new Function(jsString);
            fun();
          }
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  render(){
    const {
      className = '',
      style = {},
    } = this.props;

    const {
      innerHtml,
    } = this.state;

    return (
      <div
        className={`${prefix} ${className}`}
        style={style}
        // eslint-disable-next-line
        dangerouslySetInnerHTML={{ __html: innerHtml }}
      />
    )
  }
}

export default PageView
