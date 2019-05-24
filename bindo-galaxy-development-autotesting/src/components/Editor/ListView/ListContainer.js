import React, { Component } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import TableField from './TableField';

const prefix = 'bindo-galaxy-editor-container';

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'white',
  display: 'flex',
  padding: 8,
  // overflow: 'auto',
  minHeight: 160,
});

class ListContainer extends Component {

  getField = (uuid) => {
    const { fields } = this.props;

    for (let i = 0; i < fields.length; i++) {
      if (fields[i].uuid === uuid) {
        return fields[i];
      }
    }
  }

  render() {
    const { viewModels = [], selectedViewUuid } = this.props;

    return (
      <Droppable droppableId="listview-container-fields" direction="horizontal">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            className={`${prefix}-content`}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {viewModels.map((item, index) => {
              const field = this.getField(item.uuid);

              return (
                <TableField key={item.uuid} item={item} field={field} index={index} selectedViewUuid={selectedViewUuid} />
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  }
}

export default ListContainer;
