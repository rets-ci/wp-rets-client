import React, { Component } from 'react';
import PropertyCardList from './PropertyCardList.jsx';
import PropTypes from 'prop-types';
import Waypoint from 'react-waypoint';
import difference from 'lodash/difference';

import { Lib } from '../../lib.jsx';


class SearchResultListing extends Component {
  static propTypes = {
    allowPagination: PropTypes.bool.isRequired,
    properties: PropTypes.array.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    total: PropTypes.number
  };

  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate = (
      nextProps.allowPagination !== this.props.allowPagination || 
      !!difference(nextProps.properties, this.props.properties).length ||
      nextProps.selectedProperty !== this.props.selectedProperty ||
      nextProps.total !== this.props.total
    );
    return shouldUpdate;
  }

  handleLoadMore = (e) => {
    if (typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    this.props.onLoadMore();
  }

  render() {
    let {
      properties,
      selectedProperty,
      total,
      allowPagination,
      isMobile,
    } = this.props;

    return (
      <div className={`${Lib.THEME_CLASSES_PREFIX}listing-wrap-container h-100`}>
        <div className={`${Lib.THEME_CLASSES_PREFIX}listing-wrap`}>
          <PropertyCardList
            properties={properties}
            selectedProperty={selectedProperty}
            onUpdateSelectedProperty={this.props.onUpdateSelectedProperty}
          />
        </div>
        { allowPagination &&
          ( isMobile
            ? (<div className={ `${Lib.THEME_CLASSES_PREFIX}search-result-container` }>
                <Waypoint onEnter={ this.handleLoadMore } />
              </div>)
            : (<div className={ `${Lib.THEME_CLASSES_PREFIX}search-result-container` }>
                <a className="btn" onClick={ this.handleLoadMore }>{'Load More'}</a>
                <span>{ `${properties.length} of ${total} `}</span>
              </div>)
          )
        }
      </div>
    );
  }
}

export default SearchResultListing;
