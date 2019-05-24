import React, { Component } from 'react';
import { Modal, Select } from 'antd';
import { filterOption } from '../../utils/galaxy'

class SelectStoreModal extends Component {
  handleStoreChange = (value) => {
    const { onSelecteChange } = this.props;

    if (typeof onSelecteChange === 'function') {
      onSelecteChange(value);
    }
  }

  handleOkClik = () => {
    const { storeID, onOkClick } = this.props;

    if (storeID && typeof onOkClick === 'function') {
      onOkClick();
    }
  }

  render() {

    const {
      t,
      title,
      storeID,
      stores = [],
      onCancelClick,
    } = this.props;

    return (
      <Modal
        visible={true}
        title={title}
        okText={t('common:yes')}
        cancelText={t('common:no')}
        okButtonProps={{ disabled: !storeID }}
        onOk={this.handleOkClik}
        onCancel={onCancelClick}
      >
        <Select
          showSearch
          optionFilterProp="children"
          filterOption={filterOption}
          value={storeID}
          onChange={this.handleStoreChange}
          style={{width: '100%'}}
        >
          {
            stores.map(store => (
              <Select.Option
                key={store.id}
                value={store.id}
              >
                {store.title}
              </Select.Option>
            ))
          }
        </Select>
      </Modal>
    );
  }
}

export default SelectStoreModal;

