import React, {Component} from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';

import { Lib } from 'app_root/lib.jsx';
import AttributeTabSingle
  from 'app_root/components/PropertySingle/components/AttributeTabSingle.jsx';

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
      selectedTab: 'All'
    }
  }

  selectTab = (tab) => {
    this.setState({
      selectedTab: tab
    });
  }

  render() {
    let { selectedTab } = this.state;
    let {
      esSchema,
      esProperty,
      curatedPropertyInfo: {
        listing_type, address, address_unit
      }
    } = this.props;

    if (!listing_type || LISTING_TYPES_TO_HIDE.indexOf(listing_type) >= 0) {
      return null;
    }

    let schemaModified = Object.assign({}, esSchema);
    schemaModified['All'] = getAllTabData(schemaModified, 2);

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
              {Object.keys(schemaModified).map((p, i) =>
                <li className="nav-item" key={p}>
                  <a
                    className={`nav-link ${selectedTab === p ? 'active' : ''}`}
                    href="#"
                    onClick={(event) => { event.preventDefault(); this.selectTab(p); }}
                  >{p}</a>
                </li>
              )}
            </ul>
          </div>
          <div className="card-block">
            <div>
              <AttributeTabSingle
                tab={ schemaModified[selectedTab] }
                esProperty={ esProperty }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default AttributeTabs;
