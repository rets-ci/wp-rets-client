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
      post_modified,
      post_title,
      rets_city,
      rets_high_school,
      rets_state,
      rets_list_price,
      rets_living_area,
      rets_lot_size_area,
      rets_middle_school,
      rets_postal_code,
      rets_year_built,
      wpp_location_subdivision,
      wpp_location_city
    } = this.props;
    let daysOnWebsite = daysPassedSincePostedDate(post_date);
    let lastUpdated = getLastUpdated(post_date);
    return (
      <div className={Lib.THEME_CLASSES_PREFIX + "single-container"}>
        <ImageMixer images={images || []} />
        <div className="jumbotron">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h4>{post_title}</h4>
                <h6 className="card-subtitle mb-2 text-muted">{rets_city ? rets_city + "," : null} {rets_state} {rets_postal_code}</h6>
                <ul className={`${Lib.THEME_CLASSES_PREFIX}listing-info-box`}>
                  <li>{rets_list_price ? Util.formatPriceValue(rets_list_price) : "N/A"}</li>
                  {beds ?
                    <li>{beds} Bed</li>
                    : null
                  }
                  {baths ?
                    <li>{baths} Bath</li>
                    : null
                  }
                  {rets_living_area ? 
                    <li>{Util.formatSQFTValue(rets_living_area)} SF</li>
                    : null
                  }
                  {rets_lot_size_area ? 
                    <li>{Util.formatLotSizeValue(rets_lot_size_area)} Acers</li>
                    : null
                  }
                </ul>
                <button type="button" className={`btn btn-primary ${Lib.THEME_CLASSES_PREFIX}button ${Lib.THEME_CLASSES_PREFIX}primary-button card-link`}>Request Showing</button>
                <button type="button" className={`btn btn-primary ${Lib.THEME_CLASSES_PREFIX}button ${Lib.THEME_CLASSES_PREFIX}secondary-button card-link`}>Request Application</button>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <p className="text-muted">{renderHTML(post_content)}</p>
            </div>
          </div>
          <div className="row mb-4">
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
          <h5 className="mb-4">Property Highlights</h5>
          <PropertyHighlights
            elementary_school={elementary_school}
            rets_high_school={rets_high_school}
            rets_middle_school={rets_middle_school}
            rets_year_built={rets_year_built}
            wpp_location_city={wpp_location_city}
            wpp_location_subdivision={wpp_location_subdivision}
           />
          <h5 className="mb-4">Property Details for {post_title}</h5>
          <p className="text-muted">847 Estes Street is a house for rent in Durham, NC 27701. This 1440 square foot house sits on a 0.13 lot and features 3 bedrooms and 2 bathrooms. Built in 1915, this house has been on the market for a total of 1 month and is currently priced at $1,100 a month.</p>
          <PropertyInfoTabs />
          <h5 className="mb-4">Listing Provider for {post_title}</h5>
          <p className="text-muted">
            Information Not Guaranteed. © Triangle MLS Inc. All rights reserved. Listings marked with a TMLSidx icon are provided courtesy of the Triangle MLS, Inc. of North Carolina, Internet Data Exchange Database.
          </p>
        </div>
      </div>
    );
  }
}


export default Single;