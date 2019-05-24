import React, { Component } from 'react'
import Liquidjs from 'liquidjs'
import jquery from 'jquery';
import BindoCodeMirror from '../../../components/BindoCodeMirror'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min'

const engine = new Liquidjs();

window.jQuery = jquery;
window.$ = jquery;

class Liquid extends Component {
  state = {
    liquidTemplate: '',
    liquidData: '',
    data: {},
    innerHtml: '',
  }

  componentDidMount() {
    window.abc = (props) => {
      console.info('-----abc', props);
    };
  }

  handleTemplateChange = (value) => {
    const {
      data,
      liquidTemplate,
    } = this.state;
    this.setState({
      liquidTemplate: value,
    });

    try {
      const template = engine.parse(liquidTemplate, data);
      engine.render(template, data).then(res => this.setState({innerHtml: res}))
    } catch (error) {
      console.error(error)
    }
  }

  handleDataChange = (value) => {
    // const {
    //   liquidTemplate,
    // } = this.state;

    // let data = {};
    try {
      // eslint-disable-next-line
      // eval(`(${value})`);
      // eslint-disable-next-line
      const fun = new Function(value);
      console.info(typeof fun);
      fun();
    } catch (error) {
      console.error(error)
    }

    this.setState({
      liquidData: value,
      // data,
    });

    // engine.parseAndRender(liquidTemplate, data).then(res => this.setState({innerHtml: res}))
  }

  render(){
    const {
      liquidTemplate,
      liquidData,
      innerHtml,
    } = this.state;

    return(
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          right: 0,
        }}
      >
        <div>Liquid</div>
        <BindoCodeMirror
          mode={{
            name: 'xml',
          }}
          style={{flex: 1, overflow: 'auto'}}
          value={liquidTemplate}
          onValueChange={this.handleTemplateChange}
        />
        <div>JavaScirpt</div>
        <BindoCodeMirror
          mode={{
            name: 'javascirpt',
            json: true,
          }}
          style={{flex: 1, overflow: 'auto'}}
          value={liquidData}
          onValueChange={this.handleDataChange}
        />
        <div>HTML</div>
        {
          <div style={{flex: 1, overflow: 'auto', border: '1px solid #263238'}}>
            <div
              // eslint-disable-next-line
              dangerouslySetInnerHTML={{ __html: innerHtml }}
            />
          </div>
        }
      </div>
    )
  }
}

export default Liquid
