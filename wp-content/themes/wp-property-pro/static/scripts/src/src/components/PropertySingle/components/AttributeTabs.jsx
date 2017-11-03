import React, {Component} from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';

import { Lib }            from 'app_root/lib.jsx';
import propertyHelper     from 'app_root/helpers/propertyHelper';
import AttributeTabSingle from 'app_root/components/PropertySingle/components/AttributeTabSingle.jsx';

import esSchema from 'app_root/static_data/property-data-structure/index.js';


const LISTING_TYPES_TO_HIDE = [ 'commercial', 'land' ];
const descriptionBoilerplate = '847 Estes Street is a house for rent in Durham, NC 27701. This 1440 square foot house sits on a 0.13 lot and features 3 bedrooms and 2 bathrooms. Built in 1915, this house has been on the market for a total of 1 month and is currently priced at $1,100 a month.';

const getAllTabData = (propertyData, colNumbers) => {
  var allItems = [];
  Object.keys(propertyData).forEach((tabs) => {
    propertyData[tabs].forEach(cols => {
      Object.keys(cols).forEach(item => {
        allItems.push({[item]: cols[item]});
      })
    });
  });

  let itemsPerCol = Math.floor(allItems.length / colNumbers);
  let colsArray = [];
  for (var i = 0; i < colNumbers; i++) {
    (function () {
      let obj = {};
      let itemPerColLocal = itemsPerCol;
      while(itemPerColLocal > 0) {
        let poppedItem = allItems.shift();
        merge(obj, poppedItem);
        itemPerColLocal--;
      }
      if (i === (colNumbers - 1)) {
        allItems.forEach(a => {
          merge(obj, a);
        });
      }
      colsArray.push(obj);
    })(itemsPerCol)
  }

  return colsArray;
};

class AttributeTabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTab: 'Rooms'
    };
  }

  selectTab = (tab) => {
    this.setState({
      selectedTab: tab
    });
  }

  render() {
    const { selectedTab } = this.state;
    const { esProperty, curatedPropertyInfo } = this.props;
    const { listing_type, address, address_unit } = curatedPropertyInfo;

    if (!listing_type || LISTING_TYPES_TO_HIDE.indexOf(listing_type) >= 0) {
      return null;
    }

    let listingTypeJSONFileName = propertyHelper.getListingTypeJSONFileName(curatedPropertyInfo);

    if (!listingTypeJSONFileName) {
      return null;
    }

    let propertyDataStructure = esSchema[listingTypeJSONFileName];

    // let schemaModified = Object.assign({}, esSchema);
    // schemaModified['All'] = getAllTabData(schemaModified, 2);
    // console.log('property info tabs: ', schemaModified);

    let tabs = propertyDataStructure.map(p => p.name);
    let content = propertyDataStructure.find(d => d.name === selectedTab);

    return (
      <div className={ `${Lib.THEME_CLASSES_PREFIX}single-attr-tabs pt-5` }>
        <h5 className={ `${Lib.THEME_CLASSES_PREFIX}info-section-header mb-4` }>
          Property Details for {address[0]} {address_unit}
        </h5>

        <p className={ `${Lib.THEME_CLASSES_PREFIX}info-description text-muted py-3` }>
          {descriptionBoilerplate}
        </p>

        <div className="card text-center mb-4">
          <div className="card-header">
            <ul className="nav nav-tabs card-header-tabs">
              {tabs.map((tab, i) =>
                <li className="nav-item" key={tab}>
                  <a
                    className={`nav-link ${selectedTab === tab ? 'active' : ''}`}
                    href="#"
                    onClick={(event) => { event.preventDefault(); this.selectTab(tab); }}
                  >{tab}</a>
                </li>
              )}
            </ul>
          </div>
          <div className="card-block">
            <div>
              <AttributeTabSingle
                content={ content }
                esProperty={ esProperty }
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
};

export default AttributeTabs;
