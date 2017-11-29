import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import Waypoint from 'react-waypoint';

import { Lib }      from 'app_root/lib.jsx';
import htmlHelper from 'app_root/helpers/htmlHelper';
import PropertyCardList from 'app_root/components/properties/PropertyCardList.jsx';
import SearchResultListingPlaceholder from 'app_root/components/properties/SearchResultListingPlaceholder.jsx';


class SearchResultListing extends Component {
  static propTypes = {
    properties: PropTypes.array.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    total: PropTypes.number,
    isMobile: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
  };

  componentDidUpdate(prevProps) {
    // Scroll a bit down to make 2 loading cards fully visible
    if (this.props.isFetching && this.loaderDOM) {
      const container = document.querySelector(`.${Lib.THEME_CLASSES_PREFIX}listing-sidebar`);
      const node = findDOMNode(this.loaderDOM);
      htmlHelper.scrollToElement(container, node, 0);
    }
  }

  setLoaderDOM = (d) => {
    this.loaderDOM = d;
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
          <SearchResultListingPlaceholder
            isFetching={ isFetching }
            isMobile={ isMobile }
            onInit={ this.setLoaderDOM }
          />
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
