import get from 'lodash/get';
import { moneyFormat } from 'app_root/helpers/propertyHelper';
import {
  getAccessibility,
  getAcres,
  getActiveAdultCommunity,
  getActiveAdultCommunityNA,
  getAppliances,
  getAreaAndSubArea,
  getBasement,
  getBasementDescription,
  getBathFeatures,
  getBedrooms,
  getBedroomsOnFirstFloor,
  getCity,
  getConstructionCompletion,
  getCooling,
  getCounty,
  getDesign,
  getDiningRoom,
  getDirections,
  getElementarySchool,
  getEstFinYear,
  getExteriorFeatures,
  getExteriorFinish,
  getFireplaces,
  getFireplacesDescription,
  getFlooring,
  getFullBathrooms,
  getGarageCapacity,
  getGreenBuildingCert,
  getGreenBuildingFeatures,
  getHeating,
  getHeatingFuel,
  getHighSchool,
  getInsideCity,
  getInteriorFeatures,
  getLatitude,
  getListingStatuses,
  getLivingAreaAboveGradeSQFT,
  getLivingAreaBelowGradeSQFT,
  getLongitude,
  getLotSizeArea,
  getMasterBedroomOnFirstFloor,
  getMiddleSchool,
  getMLSId,
  getModifiedDate,
  getNeighborhood,
  getNewConstruction,
  getNumberOfRooms,
  getOtherAreaAboveGradeSQFT,
  getOtherAreaBelowGrade,
  getOtherRooms,
  getParking,
  getPool,
  getPostDirectional,
  getPrice,
  getPricePerSQFT,
  getPublishedDate,
  getState,
  getStatus,
  getStreet,
  getStreetDirectional,
  getStreetNumber,
  getType,
  getSubdivision,
  getHalfBathrooms,
  getTotalBathrooms,
  getTotalLivingAreaSQFT,
  getTotalOtherAreaSQFT,
  getUnitNumber,
  getWaterAndSewer,
  getWaterHeater,
  getWaterfront,
  getWaterfrontType,
  getYearBuilt,
  getZip,
  getZoning
} from 'app_root/helpers/propertyAttributeHelper';

export default [
  {"name": "Rooms", "children": [
    {"name": "Bedrooms", "items": [
      {"name": "Bedrooms", "value": (data) => { return getBedrooms(data); }, "order": 1},
      {"name": "Bedrooms on 1st Floor", "value": (data) => { return getBedroomsOnFirstFloor(data) }, "order": 2},
      {"name": "Master Bedroom on First Floor", "value": (data) => { return getMasterBedroomOnFirstFloor(data); }, "order": 3}
    ], "order": 1},
    {"name": "Bathrooms", "items": [
      {"name": "Full Bathrooms", "value": (data) => { return getFullBathrooms(data); }, "order": 1},
      {"name": "Half Bathrooms", "value": (data) => { return getHalfBathrooms(data); }, "order": 2},
      {"name": "Total Bathrooms", "value": (data) => { return getTotalBathrooms(data); }, "order": 3},
      {"name": "Bathroom Features", "value": (data) => { return getBathFeatures(data) }, "order": 4}
    ], "order": 2},
    {"name": "Kitchen & Dining", "items": [
      {"name": "Dining Room", "value": (data) => { return getDiningRoom(data); }, "order": 1}
    ], "order": 4},
    {"name": "Other Rooms", "items": [
      {"name": "Number of Rooms", "value": (data) => { return getNumberOfRooms(data); }, "order": 1},
      {"name": "Other Rooms", "value": (data) => { return getOtherRooms(data); }, "order": 2},
      {"name": "Attic", "value": (data) => { return get(data, 'tax_input.rets_attic.rets_attic', []).map(d => d.name).join(', ') || null; }, "order": 3},
      {"name": "Basement", "value": (data) => { return getBasement(data); }, "order": 4},
      {"name": "Basement Description", "value": (data) => { return getBasementDescription(data); }, "order": 5},
    ], "order": 5}
  ]
},
  {
    "name": "Features", "children": [
      {"name": "Interior", "items": [
        {"name": "Interior Features", "value": (data) => { return getInteriorFeatures(data); }, "order": 1},
        {"name": "Flooring", "value": (data) => { return getFlooring(data); }, "order": 2},
        {"name": "Appliances", "value": (data) => { return getAppliances(data); }, "order": 3}
      ], "order": 1},
      {"name": "Exterior", "items": [
        {"name": "Exterior Features", "value": (data) => { return getExteriorFeatures(data); }, "order": 1},
        {"name": "Exterior Finish", "value": (data) => { return getExteriorFinish(data); }, "order": 2},
        {"name": "Pool", "value": (data) => { return getPool(data); }, "order": 3}
      ], "order": 2},
      {"name": "Heating & Cooling", "items": [
        {"name": "Cooling", "value": (data) => { return getCooling(data); }, "order": 1},
        {"name": "Heating", "value": (data) => { return getHeating(data); }, "order": 2},
        {"name": "Heating Fuel", "value": (data) => { return getHeatingFuel(data); }, "order": 3},
        {"name": "Water Heater", "value": (data) => { return getWaterHeater(data); }, "order": 4},
        {"name": "Fireplaces", "value": (data) => { return getFireplaces(data); }, "order": 5},
        {"name": "Fireplace Description", "value": (data) => { return getFireplacesDescription(data); }, "order": 6}
      ], "order": 3},
      {"name": "Parking", "items": [
        {"name": "Parking", "value": (data) => { return getParking(data); }, "order": 1},
        {"name": "Garage Capacity", "value": (data) => { return getGarageCapacity(data); }, "order": 2}
      ], "order": 4},
      {"name": "Utility", "items": [
        {"name": "Water & Sewer", "value": (data) => { return getWaterAndSewer(data); }, "order": 1}
      ], "order": 5}
    ]
  },
  {"name": "Property", "children": [
    {"name": "Building", "items": [
      {"name": "Type", "value": (data) => { return getType(data); }, "order": 1},
      {"name": "New Construction", "value": (data) => { return getNewConstruction(data); }, "order": 3},
      {"name": "Construction Completion", "value": (data) => { return getConstructionCompletion(data); }, "order": 4},
      {"name": "Year Built", "value": (data) => { return getEstFinYear(data) !== null ? getYearBuilt(data) : null; }, "order": 5},
      {"name": "Design", "value": (data) => { return getDesign(data); }, "order": 6},
      {"name": "Accessibility", "value": (data) => { return getAccessibility(data); }, "order": 7},
      {"name": "Sustainability", "value": (data) => { return getGreenBuildingCert(data); }, "order": 8},
      {"name": "Sustainability", "value": (data) => { return getGreenBuildingFeatures(data); }, "order": 9},
      {"name": "Total Living Area SQFT", "value": (data) => { return getTotalLivingAreaSQFT(data); }, "order": 10},
      {"name": "Living Area Above Grade SQFT", "value": (data) => { return getLivingAreaAboveGradeSQFT(data); }, "order": 11},
      {"name": "Living Area Below Grade SQFT", "value": (data) => { return getLivingAreaBelowGradeSQFT(data); }, "order": 12},
      {"name": "Total Other Area SQFT", "value": (data) => { return getTotalOtherAreaSQFT(data); }, "order": 13},
      {"name": "Other Area Above Grade SQFT", "value": (data) => { return getOtherAreaAboveGradeSQFT(data); }, "order": 14},
      {"name": "Other Area Below Grade", "value": (data) => { return getOtherAreaBelowGrade(data); }, "order": 15},
      {"Name": "Detached Living Area Aqft", "value": (data) => { return get(data, 'post_meta.rets_detached_living_area_sq_ft[0]', null); }, "order": 16}
    ], "order": 1},
    {"name": "Lot", "items": [
      {"name": "Acres", "value": (data) => { return getLotSizeArea(data); }, "order": 1},
      {"name": "Zoning", "value": (data) => { return getZoning(data); }, "order": 2},
      {"name": "Waterfront", "value": (data) => { return getWaterfront(data); }, "order": 3},
      {"name": "Waterfront Type", "value": (data) => { return getWaterfrontType(data); }, "order": 4}
    ], "order": 2}
  ]},
  {
    "name": "Location", "children": [
      {"name": "Community", "items": [
        {"name": "Inside City", "value": (data) => { return getInsideCity(data); }, "order": 1},
        {"name": "Subdivision", "value": (data) => { return getSubdivision(data); }, "order": 2},
        {"name": "Neighborhood", "value": (data) => { return getNeighborhood(data); }, "order": 3},
        {"name": "County", "value": (data) => { return getCounty(data); }, "order": 4},
        {"name": "Area", "value": (data) => { return getAreaAndSubArea(data); }, "order": 5},
        {"name": "Active Adult Community", "value": (data) => { return getActiveAdultCommunity(data); }, 'order': 7},
        {"name": "Active Adult Community", "value": (data) => { return getActiveAdultCommunityNA(data); }, "order": 8}
      ], "order": 1},
      {"name": "Schools", "items": [
        {"name": "Elementary School", "value": (data) => { return getElementarySchool(data); }, "order": 1},
        {"name": "Middle School", "value": (data) => { return getMiddleSchool(data); }, "order": 2},
        {"name": "High School", "value": (data) => { return getHighSchool(data); }, "order": 3}
      ], "order": 2},
      {"name": "Address", "items": [
        {"name": "Street Number", "value": (data) => { return getStreetNumber(data); }, "order": 1},
        {"name": "Street Directional", "value": (data) => { return getStreetDirectional(data); }, "order": 2},
        {"name": "Street", "value": (data) => { return getStreet(data); }, "order": 3},
        {"name": "Post Directional", "value": (data) => { return getPostDirectional(data); }, "order": 4},
        {"name": "Unit Number", "value": (data) => { return getUnitNumber(data); }, "order": 5},
        {"name": "City", "value": (data) => { return getCity(data); }, "order": 6},
        {"name": "State", "value": (data) => { return getState(data); }, "order": 7},
        {"name": "Zip", "value": (data) => { return getZip(data); }, "order": 8},
        {"name": "Latitude", "value": (data) => { return getLatitude(data); }, "order": 9},
        {"name": "Longitude", "value": (data) => { return getLongitude(data); }, "order": 10},
        {"name": "Directions", "value": (data) => { return getDirections(data); }, "order": 11}
      ], "order": 3},
    ]
  },
  {"name": "Listing", "children": [
    {"name": "Pricing", "items": [
      {"name": "Type", "value": (data) => { return getListingStatuses(data); }, "order": 1},
      {"name": "Price", "value": (data) => { return getPrice(data); }, "order": 2},
      {"name": "Price", "value": (data) => { return get(data, 'post_meta.rets_payment_period[0]', null); }, "order": 3},
      {"name": "Security Deposit", "value": (data) => { return moneyFormat(get(data, 'post_meta.rets_security_deposit[0]', null)); }, "order": 4},
      {"name": "Price Per SQFT", "value": (data) => { return getPricePerSQFT(data); }, "order": 5},
    ], "order": 1},
    {"name": "Terms", "items": [
      {"name": "Date Available", "value": (data) => { return get(data, 'post_meta.rets_date_available[0]'); }, "order": 1},
      {"name": "Rental Terms", "value": (data) => { return get(data, 'tax_input.rets_rental_terms.rets_rental_terms', []).map(d => d.name).join(', ') || null; }, "order": 2},
      {"name": "Tenant Pays", "value": (data) => { return get(data, 'tax_input.rets_tenant_pays.rets_tenant_pays', []).map(d => d.name).join(', ') || null; }, "order": 3},
      {"name": "Restrictions", "value": (data) => { return get(data, 'tax_input.rets_restrictions.rets_restrictions', []).map(d => d.name).join(', ') || null; }, "order": 4},
      {"name": "Pet Policy", "value": (data) => { return get(data, 'tax_input.rets_pets.rets_pets', []).map(d => d.name).join(', ') || null; }, "order": 5}
    ], "order": 2},
    {"name": "Status", "items": [
      {"name": "MLS ID", "value": (data) => { return getMLSId(data); }, "order": 1},
      {"name": "Status", "value": (data) => { return getStatus(data); }, "order": 2},
      {"name": "Published Date", "value": (data) => { return getPublishedDate(data); }, "order": 3},
      {"name": "Modified Date", "value": (data) => { return getModifiedDate(data); }, "order": 4},
    ], "order": 3}
  ]}
]