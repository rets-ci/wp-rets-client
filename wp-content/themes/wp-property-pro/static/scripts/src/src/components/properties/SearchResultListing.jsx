import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import Waypoint from 'react-waypoint';
import _ from 'lodash';

import LoadingCircle from '../LoadingCircle.jsx';
import { Lib } from '../../lib.jsx';
import PropertyCard from '../PropertyCard.jsx';


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
    this.properties = {};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.properties !== this.props.properties) {
      this.setState({loading: false});
    }
  }

  componentDidMount() {
    if (this.props.properties.length && this.props.selectedProperty) {
      this.scrollToProperty(this.props.selectedProperty)
    }
  }

  componentDidUpdate() {
    if (this.props.properties.length && this.props.selectedProperty) {
      this.scrollToProperty(this.props.selectedProperty)
    }
  }

  scrollToProperty(propertyId) {
    if (!this.properties[propertyId]) {
     console.log('chosen property was not found in the results');
    } else {
      let node = findDOMNode(this.properties[propertyId]);
      node.scrollIntoView({ behaviour: 'smooth' });
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return (this.props.properties !== nextProps.properties) ||
  //     (this.props.selectedProperty !== nextProps.selectedProperty) ||
  //     (this.props.isFetching !== nextProps.isFetching) ||
  //     (nextState.loading !== this.state.loading);
  // }

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
          <div className="row">
            {
              properties.map((p, i) => {
                let item = {
                  address: _.get(p, '_source.post_meta.rets_address', [''])[0],
                  address_unit: _.get(p, '_source.post_meta.address_unit', ''),
                  location: _.get(p, '_source.post_meta.wpp_location_pin', []),
                  baths: _.get(p, '_source.post_meta.rets_total_baths', 0),
                  beds: _.get(p, '_source.post_meta.rets_beds', 0),
                  city: _.get(p, '_source.tax_input.wpp_location.wpp_location_city[0].name', ''),
                  gallery_images: _.get(p, '_source.wpp_media', []).map((media) => media.url),
                  id: p._id,
                  living_area: _.get(p, '_source.post_meta.rets_living_area', 0),
                  lots_size: _.get(p, '_source.post_meta.rets_lot_size_area', 0),
                  price: _.get(p, '_source.post_meta.rets_list_price[0]', 0),
                  post_name: _.get(p, '_source.post_name', 0),
                  state: _.get(p, '_source.tax_input.wpp_location.wpp_location_state[0].name', ''),
                  type: _.get(p, '_source.tax_input.wpp_listing_type.listing_type[0].slug', ''),
                  sub_type: _.get(p, '_source.tax_input.wpp_listing_type.listing_sub_type[0].name', ''),
                  relative_permalink: _.get(p, '_source.permalink', ''),
                  thumbnail: _.get(p, '_source.post_meta.rets_thumbnail_url', [''])[0],
                  zip: _.get(p, '_source.post_meta.rets_postal_code[0]', '')
                };
                return (
                  <div className={`col-12 col-md-12 col-lg-6 col-xl-4`} key={i}>
                    <PropertyCard data={item} highlighted={selectedProperty === p._id} ref={(r) => this.properties[p._id] = r} />
                  </div>
                );
              })
            }
          </div>
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
