import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Swiper from 'react-id-swiper';
import merge from 'lodash/merge';
import get from 'lodash/get';

import { Lib }            from 'app_root/lib.jsx';
import { getListingTypeJSONFileName }     from 'app_root/helpers/propertyHelper';
import AttributeTabSingle from 'app_root/components/PropertySingle/components/AttributeTabSingle.jsx';

import esSchema from 'app_root/static_data/property-data-structure/index.js';


const LISTING_TYPES_TO_HIDE = [ 'commercial', 'land' ];
const descriptionBoilerplate = '847 Estes Street is a house for rent in Durham, NC 27701. This 1440 square foot house sits on a 0.13 lot and features 3 bedrooms and 2 bathrooms. Built in 1915, this house has been on the market for a total of 1 month and is currently priced at $1,100 a month.';

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
  AllTab['children'] = combinedChildren;
  return AllTab;
};

class AttributeTabs extends Component {
  constructor(props) {
    super(props);

    console.log('******* AttributeTabs constructor');
    this.state = {
      selectedTab: 'All'
    };
  }

  selectTab = (tab) => {
    this.setState({
      selectedTab: tab
    });
  }

  componentWillReceiveProps(nextProps) {
    const previous_mlsId = get(this.props, 'curatedPropertyInfo.mlsId');
    const next_mlsId = get(nextProps, 'curatedPropertyInfo.mlsId');
    console.log('============ AttributeTabs nextProps', nextProps, previous_mlsId, next_mlsId);
  }

  render() {
    const { selectedTab } = this.state;
    const { esProperty, curatedPropertyInfo, isOneColumn } = this.props;
    const { listing_type, address, address_unit } = curatedPropertyInfo;

    if (!listing_type || LISTING_TYPES_TO_HIDE.indexOf(listing_type) >= 0) {
      return null;
    }

    let listingTypeJSONFileName = getListingTypeJSONFileName(curatedPropertyInfo);

    if (!listingTypeJSONFileName) {
      return null;
    }

    let propertyDataStructure = esSchema[listingTypeJSONFileName].slice(0);
    let allTab = getAllTabData(propertyDataStructure);
    propertyDataStructure.push(allTab);
    let tabs = propertyDataStructure.map(p => p.name);
    let content = propertyDataStructure.find(d => d.name === selectedTab);

    const swiperParams = {
      containerClass: `${Lib.THEME_CLASSES_PREFIX}attr-tabs-scroll`,
      freeMode: true,
      slidesPerView: 'auto',
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
      onInit: (swiper) => {
        this.swiper = swiper;
      }
    };

    return (
      <div className={ `${Lib.THEME_CLASSES_PREFIX}single-attrs-section pt-5` }>
        <h5 className={ `${Lib.THEME_CLASSES_PREFIX}info-section-header mb-4` }>
          Property Details for {address[0]} {address_unit}
        </h5>

        <p className={ `${Lib.THEME_CLASSES_PREFIX}info-description text-muted py-3` }>
          {descriptionBoilerplate}
        </p>

        <div className={ `${Lib.THEME_CLASSES_PREFIX}attr-tabs-header d-flex` }>
          {tabs.length &&
            <Swiper {...swiperParams}>
              {tabs.map((tab, i) =>
                <div className={ `${Lib.THEME_CLASSES_PREFIX}attr-tab` }
                  key={tab} style={{ paddingLeft: 50, paddingRight: 50 }}>
                  {tab}
                </div>
              )}
            </Swiper>
          }
          <div className={ `${Lib.THEME_CLASSES_PREFIX}attr-tab-fixed` }>
            All
          </div>
        </div>

        <div className="card text-center mb-4">

          <div className="card-block">
            <div>
              <AttributeTabSingle
                content={ content }
                esProperty={ esProperty }
                isOneColumn={ isOneColumn }
              />
            </div>
          </div>
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
