import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Swiper from 'react-id-swiper';
import merge from 'lodash/merge';
import get from 'lodash/get';
import remove from 'lodash/remove';

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

  render() {
    const { selectedTab, attributesData, tabs } = this.state;
    const { esProperty, curatedPropertyInfo, isOneColumn } = this.props;
    const { listing_type, address, address_unit } = curatedPropertyInfo;

    if (!listing_type || LISTING_TYPES_TO_HIDE.indexOf(listing_type) >= 0 || !attributesData) {
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

    return (
      <div className={ `${Lib.THEME_CLASSES_PREFIX}single-attrs-section pt-5` }>
        <h5 className={ `${Lib.THEME_CLASSES_PREFIX}info-section-header mb-4` }>
          Property Details for {address[0]} {address_unit}
        </h5>

        <p className={ `${Lib.THEME_CLASSES_PREFIX}info-description text-muted py-3` }>
          {descriptionBoilerplate}
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
