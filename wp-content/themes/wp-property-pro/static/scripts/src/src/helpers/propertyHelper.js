import moment from 'moment';
import numeral from 'numeral';
import get from 'lodash/get';

import { Lib } from 'app_root/lib.jsx';

export {
  commonDateFormat,
  getLastUpdatedMoment,
  getLastCheckedMoment,
  daysPassedSincePostedDate,
  getContactFormData,
  getContactFormTabFeeder,
  getListingTypeJSONFileName,
  formatYesOrNoFields,
  moneyFormat
};

/************************************
* public functions
************************************/
function commonDateFormat(val, formatting) {
  let formattedDate = moment(val, formatting);
  return val && formattedDate.isValid() ? formattedDate.format('MMM D, YYYY') : null;
}

function getLastUpdatedMoment(property) {
  const { post_modified } = property;

  let parsed = moment.utc(post_modified, Lib.COMMON_DATE_FORMAT_1);
  if (!parsed.isValid()) {
    console.warn(`date ${post_modified} could not be parsed`);
    return false;
  } else {
    return parsed;
  }
}

function daysPassedSincePostedDate(property) {
  const { rets_list_date } = property;

  let parsed = moment.utc(rets_list_date, Lib.COMMON_DATE_FORMAT_1);
  if (!parsed.isValid()) {
    console.warn(`date ${rets_list_date} could not be parsed`);
    return false;
  } else {
    let now = moment.utc();
    return now.diff(parsed, 'days') !== 0 ? now.diff(parsed, 'days') : 1;
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
    mlsId,
    listing_office,
    sale_type,
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
    mlsId,
    listingOffice,
    saleType: sale_type,
    saleTypeWithRDC,
  }
}

function getListingTypeJSONFileName({ sale_type, listing_type}) {
  let fileName;

  if (sale_type === 'rent' && listing_type === 'residential') {
    fileName = 'residential_rent_RT_6';
  } else if (sale_type === 'sale' && listing_type === 'residential') {
    fileName =  'residential_sale_RE_1';
  } else if (sale_type === 'sale' && listing_type === 'commercial') {
    fileName =  'commercial_CI_4';
  } else if (sale_type === 'rent' && listing_type === 'commercial')  {
    fileName =  'commercial_CI_4';
  } else if (sale_type === 'sale' && listing_type === 'land') {
    fileName =  'land_CU_5_and_LN_3';
  } else if (sale_type === 'rent' && listing_type === 'land') {
    fileName =  'land_CU_5_and_LN_3';
  }

  if (!fileName) {
    console.log('listing type was not found, property data will not be shown');
  }

  return fileName;
}

function getContactFormTabFeeder(post_title, mlsId) {
  return (selectedTab) => {
    let obj = {
      'request-information-sale': {
        'powf_b62d13821a12e61180e4fc15b428cd78': `I'm interested in ${post_title} (MLS ${mlsId})`
      },
      'request-showing-sale': {
        'powf_b62d13821a12e61180e4fc15b428cd78': `I'd like to schedule a showing for ${post_title} (MLS ${mlsId})`
      },
      'request-showing-rent': {
        'powf_7e1aec73bc16e61180e9c4346bace2d4': `I'd like to schedule a showing for ${post_title} (MLS ${mlsId})`
      }
    };
    return obj[selectedTab] || {};
  }
}

function formatYesOrNoFields(data, ESReference) {
  let t = get(data, ESReference, false);
  let result;
  if (t) {
    if (t.includes('No')) {
      result = "No";
    } else {
      result = "Yes";
    }
  } else {
    result = false;
  }
  return result;
};

function moneyFormat(data) {
  return data !== null && data !== 0 && '$' + numeral(data).format('0,0');
};

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
    if (!RETSAgent.image) {
      agent.image = defaultAgentImage;
    }
  } else if (saleTypeWithRDC === 'saleNotRdc') {
    agent = findRandomAgentBySaleType(agents, 'Buy');
  }

  return agent;
}


function getSaleTypeWithRDC({ sale_type, sale_types, listing_office }) {
  let saleTypeWithRDC;
  const isRDCListing = listing_office === 'Red Door Company';

  if (sale_type === 'rent' && isRDCListing) {
    saleTypeWithRDC = 'rentRDC';
  } else if (sale_type === 'rent' && !isRDCListing) {
    saleTypeWithRDC = 'rentNOTRdc';
  } else if (sale_type === 'sale' && isRDCListing) {
    saleTypeWithRDC = 'saleRDC';
  } else if (sale_type === 'sale' && !isRDCListing) {
    saleTypeWithRDC = 'saleNotRdc';
  }

  return saleTypeWithRDC;
}
