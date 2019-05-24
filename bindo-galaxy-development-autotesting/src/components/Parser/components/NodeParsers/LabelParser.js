import React, { Component } from 'react'
import hocParser from './hocParser'

@hocParser()
class LabelParser extends Component {
  render() {
    const { view } = this.props;
    const {
      fontWeight = 500,
      fontSize = 14,
      label,
    } = view || {};

    const nodeProps = {
      style: {
        paddingRight: '5px',
        color: 'rgba(0, 0, 0, 0.85)',
        verticalAlign: 'middle',
        display: 'inline-block',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        fontWeight,
        fontSize,
      },
    };

    return (
      <div
        style={{
          display: 'flex',
          paddingTop: '11px',
        }}
      >
        <div {...nodeProps}>
          {label}
        </div>
      </div>
    );
  }
}

export default LabelParser;
