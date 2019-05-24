import React from 'react';
import { Select, Modal } from 'antd'
import ColorConfigItem from './ColorConfigItem'
import common from '../../../constants/common'

const prefix = 'bindo-galaxy-editor-rightside';

class ColorConfiguration extends React.Component {
  state = {
    configsData: [],
  }

  handleSelectChange = (value) => {
    const {
      colorConfigFields = [],
    } = this.props;
    const selectedDate = colorConfigFields.find(item => item.name === value)
    const {
      type = '',
      staticItems = [],
      // dynamicItemSource = [],
    } = selectedDate.allowValue || {};
    if (type === common.STATIC) {
      this.setState({
        configsData: staticItems,
      })
    }
    // else if( type === common.DYNAMIC) {
    // }

  }

  onRemove = (uuid) => {
    const {
      configsData = [],
    } = this.state;

    const newConfigsData = configsData.filter(item => item.uuid!== uuid);
    this.setState({
      configsData: newConfigsData,
    });
  }

  onAdd = () => {
    console.info('onAdd')

  }

  handleColor = (uuid, color) => {
    const {
      configsData = [],
    } = this.state;
    configsData.forEach(item => {
      if(item.uuid === uuid){
        item.color = color;
      }
    })
    this.setState({
      configsData: [...configsData],
    })
  }

  render () {
    const {
      title,
      onOk = () => { },
      onCancel = () => { },
      colorConfigFields = [],
    } = this.props;

    const {
      configsData = [],
    } = this.state;

    return (
      <Modal
        title={title}
        visible={true}
        onOk={onOk}
        onCancel={onCancel}
      >
        <p>Select Reference Field</p>
        <Select
          className={`${prefix}-color-config-select`}
          onChange={this.handleSelectChange}
        >
          {
            colorConfigFields.map(item =>
              <Select.Option key={item.name} value={item.name}>
                {item.label}
              </Select.Option>
            )
          }
        </Select>
        {
          Array.isArray(configsData) &&
          configsData.length > 0 &&
          configsData.map(item =>
            <ColorConfigItem
              key={item.uuid}
              onRemove={this.onRemove}
              onAdd={this.onAdd}
              data={item}
              handleColor={this.handleColor}
            />
          )
        }
      </Modal>
    )
  }
}

export default ColorConfiguration;

