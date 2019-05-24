import React from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/css/css'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/python/python'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/yaml/yaml'
import 'codemirror/mode/jsx/jsx'

export default (props) => {
  const {
    mode = '',
    className = '',
    value = '',
    onChange = () => {},
    onValueChange = () => {},
    style = {},
  } = props;

  return (
    <div style={style}>
      <CodeMirror
        className={className}
        options={{
          mode,
          theme: 'material',
          lineNumbers: true,
        }}
        onBeforeChange={(editor, data, valueData) => {
          onValueChange(valueData);
          onChange(editor, data, valueData);
        }}
        value={value}
      />
    </div>
  )
}
