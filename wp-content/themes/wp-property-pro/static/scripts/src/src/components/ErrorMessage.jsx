import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Lib} from '../lib.jsx';

class ErrorMessage extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired
  }

  refresh() {
    window.location.reload();
  }

  render() {
    let {
      message
    } = this.props;
    return (
      <div className={`${Lib.THEME_CLASSES_PREFIX}error-message-container`}>
        <p className={`${Lib.THEME_CLASSES_PREFIX}gentle-error`}>{this.props.message}</p>
        <a className={`${Lib.THEME_CLASSES_PREFIX}refresh-link`} href="#" onClick={this.refresh}>Reload page</a>
      </div>
    )
  }
}

export default ErrorMessage;