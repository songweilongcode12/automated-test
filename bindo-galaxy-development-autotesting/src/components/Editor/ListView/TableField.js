import React, { Component } from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  border: '1px solid lightgreen',

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'white',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const Title = styled.div`
  padding: 16px 16px;
  background: #fafafa;
  min-width: 120px;
  transition: background .3s ease;
  text-align: left;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  border-bottom: 1px solid #e8e8e8;
`;

class TableField extends Component {
  render () {

    const { item, index, field, selectedViewUuid } = this.props;
    let labelItem = item.uuid;

    if (field && field.label) {
      labelItem = field.label;
    }

    return (
      <Draggable key={index} draggableId={item.uuid} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style,
              selectedViewUuid === item.uuid
            )}
          >
            <Title key={index} item={item} index={index}>{labelItem}</Title>
          </div>
        )}
      </Draggable>
    );
  }
}

export default TableField;
