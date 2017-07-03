import FilterTag from '../../FilterTag.jsx';
import {Lib} from '../../../lib.jsx';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {property_type as propertyTypeOptions} from '../../staticFilters.js';
import Util from '../../Util.jsx';

class FilterBar extends Component {
  static propTypes = {
    deleteSingleLocalFilter: PropTypes.func.isRequired,
    deleteLocalFilterTerm: PropTypes.func.isRequired,
    localFilters: PropTypes.object.isRequired,
    removeLastLocationFilter: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  handleSingleFilterRemove(filterKey) {
    this.props.deleteSingleLocalFilter(filterKey);
  }

  handleTermFilterRemove(filter) {
    let filterToRemove = {[filter.tax]: filter.value};
    this.props.deleteLocalFilterTerm(filterToRemove);
  }

  render() {
    let {
      localFilters,
      removeLastLocationFilter
    } = this.props;

    let termFilterElement;
    let termFilters = [];
    let termFilter = localFilters['term'];

    
    if (termFilter && termFilter.length) {
      termFilters = termFilter.map(t => {
        return {tax: Object.keys(t)[0], value: Object.values(t)[0]}
      });
      if (termFilters.length === 1) {
        termFilterElement = <FilterTag key={JSON.stringify(termFilters[0])} handleRemoveFilter={() => removeLastLocationFilter()} display={termFilters[0].value} value={termFilters[0].value} />;
      } else {
        termFilterElement = termFilters.map((t, i) =>
          <FilterTag key={JSON.stringify(t)} handleRemoveFilter={() => this.handleTermFilterRemove.bind(this)(t)} display={t.value} value={t.value} />
        );
      }
    }

    let bathroomsElement;
    let bathroomsFilter = localFilters['bathrooms'];
    let bedroomsFilter = localFilters['bedrooms'];
    let bedroomsElement;
    let lotSizeElement;
    let lotSizeFilter = localFilters['lotSize'];
    let priceFilter = localFilters['price'];
    let priceElement;
    let propertyTypeFilter = localFilters['property_type'];
    let propertyTypeElement;
    let sqftFilter = localFilters['sqft'];
    let sqftElement;

    if (bathroomsFilter) {
      bathroomsElement = (
        <FilterTag handleRemoveFilter={() => this.handleSingleFilterRemove.bind(this)('bathrooms')} display={bathroomsFilter + `+ Baths`} value={bathroomsFilter} />
      );
    }

    if (bedroomsFilter) {
      bedroomsElement = (
        <FilterTag handleRemoveFilter={() => this.handleSingleFilterRemove.bind(this)('bedrooms')} display={bedroomsFilter + `+ Beds`} value={bedroomsFilter} />
      );
    }

    if (lotSizeFilter) {
      lotSizeElement = (
        <FilterTag handleRemoveFilter={() => this.handleSingleFilterRemove.bind(this)('lotSize')} display={Util.lotSizeFilterSearchTagText(lotSizeFilter)} value={lotSizeFilter} />
      )
    }

    if (priceFilter) {
      priceElement = (
        <FilterTag handleRemoveFilter={() => this.handleSingleFilterRemove.bind(this)('price')} display={Util.priceFilterSearchTagText(priceFilter)} value={priceFilter} />
      );
    }

    if (propertyTypeFilter) {
      let propertyFilterValue = propertyTypeOptions.filter(p => p.value === propertyTypeFilter).map(p => p.name);
      propertyTypeElement = (
        <FilterTag handleRemoveFilter={() => this.handleSingleFilterRemove.bind(this)('property_type')} display={propertyFilterValue} value={propertyTypeFilter} />
      );
    }

    if (sqftFilter) {
      sqftElement = (
        <FilterTag handleRemoveFilter={() => this.handleSingleFilterRemove.bind(this)('sqft')} display={Util.sqftFilterSearchTagText(sqftFilter)} value={sqftFilter} />
      );
    }

    return (
      <div className={`${Lib.THEME_CLASSES_PREFIX}bs-tags-box mr-auto`}>
        <div className={Lib.THEME_CLASSES_PREFIX + "bs-tags-input"}>
          {termFilterElement}
          {bathroomsElement}
          {bedroomsElement}
          {priceElement}
          {sqftElement}
          {lotSizeElement}
          {propertyTypeElement}
          {!termFilterElement &&
            <input type="text" size="1" placeholder="Select bedroom type, amenities"/>
          }
        </div>
      </div>
    );
  }
};

export default FilterBar;
