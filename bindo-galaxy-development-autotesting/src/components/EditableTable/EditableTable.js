import React, { Component } from 'react';
import { Table, Input, Form } from 'antd';
import './EditableTable.less';

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends Component {
  state = {
    editing: false,
  }

  componentDidMount() {
    const { editable } = this.props;

    if (editable) {
      document.addEventListener('click', this.handleClickOutside, true);
    }
  }

  componentWillUnmount() {
    const { editable } = this.props;

    if (editable) {
      document.removeEventListener('click', this.handleClickOutside, true);
    }
  }

  toggleEdit = () => {
    const { editing } = this.state;
    this.setState({
      editing: !editing,
    }, () => {
      if (!editing) {
        this.input.focus();
      }
    });
  }

  handleClickOutside = (e) => {
    const { editing } = this.state;
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save();
    }
  }

  save = () => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  }

  refCell = (node) => {
    this.cell = node
  }

  refInput = (node) => {
    this.input = node
  }

  render() {
    const { editing } = this.state;
    const {
      editable,
      dataIndex,
      title,
      record,
      required,
      index,
      handleSave,
      ...restProps
    } = this.props;
    return (
      <td ref={this.refCell} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form;
              return (
                editing ? (
                  <Form.Item style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                      rules: [{
                        required,
                        message: `${title} is required.`,
                      }],
                      initialValue: record[dataIndex],
                    })(
                      <Input ref={this.refInput} onPressEnter={this.save} />
                    )}
                  </Form.Item>
                ) : (
                  <div
                    className="editable-cell-value-wrap"
                    style={{ paddingRight: 24 }}
                    onClick={this.toggleEdit}
                  >
                    {restProps.children}
                  </div>
                )
              );
            }}
          </EditableContext.Consumer>
        ) : restProps.children}
      </td>
    );
  }
}
// eslint-disable-next-line react/no-multi-comp
class EditableTable extends Component {

  handleSave = (row) => {
    const { dataSource, onDataChange = () => {} } = this.props;
    const newData = [...dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    const rowData = {
      ...item,
      ...row,
    };
    newData.splice(index, 1, rowData);

    onDataChange({ dataSource: newData, index, rowData });
  }

  getColumns = () => {
    const { columns } = this.props;

    return columns.map(column => {
      if (!column.editable) {
        return column;
      }

      return {
        ...column,
        onCell: record => ({
          record,
          editable: column.editable,
          dataIndex: column.dataIndex,
          title: column.title,
          handleSave: this.handleSave,
        }),
      };
    });
  }

  render() {
    const props = {...this.props};
    delete props.components;
    delete props.columns;

    return (
      <Table
        components={{
          body: {
            row: EditableFormRow,
            cell: EditableCell,
          },
        }}
        rowClassName={() => 'editable-row'}
        bordered
        columns={this.getColumns()}
        {...props}
      />
    );
  }
}

export default EditableTable;
