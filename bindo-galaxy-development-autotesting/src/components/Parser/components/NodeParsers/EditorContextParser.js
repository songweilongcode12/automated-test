import React, { Component } from 'react'
// import MdEditor from 'react-markdown-editor-lite'
import BindoFroalaEditor from '../../../BindoFroalaEditor'
import hocParser from './hocParser'

@hocParser()
class EditorParser extends Component {

  editorConfig = {
    toolbarBottom: false,
    toolbarButtons: [],
    events: {
      'froalaEditor.initialized': (e, editor) => {
        editor.edit.off()
      },
    },
  }

  render () {
    const {
      view,
    } = this.props;

    const {
      editorContext,
    } = view || {};

    return (
      <BindoFroalaEditor
        model={editorContext || 'Markdown No Data'}
        config={this.editorConfig}
      />
    )
  }
}
export default EditorParser;
