import React, {Component} from 'react'
import { Icon, Modal } from 'antd'
import common from '../../../../constants/common'

const prefix ='bf-galaxy-upload-initial-files';

class UploaderIcon extends Component {

  state= {
    tipIconsShow: false,
  }

  getFileName = (url) => {
    let name = '';
    if (url) {
      const position = url.lastIndexOf('/');
      if (position > 0) {
        name = url.slice(position + 1);
      } else {
        name = url;
      }
    }
    return name;
  }

  deleteFile = (e) => {
    e.preventDefault();
    const {
      item,
      deleteUploadedFile,
    } = this.props;
    if (typeof deleteUploadedFile === 'function'){
      deleteUploadedFile(item)
    }
  }

  getPreview = (tipIconsShow, editable, type) => {
    let preview = [];
    if(type === common.IMAGE){
      preview =
      <div className={`${prefix}-hover`}>
        <Icon
          onClick={()=> this.setState({previewImg: true})}
          style={{ fontSize: '16px', color: '#fff' }}
          type="eye"
        />
        {
          editable&&
          <Icon
            onClick={this.deleteFile}
            style={{ marginLeft: '10px', fontSize: '16px', color: '#fff' }}
            type="delete"
          />
        }
      </div>
    } else {
      preview =
      editable &&
      <div className={`${prefix}-hover`}>
        <Icon
          onClick={this.deleteFile}
          style={{ marginLeft: '0px', fontSize: '16px', color: '#fff' }}
          type="delete"
        />
      </div>
    }
    return tipIconsShow && preview;
  }

  render(){

    const {
      tipIconsShow = false,
      previewImg = false,
    } = this.state;

    const {
      item,
      type='',
      editable = false,
    } = this.props
    const imageTitle = this.getFileName(item) || '';

    return (
      <div
        onMouseEnter={() => {
          this.setState({
            tipIconsShow: true,
          })
        }}
        onMouseLeave={() => {
          this.setState({
            tipIconsShow: false,
          })
        }}
        className={`${prefix}-btn`}
        key={item}
        size='default'
      >
      {
        type === common.IMAGE
          ?
        <img
          className={`${prefix}-btn-preview`}
          alt='preview'
          src={item}
        />
          :
        <Icon style={{ color: '#1890f0', fontSize: '24px' }} type="file" />
      }
        <span className={`${prefix}-btn-title`}>
          {imageTitle}
        </span>
        {
          this.getPreview(tipIconsShow, editable, type)
        }
        {
          previewImg &&
          <Modal
            visible={true}
            className={`${prefix}-btn-preview-wrap`}
            title={imageTitle}
            onCancel={()=> this.setState({previewImg: false})}
            onOk={()=> this.setState({previewImg: false})}
            footer={null}
          >
          <img
            alt={imageTitle}
            src={item}
            style={{width: '100%', height: '100%', display: 'block'}}
          />
          </Modal>
        }
      </div>
    )
  }
}

export default UploaderIcon;
