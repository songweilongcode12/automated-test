import React, { Component } from 'react';
import { DragSource } from 'react-dnd';

const type = 'test';
const spec = {
  drop (props, monitor, component) {
    log.info('drop', props, monitor, component)
  },
  hover (props, monitor, component) {
    log.info('hover', props, monitor, component)
  },
  canDrop (props, monitor) {
    log.info('canDrop', props, monitor)
  },

};

class DragSourceComponent extends Component {
  handleClick = () => {
    log.info('handleClick DragSource')
  }

  render () {
    const { connectDragSource } = this.props
    return connectDragSource(<div onClick={this.handleClick}>ReacDnd DragSource</div>)
  }

}
export default DragSource(type, spec, (connect) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
}))(DragSourceComponent);
