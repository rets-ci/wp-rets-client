import FilterTag from '../../FilterTag.jsx';
import {Lib} from '../../../lib.jsx';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Util from '../../Util.jsx';

class FilterBar extends Component {
  static propTypes = {
    deleteSingleLocalFilter: PropTypes.func.isRequired,
    deleteLocalFilterTerm: PropTypes.func.isRequired,
    localFilters: PropTypes.object.isRequired
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
      localFilters
    } = this.props;
    let termFilterElement;
    let termFilters = [];
    let termFilter = localFilters['term'];
    if (termFilter && termFilter.length) {
      termFilters = termFilter.map(t => {
        return {tax: Object.keys(t)[0], value: Object.values(t)[0]}
      });
      termFilterElement = termFilters.map((t, i) =>
        <FilterTag key={JSON.stringify(t)} handleRemoveFilter={i !== 0 ? (() => this.handleTermFilterRemove.bind(this)(t)) : null} display={t.value} value={t.value} />
      );
    }
    let bathroomsElement;
    let bathroomsFilter = localFilters['bathrooms'];
    let bedroomsFilter = localFilters['bedrooms'];
    let bedroomsElement;
    let lotSizeElement;
    let lotSizeFilter = localFilters['lotSize'];
    let priceFilter = localFilters['price'];
    let priceElement;
    let propertyTypeFilter = localFilters['propertyType'];
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
      propertyTypeElement = (
        <FilterTag handleRemoveFilter={() => this.handleSingleFilterRemove.bind(this)('propertyType')} display={propertyFilter} value={propertyFilter} />
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
