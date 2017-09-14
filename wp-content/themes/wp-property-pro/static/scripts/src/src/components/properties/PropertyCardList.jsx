import {difference} from 'lodash';
import PropertyCard from '../PropertyCard.jsx';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import { findDOMNode } from 'react-dom';

class PropertyCardList extends Component {
  static propTypes = {
    properties: PropTypes.array.isRequired,
    selectedProperty: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {};
    this.properties = {};
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

  shouldComponentUpdate(nextProps) {
    return difference(nextProps.properties, this.props.properties).length ||
      nextProps.selectedProperty !== this.props.selectedProperty;
  }

  render() {
    let {
      selectedProperty,
      properties
    } = this.props;
    return (
      <div className="row">
        {
          properties.map((p, i) => {
            let item = {
              address: _.get(p, '_source.post_meta.rets_address', [''])[0],
              address_unit: _.get(p, '_source.post_meta.address_unit', '')[0],
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
              sqft: _.get(p, '_source.post_meta.sqft[0]', ''),
              sub_type: _.get(p, '_source.tax_input.wpp_listing_type.listing_sub_type[0].name', ''),
              relative_permalink: _.get(p, '_source.permalink', ''),
              thumbnail: _.get(p, '_source.post_meta.rets_thumbnail_url', [''])[0],
              zip: _.get(p, '_source.post_meta.rets_postal_code[0]', '')
            };
            return (
              <div className={`col-12 col-md-12 col-lg-6 col-xl-4`} key={p._id}>
                <PropertyCard data={item} highlighted={selectedProperty === p._id} ref={(r) => this.properties[p._id] = r} />
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default PropertyCardList;