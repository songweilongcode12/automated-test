import React, { Component } from 'react';

const prefix = 'bg-c-dragside';

class RightSide extends Component {
  constructor(props) {
    super(props)
    const { width = 320 } = this.props;

    this.state = {
      width,
    }
  }

  handleMouseDown = () => {
    const line = this.dragline
    document.onmousemove = (e) => {
      const { width } = this.state;
      const newWidth = width - (e.clientX - line.offsetLeft)
      this.setState({
        width: newWidth,
      });
    }

    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
      if (line.releaseCapture) {
        line.releaseCapture();
      }
    }

    if (line.setCapture) {
      line.setCapture();
    }
  }

  handleDragRef = dragline => {
    this.dragline = dragline
  }

  render() {
    const { children, className = '' } = this.props;
    const { width } = this.state;
    return (
      <div className={`${prefix}-right ${className}`} style={{width}}>
        <div
          className={`${prefix}-dragline`}
          onMouseDown={this.handleMouseDown}
          ref={this.handleDragRef}
        />
        <div className={`${prefix}-content`}>
          { children }
        </div>
      </div>
    );
  }
}

export default RightSide;
