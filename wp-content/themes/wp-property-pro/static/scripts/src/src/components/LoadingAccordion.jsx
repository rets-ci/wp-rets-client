import React, {Component, PropTypes} from 'react';

class LoadingAccordion extends Component {
  render() {
    let {
      style
    } = this.props;
    return (
      <div style={style}>
        <div className="spinner-accordion" style={{margin: 'auto'}}>
          <div className="rect1"></div>
          <div className="rect2"></div>
          <div className="rect3"></div>
          <div className="rect4"></div>
          <div className="rect5"></div>
        </div>
      </div>
    );
  }
};

export default LoadingAccordion;
