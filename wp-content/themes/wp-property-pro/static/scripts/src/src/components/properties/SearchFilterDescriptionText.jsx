import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Lib} from '../../lib.jsx';
import capitalize from 'lodash/capitalize';
import first from 'lodash/first';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isEqual from 'lodash/isEqual';
import sortBy from 'lodash/sortBy';
import Util from 'app_root/components/Util.jsx';

class SearchFilterDescriptionText extends Component {
  static propTypes = {
    data: PropTypes.shape({
      acres: PropTypes.object,
      bathrooms: PropTypes.string,
      bedrooms: PropTypes.string,
      filters: PropTypes.object,
      historyPush: PropTypes.func,
      price: PropTypes.object,
      saleType: PropTypes.array,
      sqft: PropTypes.object,
      subtypes: PropTypes.array,
      terms: PropTypes.array,
      total: PropTypes.number,
      type: PropTypes.string
    })
  };

  handleClearFilters = (evt) => {
    evt.preventDefault();

    const termFilters = get(this.props, 'data.filters');
    const historyPush = get(this.props, 'data.historyPush');

    let params = [];

    let property_search_options = get(bundle, 'property_search_options', []);

    // Get current search array
    let current_search = first(property_search_options.filter(function (option) {
      return option.search === termFilters.search_type;
    }));

    // Get default listing statuses for current search type
    let searchTypeArrayParams = Util.createSearchTypeArrayParams(get(termFilters, 'property_type', ''), get(current_search, 'listing_statuses'));
    params = params.concat(searchTypeArrayParams);

    // Get terms from filters
    let terms = get(termFilters, 'term', []);
    if (terms) {
      params = params.concat(terms.map(d => ({key: d.term, values: [d.slug]})));
    }

    // Create search url and go to it
    let searchURL = Util.createSearchURL('/search', params);
    historyPush(searchURL);
  };

  getTitleAndDescription(data) {

    // Define needed props for description
    let {
      acres,
      bathrooms,
      bedrooms,
      filters,
      historyPush,
      terms,
      total,
      price,
      sqft
    } = data;

    // Default values
    let title = 'No Results';
    let description = 'Your search does not match any listings. Try zooming out or removing your filters.';

    if(total){

      // TITLE

      // Count of items which can be displayed at title
      let items_limit = 2;

      let residential_sale_type_label = 'Real Estate';

      // Build locations array
      let terms = get(data, 'terms', []).map(term => (term.text));
      let locations = '';
      if (terms && terms.length <= items_limit) {
        locations = sortBy(terms).join(' and ');
      }

      // Get listing subtypes array with plural values
      let subtypes = get(data, 'subtypes', []).map(subtype => (get(bundle, ['listing_subtypes_plural_values', data.type, subtype.slug].join('.'))));

      // Checking if using 'other' subtype
      let exist_other_values = get(data, 'subtypes', []).map(subtype => (subtype.slug)).indexOf('other') !== -1;

      // If there is no selected subtypes or one of selected is 'other' then just display listing type
      let types = capitalize(data.type);
      if (subtypes && subtypes.length <= items_limit && !exist_other_values) {
        types = sortBy(subtypes).join(' and ');
      }

      // Checking selected sale types
      let saleTypes = (data.saleType && data.saleType.map(d => capitalize(d))) || ['Rent', 'Sale'];
      if (!isArray(saleTypes)) {
        saleTypes = [saleTypes];
      }

      // Define sale type title's part
      let saleType;
      let shortSaleType;
      switch (data.type) {
        case 'residential':
          shortSaleType = saleType = residential_sale_type_label;
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
          saleType = [['for', first(saleTypes)].join(' ')].join(' ');
        } else { //Case when displayed particular sale type without subtypes
          saleType = [shortSaleType, ['for', first(saleTypes)].join(' ')].join(' ')
        }
      }

      title = [locations, types, saleType].join(' ');

      // DESCRIPTION

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
      let position = 'start';
      if (_bedrooms || _bathrooms) {
        position = 'middle';
      }
      let _sqft = this.determineSqftPart(sqft, position);

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
      if(!_acres){
        if(_sqft){
          position = 'end';
          if(!_bathrooms && !_bedrooms){
            position = 'start';
          }
          _sqft = this.determineSqftPart(sqft, position);
        }else if(_bathrooms){
          _bathrooms = _bathrooms.replace(',', ', and');
        }
      }

      // For residential filter without subtypes sale type is 'homes'
      if(shortSaleType === residential_sale_type_label && !subtypes.length){
        saleType = saleType.replace(residential_sale_type_label, 'homes');
      }

      // Added 'listings' to sale type or property type/subtype for commercial and land listings
      if(['land', 'commercial'].indexOf(data.type) !== -1){
        if(types){
          types += ' listings';
        }else {
          if (saleTypes.length === 1) {
            // Case when displayed particular sale type with listing subtype
            if (subtypes.length > 0 && subtypes.length <= 2) {
              saleType = [['listings', 'for', first(saleTypes)].join(' ')].join(' ');
            } else { //Case when displayed particular sale type without subtypes
              saleType = [shortSaleType, 'listings', ['for', first(saleTypes)].join(' ')].join(' ');
            }
          }else{
            saleType += ' listings';
          }
        }
      }

      description = _count + (types ? ' ' + types.toLowerCase() : '') + (saleType ? ' ' + saleType.toLowerCase() : '') + (locations ? ' in ' + locations : '') + _price + ((_bedrooms || _bathrooms) ? ' that have' + _bedrooms + _bathrooms : '') + _sqft + _acres + '.';

    }

    return {
      title: title,
      description: description,
    };
  }

  determineSqftPart(sqft, position){
    let _sqft = '';
    if (sqft && !(sqft.to === Lib.RANGE_SLIDER_NO_MAX_TEXT && sqft.start === Lib.RANGE_SLIDER_NO_MIN_TEXT)) {
      if(position === 'end'){
        _sqft = ', and';
      }else if (position === 'middle') {
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

    return _sqft;
  }

  shouldComponentUpdate(nextProps) {
    let shouldUpdate = !isEqual(nextProps.data, this.props.data);
    return shouldUpdate;
  }

  render() {
    let data = this.getTitleAndDescription(this.props.data);
    const total = get(this.props, 'data.total')

    if (total) {
      return (
        <div className={`${Lib.THEME_CLASSES_PREFIX}headtitle`}>
          <h1 className={`${Lib.THEME_CLASSES_PREFIX}headtitle__title`}>{data.title}</h1>
          <p className={`${Lib.THEME_CLASSES_PREFIX}headtitle__text`}>{data.description}</p>
        </div>
      );
    } else {
      return (
        <div className={`${Lib.THEME_CLASSES_PREFIX}noresults-banner`}>
          <div className={`${Lib.THEME_CLASSES_PREFIX}banner__image`}
            style={{ backgroundImage: `url(${bundle.static_images_url}no-results-banner.png)` }}
          />
          <h1 className={`${Lib.THEME_CLASSES_PREFIX}banner__title`}>{ data.title }</h1>
          <p className={`${Lib.THEME_CLASSES_PREFIX}banner__text`}>{ data.description }</p>
          <a className={`${Lib.THEME_CLASSES_PREFIX}banner__btn btn`} onClick={ this.handleClearFilters }>
            {'Remove Filters'}
          </a>
        </div>
      );
    }
  }
}

export default SearchFilterDescriptionText;
