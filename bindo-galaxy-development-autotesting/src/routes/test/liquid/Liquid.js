import React, { Component } from 'react'
import Liquidjs from 'liquidjs'
import BindoCodeMirror from '../../../components/BindoCodeMirror'

const engine = new Liquidjs();

class Liquid extends Component {
  state = {
    liquidTemplate: '',
    liquidData: '',
    data: {},
    innerHtml: '',
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
    const {
      liquidTemplate,
    } = this.state;

    let data = {};
    try {
      // eslint-disable-next-line
      data = eval(`(${value})`);
    } catch (error) {
      console.error(error)
    }

    this.setState({
      liquidData: value,
      data,
    });

    engine.parseAndRender(liquidTemplate, data).then(res => this.setState({innerHtml: res}))
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
        <div>Data</div>
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
          <div style={{flex: 1, overflow: 'auto'}}>
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
