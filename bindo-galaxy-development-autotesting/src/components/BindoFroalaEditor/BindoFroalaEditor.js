import React,{ Component } from 'react'
// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min'
import 'froala-editor/js/plugins/image.min'

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css'
import 'froala-editor/css/froala_editor.pkgd.min.css'

// Require Font Awesome.
import 'font-awesome/css/font-awesome.css'
import FroalaEditor from 'react-froala-wysiwyg'
import './BindoFroalaEditor.less'
import urls from '../../constants/urls'

const prefix = 'bg-c-bindo-froala';

class BindoFroalaEditor extends Component {
  handleModelChange = (model) => {
    const {
      onModelChange,
    } = this.props;

    if (typeof onModelChange === 'function') {
      onModelChange(model);
    }
  };

  render () {
    const {
      model,
      config = {},
      moduleID,
      appID,
    } = this.props;

    const froalaConfig = {
      editorClass: `${prefix}-wrapper`,
      placeholderText: 'Edit Your Content Here!',
      heightMin: 200,
      ...config,
    };

    if (appID) {
      froalaConfig.imageUploadURL = urls.uploadUrlByAppID.replace('{appID}', appID);
    }
    if (moduleID) {
      froalaConfig.imageUploadURL = urls.uploadUrlByModuleID.replace('{moduleID}', moduleID);
    }
    if (froalaConfig.imageUploadURL) {
      froalaConfig.imageUploadParam = 'upload[file]';
      froalaConfig.imageAddNewLine = true;
      froalaConfig.imageAllowedTypes = ['jpeg', 'jpg', 'png', 'bmp', 'gif'];
    }

    return (
      <div className={prefix}>
        <FroalaEditor
          tag='textarea'
          config={froalaConfig}
          model={model}
          onModelChange={this.handleModelChange}
        />
      </div>
    );
  }
}

export default BindoFroalaEditor;
