import React, { Component } from 'react';
import PropertyCardList from './PropertyCardList.jsx';
import PropTypes from 'prop-types';
import Waypoint from 'react-waypoint';
import difference from 'lodash/difference';

import LoadingCircle from '../LoadingCircle.jsx';
import { Lib } from '../../lib.jsx';

const isMobile = window.innerWidth < 576;

class SearchResultListing extends Component {
  static propTypes = {
    allowPagination: PropTypes.bool.isRequired,
    properties: PropTypes.array.isRequired,
    seeMoreHandler: PropTypes.func.isRequired,
    total: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate = (
      nextProps.allowPagination !== this.props.allowPagination || 
      !!difference(nextProps.properties, this.props.properties).length ||
      nextProps.selectedProperty !== this.props.selectedProperty ||
      nextProps.total !== this.props.total ||
      nextState.loading !== this.state.loading
    );
    return shouldUpdate;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.properties !== this.props.properties) {
      this.setState({loading: false});
    }
  }

  render() {
    let {
      properties,
      selectedProperty,
      total
    } = this.props;

    // For desktop view there is button for loading next page
    let loadMoreHandler = <a href="#" onClick={(e) => {
      e.preventDefault();

      this.setState({loading: true});
      this.props.seeMoreHandler();
    }}>Load more</a>;

    // For mobile view there is scroll waypoint for loading next page
    if(isMobile){
      loadMoreHandler = <Waypoint
        onEnter={() => {
          this.setState({loading: true});
          this.props.seeMoreHandler();
        }}
      />;
    }

    return (
      <div className={`${Lib.THEME_CLASSES_PREFIX}listing-wrap-container h-100`}>
        <div className={`${Lib.THEME_CLASSES_PREFIX}listing-wrap`}>
          <PropertyCardList
            properties={properties}
            selectedProperty={selectedProperty}
            onUpdateSelectedProperty={this.props.onUpdateSelectedProperty}
          />
        </div>
        {this.props.allowPagination ?
          <div className={Lib.THEME_CLASSES_PREFIX + "search-result-container"}>
            <div className={Lib.THEME_CLASSES_PREFIX + "search-result-inner-container"}>
              {this.state.loading ?
                <LoadingCircle />
              : null}
              <p>Showing {this.props.properties.length} out of {total} results</p> 
              {!this.state.loading ?
                <div className={`${Lib.THEME_CLASSES_PREFIX}waypoint-container`}>
                  {loadMoreHandler}
                </div>
            : null}
              <p></p>  
            </div>
          </div>
          : null}
      </div>
    );
  }
}

export default SearchResultListing;
