import get from 'lodash/get';
import { formatYesOrNoFields, moneyFormat } from 'app_root/helpers/propertyHelper';

export {
  getAcres,
  getActiveAdultCommunity,
  getAppliances,
  getArea,
  getBasement,
  getBathFeatures,
  getBedrooms,
  getBedroomsOnFirstFloor,
  getCity,
  getCooling,
  getCounty,
  getCrossStreet,
  getDesign,
  getDiningRoom,
  getDirections,
  getElementarySchool,
  getExteriorFeatures,
  getExteriorFinish,
  getFireplaces,
  getFireplacesDescription,
  getFlooring,
  getFoundation,
  getFullBathrooms,
  getGarageCapacity,
  getHalfBathrooms,
  getHeating,
  getHeatingFuel,
  getHighSchool,
  getInsideCity,
  getInteriorFeatures,
  getLatitude,
  getListingType,
  getLivingAreaAboveGradeSQFT,
  getLivingAreaBelowGradeSQFT,
  getLongitude,
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
  getPrice,
  getPricePerSQFT,
  getPropertyType,
  getPublishedDate,
  getRoof,
  getSQFT,
  getState,
  getStatus,
  getStreet,
  getStreetDirectional,
  getStreetNumber,
  getSubArea,
  getSubdivision,
  getTotalBathrooms,
  getTotalLivingAreaSQFT,
  getTotalOtherAreaSQFT,
  getUnitNumber,
  getWaterAndSewer,
  getWaterHeater,
  getYearBuilt,
  getZip,
  getZoning
};

/************************************
* public functions
************************************/

function getAcres(data) {
  return get(data, 'tax_input.rets_acres.rets_acres', []).map(d => d.name).join(', ') || null;
}

function getActiveAdultCommunity(data) {
  return get(data, 'post_meta.rets_active_adult_community_na[0]', null);
}

function getAppliances(data) {
  return get(data, 'tax_input.rets_equipment_appliances.rets_equipment_appliances', []).map(d => d.name).join(', ') || null;
}

function getArea(data) {
  return get(data, 'tax_input.rets_listing_area.rets_listing_area', []).map(d => d.name).join(', ') || null;
}

function getBasement(data) {
  return formatYesOrNoFields(data, 'tax_input.rets_basement.rets_basement[0].name');
}

function getBathFeatures(data) {
  return get(data, 'tax_input.rets_bath_features.rets_bath_features', []).map(d => d.name).join(', ') || null;
}

function getBedrooms(data) {
  return get(data, 'post_meta.rets_beds[0]', false);
}

function getBedroomsOnFirstFloor(data) {
  return formatYesOrNoFields(data, 'tax_input.rets_bedrooms_1st_floor.rets_bedrooms_1st_floor[0].name');
}

function getCity(data) {
  return get(data, 'tax_input.wpp_location.wpp_location_city', []).map(d => d.name).join(', ') || null;
}

function getCooling(data) {
  return get(data, 'tax_input.rets_cooling.rets_cooling', []).map(d => d.name).join(', ') || null;
}

function getCounty(data) {
  return get(data, 'tax_input.wpp_location.wpp_location_county', []).map(d => d.name).join(', ') || null;
}

function getCrossStreet(data) {
  return get(data, 'post_meta.rets_cross_street[0]', null);
}

function getDesign(data) {
  return get(data, 'tax_input.rets_design.rets_design', []).map(d => d.name).join(', ') || null;
}

function getDiningRoom(data) {
  return get(data, 'tax_input.rets_dining_room.rets_dining_room[0].name', false);
}

function getDirections(data) {
  return get(data, 'post_meta.rets_directions[0]', null);
}

function getElementarySchool(data) {
  return get(data, 'tax_input.wpp_schools.elementary_school', []).map(d => d.name).join(', ') || null;
}

function getExteriorFeatures(data) {
  return get(data, 'tax_input.rets_exterior_features.rets_exterior_features', []).map(d => d.name).join(', ') || null
}

function getExteriorFinish(data) {
  return get(data, 'tax_input.rets_exterior_finish.rets_exterior_finish', []).map(d => d.name).join(', ') || null;
}

function getFireplaces(data) {
  return formatYesOrNoFields(data, 'tax_input.rets_fireplace.rets_fireplace[0].name', null);
}

function getFireplacesDescription(data) {
  return get(data, 'tax_input.rets_fireplaces.rets_fireplaces', []).map(d => d.name).join(', ') || null;
}

function getFlooring(data) {
  return get(data, 'tax_input.rets_flooring.rets_flooring', []).map(d => d.name).join(', ') || null;
}

function getFoundation(data) {
  return get(data, 'tax_input.rets_foundation.rets_foundation', []).map(d => d.name).join(', ') || null;
}

function getFullBathrooms(data) {
  return get(data, 'post_meta.rets_baths_full[0]', false);
}

function getGarageCapacity(data) {
  return get(data, 'post_meta.rets_garage[0]', null);
}

function getHalfBathrooms(data) {
  return get(data, 'post_meta.rets_baths_half[0]', false);
}

function getHeating(data) {
  return get(data, 'tax_input.rets_heating.rets_heating', []).map(d => d.name).join(', ') || null;
}

function getHeatingFuel(data) {
  return get(data, 'tax_input.rets_fuel_heat.rets_fuel_heat', []).map(d => d.name).join(', ') || null;
}

function getHighSchool(data) {
  return get(data, 'tax_input.wpp_schools.high_school', []).map(d => d.name).join(', ') || null;
}

function getInsideCity(data) {
  let t = formatYesOrNoFields(data, 'tax_input.rets_inside_city.rets_inside_city[0].name');
  if (t === 'Yes') {
    let city = get(data, 'tax_input.wpp_location.wpp_location_city', []).map(d => d.name);
    return t + (city.length ? ', ' + city.join(', ') : '');
  } else {
    return t;
  }
}

function getInteriorFeatures(data) {
  return get(data, 'tax_input.rets_interior_features.rets_interior_features', []).map(d => d.name).join(', ') || null
}

function getLatitude(data) {
  return get(data, 'post_meta.rets_latitude[0]', null);
}

function getListingType(data) {
  return get(data, 'tax_input.wpp_listing_type.listing_type', []).map(d => d.name).join(', ') || null;
}

function getLivingAreaAboveGradeSQFT(data) {
  return get(data, 'post_meta.rets_living_area_above_grade[0]', null);
}

function getLivingAreaBelowGradeSQFT(data) {
  return get(data, 'post_meta.rets_living_area_below_grade[0]', null);
}

function getLongitude(data) {
  return get(data, 'post_meta.rets_longitude[0]', null);
}

function getMasterBedroomOnFirstFloor(data) {
  return get(data, 'post_meta.rets_master_bedroom_dimensions[0]', false);
}

function getMiddleSchool(data) {
  return get(data, 'tax_input.wpp_schools.middle_school', []).map(d => d.name).join(', ') || null;
}

function getMLSId(data) {
  return get(data, 'post_meta.rets_mls_number[0]', null);
}

function getModifiedDate(data) {
  return get(data, 'post_modified', null);
}

function getNeighborhood(data) {
  return get(data, 'tax_input.wpp_location.wpp_location_neighborhood', []).map(d => d.name).join(', ') || null;
}

function getNewConstruction(data) {
  return formatYesOrNoFields(data, 'tax_input.rets_new_construction.rets_new_construction[0].name');
}

function getNumberOfRooms(data) {
  return get(data, 'post_meta.rets_number_of_rooms[0]', false);
}

function getOtherAreaAboveGradeSQFT(data) {
  return get(data, 'post_meta.rets_other_area_above_grade[0]', null);
}

function getOtherAreaBelowGrade(data) {
  return get(data, 'post_meta.rets_other_area_below_grade[0]', null);
}

function getOtherRooms(data) {
  return get(data, 'tax_input.rets_other_rooms.rets_other_rooms', []).map(d => d.name).join(', ') || null;
}

function getParking(data) {
  return get(data, 'tax_input.rets_parking.rets_parking', []).map(d => d.name).join(', ') || null;
}

function getPool(data) {
  return get(data, 'tax_input.rets_pool.rets_pool', []).map(d => d.name).join(', ') || null;
}

function getPrice(data) {
  return moneyFormat(get(data, 'post_meta.rets_list_price[0]', null));
}

function getPricePerSQFT(data) {
  return moneyFormat(get(data, 'post_meta.rets_price_per_sqft[0]', null));
}

function getPropertyType(data) {
  return get(data, 'post_meta.property_type', []).join(', ') || null;
}

function getPublishedDate(data) {
  return get(data, 'post_meta.rets_list_date[0]', null);
}

function getRoof(data) {
  return get(data,'tax_input.rets_roof.rets_roof', []).map(d => d.name).join(', ') || null;
}

function getSQFT(data) {
  return get(data, 'post_meta.rets_approx_lot_sq_ft[0]', null);
}

function getState(data) {
  return get(data, 'tax_input.wpp_location.wpp_location_state', []).map(d => d.name).join(', ') || null;
}

function getStatus(data) {
  return get(data, 'tax_input.wpp_listing_status.listing_status', []).map(d => d.name).join(', ') || null;
}

function getStreet(data) {
  return get(data, 'post_meta.rets_street_name[0]', null);
}

function getStreetDirectional(data) {
  return get(data, 'post_meta.rets_street_dir_prefix[0]', null); 
}

function getStreetNumber(data) {
  return get(data, 'post_meta.rets_street_number[0]', null);
}

function getSubArea(data) {
  return get(data, 'tax_input.rets_sub_area.rets_sub_area', []).map(d => d.name).join(', ') || null;
}

function getSubdivision(data) {
  return get(data, 'tax_input.wpp_location.wpp_location_subdivision', []).map(d => d.name).join(', ') || null;
}

function getTotalBathrooms(data) {
  return get(data, 'post_meta.rets_total_baths[0]', false);
}

function getTotalLivingAreaSQFT(data) {
  return get(data, 'post_meta.rets_living_area[0]', null);
}

function getTotalOtherAreaSQFT(data) {
  return get(data, 'post_meta.rets_total_other_area_sq_ft[0]', null);
}

function getUnitNumber(data) {
  return get(data, 'post_meta.rets_unit_number[0]', null);
}

function getWaterAndSewer(data) {
  return get(data, 'tax_input.rets_water_sewer.rets_water_sewer', []).map(d => d.name).join(', ') || null;
}

function getWaterHeater(data) {
  return get(data, 'tax_input.rets_water_heater.rets_water_heater', []).map(d => d.name).join(', ') || null;
}

function getYearBuilt(data) {
  return get(data, 'post_meta.rets_year_built[0]', null);
}

function getZip(data) {
  return get(data, 'tax_input.wpp_location.wpp_location_zipcode', []).map(d => d.name).join(', ') || null;
}

function getZoning(data) {
  return get(data, 'post_meta.rets_zoning[0]', null);
}
