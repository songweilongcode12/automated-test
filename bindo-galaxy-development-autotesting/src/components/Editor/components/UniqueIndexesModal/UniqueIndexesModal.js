import React, { Component } from 'react'
import { translate } from 'react-i18next'
import lodash from 'lodash'
import { Modal, Button } from 'antd'
// import { Modal, Icon as AntdIcon } from 'antd'
import CustomSelect from './CustomSelect'
import { createUuid } from '../../../../utils';
// import { createUuid } from '../../../../utils'

const prefix = 'bindo-galaxy-editor-rightside';

@translate()
class UniqueIndexesModal extends Component {
  state = {
    uniqueIndexes: [],
  }

  componentDidMount() {
    const {
      data = [],
    } = this.props;

    if (lodash.isArray(data)) {
      this.setState({
        uniqueIndexes: data || [],
      })
    }

  }

  handleRemove = (uuid) => {
    const {
      uniqueIndexes = [],
    } = this.state;

    const data = [];
    uniqueIndexes.forEach(item => {
      if (item.uuid !== uuid) {
        data.push(item)
      }
    })
    this.setState({
      uniqueIndexes: data,
    })
  }

  handleChange = (uuid, value) => {
    const {
      uniqueIndexes = [],
    } = this.state;

    uniqueIndexes.forEach(item => {
      if (item.uuid === uuid) {
        item.fields = value
      }
    })

    this.setState({
      uniqueIndexes: [...uniqueIndexes],
    })
  }

  handleAdd = () => {
    const {
      uniqueIndexes = [],
    } = this.state;

    this.setState({
      uniqueIndexes: [
        ...uniqueIndexes,
        {
          uuid: createUuid(),
          fields: [],
        },
      ],
    })
  }

  saveUniqueFields = () => {
    const {
      uniqueIndexes,
    } = this.state;
    const {
      onOk = () => {},
    } = this.props;

    onOk(uniqueIndexes);
  }

  render () {
    const {
      t,
      fields=[],
      onCancel = () => {},
    } = this.props;

    const {
      uniqueIndexes = [],
    } = this.state;

    return (
      <Modal
        title={t('common:module.uniqueFieldsTitle')}
        centered
        visible={true}
        onOk={this.saveUniqueFields}
        onCancel={onCancel}
        okText={t('common:ok')}
        cancelText={t('common:cancel')}
      >
        <div className={`${prefix}-addUniqueFields-title`}>{t('common:module.uniqueFields')}</div>
        {
          uniqueIndexes.map(item =>
              <CustomSelect
                t={t}
                key={item.uuid}
                fields={fields}
                data={item}
                onRemove={this.handleRemove}
                onChange={this.handleChange}
              />
          )
        }
        <Button style={{ marginTop: '10px'}} onClick={this.handleAdd}>{t('common:add')}</Button>
      </Modal>
    )
  }

}

export default UniqueIndexesModal

