import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Waypoint from 'react-waypoint';

import { Lib } from '../../lib.jsx';
import SearchResultListingPlaceholder from 'app_root/components/properties/SearchResultListingPlaceholder.jsx';
import PropertyCardList from './PropertyCardList.jsx';



class SearchResultListing extends Component {
  static propTypes = {
    properties: PropTypes.array.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    total: PropTypes.number,
    isMobile: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
  };

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
      isFetching,
      isMobile,
    } = this.props;

    const allowPagination = properties.length < total;

    return (
      <div className={ `${Lib.THEME_CLASSES_PREFIX}listing-wrap-container` }>
        <div className={`${Lib.THEME_CLASSES_PREFIX}listing-wrap`}>
          <PropertyCardList
            properties={properties}
            selectedProperty={selectedProperty}
            onUpdateSelectedProperty={this.props.onUpdateSelectedProperty}
          />
          { isFetching &&
            <SearchResultListingPlaceholder isMobile={ isMobile }/>
          }
        </div>
        { allowPagination && !isFetching &&
          ( isMobile
            ? <div className={ `${Lib.THEME_CLASSES_PREFIX}search-result-container` }>
                <Waypoint onEnter={ this.handleLoadMore } />
              </div>
            : <div className={ `${Lib.THEME_CLASSES_PREFIX}search-result-container` }>
                <a className="btn" onClick={ this.handleLoadMore }>{'Load More'}</a>
                <span>{ `${properties.length} of ${total} `}</span>
              </div>
          )
        }
      </div>
    );
  }
}

export default SearchResultListing;
