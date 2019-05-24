import React, { Component } from 'react';
import { Button, Modal } from 'antd';
import hocProperties from './hocProperties';
import BaseProperties from './BaseProperties';
import BindoFroalaEditor from '../../../BindoFroalaEditor';
import reduxKey from '../../../../constants/reduxKey'

@hocProperties()
class EditorProperties extends Component {

  state={
    showModal: false,
  }

  handleViewProps = (key, text) => {
    const { dispatch, view } = this.props;
    dispatch({
      type: reduxKey.UPDATE_MODULE_ENTITY,
      payload: {
        editViews: [{
          operate: 'update',
          uuid: view.uuid,
          data: { [key]: text },
        }],
      },
    });
  }

  render() {

    const nodeProps = {
      required: false,
      readOnly: false,
      editorProperty: true,
      ...this.props,
    }

    const {
      t,
      view,
      moduleID,
    } = this.props;

    const {
      editorContext,
    } = view || {};

    const {
      showModal,
    } = this.state;

    return (
      <div>
        <BaseProperties {...nodeProps} />
        <Button
          onClick={() => this.setState({
            showModal: true,
          })}
          style={{width: '100%', marginTop: 10}}
          type='primary'
        >
          {t('common:editor.editorContent')}
        </Button>
        {
          showModal &&
          <Modal
            visible={true}
            onCancel={() => this.setState({showModal: false})}
            onOk={() => this.setState({showModal: false})}
            title={t('common:editor.editorContent')}
            width={1500}
          >
            <BindoFroalaEditor
              config={this.editorConfig}
              model={editorContext || ''}
              moduleID={moduleID}
              onModelChange={(text) => this.handleViewProps('editorContext', text)}
            />
          </Modal>
        }
      </div>
    );
  }
}

export default EditorProperties;
