import React from 'react';
import { Button, Icon as AntdIcon } from 'antd';
import common from '../../../../constants/common';

const prefix = 'bindo-galaxy-editor-rightside-newBtn';

export default props => {

  const {
    t,
    data = {},
    onDeleteClick = () => {},
  } = props;

  const {
    uuid,
    title,
    type,
  } = data || {};

  return (
    <div className={`${prefix}`}>
      <Button type='dashed' className={`${prefix}-btn`}>
        {type === common.DEFAULT ? t(title) : title}
      </Button>
      {
        type === common.CUSTOM &&
        <AntdIcon
          onClick={() => onDeleteClick(uuid)}
          style={{ color: '#ff3e3e', marginTop: '15px', marginLeft: '15px' }}
          type='close'
        />
      }
      <AntdIcon
        className={`${prefix}-swap ${type === common.DEFAULT && 'beforeSwap'}`}
        type='swap'
        rotate={90}
      />
    </div>
  );
};

