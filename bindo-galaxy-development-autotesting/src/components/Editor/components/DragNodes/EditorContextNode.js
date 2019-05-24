import React, { Component } from 'react'
import hocNode from './hocNode'
import BindoFroalaEditor from '../../../BindoFroalaEditor'

@hocNode()
class EditorNode extends Component {

  editorConfig = {
    toolbarBottom: false,
    toolbarButtons: [],
    heightMin: 100,
    events: {
      'froalaEditor.initialized': (e, editor) => {
        editor.edit.off()
      },
    },
  }

  render() {
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

export default EditorNode;
