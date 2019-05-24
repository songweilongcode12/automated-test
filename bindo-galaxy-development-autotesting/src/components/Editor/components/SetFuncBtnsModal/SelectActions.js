import React from 'react'
import { Select, Icon as AntdIcon } from 'antd'

const prefix = 'bindo-galaxy-editor-rightside';

export default (props)=>{
  const {
    scriptList = [],
    data,
    type,
    index,
    onAdd = () => {},
    onRemove = () => {},
    onChange = () => {},
  } = props;

  return (
    <div className={`${prefix}-addUniqueFields`}>
      <Select
        style={{ width: '100%'}}
        onChange={value => onChange({...data, scriptName: value}, type)}
        value={data.scriptName}
        className={`${prefix}-addUniqueFields-select`}
      >
        {
          scriptList.length > 0&&
          scriptList.map(item =>
            <Select.Option key={item.id} value={item.actionName}>
              {item.actionName}
            </Select.Option>
          )
        }
      </Select>
      <AntdIcon onClick={() => onAdd(index, type)} className={`${prefix}-addUniqueFields-icons`} type='plus' />
      <AntdIcon onClick={() => onRemove(data.uuid, type)} className={`${prefix}-addUniqueFields-icons`} type='close' style={{ color: 'red' }} />
      <AntdIcon className={`${prefix}-addUniqueFields-icons`} type='swap' rotate={90} style={{ color: '#666' }} />
    </div>
  )
}
