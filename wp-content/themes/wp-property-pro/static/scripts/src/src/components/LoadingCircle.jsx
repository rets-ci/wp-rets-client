import React, {Component, PropTypes} from 'react';

class LoadingCircle extends Component {
  render() {
    let {
      style
    } = this.props;
    return (
      <div className="spinner-circle" style={style}>
        <div className="double-bounce1"></div>
        <div className="double-bounce2"></div>
      </div>
    );
  }
};

export default LoadingCircle;
