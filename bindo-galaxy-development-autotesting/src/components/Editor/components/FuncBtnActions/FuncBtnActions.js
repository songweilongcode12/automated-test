import React from 'react'
import { Select, Icon as AntdIcon } from 'antd'

const prefix = 'bindo-galaxy-editor-rightside';

export default (props)=>{
  const {
    // t,
    fields=[],
    data,
    onActionsRemove = () => {},
    onActionsChange = () => {},
    onActionsAdd = () => {},
    type='',
  } = props;

  return (
    <div
      className={`${prefix}-addUniqueFields`}
    >
      <Select
        // mode='multiple'
        style={{ width: '100%'}}
        onChange={value => onActionsChange(data.uuid, value)}
        // value={data.fields}
        className={`${prefix}-addUniqueFields-select`}
      >
        {
          fields.length > 0&&
          fields.map(item =>
            <Select.Option key={item.id} value={JSON.stringify(item)}>
              {item.actionName}
            </Select.Option>
          )
        }
      </Select>
      <AntdIcon onClick={() => onActionsAdd(data.uuid, type)} className={`${prefix}-addUniqueFields-icons`} type='plus' />
      <AntdIcon onClick={() => onActionsRemove(data.uuid, type)} className={`${prefix}-addUniqueFields-icons`} type='close' style={{ color: 'red' }} />
      <AntdIcon className={`${prefix}-addUniqueFields-icons`} type='swap' rotate={90} style={{ color: '#666' }} />
    </div>
  )
}
