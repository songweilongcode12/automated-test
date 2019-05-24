import React from 'react';
import BindoVideoPlayer from '../../../components/BindoVideoPlayer/BindoVideoPlayer';

const state = {
  preload: 'auto', // 预加载
  bigPlayButton: {}, // 大按钮
  autoplay: true, // 自动播放
  controls: true, // 是否开启控制栏
  width: 800, // 播放器宽度
  height: 600, // 播放器高度
  playbackRates: [1, 1.5, 2], // 播放倍速
  sources: [ // 视频源
    {
      // src: 'http://yunxianchang.live.ujne7.com/vod-system-bj/44_176_20170224113626af3a75cd-3508-4bc3-b51f-366fca3c7e39.m3u8',
      src: 'http://demo-rtmp-tcloud.bindo.cn/live/1.m3u8',
      type: 'application/x-mpegURL',
      withCredentials: false,
    },
    // {
    //   src: 'http://vjs.zencdn.net/v/oceans.mp4',
    //   type: 'video/mp4',
    //   label: 'MP4',
    //   res: 720,
    // },
  ],
}

export default props => (

  <BindoVideoPlayer
    {...props}
    {...state}
  />
);
