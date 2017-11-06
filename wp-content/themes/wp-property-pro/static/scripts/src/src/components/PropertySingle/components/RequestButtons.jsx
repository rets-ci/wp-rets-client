import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Lib } from 'app_root/lib.jsx';


class RequestButtons extends Component {

  handleBtnClick = (type) => {
    this.props.onClick(type);
  }

  render() {
    const { saleType, saleTypeWithRDC } = this.props;

    const btnClass = `btn btn-primary ${Lib.THEME_CLASSES_PREFIX}button`;

    const typeA = 'request-showing-' + saleType;
    const typeB = 'request-information-' + saleType;
    const typeC = 'request-application';

    return (
      <div className={ `${Lib.THEME_CLASSES_PREFIX}request-buttons` }>
        <button
          type="button"
          className={`${btnClass} ${Lib.THEME_CLASSES_PREFIX}primary-button`}
          onClick={this.handleBtnClick.bind(this, typeA)}
        >
          Request Showing
        </button>

        {['rentNOTRdc', 'saleRDC', 'saleNotRdc'].indexOf(saleTypeWithRDC) >= 0 &&
          <button
            type="button"
            className={`${btnClass} ${Lib.THEME_CLASSES_PREFIX}secondary-button`}
            onClick={this.handleBtnClick.bind(this, typeB)}
          >
            Request Information
          </button>
        }

        {saleTypeWithRDC === 'rentRDC' &&
          <button
            type="button"
            className={`${btnClass} ${Lib.THEME_CLASSES_PREFIX}secondary-button`}
            onClick={this.handleBtnClick.bind(this, typeC)}
          >
            Request Application
          </button>
        }
      </div>
    );
  }
}

RequestButtons.propTypes = {
  saleType: PropTypes.string,
  saleTypeWithRDC: PropTypes.string,
  onClick: PropTypes.func,
};

export default RequestButtons;
