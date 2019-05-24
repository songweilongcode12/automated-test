import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tag as AntdTag } from 'antd';

// const tagPrefix = 'bg-galaxy-tag';

@connect(({ galaxy }) => ({ ...galaxy }))
class TitleTag extends Component {
  state = {
    tagHide: false,
  };

  handleClose = () => {
    const { delItem, identy } = this.props;
    delItem(identy);

    this.setState({
      tagHide: true,
    });
  };

  render () {
    const { tag = '', title = 'default', hidden } = this.props;
    const { tagHide } = this.state;

    const view = tagHide ? (
      <span />
    ) : (
        <div
          className={`${
            !hidden ? 'bg-galaxy-tag-container-active' : 'bg-galaxy-tag-container'
          }`}
        >
          <div className='title'>{title}</div>
          <AntdTag
            className='bg-galaxy-tag-antTag'
            closable
            onClose={this.handleClose}
          >
            <span>{tag}</span>
          </AntdTag>
        </div>
    );
    return <div>{view}</div>;
  }
}

export default TitleTag;
