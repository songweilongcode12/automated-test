import React from 'react'
import { Select, Icon as AntdIcon } from 'antd'

const prefix = 'bindo-galaxy-editor-rightside';

export default (props)=>{
  const {
    t,
    fields,
    data,
    onRemove = () => {},
    onChange = () => {},
  } = props;

  return (
    <div
      className={`${prefix}-addUniqueFields`}
    >
      <Select
        mode='multiple'
        style={{ width: '100%'}}
        placeholder={t('common:module.uniqueFieldsHolder')}
        onChange={value => onChange(data.uuid, value)}
        value={data.fields}
        className={`${prefix}-addUniqueFields-select`}
      >
        {
          fields.length > 0&&
          fields.map(item =>
            <Select.Option key={item.name} value={item.name}>
              {item.label}
            </Select.Option>
          )
        }
      </Select>
      <AntdIcon onClick={() => onRemove(data.uuid)} className={`${prefix}-addUniqueFields-icons`} type='close' style={{ color: 'red' }} />
    </div>
  )
}
