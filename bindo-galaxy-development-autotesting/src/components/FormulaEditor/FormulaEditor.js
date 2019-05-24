import React, { Component } from 'react';
import { Editor, EditorState, Modifier, ContentState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import './FormulaEditor.less'

class FormulaEditor extends Component {
  constructor(props) {
    super(props);
    const html = '1=2*a';
    const contentBlock = htmlToDraft(html);
    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
    const editorState = EditorState.createWithContent(contentState);
    this.state = {
      editorState,
    };
  }

  handleEditorChange = (editorState) => {
    this.setState({
      editorState,
    })
  }

  addStar = () => {
    const { editorState } = this.state;
    const contentState = Modifier.insertText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      '*',
      editorState.getCurrentInlineStyle(),
    );
    this.handleEditorChange(EditorState.push(editorState, contentState, 'insert-characters'));
  };

  toHtml = () => {
    const { editorState } = this.state;
    let text = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    text = text.replace(/<\/?.+?>/g, '');
    text = text.replace(/[\r\n]/g, '');
    text = text.replace(/<p>\s*<\/P>/g, '');
    text = text.replace(/<p>\s*<\/P>/g, '');
    // text = text.replace(/<p>|<\/p>|<p>\s*<\/P>/g, '');

    log.info(text)
  }

  addFun = () => {
    const { editorState } = this.state;
    let contentState = Modifier.insertText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      '$.self.id.IN()',
      editorState.getCurrentInlineStyle(),
    );
    contentState = contentState.createEntity()
    this.handleEditorChange(EditorState.push(editorState, contentState, 'insert-characters'));
  }

  render() {
    const { editorState } = this.state;

    return (
      <div>
        <div onClick={this.addStar}>Add Star</div>
        <div onClick={this.addFun}>Add Fun</div>
        <div onClick={this.toHtml}>To Html</div>
        <div style={{height: 100, width: '100%', overflow: 'auto'}}>
          <Editor
            editorState={editorState}
            onChange={this.handleEditorChange}
          />
        </div>
      </div>
    );
  }
}

export default FormulaEditor;
