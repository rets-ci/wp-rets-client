import React, { Component } from 'react';
import PropertyCardList from './PropertyCardList.jsx';
import PropTypes from 'prop-types';
import Waypoint from 'react-waypoint';
import _ from 'lodash';

import LoadingCircle from '../LoadingCircle.jsx';
import { Lib } from '../../lib.jsx';


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

  shouldComponentUpdate(nextProps) {
    let update = nextProps.allowPagination !== this.props.allowPagination || 
      nextProps.isFetching !== this.props.isFetching ||
      _.difference(nextProps.properties, this.props.properties).length ||
      nextProps.selectedProperty !== this.props.selectedProperty ||
      nextProps.total !== this.props.total;
    return update;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.properties !== this.props.properties) {
      this.setState({loading: false});
    }
  }

  render() {
    let {
      isFetching,
      properties,
      selectedProperty,
      total
    } = this.props;
    let classNames = [];
    classNames.push(Lib.THEME_CLASSES_PREFIX + 'listing-wrap');
    if (isFetching) { classNames.push(Lib.THEME_CLASSES_PREFIX + 'loading-overlay'); }
    return (
      <div className={`${Lib.THEME_CLASSES_PREFIX}listing-wrap-container h-100`}>
        <div className={classNames.join(' ')}>
          <PropertyCardList properties={properties} selectedProperty={selectedProperty} />
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
                   <Waypoint
                    onEnter={() => {
                      this.setState({loading: true});
                      this.props.seeMoreHandler(); 
                    }}
                  /> 
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
