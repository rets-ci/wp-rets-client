import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Swiper from 'react-id-swiper';
import merge from 'lodash/merge';
import get from 'lodash/get';
import remove from 'lodash/remove';
import Util from 'app_root/components/Util.jsx';

import { Lib }            from 'app_root/lib.jsx';
import { getListingTypeJSONFileName, daysPassedSincePostedDate }     from 'app_root/helpers/propertyHelper';
import AttributeTabSingle from 'app_root/components/PropertySingle/components/AttributeTabSingle.jsx';

import esSchema from 'app_root/static_data/property-data-structure/index.js';

const getAllTabData = (propertyDataStructure) => {
  let AllTab = {
    "name": "All",
    "children": []
  };
  let combinedChildren = propertyDataStructure.map(d => {
    return d.children;
  }).reduce((a, b) => {
    return a.concat(b);
  });
  combinedChildren = combinedChildren.map((d, i) => {
      d.order = i + 1;
      return d;
  });
  AllTab['children'] = combinedChildren;
  return AllTab;
};

const getTabClass = (tab, selectedTab) => {
  if (tab === selectedTab) {
    return `${Lib.THEME_CLASSES_PREFIX}attr-tab ${Lib.THEME_CLASSES_PREFIX}attr-tab-active`;
  } else {
    return `${Lib.THEME_CLASSES_PREFIX}attr-tab`; 
  }
};


class AttributeTabs extends Component {
  constructor(props) {
    super(props);

    console.log('[AttributeTabs] constructor');
    this.state = {
      selectedTab: 'All',
      attributesData: null,
      tabs: [],
    };
  }

  componentDidMount() {
    this.calculateAttrData();
  }

  componentWillReceiveProps(nextProps) {
    const previous_mlsId = get(this.props, 'curatedPropertyInfo.mlsId');
    const next_mlsId = get(nextProps, 'curatedPropertyInfo.mlsId');

    if (previous_mlsId !== next_mlsId) {
      this.calculateAttrData();
    }
  }

  selectTab = (tab) => {
    if (this.state.selectedTab !== tab) {
      this.setState({
        selectedTab: tab
      });
    }
  }

  calculateAttrData = () => {
    const listingTypeJSONFileName = getListingTypeJSONFileName(this.props.curatedPropertyInfo);
    let propertyDataStructure = null;
    let tabs = [];

    if (listingTypeJSONFileName) {
      propertyDataStructure = esSchema[listingTypeJSONFileName].slice(0);
      tabs = propertyDataStructure.map(t => t.name);

      propertyDataStructure.push(
        getAllTabData(propertyDataStructure)
      );
    }

    this.setState({
      attributesData: propertyDataStructure,
      tabs,
    });
  }

  generateDescription(property){
    let description;

    let listing_type = get(property, 'tax_input.wpp_listing_type.listing_type[0].slug');
    let listing_subtype = get(property, 'tax_input.wpp_listing_subtype.listing_sub_type[0].slug');

    let sale_types = get(property, 'tax_input.wpp_sale_status.listing_status_sale', []).map((item) => {
      return get(item, 'slug', '').replace('for-', '');
    });

    if(sale_types.length === 2){
      sale_types = sale_types.join('and');
    }

    switch(listing_type){
      case 'residential':

        let sale_type = get(property, 'tax_input.wpp_sale_status.listing_status_sale[0].slug');

        // Street information
        description = [get(property, 'post_meta.rets_street_number'), get(property, 'post_meta.rets_street_name'), get(property, 'post_meta.rets_unit_number')].join(' ');

        // Subtype and sale type
        description += [' is a', listing_subtype, sale_type.toLowerCase().replace('-', ' ')].join(' ');

        // Location
        description += ` in ${get(property, 'tax_input.location_city.location_city[0].name')}, ` + [get(property, 'tax_input.location_state.location_state[0].slug').toUpperCase(), get(property, 'tax_input.location_zip.location_zip[0].name')].join(' ') + '.';

        // Attributes
        description += [' This', Util.formatSQFTValue(get(property, 'post_meta.sqft[0]', 0)), 'SQFT', listing_subtype, 'sits', 'on a', Util.formatAcresValue(get(property, 'post_meta.rets_lot_size_area[0]', 0)), 'acre lot and features', get(property, 'post_meta.rets_beds[0]', 0), 'bedrooms and', get(property, 'post_meta.rets_total_baths[0]', 0), 'bathrooms.'].join(' ');

        // Additional info
        description += [' Built in', get(property, 'post_meta.rets_year_built[0]', 0) + ',', 'this ', listing_subtype, 'has been on the market for a total of', daysPassedSincePostedDate({rets_list_date: get(property, 'post_meta.rets_list_date[0]')}), 'days and is currently priced at', Util.formatPriceValue(get(property, 'post_meta.rets_list_price[0]', 0))].join(' ');

        if(sale_type.indexOf('rent') !== -1){
          description += ' a month.';
        }else{
          description += '.';
        }
        break;

      case 'commercial':

        // Street information
        description = [get(property, 'post_meta.rets_street_number'), get(property, 'post_meta.rets_street_name'), get(property, 'post_meta.rets_unit_number')].join(' ');

        // Subtype and sale type
        description += [' is a', listing_subtype, 'commercial space for', sale_types].join(' ');

        // Location
        description += ` in ${get(property, 'tax_input.location_city.location_city[0].name')}, ` + [get(property, 'tax_input.location_state.location_state[0].slug').toUpperCase(), get(property, 'tax_input.location_zip.location_zip[0].name')].join(' ') + '.';

        break;

      case 'land':

        // Street information
        description = [get(property, 'post_meta.rets_street_number'), get(property, 'post_meta.rets_street_name'), get(property, 'post_meta.rets_unit_number')].join(' ');

        // Subtype and sale type
        description += [' is a', get(property, 'post_meta.rets_lot_size_area'), 'acre lot for', sale_types].join(' ');

        // Location
        description += ` in ${get(property, 'tax_input.location_city.location_city[0].name')}, ` + [get(property, 'tax_input.location_state.location_state[0].slug').toUpperCase(), get(property, 'tax_input.location_zip.location_zip[0].name')].join(' ') + '.';

        break;
    }

    return description;
  }

  render() {
    const { selectedTab, attributesData, tabs } = this.state;
    const { esProperty, curatedPropertyInfo, isOneColumn } = this.props;
    const { listing_type, address, address_unit } = curatedPropertyInfo;

    if (!listing_type || !attributesData) {
      return null;
    }
    let content = attributesData.find(t => t.name === selectedTab);

    const swiperParams = {
      containerClass: `${Lib.THEME_CLASSES_PREFIX}attr-tabs-scroll`,
      freeMode: true,
      slidesPerView: 'auto',
      nextButton: '.swiper-button-next-custom',
      prevButton: '.swiper-button-prev-custom',
      nextButtonCustomizedClass: 'fa fa-angle-right',
      prevButtonCustomizedClass: 'fa fa-angle-left',
    };


    let scrollingTabs = null
    if (tabs.length) {
      scrollingTabs = (
        <Swiper {...swiperParams}>
          {tabs.map((tab) => {
            return (
              <div className={ getTabClass(tab, selectedTab) } key={ tab } onClick={ this.selectTab.bind(this, tab) }>
                { tab }
              </div>
            );
          })}
        </Swiper>
      )
    }

    let description = this.generateDescription(this.props.esProperty);

    return (
      <div className={ `${Lib.THEME_CLASSES_PREFIX}single-attrs-section pt-5` }>
        <div className={ `${Lib.THEME_CLASSES_PREFIX}info-section-header mb-4` }>
          Property Details for {address[0]} {address_unit}
        </div>

        <p className={ `${Lib.THEME_CLASSES_PREFIX}info-description text-muted py-3` }>
          {description}
        </p>

        <div className={ `${Lib.THEME_CLASSES_PREFIX}attr-tabs-header d-flex` }>
          <div className={ getTabClass('All', selectedTab) } onClick={ this.selectTab.bind(this, 'All') }>
            All
          </div>
          { scrollingTabs }
        </div>

        <div className={ `${Lib.THEME_CLASSES_PREFIX}attr-tabs-content` }>
          <AttributeTabSingle
            content={ content }
            esProperty={ esProperty }
            isOneColumn={ isOneColumn }
          />
        </div>
      </div>
    );
  }
};

AttributeTabs.propTypes = {
  esProperty: PropTypes.object.isRequired,
  curatedPropertyInfo: PropTypes.object.isRequired,
  isOneColumn: PropTypes.bool.isRequired,
};

export default AttributeTabs;
