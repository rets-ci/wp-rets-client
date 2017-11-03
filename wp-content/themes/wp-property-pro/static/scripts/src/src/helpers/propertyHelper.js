import moment from 'moment';
import get from 'lodash/get';

import { Lib } from 'app_root/lib.jsx';


const helper = {
  getLastUpdatedMoment,
  getLastCheckedMoment,
  daysPassedSincePostedDate,

  getContactFormData,
};

export default helper;

/************************************
* public functions
************************************/
function getLastUpdatedMoment(property) {
  const { post_date } = property;

  let parsed = moment.utc(post_date, Lib.COMMON_DATE_FORMAT_1);
  if (!parsed.isValid()) {
    console.warn(`date ${post_date} could not be parsed`);
    return false;
  } else {
    return parsed;
  }
}

function daysPassedSincePostedDate(property) {
  const { post_date } = property;

  let parsed = moment.utc(post_date, Lib.COMMON_DATE_FORMAT_1);
  if (!parsed.isValid()) {
    console.warn(`date ${post_date} could not be parsed`);
    return false;
  } else {
    let now = moment.utc();
    return now.diff(parsed, 'days') !== 0 ? now.diff(parsed, 'days') : 'Today';
  }
}

function getLastCheckedMoment(property) {
  const { post_modified, wpp_import_time } = property;

  let post_modified_moment = moment.utc(post_modified, Lib.COMMON_DATE_FORMAT_1);
  let wpp_import_time_moment = moment.utc(wpp_import_time, Lib.COMMON_DATE_FORMAT_1);

  let lastCheckedMoment = post_modified_moment;
  if (wpp_import_time && wpp_import_time_moment.isSameOrAfter(post_modified_moment)) {
    lastCheckedMoment = wpp_import_time_moment;
  }

  return lastCheckedMoment;
}



/*
  @params {object} property - curated metadata
  @output {object}

*/
function getContactFormData(property, agents) {

  const {
    agentId,
    agentName,
    agentPhoneNumber,
    listing_office
  } = property;

  const RETSAgent = {
    id: agentId,
    name: agentName,
    phone: agentPhoneNumber,
  };

  const saleTypeWithRDC = getSaleTypeWithRDC(property);
  const listingOffice = saleTypeWithRDC.includes('sale') ? 'Red Door Company' : listing_office;

  let agent;
  if (RETSAgent.id && agents && agents.length) {
    agent = pickProperAgent(RETSAgent, agents, saleTypeWithRDC);
  }

  return {
    agent,
    listingOffice,
    saleTypeWithRDC,
  }
}

/************************************
* private functions
************************************/

const defaultAgentImage = `${bundle.static_images_url}user-placeholder-image.png`;

const getAgentImage = (agentObject) => get(agentObject, 'data.images[0][0]', defaultAgentImage);
const getAgentName = (agentObject) => get(agentObject, 'data.display_name', null);
const getAgentPhone = (agentObject) => get(agentObject, 'data.meta.phone_number[0]', null);

function findAgentById(agents, agentId) {
  let agent = {};

  let foundAgent = agents.find(function(e) {
    return get(e, 'data.meta.triangle_mls_id[0]') === agentId;
  });

  if (foundAgent) {
    agent.image = getAgentImage(foundAgent);
    agent.name = getAgentName(foundAgent);
    agent.phone = getAgentPhone(foundAgent);
  }

  return agent;
}

function findRandomAgentBySaleType(agents, saleType) {
  let agent = {};

  let agentsBySaleTypes = agents.filter(function(a) {
    return a.data.meta.sale_type ? a.data.meta.sale_type[0].includes(saleType) : null;
  });

  if (agentsBySaleTypes.length) {
    let randomAgent = agentsBySaleTypes[ Math.floor(Math.random() * agentsBySaleTypes.length) ];
    agent.image = getAgentImage(randomAgent);
    agent.name = getAgentName(randomAgent);
    agent.phone = getAgentPhone(randomAgent)
  }

  return agent;
}

function pickProperAgent(RETSAgent, agents, saleTypeWithRDC) {
  let agent;

  if (saleTypeWithRDC === 'rentRDC' || saleTypeWithRDC === 'saleRDC') {
    agent = findAgentById(agents, RETSAgent.id);
  } else if (saleTypeWithRDC === 'rentNOTRdc') {
    agent = RETSAgent;
  } else if (saleTypeWithRDC === 'saleNotRdc') {
    agent = findRandomAgentBySaleType(agents, 'Buy');
  }

  return agent;
}


function getSaleTypeWithRDC({ listing_status_sale, listing_office }) {
  const saleType = listing_status_sale.replace('for-', '');
  const isRDCListing = listing_office === 'Red Door Company';

  let saleTypeWithRDC;

  if (saleType === 'rent' && isRDCListing) {
    saleTypeWithRDC = 'rentRDC';
  } else if (saleType === 'rent' && !isRDCListing) {
    saleTypeWithRDC = 'rentNOTRdc';
  } else if (saleType === 'sale' && isRDCListing) {
    saleTypeWithRDC = 'saleRDC';
  } else if (saleType === 'sale' && !isRDCListing) {
    saleTypeWithRDC = 'saleNotRdc';
  }

  return saleTypeWithRDC;
}
