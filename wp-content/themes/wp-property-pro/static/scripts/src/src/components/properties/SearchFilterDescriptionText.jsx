import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Lib} from '../../lib.jsx';
import Util from '../Util.jsx';
import {get, first, isArray, capitalize, sortBy} from 'lodash';

class SearchFilterDescription extends Component {
  static propTypes = {
    bathrooms: PropTypes.string,
    bedrooms: PropTypes.string,
    price: PropTypes.object,
    saleType: PropTypes.array,
    subtypes: PropTypes.array,
    terms: PropTypes.array,
    total: PropTypes.number,
    type: PropTypes.string
  };

  getTitleAndDescription(props) {
    // Count of items which can be displayed at title
    let items_limit = 2;

    // Build locations array
    let terms = get(props, 'terms', []).map(term => (term.text));
    let locations = '';
    if (terms && terms.length <= items_limit) {
      locations = sortBy(terms).join(' and ');
    }

    // Get listing subtypes array with plural values
    let subtypes = get(props, 'subtypes', []).map(subtype => (get(bundle, ['listing_subtypes_plural_values', props.type, subtype.slug].join('.'))));

    // Checking if using 'other' subtype
    let exist_other_values = get(props, 'subtypes', []).map(subtype => (subtype.slug)).indexOf('other') !== -1;

    // If there is no selected subtypes or one of selected is 'other' then just display listing type
    let types = capitalize(props.type);
    if (subtypes && subtypes.length <= items_limit && !exist_other_values) {
      types = sortBy(subtypes).join(' and ');
    }

    // Checking selected sale types
    let saleTypes = (props.saleType && props.saleType.map(d => capitalize(d))) || ['Rent', 'Sale'];
    if (!isArray(saleTypes)) {
      saleTypes = [saleTypes];
    }

    // Define sale type title's part
    let saleType;
    let shortSaleType;
    switch (props.type) {
      case 'residential':
        shortSaleType = saleType = 'Real Estate';
        break;
      case 'commercial':
        shortSaleType = saleType = 'Commercial Real Estate';
        if (exist_other_values) {
          types = saleType;
        }
        break;
      case 'land':
        saleType = 'Land Real Estate';
        shortSaleType = 'Land';
        if (exist_other_values) {
          types = saleType;
        }
        break;
    }

    // If display all sale type, then drop it
    if (saleTypes.length === 2 && subtypes.length > 0) {
      saleType = '';
    } else if (saleTypes.length === 1) {
      // Case when displayed particular sale type with listing subtype
      if (subtypes.length > 0 && subtypes.length <= 2) {
        saleType = [['For', first(saleTypes)].join(' ')].join(' ');
      } else { //Case when displayed particular sale type without subtypes
        saleType = [shortSaleType, ['For', first(saleTypes)].join(' ')].join(' ')
      }
    }

    let title = [locations, types, saleType].join(' ');

    let {
      bathrooms,
      bedrooms,
      total,
      price
    } = props;
    let description = '';
    if (total && saleTypes) {
      description += `There are ${total} homes for ${saleTypes.join(' and ')} in this area`;
    }
    if (price && !(price.to === Lib.RANGE_SLIDER_NO_MAX_TEXT && price.start === Lib.RANGE_SLIDER_NO_MIN_TEXT)) {
      description += ` that are priced`;
      if (price.to === Lib.RANGE_SLIDER_NO_MAX_TEXT) {
        description += ` more than ${Util.formatPriceValue(price.start)} `;
      } else if (price.start === Lib.RANGE_SLIDER_NO_MIN_TEXT) {
        description += ` less than ${Util.formatPriceValue(price.to)} `;
      } else {
        description += ` between ${Util.formatPriceValue(price.start)} and ${Util.formatPriceValue(price.to)}`;
      }
    }

    if (bedrooms) {
      description += ` with ${bedrooms} or more bedrooms`
    }
    if (bathrooms) {
      let prefix = bedrooms ? ' and' : ' with';
      description += `${prefix} ${bathrooms} or more bathrooms`;
    }
    return {
      title: title,
      description: description,
    };
  }

  render() {

    let data = this.getTitleAndDescription(this.props)
    return (
      <div className={Lib.THEME_CLASSES_PREFIX + "headtitle"}>
        <h1>{data.title}</h1>
        <p>{data.description}</p>
      </div>
    );
  }
}

export default SearchFilterDescription;