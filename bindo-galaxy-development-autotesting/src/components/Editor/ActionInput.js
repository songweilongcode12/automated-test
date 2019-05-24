import React, { Component } from 'react';
import { Input } from 'antd';

class ActionInput extends Component {

  state = {
    defaultValue: null,
    value: null,
  }

  componentDidMount() {
    const { value } = this.props;
    this.setState({
      defaultValue: value,
      value,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { defaultValue } = this.state;
    const { value } = nextProps;
    if (defaultValue !== value) {
      this.setState({
        defaultValue: value,
        value,
      });
    }
  }

  handleChange = (evt) => {
    this.setState({
      value: evt.target.value,
    });
  }

  handleFocus = () => {
    const { value } = this.state;
    const { value: propsValue } = this.props;

    this.setState({
      value: value || propsValue,
    });
  }

  handleBlur = () => {
    this.handleOkClick();
  }

  handleOkClick = () => {
    const { onOkClick } = this.props;
    const { value } = this.state;

    if (typeof onOkClick === 'function') {
      onOkClick(value);
    }
  }

  handleCancelClick = () => {
    const { value } = this.props;

    this.setState({
      value,
    });
  }

  render() {
    const { value } = this.state;

    const props = {
      ...this.props,
    }

    delete props.onOkClick;

    return (
      <Input
        {...props}
        value={value}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onPressEnter={this.handleOkClick}
      />
    );
  }
}

export default ActionInput;
