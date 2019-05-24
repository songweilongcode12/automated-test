import React, { Component } from 'react';
import {
  Row,
  Col,
  Select,
  InputNumber,
  Form,
  Radio,
} from 'antd';
import {
  parseParams,
} from '../../../../utils/galaxy';
import {
  findModule,
} from '../../../../utils/module'
import hocProperties from './hocProperties';
import BaseProperties from './BaseProperties';
import ActionInput from '../ActionInput';
import videoPlayerContants from '../../../../constants/videoPlayer';

@hocProperties()
class VideoPlayerProperties extends Component {
  render() {
    const {
      t,
      view,
      onViewPropsChange,
      prefix,
      field,
    } = this.props;

    const {
      appID,
      moduleID,
      storeID,
    } = parseParams(this.props);

    const moduleEntity = findModule({
      props: this.props,
      appID,
      storeID,
      moduleID,
    });

    const {
      fields = [],
    } = moduleEntity;

    const {
      width,
      height,
      url,
      mediaType = videoPlayerContants.STREAMING,
      urlSource = videoPlayerContants.FROMFIELD,
    } = view;

    const {
      uuid,
    } = field;

    return (
      <div>
        <BaseProperties
          {...this.props}
          required={false}
          readOnly={false}
        />
        <div className={prefix} style={{marginLeft: 5}}>
          <Row>
            <Col span={12}>
              <div className={`${prefix}-label`}>
                {t('common:editor.width')}
              </div>
              <InputNumber
                value={width}
                onChange={value => onViewPropsChange('width', value)}
              />
            </Col>
            <Col span={12}>
              <div className={`${prefix}-label`}>
                {t('common:editor.height')}
              </div>
              <InputNumber
                value={height}
                onChange={value => onViewPropsChange('height', value)}
              />
            </Col>
          </Row>
        </div>
        <div className={prefix} style={{marginLeft: 5}}>
        <Form.Item
          label={t('common:editor.mediaType')}
          colon={false}
        >
          <Select
            style={{width: '100%'}}
            onChange={value => onViewPropsChange('mediaType', value)}
            value={mediaType}
          >
            <Select.Option value={videoPlayerContants.STREAMING}>{t('common:editor.streaming')}</Select.Option>
            <Select.Option value={videoPlayerContants.VIDEOFILE}>{t('common:editor.videoFile')}</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={t('common:editor.urlSource')}
          colon={false}
        >
          <Radio.Group
            onChange={evt => onViewPropsChange('urlSource', evt.target.value)}
            value={urlSource}
          >
            <Radio value={videoPlayerContants.STATIC}>{t('common:editor.static')}</Radio>
            <Radio value={videoPlayerContants.FROMFIELD}>{t('common:editor.fromField')}</Radio>
          </Radio.Group>
        </Form.Item>
        {
          (urlSource === videoPlayerContants.FROMFIELD) &&
          <Form.Item
            label={t('common:editor.selectField')}
          >
            <Select
              optionFilterProp="children"
              style={{width: '100%'}}
              onChange={value => onViewPropsChange('url', value)}
              value={url}
            >
              {
                fields.filter(fieldItem => fieldItem.uuid !== uuid).map(item =>
                  <Select.Option key={item.uuid} value={item.name}>{item.name}</Select.Option>
                )
              }
            </Select>
          </Form.Item>
        }
        {
          (urlSource === videoPlayerContants.STATIC) &&
          <Form.Item
            label={t('common:editor.url')}
          >
            <ActionInput
              value={url}
              onOkClick={value => onViewPropsChange('url', value)}
            />
          </Form.Item>
        }
        </div>
      </div>
    );
  }
}

export default VideoPlayerProperties;
