import React, { Component } from 'react';
import { Table } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import './TableTree.less';

const prefix = 'bg-c-tabletree';

function dragDirection(
  initialClientOffset,
  clientOffset,
  sourceClientOffset,
) {
  const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
  const hoverClientY = clientOffset.y - sourceClientOffset.y;
  if (hoverClientY > hoverMiddleY) {
    return 'downward';
  }
  if (hoverClientY < hoverMiddleY) {
    return 'upward';
  }
}

let direction = '';

class BodyRow extends Component {
  render() {
    const {
      isOver,
      connectDragSource,
      connectDropTarget,
      moveRow,
      isMovable,
      dragRow,
      clientOffset,
      sourceClientOffset,
      initialClientOffset,
      ...restProps
    } = this.props;
    const style = { ...restProps.style, cursor: 'move' };

    let { className } = restProps;
    if (isOver && initialClientOffset) {
      const movable = isMovable(dragRow.record, restProps.record);
      if (dragRow.record.key !== restProps.record.key && movable) {
        direction = dragDirection(
          initialClientOffset,
          clientOffset,
          sourceClientOffset
        );
        if (direction === 'downward') {
          className += ' drop-over-downward';
        }
        if (direction === 'upward') {
          className += ' drop-over-upward';
        }
      }
    }

    return connectDragSource(
      connectDropTarget(
        <tr
          {...restProps}
          className={className}
          style={style}
        />
      )
    );
  }
}

const rowSource = {
  beginDrag(props) {
    return {
      index: props.index,
      record: props.record,
      isMovable: props.isMovable,
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const dragRecord = monitor.getItem().record;
    const { index: hoverIndex, record: hoverRecord, isMovable } = props;
    const movable = isMovable(dragRecord, hoverRecord);

    if (dragRecord.key === hoverRecord.key || !movable) {
      return;
    }

    props.moveRow({
      dragIndex,
      dragRecord,
      hoverIndex,
      hoverRecord,
      direction,
    });

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  sourceClientOffset: monitor.getSourceClientOffset(),
}))(
  DragSource('row', rowSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    dragRow: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset(),
  }))(BodyRow)
);

// eslint-disable-next-line react/no-multi-comp
class TableTree extends Component {
  components = {
    body: {
      row: DragableBodyRow,
    },
  }

  render() {
    const {
      draggable,
      isMovable,
      onMove,
      onRowClick,
      onRow,
    } = this.props;
    let props = {
      ...this.props,
      onRow: (record, index) => {
        if (typeof onRow === 'function') {
          onRow(record, index);
        }
        return {
          onClick: () => {
            if (typeof onRowClick === 'function') {
              onRowClick(record, index);
            }
          },
        }
      },
    };
    if (draggable) {
      props = {
        components: this.components,
        ...this.props,
        onRow: (record, index) => {
          if (typeof onRow === 'function') {
            onRow(record, index);
          }
          return {
            index,
            record,
            moveRow: onMove || (() => {}),
            isMovable: isMovable || (() => true),
            onClick: () => {
              if (typeof onRowClick === 'function') {
                onRowClick(record, index);
              }
            },
          }
        },
      }
    }

    delete props.onRowClick;

    return (
      <Table
        {...props}
        className={prefix}
      />
    );
  }
}

export default DragDropContext(HTML5Backend)(TableTree);
