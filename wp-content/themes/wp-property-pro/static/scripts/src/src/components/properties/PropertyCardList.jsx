import React, {Component} from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import difference from 'lodash/difference';
import get from 'lodash/get';
import map from 'lodash/map';
import find from 'lodash/find';

import {
  receivePropertySingleResult,
  receivePropertySingleFetchingError,
  requestPropertySingleResult,
  selectPropertyOnMap,
} from 'app_root/actions/index.jsx';
import { Lib }      from 'app_root/lib.jsx';
import htmlHelper   from 'app_root/helpers/htmlHelper';
import Api          from 'app_root/containers/Api.jsx';
import PropertyCard from 'app_root/components/PropertyCard.jsx';


const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    selectPropertyOnMap: (property) => {
      dispatch(selectPropertyOnMap(property));
    }
  }
}

class PropertyCardList extends Component {
  static propTypes = {
    properties: PropTypes.array.isRequired,
    selectedProperty: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.selectedPropertyOnList = null;
    this.propertiesDOM = {};
  }

  componentDidMount() {
    if (this.props.properties.length && this.props.selectedProperty) {
      this.scrollToProperty(this.props.selectedProperty);
      const property = this.getPropertyRecordByMlsID(this.props.selectedProperty);
      if (!property) {
        console.log('selected property was not found')
      } else {
        this.props.selectPropertyOnMap(property._source); 
      }
    }
  }

  componentDidUpdate() {
    if (this.props.properties.length && this.props.selectedProperty) {
      // If a property is selected on list section, do not scroll
      if (this.props.selectedProperty !== this.selectedPropertyOnList) {
        this.scrollToProperty(this.props.selectedProperty);
        this.selectedPropertyOnList = this.props.selectedProperty;
      }
      const property = this.getPropertyRecordByMlsID(this.props.selectedProperty);
      if (!property) {
        console.log('selected property was not found')
      } else {
        this.props.selectPropertyOnMap(property._source); 
      }
    }
  }

  shouldComponentUpdate(nextProps) {
    return difference(nextProps.properties, this.props.properties).length ||
      nextProps.selectedProperty !== this.props.selectedProperty;
  }

  scrollToProperty(propertyId) {
    if (!this.propertiesDOM[propertyId]) {
     console.log('chosen property was not found in the results');
    } else {
      // it's listing container (not body) which is scrollable
      const container = document.querySelector(`.${Lib.THEME_CLASSES_PREFIX}listing-sidebar`);
      const node = findDOMNode(this.propertiesDOM[propertyId]);
      htmlHelper.scrollToElement(container, node, 500);
    }
  }

  getPropertyRecordByMlsID = (mlsID) => {
    let foundProperty = this.props.properties.filter(d => {
      return get(d, '_source.post_meta.rets_mls_number[0]', null) === mlsID
    });
    return foundProperty.length ? foundProperty[0] : null
  }

  handlePropertyClick = (propertyId) => {
    this.props.onUpdateSelectedProperty(propertyId);
    const property = this.getPropertyRecordByMlsID(propertyId);
    
    if (!property) {
      console.log('property was not found')
    } else {
      this.selectedPropertyOnList = propertyId;
      this.props.selectPropertyOnMap(property._source);
    }
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
              address: get(p, '_source.post_meta.rets_address', [''])[0],
              address_unit: get(p, '_source.post_meta.address_unit', '')[0],
              location: get(p, '_source.post_meta.wpp_location_pin', []),
              baths: get(p, '_source.post_meta.rets_total_baths', 0),
              beds: get(p, '_source.post_meta.rets_beds', 0),
              city: get(p, '_source.tax_input.wpp_location.wpp_location_city[0].name', ''),
              gallery_images: get(p, '_source.wpp_media', []).map((media) => media.url),
              id: get(p, '_source.post_meta.rets_mls_number[0]', null),
              living_area: get(p, '_source.post_meta.rets_living_area', 0),
              lots_size: get(p, '_source.post_meta.rets_lot_size_area', 0),
              price: get(p, '_source.post_meta.rets_list_price[0]', 0),
              post_name: get(p, '_source.post_name', 0),
              state: get(p, '_source.tax_input.wpp_location.wpp_location_state[0].name', ''),
              type: get(p, '_source.tax_input.wpp_listing_type.listing_type[0].slug', ''),
              sqft: get(p, '_source.post_meta.sqft[0]', ''),
              sub_types: map(get(p, '_source.tax_input.wpp_listing_subtype.listing_sub_type', []), 'name'),
              relative_permalink: get(p, '_source.permalink', ''),
              thumbnail: get(p, '_source.post_meta.rets_thumbnail_url', [''])[0],
              zip: get(p, '_source.post_meta.rets_postal_code[0]', '')
            };

            return (
              <div className={`col-12 col-xl-6`} key={item.id}>
                <PropertyCard
                  data={item}
                  highlighted={selectedProperty === item.id}
                  propertiesDOM={this.propertiesDOM}
                  openPanelWhenClicked={true}
                  onClickCard={this.handlePropertyClick}
                />
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertyCardList);
