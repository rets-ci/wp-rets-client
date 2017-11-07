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

  let gridClass = fromMapView ? 'col-12' : 'col-xl-6';

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
            <ul className={`${Lib.THEME_CLASSES_PREFIX}details-list`}>
              <li>
                <span>Agent:</span> {agentName}
              </li>
              <li>
                <span>Agent Phone Number:</span> {agentPhoneNumber}
              </li>
              <li>
                <span>Office:</span> {htmlHelper.decodeHtml(listing_office)}
              </li>
              <li>
                <span>Office Phone Number:</span> {officePhoneNumber}
              </li>
              <li>
                <span>MLS ID:</span> {mlsId}
              </li>
            </ul>
          </div>
          <div className={ gridClass }>
            <ul className={`${Lib.THEME_CLASSES_PREFIX}details-list`}>
              <li>
                <span>Data Source: </span>  Triangle MLS Inc.
              </li>
              <li>
                <span>Last Checked: </span> {lastCheckedMoment.isValid() ? lastCheckedMoment.format('LLL') + ' UTC' : ''}
              </li>
              <li>
                <span>Last Updated: </span> {lastUpdatedMoment.isValid() ? lastUpdatedMoment.format('LLL') + ' UTC' : ''}
              </li>
              <li>
                <span>Days on Site: </span> {daysOnWebsite}
              </li>
              <li>
                <img src={bundle.static_images_url + "triangle-mls-logo-large.gif"} alt="Buy"/>
              </li>
            </ul>
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