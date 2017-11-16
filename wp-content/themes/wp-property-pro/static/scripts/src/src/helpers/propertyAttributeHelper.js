import get from 'lodash/get';
import { commonDateFormat, formatYesOrNoFields, moneyFormat } from 'app_root/helpers/propertyHelper';

export {
  getAccessibility,
  getAcres,
  getActiveAdultCommunity,
  getActiveAdultCommunityNA,
  getAppliances,
  getArea,
  getBasement,
  getBasementDescription,
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
  getEstFinMonth,
  getExteriorFeatures,
  getExteriorFinish,
  getFireplaces,
  getFireplacesDescription,
  getFlooring,
  getFoundation,
  getFullBathrooms,
  getGarageCapacity,
  getGreenBuildingCert,
  getGreenBuildingFeatures,
  getHalfBathrooms,
  getHeating,
  getHeatingFuel,
  getHighSchool,
  getInsideCity,
  getInteriorFeatures,
  getLatitude,
  getListingStatuses,
  getListingType,
  getLivingAreaAboveGradeSQFT,
  getLivingAreaBelowGradeSQFT,
  getLongitude,
  getLotDescription,
  getLotNumber,
  getLotSizeArea,
  getLotSizeDim,
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
  getPricePerAcre,
  getPricePerSQFT,
  getPropertySubType,
  getPropertyType,
  getPublishedDate,
  getRestrictiveCovenants,
  getRoadFrontage,
  getRoof,
  getSQFT,
  getState,
  getStatus,
  getStreet,
  getStreetDirectional,
  getStreetNumber,
  getStyle,
  getSubArea,
  getSubdivision,
  getSubTypes,
  getTotalBathrooms,
  getTotalLivingAreaSQFT,
  getTotalOtherAreaSQFT,
  getUnitNumber,
  getWaterAndSewer,
  getWaterfront,
  getWaterfrontType,
  getWaterHeater,
  getYearBuilt,
  getZip,
  getZoning
};

/************************************
* public functions
************************************/

function getAccessibility(data) {
  return get(data, 'tax_input.rets_accessibility.rets_accessibility', []).map(d => d.name).join(', ') || null;
}

function getAcres(data) {
  return get(data, 'post_meta.rets_acres.rets_acres', []).map(d => d.name).join(', ') || null;
}

function getActiveAdultCommunity(data) {
  return get(data, 'tax_input.rets_active_adult_community.rets_active_adult_community', []).map(d => d.name).join(', ') || null;
}

function getActiveAdultCommunityNA(data) {
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

function getBasementDescription(data) {
  return get(data, 'tax_input.rets_basement.rets_basement', []).map(d => d.name).join(', ') || null;
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

function getEstFinMonth(data) {
  return get(data, 'tax_input.rets_est_fin_month.rets_est_fin_month', []).map(d => d.name).join(', ') || null;
}

function getExteriorFeatures(data) {
  return get(data, 'tax_input.rets_exterior_features.rets_exterior_features', []).map(d => d.name).join(', ') || null;
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

function getGreenBuildingCert(data) {
  return get(data, 'tax_input.rets_green_building_cert.rets_green_building_cert', []).map(d => d.name).join(', ') || null;
}

function getGreenBuildingFeatures(data) {
  return get(data, 'tax_input.rets_green_building_features.rets_green_building_features', []).map(d => d.name).join(', ') || null;
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
  } else if (t === 'No') {
    return t;
  } else if (t === false) {
    return null;
  }
}

function getInteriorFeatures(data) {
  return get(data, 'tax_input.rets_interior_features.rets_interior_features', []).map(d => d.name).join(', ') || null
}

function getLatitude(data) {
  return get(data, 'post_meta.rets_latitude[0]', null);
}

function getListingStatuses(data) {
  return get(data, 'tax_input.wpp_listing_status.listing_status_sale', []).map(d => d.name.replace('For ', '')).join(', ');
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

function getLotDescription(data) {
  return get(data, 'tax_input.rets_lot_description.rets_lot_description', []).map(d => d.name).join(', ') || null;
}

function getLotNumber(data) {
  return get(data, 'post_meta.rets_lot_number[0]', null);
}

function getLotSizeArea(data) {
  return get(data, 'post_meta.rets_lot_size_area[0]', null);
}

function getLotSizeDim(data) {
  return get(data, 'post_meta.rets_lot_size_dim[0]', null);
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
  let date = get(data, 'post_modified', null);
  return commonDateFormat(date, 'YYYY-MM-DD');
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

function getPostDirectional(data) {
  return get(data, 'tax_input.rets_post_direction.rets_post_direction', []).map(d => d.name).join(', ') || null;
}

function getPrice(data) {
  return moneyFormat(get(data, 'post_meta.rets_list_price[0]', null));
}

function getPricePerAcre(data) {
  return moneyFormat(get(data, 'post_meta.rets_price_per_acre[0]', null));
}

function getPricePerSQFT(data) {
  return moneyFormat(get(data, 'post_meta.rets_price_per_sqft[0]', null));
}

function getPropertySubType(data) {
  return get(data, 'tax_input.wpp_listing_subtype.listing_sub_type', []).map(d => d.name).join(', ') || null;
}

function getPropertyType(data) {
  return get(data, 'post_meta.property_type', []).join(', ') || null;
}

function getPublishedDate(data) {
  let date = get(data, 'post_meta.rets_list_date[0]', null);
  return commonDateFormat(date, 'YYYY-MM-DD');
}

function getRestrictiveCovenants(data) {
  return formatYesOrNoFields(data, 'tax_input.rets_restrictive_covenants.rets_restrictive_covenants[0].name');
}

function getRoadFrontage(data) {
  return get(data, 'post_meta.rets_road_frontage[0]', null);
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

function getStyle(data) {
  return get(data, 'tax_input.rets_style.rets_style', []).map(d => d.name).join(', ') || null;
}

function getSubArea(data) {
  return get(data, 'tax_input.rets_sub_area.rets_sub_area', []).map(d => d.name).join(', ') || null;
}

function getSubdivision(data) {
  return get(data, 'tax_input.wpp_location.wpp_location_subdivision', []).map(d => d.name).join(', ') || null;
}

function getSubTypes(data) {
  return get(data, 'tax_input.wpp_listing_subtype.listing_sub_type', []).map(d => d.name).join(', ') || null;
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

function getWaterfront(data) {
  return get(data, 'tax_input.rets_water_body_name.rets_water_body_name', []).map(d => d.name).join(', ') || null;
}

function getWaterfrontType(data) {
  return get(data, 'tax_input.rets_waterfront_type.rets_waterfront_type', []).map(d => d.name).join(', ') || null;
}

function getWaterHeater(data) {
  return get(data, 'tax_input.rets_water_heater.rets_water_heater', []).map(d => d.name).join(', ') || null;
}

function getYearBuilt(data) {
  return get(data, 'post_meta.rets_year_built[0]', null);
}

function getZip(data) {
  return get(data, 'post_meta.rets_postal_code[0]', null);
}

function getZoning(data) {
  return get(data, 'post_meta.rets_zoning[0]', null);
}
