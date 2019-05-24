import React,{ Component } from 'react';
// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';
import {
  Modal,
} from 'antd';
import Liquid from 'liquidjs'
import BindoFroalaEditor from '../../BindoFroalaEditor';

const engine = new Liquid();

class ExportTemplateModal extends Component{

  state = {
    liquidContext: '',
  }

  editorConfig = {
    toolbarBottom: false,
    toolbarButtons: [
      // 'getPDF',
      'print',
    ],
  }

  componentDidMount () {
    const {
      editorContext,
      exportRecord,
    } = this.props;
    // 处理editorContext, 特殊处理, 把{{}}里的&quot;替换为双引号, 为了使liquid语言里的日期数据可以使用
    const res = editorContext.replace(/&quot;/g, '"');

    this.parserLiquid(res, exportRecord);
  }

  /**
   * liquid数据解析
   * @editorContext html数据模版
   * @exportRecord 数据源
   */
  parserLiquid = (editorContext, exportRecord) => {

    try {
      const template = engine.parse(editorContext, exportRecord);
      engine.render(template, exportRecord).then(value => this.setState({
        liquidContext: value,
      }))
    } catch (error) {
      console.info(error)
    }
    // engine.parseAndRender(editorContext, exportRecord)
    //   .then(value => {
    //     this.setState({
    //       liquidContext: value,
    //     })
    //   })
  }

  render(){
    const {
      t,
      moduleID,
      onCancelClick,
    } = this.props;

    const {
      liquidContext,
    } = this.state;

    return(
      <Modal
        visible={true}
        title={t('common:editor.export')}
        onCancel={onCancelClick}
        width={1500}
        footer={null}
      >
        <BindoFroalaEditor
          model={liquidContext || 'No Data'}
          moduleID={moduleID}
          config={this.editorConfig}
        />
      </Modal>
    )
  }
}

export default ExportTemplateModal;
