import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Lib }  from 'app_root/lib.jsx';
import Util     from 'app_root/components/Util.jsx';


class Masthead extends Component {

  render() {
    let {
      address,
      address_unit,
      city,
      state,
      rets_postal_code,
      listing_sub_types,
      listing_type,
      rets_list_price,
      beds,
      baths,
      sqft,
      rets_lot_size_area,
    } = this.props.curatedPropertyInfo;

    listing_sub_types = listing_sub_types || [];
    let attributes = [];

    attributes.push(`${listing_sub_types.join(', ')}`);

    if (rets_list_price) {
      attributes.push(rets_list_price ? Util.formatPriceValue(rets_list_price) : 'N/A');
    }

    switch (listing_type) {
      case 'land':
        if (rets_lot_size_area) {
          attributes.push(`${Util.formatAcresValue(rets_lot_size_area)} Acres`);
        }
        break;
      case 'commercial':
        if (!!+sqft) {
          attributes.push(`${Util.formatSQFTValue(sqft)} SQFT`);
        }
        break;
      default:
        if (beds) {
          attributes.push(`${beds} Bedrooms`);
        }

        if (baths) {
          attributes.push(`${baths} Bathrooms`);
        }

        if (!!+sqft) {
          attributes.push(`${Util.formatSQFTValue(sqft)} SQFT`);
        }

        if (rets_lot_size_area) {
          attributes.push(`${Util.formatAcresValue(rets_lot_size_area)} Acres`);
        }
    }

    return (
      <section className={ `${Lib.THEME_CLASSES_PREFIX}single-masthead py-5` }>
        <div className="container"><div className="row"><div className={ this.props.gridWidth }>

          <h4>
            {address[0]} {address_unit}
          </h4>

          <h6 className="text-muted mb-3">
            {city}, {state} {rets_postal_code}
          </h6>

          <ul className={ `${Lib.THEME_CLASSES_PREFIX}listing-info-box flex-wrap m-0` }>
            {
              attributes.map((attr, index) =>
                <li key={index}>{ attr }</li>
              )
            }
          </ul>

        </div></div></div>
      </section>
    )
  }
}

Masthead.propTypes = {
  curatedPropertyInfo: PropTypes.object,
  gridWidth: PropTypes.string,
}

export default Masthead;
