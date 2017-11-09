import React, { Component } from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';
import moment from 'moment';

import { Lib } from 'app_root/lib.jsx';
import { daysPassedSincePostedDate, getLastCheckedMoment, getLastUpdatedMoment } from 'app_root/helpers/propertyHelper';


class Overview extends Component {

  render() {
    let {
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

    let gridClass = `${Lib.THEME_CLASSES_PREFIX}small-info-box `;
    if (this.props.fromMapView) {
      gridClass += 'col-6 col-xl-4'
    } else {
      gridClass += 'col-4 col-md-4'
    }

    return (
      <div className={ `${Lib.THEME_CLASSES_PREFIX}single-overview` }>
        <p className={ `${Lib.THEME_CLASSES_PREFIX}info-description text-muted mb-5` }>
          { availabilityOpening }
          { renderHTML(post_content) }
        </p>

        <div className="row">
          <div className={ `${gridClass}` }>
            <p className="text-muted">Last Checked</p>
            <p>{
              // lastCheckedMoment.fromNow()
              lastCheckedMoment
            }</p>
          </div>
          {lastUpdatedMoment &&
            <div className={ `${gridClass}` }>
              <p className="text-muted">Last Updated</p>
              <p>{lastUpdatedMoment.format('MMM DD, YYYY')}</p>
            </div>
          }
          {daysOnWebsite &&
            <div className={ `${gridClass}` }>
              <p className="text-muted">Days on Website</p>
              <p>{daysOnWebsite}</p>
            </div>
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
