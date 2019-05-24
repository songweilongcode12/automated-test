import React from 'react';
import { Input, Icon as AntdIcon} from 'antd'

const prefix = 'bindo-galaxy-editor-rightside';

export default (props) => {

  const {
    onAdd = () => {},
    onRemove = () => {},
    handleColor = () => {},
    data= {},
  } = props;

  const {
    uuid = '',
    value = '',
    color = '',
  } = data;

  return (
    <div className={`${prefix}-color-config-data-item`}>
      <Input
        className={`${prefix}-color-config-input`}
        placeholder='Value'
        value={value}
      />
      <Input
        className={`${prefix}-color-config-input-right`}
        placeholder='Color'
        value={color}
        onChange={(e) =>handleColor(uuid, e.target.value)}
      />
      <AntdIcon
        className={`${prefix}-addUniqueFields-icons`}
        type='close'
        style={{ color: 'red' }}
        onClick={() =>onRemove(uuid)}
      />
      <AntdIcon
        className={`${prefix}-addUniqueFields-icons`}
        type='plus'
        onClick={onAdd()}
      />
    </div>
  )
}

