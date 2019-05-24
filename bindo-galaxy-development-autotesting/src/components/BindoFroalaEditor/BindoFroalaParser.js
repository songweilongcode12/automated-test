import React from 'react';
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';
// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min'

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css'
import 'froala-editor/css/froala_editor.pkgd.min.css'

// Require Font Awesome.
import 'font-awesome/css/font-awesome.css'

export default (props) => (
  <FroalaEditorView {...props} />
);
