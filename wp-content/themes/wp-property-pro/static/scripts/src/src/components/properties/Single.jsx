import _ from 'lodash';
import {Lib} from '../../lib.jsx';
import moment from 'moment';
import PropertyHighlights from './Components/PropertyHighlights.jsx';
import PropertyInfoTabs from './Components/PropertyInfoTabs.jsx';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import renderHTML from 'react-render-html';
import ImageMixer from './Components/ImageMixer.jsx';
import Util from '../Util.jsx';

let getLastUpdated = lastUpdated => {
  let parsed = moment.utc(lastUpdated, 'YYYY-MM-D hh:mm:ss');
  if (!parsed.isValid()) {
    console.warn(`date ${lastUpdated} could not be parsed`);
    return false;
  } else {
    return parsed.format('MMM DD, YYYY');
  }
};

let daysPassedSincePostedDate = postDate => {
  let parsed = moment.utc(postDate, 'YYYY-MM-D hh:mm:ss');
  if (!parsed.isValid()) {
    console.warn(`date ${postDate} could not be parsed`);
    return false;
  } else {
    let now = moment.utc();
    return now.from(parsed);
  }
};

class Single extends Component {
  componentDidMount() {
    // let scripts = _.get(this.props.post, 'scripts', '');
    // Util.loadScripts(scripts);
  }

  render() {
    let {
      baths,
      beds,
      elementary_school,
      images,
      post_content,
      post_date,
      post_title,
      rets_city,
      rets_high_school,
      rets_state,
      formatted_address_simple,
      rets_list_price,
      rets_living_area,
      rets_lot_size_area,
      rets_middle_school,
      rets_postal_code,
      rets_year_built,
      wpp_location_subdivision,
      wpp_location_city,
      listing_type,
      listing_sub_type,
    } = this.props;
    let daysOnWebsite = daysPassedSincePostedDate(post_date);
    let lastUpdated = getLastUpdated(post_date);

    let info_box = `<li>${listing_sub_type}</li>`;

    if(rets_list_price){
      info_box += `<li>${rets_list_price ? Util.formatPriceValue(rets_list_price) : "N/A"}</li>`;
    }

    switch (listing_type){
      case 'land':
        if(rets_lot_size_area){
          info_box += `<li>${Util.formatLotSizeValue(rets_lot_size_area)} Acres</li>`;
        }
        break;
      case 'commercial':
        if(rets_living_area){
          info_box += `<li>${Util.formatSQFTValue(rets_living_area)} SF</li>`;
        }
        break;
      default:
        if(beds){
          info_box += `<li>${beds} Beds</li>`;
        }

        if(baths){
          info_box += `<li>${baths} Baths</li>`;
        }

        if(!!+rets_living_area){
          info_box += `<li>${Util.formatSQFTValue(rets_living_area)} SF</li>`;
        }
    }

    return (
      <div className={Lib.THEME_CLASSES_PREFIX + "single-container"}>
        <ImageMixer images={images || []} />
        <div className="jumbotron py-5 mb-5">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h4 className={`${Lib.THEME_CLASSES_PREFIX}info-title`}>{formatted_address_simple}</h4>
                <h6 className="mb-3 text-muted">{rets_city ? rets_city + "," : null} {rets_state} {rets_postal_code}</h6>
                <ul className={`${Lib.THEME_CLASSES_PREFIX}listing-info-box`}>{renderHTML(info_box)}</ul>
                <button type="button" className={`btn btn-primary ${Lib.THEME_CLASSES_PREFIX}button ${Lib.THEME_CLASSES_PREFIX}primary-button card-link`}>Request Showing</button>
                <button type="button" className={`btn btn-primary ${Lib.THEME_CLASSES_PREFIX}button ${Lib.THEME_CLASSES_PREFIX}secondary-button card-link`}>Request Application</button>
              </div>
            </div>
          </div>
        </div>


        <div className="container">
          <div className="row">
            <div className="col-md-12 mb-5">
              <p className={`text-muted ${Lib.THEME_CLASSES_PREFIX}info-description`}>{renderHTML(post_content)}</p>
            </div>
          </div>


          <div className="row mb-5">
            <div className={`col-md-3 ${Lib.THEME_CLASSES_PREFIX}small-info-box`}>
              <p className={`text-muted ${Lib.THEME_CLASSES_PREFIX}top`}>Last Checked</p>
              <p className={`${Lib.THEME_CLASSES_PREFIX}bottom`}>1 minute ago</p>
            </div>
            {lastUpdated &&
              <div className={`col-md-3 ${Lib.THEME_CLASSES_PREFIX}small-info-box`}>
                <p className={`text-muted ${Lib.THEME_CLASSES_PREFIX}top`}>Last Updated</p>
                <p className={`${Lib.THEME_CLASSES_PREFIX}bottom`}>{lastUpdated}</p>
              </div>
            }
            {daysOnWebsite &&
              <div className={`col-md-3 ${Lib.THEME_CLASSES_PREFIX}small-info-box`}>
                <p className={`text-muted ${Lib.THEME_CLASSES_PREFIX}top`}>Days on Website</p>
                <p className={`${Lib.THEME_CLASSES_PREFIX}bottom`}>{daysOnWebsite}</p>
              </div>
            }
          </div>


          <div className="row">
            <div className="col-md-12 mb-3">
              <h5 className={`mb-3 ${Lib.THEME_CLASSES_PREFIX}info-section-header`}>Property Highlights</h5>
            </div>

            <div className="col-md-12">
              <PropertyHighlights
                elementary_school={elementary_school}
                rets_high_school={rets_high_school}
                rets_middle_school={rets_middle_school}
                rets_year_built={rets_year_built}
                wpp_location_city={wpp_location_city}
                wpp_location_subdivision={wpp_location_subdivision}
               />
            </div>
          </div>


          <div className="row">
            <div className="col-md-12 mb-3">
              <h5 className={`${Lib.THEME_CLASSES_PREFIX}info-section-header`}>Property Details for {post_title}</h5>
            </div>
            <div className="col-md-12 mb-3">
              <p className={`text-muted ${Lib.THEME_CLASSES_PREFIX}info-description`}>847 Estes Street is a house for rent in Durham, NC 27701. This 1440 square foot house sits on a 0.13 lot and features 3 bedrooms and 2 bathrooms. Built in 1915, this house has been on the market for a total of 1 month and is currently priced at $1,100 a month.</p>
            </div>
            <div className="col-md-12 mb-5">
              <PropertyInfoTabs />
            </div>
          </div>


          <div className="row">
            <div className="col-md-12 mt-3 mb-3">
              <h5 className={`${Lib.THEME_CLASSES_PREFIX}info-section-header`}>Listing Provider for {post_title}</h5>
            </div>

            <div className="col-md-12 mb-5">
              <p className={`text-muted ${Lib.THEME_CLASSES_PREFIX}info-description`}>
                Information Not Guaranteed. © Triangle MLS Inc. All rights reserved. Listings marked with a TMLSidx icon are provided courtesy of the Triangle MLS, Inc. of North Carolina, Internet Data Exchange Database.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default Single;