import React, { Component } from 'react';

import BindoCodeMirror from '../../BindoCodeMirror'
import actionConstans from '../../../constants/action';

const prefix = 'bg-c-editor-action'

class ActionTodoArea extends Component {
  state = {
    content: '',
  }

  changeCode = (editor, data, value) => {
    const {
      getCodeContent,
    } = this.props
    getCodeContent(editor, data, value)
  }

  /**
   * 判断应展示何种类型的actiontodo
   * @param actionToDoType 页面上的类型
   */
  showActionTodo = (actionToDoType) =>{
    const {
      chooseActionToDoType, // 用户选择的类型
    } = this.props;

    if (actionToDoType === chooseActionToDoType) return true;
  }

  handleDataChange = (value) => {
    const {
      getCodeContent,
    } = this.props
    getCodeContent(value);

    this.setState({
      content: value,
    })
  }

  render(){
    const {
      content,
    } = this.state;

    const {
      value: propsValue,
    } = this.props;

    return(
      <div>
        {
          this.showActionTodo(actionConstans.EXECUTEPYTHONCODE) &&
          <BindoCodeMirror
            className={`${prefix}-codeMiroor`}
            // options={{
            //   mode: 'python',
            //   theme: 'material',
            //   lineNumbers: true,
            //   cursorHeight: 0.85,
            // }}
            mode={{
              name: 'python',
              lineNumbers: true,
              cursorHeight: 0.85,
            }}
            // onChange={(editor, data, value) => {this.changeCode(editor, data, value)}}
            onValueChange={this.handleDataChange}
            value={content || propsValue}
          />
        }
        {
           this.showActionTodo(actionConstans.LIQUIDTEMPLATE) &&
           <BindoCodeMirror
             className={`${prefix}-codeMiroor`}
            //  options={{
            //    mode: 'htmlmixed',
            //    theme: 'material',
            //    lineNumbers: true,
            //    cursorHeight: 0.85,
            //  }}
            //  onChange={(editor, data, value) => {this.changeCode(editor, data, value)}}
             mode={{
               name: 'xml',
             }}
             value={content || propsValue}
             onValueChange={this.handleDataChange}
           />
        }
      </div>
    )
  }
}

export default ActionTodoArea
