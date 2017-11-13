import get from 'lodash/get';
import { moneyFormat } from 'app_root/helpers/propertyHelper';
import {
  getAcres,
  getArea,
  getCity,
  getCounty,
  getCrossStreet,
  getDirections,
  getElementarySchool,
  getInsideCity,
  getHighSchool,
  getLatitude,
  getLongitude,
  getLotDescription,
  getLotNumber,
  getLotSizeArea,
  getLotSizeDim,
  getMiddleSchool,
  getMLSId,
  getModifiedDate,
  getPrice,
  getPricePerAcre,
  getPricePerSQFT,
  getPropertyType,
  getPublishedDate,
  getRestrictiveCovenants,
  getRoadFrontage,
  getState,
  getStatus,
  getStreet,
  getStreetDirectional,
  getStreetNumber,
  getSubArea,
  getUnitNumber,
  getSQFT,
  getZip,
  getZoning
} from 'app_root/helpers/propertyAttributeHelper';

export default [
  {
    "name": "Features", "children": [
      {"name": "Land", "items": [
        {"name": "Type", "value": (data) => { return getPropertyType(data); }, "order": 1},
        {"name": "Description", "value": (data) => { return null; }, "order": 2},
        {"name": "Topography", "value": (data) => { return null; }, "order": 3},
        {"name": "Vegetation", "value": (data) => { return null }, "order": 4},
        {"name": "Cleared Acres", "value": (data) => { return get(data, 'post_meta.rets_cleared_acres[0]', null); }, "order": 5},
        {"name": "Wooded Acres", "value": (data) => { return get(data, 'post_meta.rets_wooded_acres[0]', null); }, "order": 6},
        {"name": "Farm Use", "value": (data) => { return null; }, "order": 7},
        {"name": "Water", "value": (data) => { return null }, "order": 8}
      ], "order": 1},
      {"name": "Lot", "items": [
        {"name": "Number", "value": (data) => { return getLotNumber(data); }, "order": 1},
        {"name": "Description", "value": (data) => { return getLotDescription(data); }, "order": 2},
        {"name": "Acres", "value": (data) => { return getLotSizeArea(data); }, "order": 3},
        {"name": "SQFT", "value": (data) => { return getSQFT(data); }, "order": 4},
        {"name": "Dimensions", "value": (data) => { return getLotSizeDim(data); }, "order": 5},
        {"name": "Buildings", "value": (data) => { return get(data, 'post_meta.rets_number_of_buildings[0]', null); }, "order": 6},
        {"name": "Equipment", "value": (data) => { return null; }, "order": 7},
        {"name": "Sewer", "value": (data) => { return null; }, "order": 8},
        {"name": "Percolation Test", "value": (data) => { return null; }, "order": 9},
        {"name": "Percolation Test Result", "value": (data) => { let result = get(data, 'post_meta.rets_number_of_beds_yielded[0]', null); return result ? "Rated " + result + " bedrooms" : null; }, "order": 10},
        {"name": "Zoning", "value": (data) => { return getZoning(data); }, "order": 11},
        {"name": "Restrictive Covenants", "value": (data) => { return getRestrictiveCovenants(data); }, "order": 12},
        {"name": "Easements", "value": (data) => { return null; }, "order": 13},
        {"name": "Road Frontage", "value": (data) => { return null; }, "order": 14},
        {"name": "Road Frontage Length", "value": (data) => { getRoadFrontage(data); }, "order": 14},
        {"name": "Road Description", "value": (data) => { return null; }, "order": 15},
        {"name": "Improvements", "value": (data) => { return null; }, "order": 16},
        {"name": "Utilities", "value": (data) => { return null; }, "order": 17},
        {"name": "Building Project", "value": (data) => { return get(data, 'post_meta.rets_building_name[0]', null); }, "order": 18},
        {"name": "Flood Plain", "value": (data) => { return null; }, "order": 19},
        {"name": "Traffic Count", "value": (data) => { return get(data, 'post_meta.rets_traffic_count[0]', null); }, "order": 20},
        {"name": "Distance to RDU", "value": (data) => { return null; }, "order": 21},
        {"name": "Rail Service", "value": (data) => { return null }, "order": 22}
      ], "order": 2},
      {"name": "Utility", "items": [
        {"name": "Utilities", "value": (data) => { return get(data, 'post_meta.rets_number_of_rentals[0]', null); }, "order": 1},
        {"name": "Water & Sewer", "value": (data) => { return get(data, 'post_meta.rets_water_sewer_fee[0]', null); }, "order": 2}
      ], "order": 3}
    ]
  },
  {
    "name": "Location", "children": [
      {"name": "Community", "items": [
        {"name": "Subdivision", "value": (data) => { return getSubdivision(data); }, "order": 1},
        {"name": "Neighborhood", "value": (data) => { return getNeighborhood(data); }, "order": 2},
        {"name": "County", "value": (data) => { return getCounty(data); }, "order": 3},
        {"name": "Area", "value": (data) => { return getArea(data); }, "order": 4},
        {"name": "Sub Area", "value": (data) => { return getSubArea(data); }, "order": 5},
        {"name": "Transit", "value": (data) => { return null; }, "order": 6}
      ], "order": 1},
      {"name": "Homeowners Association", "items": [
        {"name": "HOA Fees", "value": (data) => { return get(data, 'post_meta.rets_association_fee[0]', null); }, "order": 1},
        {"name": "HOA Fees", "value": (data) => { return null; }, "order": 2}
      ], "order": 2},
      {"name": "Schools", "items": [
        {"name": "Elementary School", "value": (data) => { return getElementarySchool(data); }, "order": 1},
        {"name": "Middle School", "value": (data) => { return getMiddleSchool(data); }, "order": 2},
        {"name": "High School", "value": (data) => { return getHighSchool(data); }, "order": 3}
      ], "order": 3},
      {"name": "Address", "items": [
        {"name": "Cross Street", "value": (data) => { return getCrossStreet(data); }, "order": 1},
        {"name": "Inside City", "value": (data) => { return getInsideCity(data); }, "order": 2},
        {"name": "Street Number", "value": (data) => { return getStreetNumber(data); }, "order": 3},
        {"name": "Street Directional", "value": (data) => { return getStreetDirectional(data); }, "order": 4},
        {"name": "Street", "value": (data) => { return getStreet(data); }, "order": 5},
        {"name": "Post Directional", "value": (data) => { return null; }, "order": 6},
        {"name": "Unit Number", "value": (data) => { return getUnitNumber(data); }, "order": 7},
        {"name": "City", "value": (data) => { return getCity(data); }, "order": 8},
        {"name": "State", "value": (data) => { return getState(data); }, "order": 9},
        {"name": "Zip", "value": (data) => { return getZip(data); }, "order": 10},
        {"name": "Latitude", "value": (data) => { return getLatitude(data); }, "order": 11},
        {"name": "Longitude", "value": (data) => { return getLongitude(data); }, "order": 12},
        {"name": "Directions", "value": (data) => { return getDirections(data); }, "order": 13}
      ], "order": 4},
    ]
  },
  {"name": "Listing", "children": [
    {"name": "Pricing", "items": [
      {"name": "Type", "value": (data) => { return get(data, 'tax_input.wpp_listing_status.listing_status_sale', []).map(d => d.name.replace('For ', '')).join(', '); }, 'order': 1},
      {"name": "Price", "value": (data) => { return getPrice(data); }, "order": 2},
      {"name": "Price Per Acre", "value": (data) => { return getPricePerAcre(data); }, "order": 3},
      {"name": "Price Per SQFT", "value": (data) => { return getPricePerSQFT(data); }, 'order': 4},
      {"name": "Sale Price", "value": (data) => { return getPrice(data); }, 'order': 5},
      {"name": "Minimum Sale Price Per Acre", "value": (data) => { return moneyFormat(get(data, 'post_meta.rets_minimum_sq_ft_available[0]', null)); }, 'order': 6},
      {"name": "Rent Price", "value": (data) => { let leasePrice = get(data, 'post_meta.rets_lease_price[0]', null); return +leasePrice !== 0 ? leasePrice : null; }, 'order': 7},
      {"name": "Minimum Rent Price Per Acre", "value": (data) => { let mnimumLeasePrice = get(data, 'post_meta.rets_minimum_lease_price_acre[0]', null); return +mnimumLeasePrice !== 0 ? mnimumLeasePrice : null; }, 'order': 8},
      {"name": "Acres Available", "value": (data) => { return get(data, 'post_meta.rets_available_acres[0]', null); }, 'order': 9},
      {"name": "Minimum Acres Available", "value": (data) => { return get(data, 'post_meta.rets_minimum_acres_avail[0]', null); }, 'order': 10}
    ], "order": 1},
    {"name": "Terms", "items": [
      {"name": "Special Conditions", "value": (data) => { return null; }, "order": 1},
      {"name": "Terms", "value": (data) => { return null; }, "order": 2}
    ], "order": 2},
    {"name": "Status", "items": [
      {"name": "MLS ID", "value": (data) => { return getMLSId(data); }, "order": 1},
      {"name": "Status", "value": (data) => { return getStatus(data); }, "order": 2},
      {"name": "Published Date", "value": (data) => { return getPublishedDate(data); }, "order": 3},
      {"name": "Modified Date", "value": (data) => { return getModifiedDate(data); }, "order": 4}
    ], "order": 3}
  ]}
]