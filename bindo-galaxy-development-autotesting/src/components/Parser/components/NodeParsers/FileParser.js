import React, { Component } from 'react'
import { Form, Upload, Button, Icon, message } from 'antd';
import i18n from 'i18next';
import lodash from 'lodash';
import hocParser from './hocParser';
import UploaderIcon from './UploaderIcon';
import common from '../../../../constants/common';
import urls from '../../../../constants/urls';

@hocParser()
class FileParser extends Component {

  state = {
    fileList: [],
  }

  componentDidMount () {
    const {
      setFieldsValue,
      field = {},
      getInitialValue,
    } = this.props;
    const {
      name = '',
    } = field;

    let initialValue = getInitialValue()
    if (!lodash.isArray(initialValue)) {
      initialValue = [];
    }

    setFieldsValue({
      [name]: initialValue || [],
    });
    this.setState({
      fileList: initialValue,
    });
  }

  beforeUpload = (file) => {
    const isLt200M = file.size / 1024 / 1024 < 200;
    if (!isLt200M) {
      message.error(`${i18n.t('common:module.FileUploadLimit')}200MB!`);
      return false;
    } else {
      return true;
    }

  }

  handleUpload = (info) => {
    const {
      setFieldsValue,
      field = {},
      dispatch,
    } = this.props;
    dispatch({
      type: 'UPDATE_GALAXY_REDUCER',
      payload: {
        galaxyLoading: true,
      },
    });

    const {
      fileList = [],
    } = this.state;
    const {
      file = {},
    } = info || {};

    const {
      status,
      response,
      size,
    } = file || {};

    const {
      name,
    } = field;
    const isLt200M = size / 1024 / 1024 < 200;
    if (!isLt200M) {
      setFieldsValue({
        [name]: fileList,
      });
      dispatch({
        type: 'UPDATE_GALAXY_REDUCER',
        payload: {
          galaxyLoading: false,
        },
      });
      return;
    }

    if ( isLt200M && status.toUpperCase() === common.DONE) {
      const {
        success = false,
        url = '',
      } = response || {};

      if (success && lodash.startsWith(url, 'http')) {
        setFieldsValue({
          [name]: [...fileList, url],
        });
        this.setState({
          fileList: [...fileList, url],
        })
      }

      message.success(`${info.file.name} ${i18n.t('common:module.FileUploadSuccess')}`);
      dispatch({
        type: 'UPDATE_GALAXY_REDUCER',
        payload: {
          galaxyLoading: false,
        },
      });
    } else if (status.toUpperCase() === common.FAILED) {
      dispatch({
        type: 'UPDATE_GALAXY_REDUCER',
        payload: {
          galaxyLoading: false,
        },
      });
    }

  }

  deleteUploadedFile = (file) => {
    const {
      fileList = [],
    } = this.state;
    const {
      setFieldsValue,
      field = {},
    } = this.props;
    const {
      name,
    } = field;
    const newFileList = fileList.filter(item =>item !== file);
    setFieldsValue({
      [name]: newFileList,
    });
    this.setState({
      fileList: newFileList,
    })

  }

  render () {
    const {
      moduleID,
      view,
      getFieldDecorator,
      getInitialValue,
      field={},
      getFormItemProps,
      checkReadOnly,
      width = 'auto',
      minWidth = 84,
      height = 84,
      getRules,
    } = this.props;

    const {
      fileList= [],
    } = this.state;

    const {
      buttonText = '',
    } = view || {};

    const url = urls.uploadUrlByModuleID.replace('{moduleID}', moduleID);

    const props = {
      action: url,
      name: 'upload[file]',
      onChange: this.handleUpload,
      beforeUpload: this.beforeUpload,
      onRemove: this.handleRemove,
      listType: 'picture-card',
      multiple: true,
      showUploadList: false,
    };

    const {
      name='',
    } = field;

    const initialValue = getInitialValue();

    return (
      <Form.Item {...getFormItemProps()}>
        {getFieldDecorator(name, {
          initialValue,
          rules: getRules(),
        })(
          <div>
            <Upload {...props} className='bf-galaxy-upload-default-style-change'>
              <Button disabled={checkReadOnly()} size='default' style={{ width, height, minWidth, boxSizing: 'content-box' }}>
                <Icon type="upload" />
                {buttonText}
              </Button>
            </Upload>
            {
              fileList
              &&
              fileList.length > 0
              &&
              <div className='bf-galaxy-upload-initial-files' style={{width, height, minWidth }}>
                {
                  fileList.map(item =>
                    <UploaderIcon
                      deleteUploadedFile={(file) => this.deleteUploadedFile(file)}
                      key={item}
                      item={item}
                      editable={!checkReadOnly()}
                    />
                  )
                }
              </div>
            }
          </div>
        )}
      </Form.Item>
    );
  }
}

export default FileParser;

