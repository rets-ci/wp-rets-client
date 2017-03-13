import React, {Component, PropTypes} from 'react';

class LoadingIcon extends Component {
  render() {
    let {
      style
    } = this.props;
    return (
      <div className="spinner" style={style}>
        <div className="double-bounce1"></div>
        <div className="double-bounce2"></div>
      </div>
    );
  }
};

export default LoadingIcon;
