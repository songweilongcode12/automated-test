import React, { Component } from 'react';
import { Button, Icon as AntdIcon } from 'antd';
import { translate } from 'react-i18next';
import CONSTANTS from '../../../constants/common';

const prefix = 'bindo-galaxy-editor-rightside-newBtn';

@translate()
class FuncBtns extends Component {
  render () {
    const {
      title,
      // scriptName = '',
      type,
      uuid,
      // status,
      // params
      delAddedBtns = () => { },
      t,
    } = this.props;

    return (
      <div
        className={`${prefix}`}
      >
        <Button type='dashed' className={`${prefix}-btn`}>{type === CONSTANTS.DEFAULT ? t(title) : title}</Button>
        {type === CONSTANTS.CUSTOM
          &&
          <AntdIcon
            onClick={() => delAddedBtns(uuid)}
            style={{ color: '#ff3e3e', marginTop: '15px', marginLeft: '15px' }}
            type='close'
          />}
        <AntdIcon className={`${prefix}-swap ${type === CONSTANTS.DEFAULT && 'beforeSwap'}`} type='swap' rotate={90} />
      </div>
    )
  }

}

export default FuncBtns;

