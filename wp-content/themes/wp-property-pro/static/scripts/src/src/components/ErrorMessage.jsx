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
        <i className="fa fa-exclamation-triangle fa-2x d-flex mr-3" aria-hidden="true"></i>
        <p>{message}</p>
      </div>
    )
  }
}

export default ErrorMessage;