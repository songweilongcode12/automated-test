import React, { Component } from 'react';
import { Form } from 'antd';
import hocParser from './hocParser';
import BindoVideoPlayer from '../../../BindoVideoPlayer';
import videoPlayerConstants from '../../../../constants/videoPlayer';
import Icon from '../../../Icon'

// 播放器属性
// const playerState = {
//   preload: 'auto', // 预加载
//   bigPlayButton: {}, // 大按钮
//   autoplay: true, // 自动播放
//   controls: true, // 是否开启控制栏
//   width: 800, // 播放器宽度
//   height: 600, // 播放器高度
//   playbackRates: [1, 1.5, 2], // 播放倍速
//   sources: [ // 视频源
//     {
//       // src: 'http://yunxianchang.live.ujne7.com/vod-system-bj/44_176_20170224113626af3a75cd-3508-4bc3-b51f-366fca3c7e39.m3u8',
//       src: 'http://demo-rtmp-tcloud.bindo.cn/live/1.m3u8',
//       type: 'application/x-mpegURL',
//       withCredentials: false,
//     },
//     {
//        src: 'http://vjs.zencdn.net/v/oceans.mp4',
//        type: 'video/mp4',
//        label: 'MP4',
//        res: 720,
//     },
//   ],
// }

@hocParser()
class VideoPlayerParser extends Component {

  getVideoUrl = () => {
    const {
      view = {},
      recordData,
    } = this.props;

    const {
      urlSource,
      url,
    } = view;

    if(urlSource === videoPlayerConstants.STATIC){ // 直接取到url
      return url
    } else if (urlSource === videoPlayerConstants.FROMFIELD) { // url来自其它field
      return recordData[url]
    }
  }

  render() {
    const {
      view,
      // field,
      // getFieldDecorator,
      // getRules,
      getFormItemProps,
      editableData,
    } = this.props;

    const {
      mediaType,
      width,
      height,
    } = view || {};

    const playerProps = {
      preload: 'auto', // 预加载
      autoplay: true, // 自动播放
      controls: true, // 是否开启控制栏
      width,
      height,
    };

    const source = {}
    if (mediaType === videoPlayerConstants.VIDEOFILE) { // 非直播视频源
      source.src = this.getVideoUrl();
    } else if (mediaType === videoPlayerConstants.STREAMING) { // 直播视频源
      source.src = this.getVideoUrl();
      source.type = 'application/x-mpegURL';
      source.withCredentials = false;
    }

    playerProps.sources = [{...source}];

    return (
     <Form.Item {...getFormItemProps()}>
      {
        editableData &&
        <Icon type='icon-videoPlayer-Placeholder' style={{fontSize: 100}} />
      }
      {
        !editableData &&
        <div>
          <BindoVideoPlayer
            {...playerProps}
          />
        </div>
      }
     </Form.Item>
    )
  }
}

export default VideoPlayerParser;
