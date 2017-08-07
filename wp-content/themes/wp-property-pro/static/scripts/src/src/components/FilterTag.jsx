import React, {Component} from 'react';
import {Lib} from '../lib.jsx';

class FilterTag extends Component {

  handleClick = (e) => {
    e.stopPropagation(); // need to stop propagation so that it doesn't open filter modal

    const { value, handleRemoveFilter } = this.props;

    if (typeof handleRemoveFilter === 'function') {
      handleRemoveFilter(value);
    }
  }

  render() {
    return (
      <span className={`${Lib.THEME_CLASSES_PREFIX}tag badge badge-default`}>
        <span>
          <i className="fa fa-times" onClick={this.handleClick}></i>
        </span>
        { this.props.display }
      </span>
    );
  }
}

export default FilterTag;
