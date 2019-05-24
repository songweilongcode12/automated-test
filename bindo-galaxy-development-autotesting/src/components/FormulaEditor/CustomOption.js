import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { EditorState, Modifier } from 'draft-js';
// import { Editor } from 'react-draft-wysiwyg';

class CustomOption extends Component {

  addStar = () => {
    const { editorState, onChange } = this.props;
    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      'a',
      editorState.getCurrentInlineStyle(),
    );
    onChange(EditorState.push(editorState, contentState, 'insert-characters'));
  };

  render() {
    return (
      <span onClick={this.addStar}>
        a
      </span>
    );
  }
}

export default CustomOption;
