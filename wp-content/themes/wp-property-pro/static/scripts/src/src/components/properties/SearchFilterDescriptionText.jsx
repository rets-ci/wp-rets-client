import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Lib} from '../../lib.jsx';
import Util from '../Util.jsx';

class SearchFilterDescription extends Component {
  static propTypes = {
    bathrooms: PropTypes.string,
    bedrooms: PropTypes.string,
    price: PropTypes.object,
    saleType: PropTypes.array,
    total: PropTypes.number
  }

  getMainText(saleType, props) {
    let {
      bathrooms,
      bedrooms,
      total,
      price
    } = props;
    let text = '';
    if (total && saleType) {
      text += `There are ${total} homes for ${saleType.join(' and ')} in this area`;
    }
    if (price && !(price.to === Lib.RANGE_SLIDER_NO_MAX_TEXT && price.start === Lib.RANGE_SLIDER_NO_MIN_TEXT)) {
      text += ` that are priced`;
      if (price.to === Lib.RANGE_SLIDER_NO_MAX_TEXT) {
        text += ` more than ${Util.formatPriceValue(price.start)} `;
      } else if (price.start === Lib.RANGE_SLIDER_NO_MIN_TEXT) {
        text += ` less than ${Util.formatPriceValue(price.to)} `;
      } else {
        text += ` between ${Util.formatPriceValue(price.start)} and ${Util.formatPriceValue(price.to)}`;
      }
    }

    if (bedrooms) {
      text += ` with ${bedrooms} or more bedrooms`
    }
    if (bathrooms) {
      let prefix = bedrooms ? ' and' : ' with';
      text += `${prefix} ${bathrooms} or more bathrooms`;
    }
    return text;
  }

  render() {
    let saleType = this.props.saleType || ['Rent', 'Sale'];
    let headText = `Homes for ${saleType.join(' and ')}`;
    
    let mainText = this.getMainText(saleType, this.props);
    return (
      <div className={Lib.THEME_CLASSES_PREFIX + "headtitle"}>
        <h1>{headText}</h1>
        <p>{mainText}</p>
      </div>
    );
  }
};

export default SearchFilterDescription;