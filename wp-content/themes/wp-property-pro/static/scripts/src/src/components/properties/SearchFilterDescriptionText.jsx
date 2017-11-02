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

    // Define needed props for description
    let {
      acres,
      bathrooms,
      bedrooms,
      total,
      price,
      sqft
    } = props;

    let description = '';

    // Build description just in case when founded something
    if (total) {

      // Build total count part
      let _count = `We found ${total}`;

      // Build price part
      let _price = '';
      if (price && !(price.to === Lib.RANGE_SLIDER_NO_MAX_TEXT && price.start === Lib.RANGE_SLIDER_NO_MIN_TEXT)) {
        _price += ` priced`;
        if (price.to === Lib.RANGE_SLIDER_NO_MAX_TEXT) {
          _price += ` no less than ${Util.formatPriceValue(price.start)} `;
        } else if (price.start === Lib.RANGE_SLIDER_NO_MIN_TEXT) {
          _price += ` no more than ${Util.formatPriceValue(price.to)} `;
        } else {
          _price += ` between ${Util.formatPriceValue(price.start)} and ${Util.formatPriceValue(price.to)}`;
        }
      }

      // Build bedrooms part
      let _bedrooms = '';
      if (bedrooms) {
        _bedrooms += ` at least ${bedrooms} ${bedrooms === '1' ? 'bedroom' : 'bedrooms'}`;
      }

      // Build bathrooms part
      let _bathrooms = '';
      if (bathrooms) {
        if (_bedrooms) {
          _bathrooms += ',';
        }
        _bathrooms += ` at least  ${bathrooms} ${bathrooms === '1' ? 'bathroom' : 'bathrooms'}`;
      }

      // Build sqft part
      let _sqft = '';
      if (sqft && !(sqft.to === Lib.RANGE_SLIDER_NO_MAX_TEXT && sqft.start === Lib.RANGE_SLIDER_NO_MIN_TEXT)) {
        if (_bedrooms || _bathrooms) {
          _sqft = ',';
        }
        if (sqft.to === Lib.RANGE_SLIDER_NO_MAX_TEXT) {
          _sqft += ` at least ${Util.formatSQFTValue(sqft.start)} SQFT`;
        } else if (sqft.start === Lib.RANGE_SLIDER_NO_MIN_TEXT) {
          _sqft += ` at most ${Util.formatSQFTValue(sqft.to)} SQFT`;
        } else {
          _sqft += ` between ${Util.formatSQFTValue(sqft.start)} and ${Util.formatSQFTValue(sqft.to)} SQFT`;
        }
      }

      // Build acres part
      let _acres = '';
      if (acres && !(acres.to === Lib.RANGE_SLIDER_NO_MAX_TEXT && acres.start === Lib.RANGE_SLIDER_NO_MIN_TEXT)) {
        if (_bedrooms || _bathrooms || _sqft) {
          _acres = ', and';
        }
        if (acres.to === Lib.RANGE_SLIDER_NO_MAX_TEXT) {
          _acres += ` at least ${Util.formatAcresValue(acres.start)} acres`;
        } else if (acres.start === Lib.RANGE_SLIDER_NO_MIN_TEXT) {
          _acres += ` at most ${Util.formatAcresValue(acres.to)} acres`;
        } else {
          _acres += ` between ${Util.formatAcresValue(acres.start)} and ${Util.formatAcresValue(acres.to)} acres`;
        }
      }

      // Use an "and" after the last comma.
      if(!acres){
        if(_sqft){
          _sqft = _sqft.replace(',', ', and')
        }else if(_bathrooms){
          _bathrooms = _bathrooms.replace(',', ', and')
        }
      }

      description = _count + (types ? ' ' + types.toLowerCase() : '') + (saleType ? ' ' + saleType.toLowerCase() : '') + (locations ? ' in ' + locations : '') + _price + ((_bedrooms || _bathrooms) ? ' that have' + _bedrooms + _bathrooms : '') + _sqft + _acres + '.';
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