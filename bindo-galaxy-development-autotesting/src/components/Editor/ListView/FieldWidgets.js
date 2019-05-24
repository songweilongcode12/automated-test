import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import widgets from '../../../constants/widgets';

const prefix = 'bindo-galaxy-editor-widgets';

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'white',
  padding: 8,
  flex: 1,
  // overflow: 'auto',
});

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  border: '1px solid lightgreen',
  background: isDragging ? 'lightgreen' : 'white',
  margin: '2px 0',
  padding: '8px',
  ...draggableStyle,
});

@translate()
class FieldWidgets extends Component {
  getFieldsData = () => {
    const {
	  fields = [],
	  viewModels = [],
    } = this.props;
    const uuidSet = new Set();
    viewModels.forEach(child => {
      uuidSet.add(child.uuid);
    });
	  const options = [];
	  fields.forEach(field => {
      if (!uuidSet.has(field.uuid)) {
        options.push({
          uuid: field.uuid,
          viewType: widgets.WIDGET,
          type: widgets.TABLE_OPTION,
          label: field.label,
          name: field.name,
        });
      }
	  });
	  return options;
  };

  render() {
    return (
      <div className={`${prefix}-forlist`}>
        <Droppable droppableId="listview-widgets-fields">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {this.getFieldsData().map((field, index) => (
                <Draggable key={field.uuid} draggableId={field.uuid} index={index}>
                  {(provide, snapshots) => (
                    <div
                      ref={provide.innerRef}
                      {...provide.draggableProps}
                      {...provide.dragHandleProps}
                      style={getItemStyle(
                        snapshots.isDragging,
                        provide.draggableProps.style
                      )}
                    >
                      {field.label}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    );
  }
}

export default FieldWidgets;
