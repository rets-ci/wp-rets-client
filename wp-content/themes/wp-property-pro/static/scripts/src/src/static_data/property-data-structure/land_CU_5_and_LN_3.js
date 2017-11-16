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
  getListingStatuses,
  getLatitude,
  getLongitude,
  getLotDescription,
  getLotNumber,
  getLotSizeArea,
  getLotSizeDim,
  getMiddleSchool,
  getMLSId,
  getModifiedDate,
  getPostDirectional,
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
  getNeighborhood,
  getSubArea,
  getSubdivision,
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
        {"name": "Description", "value": (data) => { return get(data, 'tax_input.rets_land_description.rets_land_description', []).map(d => d.name).join(', ') || null; }, "order": 2},
        {"name": "Topography", "value": (data) => { return get(data, 'tax_input.rets_topography.rets_topography', []).map(d => d.name).join(', ') || null; }, "order": 3},
        {"name": "Vegetation", "value": (data) => { return get(data, 'tax_input.rets_vegetation.rets_vegetation', []).map(d => d.name).join(', ') || null; }, "order": 4},
        {"name": "Cleared Acres", "value": (data) => { return get(data, 'post_meta.rets_cleared_acres[0]', null); }, "order": 5},
        {"name": "Wooded Acres", "value": (data) => { return get(data, 'post_meta.rets_wooded_acres[0]', null); }, "order": 6},
        {"name": "Farm Use", "value": (data) => { return get(data, 'tax_input.rets_farm_use.rets_farm_use', []).map(d => d.name).join(', ') || null; }, "order": 7},
        {"name": "Water", "value": (data) => { return get(data, 'tax_input.rets_water.rets_water', []).map(d => d.name).join(', ') || null; }, "order": 8}
      ], "order": 1},
      {"name": "Lot", "items": [
        {"name": "Number", "value": (data) => { return getLotNumber(data); }, "order": 1},
        {"name": "Description", "value": (data) => { return getLotDescription(data); }, "order": 2},
        {"name": "Acres", "value": (data) => { return getLotSizeArea(data); }, "order": 3},
        {"name": "SQFT", "value": (data) => { return getSQFT(data); }, "order": 4},
        {"name": "Dimensions", "value": (data) => { return getLotSizeDim(data); }, "order": 5},
        {"name": "Buildings", "value": (data) => { return get(data, 'post_meta.rets_number_of_buildings[0]', null); }, "order": 6},
        {"name": "Equipment", "value": (data) => { return get(data, 'tax_input.rets_equipment_prod.rets_equipment_prod', []).map(d => d.name).join(', ') || null; }, "order": 7},
        {"name": "Sewer", "value": (data) => { return get(data, 'tax_input.rets_sewer_septic.rets_sewer_septic', []).map(d => d.name).join(', ') || null; }, "order": 8},
        {"name": "Percolation Test", "value": (data) => { return get(data, 'tax_input.rets_perk_test.rets_perk_test', []).map(d => d.name).join(', ') || null; }, "order": 9},
        {"name": "Percolation Test Result", "value": (data) => { let result = get(data, 'post_meta.rets_number_of_beds_yielded[0]', null); return result ? "Rated " + result + " bedrooms" : null; }, "order": 10},
        {"name": "Zoning", "value": (data) => { return getZoning(data); }, "order": 11},
        {"name": "Restrictive Covenants", "value": (data) => { return getRestrictiveCovenants(data); }, "order": 12},
        {"name": "Easements", "value": (data) => { return get(data, 'tax_input.rets_easements.rets_easements', []).map(d => d.name).join(', ') || null; }, "order": 13},
        {"name": "Road Frontage", "value": (data) => { return get(data, 'tax_input.rets_road_frontage_description.rets_road_frontage_description', []).map(d => d.name).join(', ') || null; }, "order": 14},
        {"name": "Road Frontage Length", "value": (data) => { return getRoadFrontage(data); }, "order": 14},
        {"name": "Road Description", "value": (data) => { return get(data, 'tax_input.rets_road_description.rets_road_description', []).map(d => d.name).join(', ') || null; }, "order": 15},
        {"name": "Improvements", "value": (data) => { return get(data, 'tax_input.rets_improvements.rets_improvements', []).map(d => d.name).join(', ') || null; }, "order": 16},
        {"name": "Utilities", "value": (data) => { return get(data, 'tax_input.rets_utilities.rets_utilities', []).map(d => d.name).join(', ') || null; }, "order": 17},
        {"name": "Building Project", "value": (data) => { return get(data, 'post_meta.rets_building_name[0]', null); }, "order": 18},
        {"name": "Flood Plain", "value": (data) => { return get(data, 'tax_input.rets_flood_plain.rets_flood_plain', []).map(d => d.name).join(', ') || null; }, "order": 19},
        {"name": "Traffic Count", "value": (data) => { return get(data, 'post_meta.rets_traffic_count[0]', null); }, "order": 20},
        {"name": "Distance to RDU", "value": (data) => { return get(data, 'tax_input.rets_distance_rdu.rets_distance_rdu', []).map(d => d.name).join(', ') || null; }, "order": 21},
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
        {"name": "Inside City", "value": (data) => { return getInsideCity(data); }, "order": 1},
        {"name": "Subdivision", "value": (data) => { return getSubdivision(data); }, "order": 2},
        {"name": "Neighborhood", "value": (data) => { return getNeighborhood(data); }, "order": 3},
        {"name": "County", "value": (data) => { return getCounty(data); }, "order": 4},
        {"name": "Area", "value": (data) => { return getArea(data); }, "order": 5},
        {"name": "Sub Area", "value": (data) => { return getSubArea(data); }, "order": 6},
        {"name": "Transit", "value": (data) => { return get(data, 'tax_input.rets_transportation.rets_transportation', []).map(d => d.name).join(', ') || null; }, "order": 7}
      ], "order": 1},
      {"name": "Homeowners Association", "items": [
        {"name": "HOA Fees", "value": (data) => { return get(data, 'post_meta.rets_association_fee[0]', null); }, "order": 1},
        {"name": "HOA Fees", "value": (data) => { return get(data, 'tax_input.rets_association_fee_payment.rets_association_fee_payment', []).map(d => d.name).join(', ') || null; }, "order": 2}
      ], "order": 2},
      {"name": "Schools", "items": [
        {"name": "Elementary School", "value": (data) => { return getElementarySchool(data); }, "order": 1},
        {"name": "Middle School", "value": (data) => { return getMiddleSchool(data); }, "order": 2},
        {"name": "High School", "value": (data) => { return getHighSchool(data); }, "order": 3}
      ], "order": 3},
      {"name": "Address", "items": [
        {"name": "Cross Street", "value": (data) => { return getCrossStreet(data); }, "order": 1},
        {"name": "Street Number", "value": (data) => { return getStreetNumber(data); }, "order": 2},
        {"name": "Street Directional", "value": (data) => { return getStreetDirectional(data); }, "order": 3},
        {"name": "Street", "value": (data) => { return getStreet(data); }, "order": 4},
        {"name": "Post Directional", "value": (data) => { return getPostDirectional(data); }, "order": 5},
        {"name": "Unit Number", "value": (data) => { return getUnitNumber(data); }, "order": 6},
        {"name": "City", "value": (data) => { return getCity(data); }, "order": 7},
        {"name": "State", "value": (data) => { return getState(data); }, "order": 8},
        {"name": "Zip", "value": (data) => { return getZip(data); }, "order": 9},
        {"name": "Latitude", "value": (data) => { return getLatitude(data); }, "order": 10},
        {"name": "Longitude", "value": (data) => { return getLongitude(data); }, "order": 11},
        {"name": "Directions", "value": (data) => { return getDirections(data); }, "order": 12}
      ], "order": 4},
    ]
  },
  {"name": "Listing", "children": [
    {"name": "Pricing", "items": [
      {"name": "Type", "value": (data) => { return getListingStatuses(data); }, 'order': 1},
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
      {"name": "Special Conditions", "value": (data) => { return get(data, 'tax_input.rets_special_conditions.rets_special_conditions', []).map(d => d.name).join(', ') || null; }, "order": 1},
      {"name": "Terms", "value": (data) => { return get(data, 'tax_input.rets_terms.rets_terms', []).map(d => d.name).join(', ') || null; }, "order": 2}
    ], "order": 2},
    {"name": "Status", "items": [
      {"name": "MLS ID", "value": (data) => { return getMLSId(data); }, "order": 1},
      {"name": "Status", "value": (data) => { return getStatus(data); }, "order": 2},
      {"name": "Published Date", "value": (data) => { return getPublishedDate(data); }, "order": 3},
      {"name": "Modified Date", "value": (data) => { return getModifiedDate(data); }, "order": 4}
    ], "order": 3}
  ]}
]