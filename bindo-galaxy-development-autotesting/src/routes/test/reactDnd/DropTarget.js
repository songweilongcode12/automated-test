import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';

const type = 'test';
const spec = {
  beginDrag (props, monitor, component) {
    log.info('beginDrag', props, monitor, component)
    // 返回需要注入的属性
    return {
      id: props.id,
    }
  },
  endDrag (props, monitor, component) {
    log.info('endDrag', props, monitor, component)
  },
  canDrag (props, monitor) {
    log.info('canDrag', props, monitor)
  },
  isDragging (props, monitor) {
    log.info('isDragging', props, monitor)
  },
};

class DropTargetComponent extends Component {
  handleClick = () => {
    log.info('handleClick DropTarget')
  }

  render () {
    const {
      connectDropTarget,
    } = this.props;
    return connectDropTarget(<div onClick={this.handleClick}>ReacDnd DropTarget</div>)
  }

}

export default DropTarget(
  type,
  spec,
  (connect) => ({
    connectDropTarget: connect.dropTarget(),
  })
)(DropTargetComponent);
