import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Lib } from 'app_root/lib.jsx';
import htmlHelper from 'app_root/helpers/htmlHelper';
import { daysPassedSincePostedDate, getLastCheckedMoment, getLastUpdatedMoment } from 'app_root/helpers/propertyHelper';

const DISCLAIMER_TEXT = 'Information Not Guaranteed. © Triangle MLS Inc. All rights reserved. Listings marked with a TMLSidx icon are provided courtesy of the Triangle MLS, Inc. of North Carolina, Internet Data Exchange Database.';


const ListingProvider = ({ curatedPropertyInfo, fromMapView }) => {
  let {
    mlsId,
    address,
    address_unit,
    listing_office,
    officePhoneNumber,
    agentName,
    agentPhoneNumber,
  } = curatedPropertyInfo;

  let gridClass = fromMapView ? 'col-12' : 'col-lg-6';

  let daysOnWebsite = daysPassedSincePostedDate(curatedPropertyInfo);
  let lastUpdatedMoment = getLastUpdatedMoment(curatedPropertyInfo);
  let lastCheckedMoment = getLastCheckedMoment(curatedPropertyInfo);

  return (
    <section className={ `${Lib.THEME_CLASSES_PREFIX}single-listing-provider py-5` }>
      <div className="container"><div className="row"><div className="col-12">
        <h5 className={ `${Lib.THEME_CLASSES_PREFIX}info-section-header mb-4` }>
          Listing Provider for {address[0]} {address_unit}
        </h5>

        <p className={`text-muted ${Lib.THEME_CLASSES_PREFIX}info-description text-muted py-3`}>
          {DISCLAIMER_TEXT}
        </p>

        <div className="row">
          <div className={ gridClass }>
            <div className={`${Lib.THEME_CLASSES_PREFIX}attr-group-content`}>
              <div>
                <span>Agent: </span>
                <span>{agentName}</span>
              </div>
              <div>
                <span>Agent Phone Number: </span>
                <span>{agentPhoneNumber}</span>
              </div>
              <div>
                <span>Office: </span>
                <span>{htmlHelper.decodeHtml(listing_office)}</span>
              </div>
              <div>
                <span>Office Phone Number: </span>
                <span>{officePhoneNumber}</span>
              </div>
              <div>
                <span>MLS ID: </span>
                <span>{mlsId}</span>
              </div>
            </div>
          </div>
          <div className={ gridClass }>
            <div className={`${Lib.THEME_CLASSES_PREFIX}attr-group-content`}>
              <div>
                <span>Data Source: </span>
                <span>Triangle MLS Inc.</span>
              </div>
              <div>
                <span>Last Checked: </span>
                <span>{lastCheckedMoment.isValid() ? lastCheckedMoment.format('LLL') + ' UTC' : ''}</span>
              </div>
              <div>
                <span>Last Updated: </span>
                <span>{lastUpdatedMoment.isValid() ? lastUpdatedMoment.format('LLL') + ' UTC' : ''}</span>
              </div>
              <div>
                <span>Days on Site: </span>
                <span>{daysOnWebsite}</span>
              </div>
              <div>
                <img src={bundle.static_images_url + "triangle-mls-logo-large.gif"} alt="Buy"/>
              </div>
            </div>
          </div>
        </div>
      </div></div></div>
    </section>
  );
};

ListingProvider.propTypes = {
  curatedPropertyInfo: PropTypes.object,
  fromMapView: PropTypes.bool,
}

export default ListingProvider;