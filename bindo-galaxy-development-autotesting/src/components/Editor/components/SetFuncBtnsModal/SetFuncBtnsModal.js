import React, { Component } from 'react'
import { translate } from 'react-i18next'
import lodash from 'lodash'
import { Modal, Icon as AntdIcon } from 'antd'
import FuncBtn from './FuncBtn'
import AddFuncBtnModal from './AddFuncBtnModal'
import { queryScriptRecords } from '../../../../data/graphql/action'

const prefix = 'bindo-galaxy-editor-rightside';

@translate()
class SetFuncBtnsModal extends Component {
  state = {
    visible: true,
    showAddModal: false,
    btnData: [],
    scriptList: [],
  }

  componentDidMount() {
    const {
      data,
      viewType,
    } = this.props;

    const tempData = data || {};
    const btnData = tempData[viewType] || [];

    this.setState({
      btnData: lodash.cloneDeep(btnData),
    })
  }

  loadScripts = async () => {
    const {
      scriptList,
    } = this.state;

    if (lodash.isArray(scriptList) && scriptList.length > 0) {
      return;
    }

    const {
      moduleID,
      storeID,
    } = this.props;

    try {
      const {
        data=[],
      } = await queryScriptRecords({
        storeID,
        moduleID,
      })

      this.setState({
        scriptList: data,
      })
    } catch (error) {
      log.error(error)
    }
  }

  handleOk = () => {
    const {
      onOk = () => {},
      viewType,
    } = this.props;

    const {
      btnData,
    } = this.state;

    onOk(btnData, viewType);
  }

  handleDelete = (uuid) => {
    const {
      btnData = [],
    } = this.state;

    const newData = [];
    btnData.forEach(item => {
      if (item.uuid !== uuid) {
        newData.push(item);
      }
    })

    this.setState({
      btnData: newData,
    })
  }

  handleAddClick = () => {
    this.setState({
      visible: false,
      showAddModal: true,
    });

    this.loadScripts();
  }

  handleAddFuncBtn = (funcBtn) => {
    const {
      btnData = [],
    } = this.state;

    btnData.push(funcBtn);

    this.setState({
      btnData: [...btnData],
      visible: true,
      showAddModal: false,
    })
  }

  render() {

    const {
      t,
      onCancel,
      singleViews = [],
    } = this.props;

    const {
      visible,
      btnData = [],
      scriptList = [],
      showAddModal = false,
    } = this.state;

    return (
      <span>
        <Modal
          title={t('common:module.viewfuncBtnTitle')}
          centered
          visible={visible}
          onOk={this.handleOk}
          onCancel={onCancel}
          okText={t('common:ok')}
          cancelText={t('common:cancel')}
        >
          {
            btnData && btnData.length > 0 &&
            btnData.map(item => (
              <FuncBtn
                key={item.uuid}
                t={t}
                data={item}
                onDeleteClick={this.handleDelete}
              />
            ))
          }
          <div
            className={`${prefix}-addBtn`}
            onClick={this.handleAddClick}
          >
            <AntdIcon type='plus' style={{ color: '#1890FF' }} />
            <p className={`${prefix}-addBtn-title`}>{t('common:module.addNewBtn')}</p>
          </div>
        </Modal>
        {
          showAddModal &&
          <AddFuncBtnModal
            scriptList={scriptList}
            singleViews={singleViews}
            onOk={this.handleAddFuncBtn}
            onCancel={() => this.setState({
              visible: true,
              showAddModal: false,
            })}
          />
        }
      </span>
    );
  }
}

export default SetFuncBtnsModal;
