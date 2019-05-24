/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import videojs from 'video.js'
import { HlsSourceHandler } from 'videojs-contrib-hls'
import 'video.js/dist/video-js.min.css';

class BindoVideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.options = {

    };
    this.sources = [];
    // 判断是否是多码流，来修改播放器的播放方式
    if (props.sources.length > 1) {
      // 若存在多个流地址，则开启videoJsResolutionSwitcher
      this.sources = props.sources
    } else {
      this.options.source = props.sources
    }
  }

  componentDidMount() {
    videojs.getTech('html5').registerSourceHandler(HlsSourceHandler('html5'), 0);
    this.player = videojs(this.videoContainer, {
      ...this.props,
      ...this.options,
      plugins: {
      },
    }, () => {
      // const player = this;
      // const props = this.props;

      const {
        onReady,
        // sourceChanged,
      } = this.props;

      // 播放器加载成功的回调
      if (onReady) {
        onReady(this.props)
      }

      // 判断是否是多码流，单码流调用video.js播放器播放，多码流使用插件播放
      // if (this.sources.length > 1) {
      //   player.updateSrc([...this.sources])
      //   player.on('resolutionchange', () => {
      //     // 切换成功的回调
      //     if (sourceChanged) {
      //       sourceChanged(player)
      //     }
      //   })
      // }
    })
  }

  componentWillUnmount() {
    // 销毁播放器
    if (this.player) {
      this.player.dispose()
    }
  }

  handleRef = input => {
    this.videoContainer = input
  }

  render() {
    return (
      <div data-vjs-player>
        <video
          className="video-js"
          ref={this.handleRef}
        />
      </div>
    )
  }
}

BindoVideoPlayer.propTypes = {
  sources: PropTypes.array.isRequired, // 视频流地址列表 数组，必填
  // sourceChanged: PropTypes.func, // 多码流时，对码流切换的回调
  onReady: PropTypes.func, // 播放器加载成功时的回调
}

export default BindoVideoPlayer
