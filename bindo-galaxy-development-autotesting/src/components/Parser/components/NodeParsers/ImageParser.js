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
    initValues: '',
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

    const initialValue = getInitialValue()

    setFieldsValue({
      [name]: initialValue,
    });
    this.setState({
      initValues: initialValue,
    });
  }

  beforeUpload = (file) => {
    const {
      type = '',
      size = 0,
    } = file;
    let isImg = false;
    switch (type) {
      case 'image/png':
      case 'image/jpeg':
      case 'image/jpg':
      case 'image/gif':
      case 'image/bmp':
        isImg = true;
        break;
      default:
        isImg = false;
        break;
    }
    if (!isImg) {
      message.error(i18n.t('common:module.FileFormatLimitImage'));
      return isImg;
    }
    const isLt2M = size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error(`${i18n.t('common:module.FileUploadLimit')} 2MB!`);
      return isLt2M;
    }

  }

  handleRemove = (file) => {
    const {
      response = {},
    } = file;
    const {
      url = '',
    } = response;

    const {
      setFieldsValue,
      field = {},
    } = this.props;

    const {
      name,
    } = field || {};

    setFieldsValue({
      [name]: url,
    });

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
      initValues='',
    } = this.state;

    const {
      file = {},
    } = info || {};

    const {
      type = '',
      size = 0,
      status,
      response,
    } = file;

    let isImg = false;
    switch (type) {
      case 'image/png':
      case 'image/jpeg':
      case 'image/jpg':
      case 'image/gif':
      case 'image/bmp':
        isImg = true;
        break;
      default:
        isImg = false;
        break;
    }

    const {
      name,
    } = field;

    const isLt2M = size / 1024 / 1024 < 2;
    if (!isImg || !isLt2M) {
      setFieldsValue({
        [name]: initValues,
      });
      return;
    }

    if (isImg && isLt2M && status.toUpperCase() === common.DONE) {
      const {
        success = false,
        url = '',
      } = response || {};

      if (success && lodash.startsWith(url, 'http')) {
        setFieldsValue({
          [name]: url,
        });
        this.setState({
          initValues: url,
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

  deleteUploadedFile = () => {
    const {
      setFieldsValue,
      field = {},
    } = this.props;
    const {
      name,
    } = field;
    setFieldsValue({
      [name]: '',
    });
    this.setState({
      initValues: '',
    })

  }

  render () {
    const {
      moduleID,
      view,
      getFieldDecorator,
      getInitialValue,
      field = {},
      getFormItemProps,
      checkReadOnly,
      width = 'auto',
      minWidth = 84,
      height = 84,
      getRules,
    } = this.props;

    const {
      initValues = '',
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
      showUploadList: false,
    };

    const {
      name = '',
    } = field;

    const initialValue = getInitialValue();

    return (
      <Form.Item {...getFormItemProps()}>
        {getFieldDecorator(name, {
          initialValue,
          rules: getRules(),
        })(
          <div style={{ display: 'flex'}}>
            {
              initValues
              &&
              initValues.length > 0
              &&
              <div className='bf-galaxy-upload-initial-files' style={{width, height, minWidth }}>
                {
                    <UploaderIcon
                      deleteUploadedFile={(file) => this.deleteUploadedFile(file)}
                      key={initValues}
                      item={initValues}
                      type={common.IMAGE}
                      editable={!checkReadOnly()}
                    />
                }
              </div>
            }
            <Upload {...props} className='bf-galaxy-upload-default-style-change'>
              <Button disabled={checkReadOnly()} size='default' style={{ width, height, minWidth, boxSizing: 'content-box' }}>
                <Icon type="upload" />
                {buttonText}
              </Button>
            </Upload>
          </div>
        )}
      </Form.Item>
    );
  }
}

export default FileParser;

