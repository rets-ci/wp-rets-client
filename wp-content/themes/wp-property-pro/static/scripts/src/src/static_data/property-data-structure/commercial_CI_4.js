import get from 'lodash/get';
import { moneyFormat } from 'app_root/helpers/propertyHelper';
import {
  getAcres,
  getArea,
  getCity,
  getCounty,
  getCrossStreet,
  getDirections,
  getFoundation,
  getInsideCity,
  getLotSizeArea,
  getNewConstruction,
  getPrice,
  getPricePerAcre,
  getPricePerSQFT,
  getRoadFrontage,
  getRoof,
  getLatitude,
  getLongitude,
  getLotSizeDim,
  getMLSId,
  getModifiedDate,
  getPublishedDate,
  getState,
  getStatus,
  getStreet,
  getStreetDirectional,
  getStreetNumber,
  getSQFT,
  getSubArea,
  getUnitNumber,
  getYearBuilt,
  getZoning,
  getZip
} from 'app_root/helpers/propertyAttributeHelper';

export default [
  {
    "name": "Features", "children": [
      {"name": "Interior", "items": [
        {"name": "Unit Count", "value": (data) => { return get(data, 'post_meta.rets_number_of_units[0]', null); }, "order": 1},
        {"name": "Ceiling Height", "value": (data) => { return get(data, 'post_meta.rets_ceiling_height[0]', null); }, "order": 2},
        {"name": "Sprinklers", "value": (data) => { return null; }, "order": 3},
      ], "order": 1},
      {"name": "Exterior", "items": [
        {"name": "Roof", "value": (data) => { return getRoof(data); }, "order": 1},
        {"name": "Foundation", "value": (data) => { return getFoundation(data); }, "order": 2}
      ], "order": 2},
      {"name": "Commercial", "items": [
        {"name": "Rentals", "value": (data) => { return get(data, 'post_meta.rets_number_of_rentals[0]', null); }, "order": 1},
        {"name": "Docks", "value": (data) => { return get(data, 'post_meta.rets_number_of_docks[0]', null); }, "order": 2},
        {"name": "Drive-in Doors", "value": (data) => { return get(data, 'post_meta.rets_number_of_drive_in_doors[0]', null); }, "order": 3}
      ], "order": 3},
      {"name": "Financials", "items": [
        {"name": "Operating Expense", "value": (data) => { return get(data, 'post_meta.rets_operating_expense[0]', null); }, "order": 1},
        {"name": "Annual Net Operating Income", "value": (data) => { return get(data, 'post_meta.rets_annual_net_oper_income[0]', null); }, "order": 2},
        {"name": "Gross Operating Income", "value": (data) => { return get(data, 'post_meta.rets_gross_operating_income[0]', null); }, "order": 3},
        {"name": "Gross Scheduled Income", "value": (data) => { return get(data, 'post_meta.rets_gross_scheduled_income[0]', null); }, "order": 4},
        {"name": "Effect Income", "value": (data) => { return get(data, 'post_meta.rets_effect_income[0]', null); }, "order": 5},
        {"name": "Other Income", "value": (data) => { return get(data, 'post_meta.rets_other_income[0]', null); }, "order": 6}
      ], "order": 5}
    ]
  },
  {"name": "Property", "children": [
    {"name": "Building", "items": [
      {"name": "New Construction", "value": (data) => { return getNewConstruction(data); }, "order": 1},
      {"name": "Construction Completion", "value": (data) => { return null; }, "order": 2},
      {"name": "Year Built", "value": (data) => { return getYearBuilt(data); }, "order": 3},
      {"name": "Building", "value": (data) => { return get(data, 'post_meta.rets_building_name[0]', null); }, "order": 4},
      {"name": "Building SQFT", "value": (data) => { return get(data, 'post_meta.rets_building_sq_ft[0]', null); }, "order": 5},
      {"name": "Building Height", "value": (data) => { return get(data, 'post_meta.rets_stories[0]', null); }, "order": 6},
      {"name": "Building Count", "value": (data) => { return get(data, 'post_meta.rets_number_of_buildings[0]', null); }, "order": 7}
    ], "order": 1},
    {"name": "Lot", "items": [
      {"name": "Number", "value": (data) => { return get(data, 'post_metea.rets_lot_number[0]', null); }, "order": 1},
      {"name": "Acres", "value": (data) => { return getLotSizeArea(data); }, 'order': 2},
      {"name": "SQFT", "value": (data) => { return getSQFT(data); }, 'order': 3},
      {"name": "Dimensions", "value": (data) => { return getLotSizeDim(data); }, 'order': 4},
      {"name": "Zoning", "value": (data) => { return getZoning(data); }, "order": 5},
      {"name": "Flood Plain", "value": (data) => { return null; }, "order": 6},
      {"name": "Road Frontage", "value": (data) => { return getRoadFrontage(data); }, "order": 7},
      {"name": "Traffic Count", "value": (data) => { return get(data, 'post_meta.rets_traffic_count[0]', null); }, "order": 8}
    ], "order": 2}
  ]},
  {
    "name": "Location", "children": [
      {"name": "Community", "items": [
        {"name": "County", "value": (data) => { return getCounty(data); }, "order": 1},
        {"name": "Area", "value": (data) => { return getArea(data); }, "order": 2},
        {"name": "Sub Area", "value": (data) => { return getSubArea(data); }, "order": 3},
        {"name": "Distance to RDU", "value": (data) => { return null; }, "order": 4},
      ], "order": 1},
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
      ], "order": 3},
    ]
  },
  {"name": "Listing", "children": [
    {"name": "Pricing", "items": [
      {"name": "Type", "value": (data) => { return 'Commercial'; }, 'order': 1},
      {"name": "Price", "value": (data) => { return getPrice(data); }, "order": 2},
      {"name": "Price Per SQFT", "value": (data) => { return getPricePerSQFT(data); }, 'order': 3},
      {"name": "Price Per Acre", "value": (data) => { return getPricePerAcre(data); }, "order": 4},
      {"name": "Min Rent SQFT Available", "value": (data) => { return get(data, 'post_meta.rets_minimum_lease_sq_ft[0]', null); }, "order": 5},
      {"name": "Min SQFT Available", "value": (data) => { return get(data, 'post_meta.rets_minimum_sq_ft_available[0]', null); }, "order": 6},
      {"name": "Max Rent SQFT Available", "value": (data) => { return get(data, 'post_meta.rets_max_lease_sq_ft[0]', null); }, "order": 7},
      {"name": "Max SQFT Available", "value": (data) => { return get(data, 'post_meta.rets_maximum_sq_ft_available[0]', null); }, "order": 8}
    ], "order": 1},
    {"name": "Terms", "items": [
      {"name": "Includes", "value": (data) => { return null; }, "order": 1},
      {"name": "Special Conditions", "value": (data) => { return null; }, "order": 2},
      {"name": "Restrictions", "value": (data) => { return null; }, "order": 3}
    ], "order": 2},
    {"name": "Status", "items": [
      {"name": "MLS ID", "value": (data) => { return getMLSId(data); }, "order": 1},
      {"name": "Status", "value": (data) => { return getStatus(data); }, "order": 2},
      {"name": "Published Date", "value": (data) => { return getPublishedDate(data); }, "order": 3},
      {"name": "Modified Date", "value": (data) => { return getModifiedDate(data); }, "order": 4}
    ], "order": 3}
  ]}
]