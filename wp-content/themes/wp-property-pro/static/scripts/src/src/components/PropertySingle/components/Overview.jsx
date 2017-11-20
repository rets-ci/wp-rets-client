import React, { Component } from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';
import moment from 'moment';

import { Lib } from 'app_root/lib.jsx';
import { daysPassedSincePostedDate, getLastCheckedMoment, getLastUpdatedMoment } from 'app_root/helpers/propertyHelper';


class Overview extends Component {

  render() {
    let {
      fromMapView,
      curatedPropertyInfo: {
        post_content,
        listing_type,
        rets_date_available,
        sale_type: saleType,
      }
    } = this.props;

    let availableDate = moment.utc(rets_date_available, 'YYYY-MM-DD');
    let daysOnWebsite = daysPassedSincePostedDate(this.props.curatedPropertyInfo);
    let lastUpdatedMoment = getLastUpdatedMoment(this.props.curatedPropertyInfo);
    // let lastCheckedMoment = getLastCheckedMoment(this.props.curatedPropertyInfo);
    let lastCheckedMoment = '1 minute ago';

    let availabilityOpening = null;
    if (saleType === 'rent' && listing_type === 'residential' && availableDate.isValid()) {
      availabilityOpening = "Available " + availableDate.format('MMMM D, YYYY') + '. ';
    }

    let boxClass = `${Lib.THEME_CLASSES_PREFIX}attr-box`;
    let gridClass = fromMapView ? 'col-12' : 'col-12 col-md-4';

    return (
      <div className={ `${Lib.THEME_CLASSES_PREFIX}single-overview` }>
        <p className={ `${Lib.THEME_CLASSES_PREFIX}info-description text-muted mb-5` }>
          { availabilityOpening }
          { renderHTML(post_content) }
        </p>

        <div className={ `${Lib.THEME_CLASSES_PREFIX}attr-box-overlay` } />

        <div className={ `${Lib.THEME_CLASSES_PREFIX}attr-box-container row` }>
          <div className={ gridClass }><div className={ boxClass }>
            <p>Last Checked</p>
            <p>{
              // lastCheckedMoment.fromNow()
              lastCheckedMoment
            }</p>
          </div></div>
          {lastUpdatedMoment &&
            <div className={ gridClass }><div className={ boxClass }>
              <p>Last Updated</p>
              <p>{lastUpdatedMoment.format('MMM DD, YYYY')}</p>
            </div></div>
          }
          {daysOnWebsite &&
            <div className={ gridClass }><div className={ boxClass }>
              <p>Days on Website</p>
              <p>{daysOnWebsite}</p>
            </div></div>
          }
        </div>
      </div>
    )
  }
}

Overview.propTypes = {
  curatedPropertyInfo: PropTypes.object,
  fromMapView: PropTypes.bool,
}

export default Overview;
