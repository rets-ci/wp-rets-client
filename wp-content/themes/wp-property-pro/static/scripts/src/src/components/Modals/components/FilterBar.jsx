import FilterTag from '../../FilterTag.jsx';
import {Lib} from '../../../lib.jsx';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Util from '../../Util.jsx';

class FilterBar extends Component {
  static propTypes = {
    deleteSingleLocalFilter: PropTypes.func.isRequired,
    deleteLocalFilterTerm: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired,
    deleteLastLocalFilterTerm: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  handleTermFilterRemove = filter => {
    let filterToRemove = {[filter.tax]: filter.value};
    this.props.deleteLocalFilterTerm(filterToRemove);
  }

  handleDeleteLastLocalFilterTerm = filter => {
    let filterToRemove = {[filter.tax]: filter.value};
    this.props.deleteLastLocalFilterTerm(filterToRemove)
  }

  render() {
    let {
      filters
    } = this.props;

    let termFilterElement;
    let termFilters = [];
    let termFilter = filters['term'];
    
    if (termFilter && termFilter.length) {
      termFilters = termFilter.map(t => {
        return {tax: Object.keys(t)[0], value: Object.values(t)[0]}
      });
      if (termFilters.length === 1) {
        termFilterElement = <FilterTag key={JSON.stringify(termFilters[0])} handleRemoveFilter={() => this.handleDeleteLastLocalFilterTerm(termFilters[0])} display={termFilters[0].value} value={termFilters[0].value} />;
      } else {
        termFilterElement = termFilters.map((t, i) =>
          <FilterTag key={JSON.stringify(t)} handleRemoveFilter={() => this.handleTermFilterRemove(t)} display={t.value} value={t.value} />
        );
      }
    }

    let bathroomsElement;
    let bathroomsFilter = filters['bathrooms'];
    let bedroomsFilter = filters['bedrooms'];
    let bedroomsElement;
    let lotSizeElement;
    let lotSizeFilter = filters['lotSize'];
    let priceFilter = filters['price'];
    let priceElement;
    let sqftFilter = filters['sqft'];
    let sqftElement;
    if (bathroomsFilter) {
      bathroomsElement = (
        <FilterTag handleRemoveFilter={() => this.props.deleteSingleLocalFilter('bathrooms')} display={bathroomsFilter + `+ Baths`} value={bathroomsFilter} />
      );
    }

    if (bedroomsFilter) {
      bedroomsElement = (
        <FilterTag handleRemoveFilter={() => this.props.deleteSingleLocalFilter('bedrooms')} display={bedroomsFilter + `+ Beds`} value={bedroomsFilter} />
      );
    }

    if (lotSizeFilter) {
      lotSizeElement = (
        <FilterTag handleRemoveFilter={() => this.props.deleteSingleLocalFilter('lotSize')} display={Util.lotSizeFilterSearchTagText(lotSizeFilter)} value={lotSizeFilter} />
      )
    }

    if (priceFilter) {
      priceElement = (
        <FilterTag handleRemoveFilter={() => this.props.deleteSingleLocalFilter('price')} display={Util.priceFilterSearchTagText(priceFilter)} value={priceFilter} />
      );
    }

    if (sqftFilter) {
      sqftElement = (
        <FilterTag handleRemoveFilter={() => this.props.deleteSingleLocalFilter('sqft')} display={Util.sqftFilterSearchTagText(sqftFilter)} value={sqftFilter} />
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
          {!termFilterElement &&
            <input type="text" size="1" placeholder="Select bedroom type, amenities"/>
          }
        </div>
      </div>
    );
  }
};

export default FilterBar;
