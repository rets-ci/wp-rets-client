import React, { Component } from 'react'
import PropTypes from 'prop-types'
import throttle from 'lodash/throttle'

class InputWrapper extends Component {

  constructor(props) {
    super(props)

    this.state = {
      value: this.props.value || ''
    }

    const DELAY = this.props.delay || 500;

    if (this.props.onChangeValue) {
      this.throttledChange = throttle(this.props.onChangeValue, DELAY, { leading: false })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value })
    }
  }

  _handleKeyPress = event => {
    if (event.key === 'Enter' && this.props.onPressEnter) {
      this.props.onPressEnter(this.state.value)
    }
  }

  _handleChange = event => {
    this.setState({ value: event.target.value })

    if (this.throttledChange) {
      this.throttledChange(event.target.value)
    }
  }

  _handleClear = () => {
    this.setState({ value: '' })
    if (this.props.onClearValue) {
      this.props.onClearValue()
    }
  }


  render () {

    return (
      <input
        type="text"
        autoComplete="off"
        id={this.props.id}
        className={this.props.className}
        placeholder={this.props.placeholder}
        value={this.state.value}
        onChange={this._handleChange}
        onKeyPress={this._handleKeyPress}
        ref={this.props.onInit}
      />
    )
  }
}

InputWrapper.propTypes = {
  onChangeValue: PropTypes.func,
  onClearValue: PropTypes.func,
  onPressEnter: PropTypes.func,
  delay: PropTypes.number,
}

export default InputWrapper
