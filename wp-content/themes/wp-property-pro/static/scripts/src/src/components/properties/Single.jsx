import {setAgentCardTab} from '../../actions/index.jsx';
import AgentCardForms from './Components/AgentCardForms.jsx';
import FormFetcher from '../Forms/FormFetcher.jsx';
import get from 'lodash/get';
import {Lib} from '../../lib.jsx';
import moment from 'moment';
import PropertyHighlights from './Components/PropertyHighlights.jsx';
import PropertyInfoTabs from './Components/PropertyInfoTabs.jsx';
import propertyDataStructure from '../../../static_data/property-data-structure.json';
import PropertiesModal from '../Modals/PropertiesModal.jsx';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import renderHTML from 'react-render-html';
import scrollToElement from 'scroll-to-element';
import ImageMixer from './Components/ImageMixer.jsx';
import Util from 'app_root/components/Util.jsx';

let getAgentImage = (agentObject) => get(agentObject, 'data.images[0][0]', null);
let getAgentName = (agentObject) => get(agentObject, 'data.display_name', null);
let getAgentPhone = (agentObject) => get(agentObject, 'data.meta.phone_number[0]', null);

let findAgentById = (agents, agentId) => {
  let agent = {};
  let foundAgent = agents.filter(function(a) {
    return a.data.meta.triangle_mls_id ? a.data.meta.triangle_mls_id[0] === agentId : null;
  });
  if (foundAgent.length) {
    agent.image = getAgentImage(foundAgent[0]);
    agent.name = getAgentName(foundAgent[0]);
    agent.phone = getAgentPhone(foundAgent[0]);;
  }
  return agent;
}

let findRandomAgentBySaleType = (agents, saleType) => {
  let agent = {};
  let agentsBySaleTypes = agents.filter(function(a) {
    return a.data.meta.sale_type ? a.data.meta.sale_type[0].includes(saleType) : null;
  });
  if (agentsBySaleTypes.length) {
    let randomAgent = agentsBySaleTypes[Math.floor(Math.random() * agentsBySaleTypes.length)];
    agent.image = getAgentImage(randomAgent);;
    agent.name = getAgentName(randomAgent);;
    agent.phone = getAgentPhone(randomAgent);
  }
  return agent;
}

let getLastUpdatedMoment = (lastUpdated, format) => {
  let parsed = moment.utc(lastUpdated, format);
  if (!parsed.isValid()) {
    console.warn(`date ${lastUpdated} could not be parsed`);
    return false;
  } else {
    return parsed;
  }
};

let daysPassedSincePostedDate = (postDate, format) => {
  let parsed = moment.utc(postDate, format);
  if (!parsed.isValid()) {
    console.warn(`date ${postDate} could not be parsed`);
    return false;
  } else {
    let now = moment.utc();
    return now.diff(parsed, 'days') !== 0 ? now.diff(parsed, 'days') : 'Today';
  }
};

const mapStateToProps = (state) => {
  return {
    selectedAgentCardTab: get(state, 'agentCardState.tab', null) 
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setAgentCardTab: (tab) => {
      dispatch(setAgentCardTab(tab));
    }
  };
}

class Single extends Component {
  static propTypes = {
    selectedAgentCardTab: PropTypes.string,
    setAgentCardTab: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      agent: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.mlsId !== nextProps.mlsId) {
      const container = document.querySelector(`.${Lib.THEME_CLASSES_PREFIX}single-container`);
      const node = document.querySelector(`.${Lib.THEME_CLASSES_PREFIX}image-mixer`);
      Util.scrollToElement(container, node, 500);
    }
  }

  correctAgent = (RETSAgent, agents, scenario) => {
    let agent;
    if (scenario === 'rentRDC') {
      agent = findAgentById(agents, RETSAgent.id);
    } else if (scenario === 'rentNOTRdc') {
      agent = RETSAgent;
    } else if (scenario === 'saleRDC') {
      agent = findAgentById(agents, RETSAgent.id);
    } else if (scenario === 'saleNotRdc') {
      agent = findRandomAgentBySaleType(agents, 'Buy');
    }
    return agent;
  }

  correctScenario = (saleType, rdcListing) => {
    let scenario;
    if (saleType === 'rent' && rdcListing) {
      scenario = 'rentRDC';
    } else if (saleType === 'rent' && !rdcListing) {
      scenario = 'rentNOTRdc';
    } else if (saleType === 'sale' && rdcListing) {
      scenario = 'saleRDC';
    } else if (saleType === 'sale' && !rdcListing) {
      scenario = 'saleNotRdc';
    }
    return scenario;
  }

  requestButtonClicked = tab => {
    if (this.props.fromMapView) {
      const container = document.querySelector(`.${Lib.THEME_CLASSES_PREFIX}single-container`);
      const node = document.getElementById(this.agentCardContainer.id);
      Util.scrollToElement(container, node, 500);
    } else {
      scrollToElement('#' + this.agentCardContainer.id, { duration: 500 });
    }
    this.props.setAgentCardTab(tab);
  }

  render() {
    let {
      address,
      address2,
      address_unit,
      agents,
      all,
      baths,
      beds,
      city,
      elementary_school,
      images,
      mlsId,
      post_content,
      post_date,
      post_title,
      post_modified,
      rets_city,
      rets_high_school,
      rets_state,
      formatted_address_simple,
      rets_date_available,
      rets_list_price,
      rets_living_area,
      rets_lot_size_area,
      rets_middle_school,
      rets_postal_code,
      rets_year_built,
      state,
      sqft,
      wpp_location_subdivision,
      wpp_location_city,
      listing_office,
      listing_status_sale,
      listing_type,
      listing_sub_type,
      officePhoneNumber,
      wpp_import_time
    } = this.props;
    let agent;

    let RETSAgent = {
      id: this.props.agentId,
      name: this.props.agentName,
      phone: this.props.agentPhoneNumber,
    };
    let saleType = listing_status_sale.replace('for-', '');
    let rdcListing = listing_office === 'Red Door Company';
    let correctScenario = this.correctScenario(saleType, rdcListing);

    if (RETSAgent.id && agents && agents.length) {
      agent = this.correctAgent(
        RETSAgent,
        agents,
        correctScenario
      );
    }
    let daysOnWebsite = daysPassedSincePostedDate(post_date, Lib.COMMON_DATE_FORMAT_1);
    let datesAvailable = moment.utc(rets_date_available, 'YYYY-MM-DD');
    let lastUpdated = getLastUpdatedMoment(post_date, Lib.COMMON_DATE_FORMAT_1);

    let info_box = `<li>${listing_sub_type}</li>`;
    let post_modified_moment = moment.utc(post_modified, Lib.COMMON_DATE_FORMAT_1);
    let wpp_import_time_moment = moment.utc(wpp_import_time, Lib.COMMON_DATE_FORMAT_1);

    let lastCheckedMoment = wpp_import_time ? (wpp_import_time_moment.isSameOrAfter(post_modified_moment) ? wpp_import_time_moment : post_modified_moment) : post_modified_moment;
    if (rets_list_price) {
      info_box += `<li>${rets_list_price ? Util.formatPriceValue(rets_list_price) : "N/A"}</li>`;
    }
    switch (listing_type) {
      case 'land':
        if (rets_lot_size_area) {
          info_box += `<li>${Util.formatLotSizeValue(rets_lot_size_area)} Acres</li>`;
        }
        break;
      case 'commercial':
        if (!!+sqft) {
          info_box += `<li>${Util.formatSQFTValue(sqft)} SF</li>`;
        }
        break;
      default:
        if (beds) {
          info_box += `<li>${beds} Beds</li>`;
        }

        if (baths) {
          info_box += `<li>${baths} Baths</li>`;
        }

        if (!!+sqft) {
          info_box += `<li>${Util.formatSQFTValue(sqft)} SF</li>`;
        }

        if (rets_lot_size_area) {
          info_box += `<li>${Util.formatLotSizeValue(rets_lot_size_area)} Acres</li>`;
        }
    }
    return (
      <div className={Lib.THEME_CLASSES_PREFIX + "single-container"}>
        <ImageMixer images={images || []}/>
        <div className="jumbotron py-5 mb-5">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h4 className={`${Lib.THEME_CLASSES_PREFIX}info-title`}>{address[0]} {address_unit}</h4>
                <h6
                  className="mb-3 text-muted">{city}, {state} {rets_postal_code}</h6>
                <ul className={`${Lib.THEME_CLASSES_PREFIX}listing-info-box ${Lib.THEME_CLASSES_PREFIX}listing-info-box-wrap`}>{renderHTML(info_box)}</ul>
                <button
                  className={`btn btn-primary ${Lib.THEME_CLASSES_PREFIX}button ${Lib.THEME_CLASSES_PREFIX}primary-button`}
                  onClick={(event) => { event.preventDefault(); this.requestButtonClicked('request-showing-' + saleType)}}
                  type="button"
                >
                  Request Showing
                </button>
                {['rentNOTRdc', 'saleRDC', 'saleNotRdc'].indexOf(correctScenario) >= 0 &&
                  <button
                    className={`btn btn-primary ${Lib.THEME_CLASSES_PREFIX}button ${Lib.THEME_CLASSES_PREFIX}secondary-button ml-md-3`}
                    onClick={(event) => { event.preventDefault(); this.requestButtonClicked('request-information-' + saleType)}}
                    type="button"
                  >
                    Request Information
                  </button> 
                }
                {correctScenario === 'rentRDC' &&
                  <button
                    className={`btn btn-primary ${Lib.THEME_CLASSES_PREFIX}button ${Lib.THEME_CLASSES_PREFIX}secondary-button ml-md-3`}
                    onClick={(event) => { event.preventDefault(); this.requestButtonClicked('request-application')}}
                    type="button"
                  >
                    Request Application
                  </button>
                }
              </div>
            </div>
          </div>
        </div>


        <div className="container">
          <div className="row">
            <div className="col-md-12 mb-5">
              <p className={`text-muted ${Lib.THEME_CLASSES_PREFIX}info-description`}>{(saleType === 'rent' && listing_type === 'residential' && datesAvailable.isValid() ? "Available " + datesAvailable.format('MMMM D, YYYY') + '. ' : '') + renderHTML(post_content)}</p>
            </div>
          </div>


          <div className="row mb-5">
            <div className={`col-md-3 ${Lib.THEME_CLASSES_PREFIX}small-info-box`}>
              <p className={`text-muted ${Lib.THEME_CLASSES_PREFIX}top`}>Last Checked</p>
              <p className={`${Lib.THEME_CLASSES_PREFIX}bottom`}>{lastCheckedMoment.fromNow()}</p>
            </div>
            {lastUpdated.isValid() &&
              <div className={`col-md-3 ${Lib.THEME_CLASSES_PREFIX}small-info-box`}>
                <p className={`text-muted ${Lib.THEME_CLASSES_PREFIX}top`}>Last Updated</p>
                <p className={`${Lib.THEME_CLASSES_PREFIX}bottom`}>{lastUpdated.format('MMM DD, YYYY')}</p>
              </div>
            }
            {daysOnWebsite !== null &&
              <div className={`col-md-3 ${Lib.THEME_CLASSES_PREFIX}small-info-box`}>
                <p className={`text-muted ${Lib.THEME_CLASSES_PREFIX}top`}>Days on Website</p>
                <p className={`${Lib.THEME_CLASSES_PREFIX}bottom`}>{daysOnWebsite}</p>
              </div>
            }
          </div>

          {['commercial', 'land'].indexOf(listing_type) < 0 &&
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
          }

          {['commercial', 'land'].indexOf(listing_type) < 0 &&
            <div className="row">
              <div className="col-md-12 mb-3">
                <h5 className={`${Lib.THEME_CLASSES_PREFIX}info-section-header`}>Property Details for {address[0]} {address_unit}</h5>
              </div>
              <div className="col-md-12 mb-3">
                <p className={`text-muted ${Lib.THEME_CLASSES_PREFIX}info-description`}>847 Estes Street is a house for
                  rent in Durham, NC 27701. This 1440 square foot house sits on a 0.13 lot and features 3 bedrooms and 2
                  bathrooms. Built in 1915, this house has been on the market for a total of 1 month and is currently
                  priced at $1,100 a month.</p>
              </div>
              <div className="col-md-12 mb-5">
                <PropertyInfoTabs
                  data={all}
                  propertyDataStructure={propertyDataStructure}
                />
              </div>
            </div>
          }

          <div id="agentCardContainer" className="mb-5" ref={(r) => this.agentCardContainer = r}>
            <AgentCardForms
              address={address[0]}
              correctScenario={correctScenario}
              agent={agent}
              listingOffice={correctScenario.includes('sale') ? "Red Door Company" : Util.decodeHtml(this.props.listing_office)}
              mlsId={mlsId}
              rdcListing={rdcListing}
              officePhoneNumber={officePhoneNumber}
              setAgentCardTab={this.props.setAgentCardTab}
              selectedTab={this.props.selectedAgentCardTab}
              saleType={listing_status_sale.replace('for-', '')}
            />
          </div>


          <div className="row">
            <div className="col-md-12 mt-3 mb-3">
              <h5 className={`${Lib.THEME_CLASSES_PREFIX}info-section-header`}>Listing Provider for {address[0]} {address_unit}</h5>
            </div>

            <div className="col-md-12 mb-4">
              <p className={`text-muted ${Lib.THEME_CLASSES_PREFIX}info-description`}>
                Information Not Guaranteed. © Triangle MLS Inc. All rights reserved. Listings marked with a TMLSidx icon
                are provided courtesy of the Triangle MLS, Inc. of North Carolina, Internet Data Exchange Database.
              </p>
            </div>
          </div>
          <div className="row mb-5">
            <div className={`col-md-6`}>
              <ul className={`${Lib.THEME_CLASSES_PREFIX}details-list`}>
                <li>
                  <span className={`${Lib.THEME_CLASSES_PREFIX}item-name`}>Agent:</span> {RETSAgent.name}
                </li>
                <li>
                  <span className={`${Lib.THEME_CLASSES_PREFIX}item-name`}>Agent Phone Number:</span> {RETSAgent.phone}
                </li>
                <li>
                  <span className={`${Lib.THEME_CLASSES_PREFIX}item-name`}>Office:</span> {Util.decodeHtml(this.props.listing_office)}
                </li>
                <li>
                  <span className={`${Lib.THEME_CLASSES_PREFIX}item-name`}>Office Phone Number:</span> {officePhoneNumber}
                </li>
                <li>
                  <span className={`${Lib.THEME_CLASSES_PREFIX}item-name`}>MLS ID:</span> {mlsId}
                </li>
              </ul>
            </div>
            <div className="col-md-6">
              <ul className={`${Lib.THEME_CLASSES_PREFIX}details-list`}>
                <li>
                  <span className={`${Lib.THEME_CLASSES_PREFIX}item-name`}>Data Source: </span>  Triangle MLS Inc.
                </li>
                <li>
                  <span className={`${Lib.THEME_CLASSES_PREFIX}item-name`}>Last Checked: </span> {lastCheckedMoment.isValid() ? lastCheckedMoment.format('LLL') + ' UTC' : ''}
                </li>
                <li>
                  <span className={`${Lib.THEME_CLASSES_PREFIX}item-name`}>Last Updated: </span> {lastUpdated.isValid() ? lastUpdated.format('LLL') + ' UTC' : ''}
                </li>
                <li>
                  <span className={`${Lib.THEME_CLASSES_PREFIX}item-name`}>Days on Site: </span> {daysOnWebsite}
                </li>
                <li>
                  <img src={bundle.static_images_url + "triangle-mls-logo-large.gif"} alt="Buy"/>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Single);