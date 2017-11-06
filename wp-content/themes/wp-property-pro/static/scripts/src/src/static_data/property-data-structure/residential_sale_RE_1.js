import get from 'lodash/get';

let YesOrNoFields = (data, ESReference) => {
  let t = get(data, ESReference, false);
  return t ?
    t.includes('No') ? "No" : "Yes" : false;
}

export default [
  {"name": "Rooms", "children": [
    {"name": "Bedrooms", "items": [
      {"name": "Bedrooms", "value": (data) => { return get(data, 'post_meta.rets_beds[0]', false); }, "order": 1},
      {"name": "Bedrooms on 1st Floor", "value": (data) => { return !!get(data, 'tax_input.rets_bedrooms_1st_floor.rets_bedrooms_1st_floor', false); }, "order": 2},
      {"name": "Master Bedroom Dimensions", "value": (data) => { return get(data, 'post_meta.rets_master_bedroom_dimensions[0]', false); }, "order": 3},
      {"name": "Master Bedroom on First Floor", "value": (data) => { return YesOrNoFields(data, 'tax_input.rets_master_bedroom_1st_floor.rets_master_bedroom_1st_floor[0].name'); }, "order": 3},
      {"name": "Master Bedroom Floor", "value": (data) => { return get(data, 'tax_input.rets_master_bedroom_floor.rets_master_bedroom_floor[0].name', false); }, "order": 4},
      {"name": "Bedroom 2 Dimensions", "value": (data) => { return get(data, 'post_meta.rets_bedroom_2_dimensions[0]', false); }, "order": 5},
      {"name": "Bedroom 2 Floor", "value": (data) => { return get(data, 'tax_input.rets_bedroom_2_floor.rets_bedroom_2_floor[0].name', false); }, "order": 6},
      {"name": "Bedroom 3 Dimensions", "value": (data) => { return get(data, 'post_meta.rets_bedroom_3_dimensions[0]', false); }, "order": 7},
      {"name": "Bedroom 3 Floor", "value": (data) => { return get(data, 'tax_input.rets_bedroom_3_floor.rets_bedroom_3_floor[0].name', false); }, "order": 8},
      {"name": "Bedroom 4 Dimensions", "value": (data) => { return get(data, 'post_meta.rets_bedroom_4_dimensions[0]', false); }, "order": 9},
      {"name": "Bedroom 4 Floor", "value": (data) => { return get(data, 'tax_input.rets_bedroom_4_floor.rets_bedroom_4_floor[0].name', false); }, "order": 10},
      {"name": "Bedroom 5 Dimensions", "value": (data) => { return get(data, 'post_meta.rets_bedroom_5_dimensions[0]', false); }, "order": 11},
      {"name": "Bedroom 5 Floor", "value": (data) => { return get(data, 'tax_input.rets_bedroom_5_floor.rets_bedroom_5_floor[0].name', false); }, "order": 11}
    ], "order": 1},
    {"name": "Bathrooms", "items": [
      {"name": "Full Bathrooms", "value": (data) => { return get(data, 'post_meta.rets_baths_full[0]', false); }, "order": 1},
      {"name": "Half Bathrooms", "value": (data) => { return get(data, 'post_meta.rets_baths_half[0]', false); }, "order": 2},
      {"name": "Total Bathrooms", "value": (data) => { return get(data, 'post_meta.rets_total_baths[0]', false); }, "order": 3},
      {"name": "Bath Features", "value": (data) => { return get(data, 'tax_input.rets_bath_features.rets_bath_features', []).map(d => d.name).join(', ') || null }, "order": 4}
    ], "order": 2},
    {"name": "Living Area", "items": [
      {"name": "Living Room Floor", "value": (data) => { return get(data, 'tax_input.rets_living_room_floor.rets_living_room_floor[0].name', false); }, "order": 1},
      {"name": "Family Room Dimensions", "value": (data) => { return get(data, 'post_meta.rets_family_room_dimensions[0]', false); }, "order": 2},
      {"name": "Family Room Floor", "value": (data) => { return get(data, 'tax_input.rets_family_room_floor.rets_family_room_floor[0].name', false); }, "order": 3},
      {"name": "Other Room", "value": (data) => { return get(data, 'post_meta.rets_lvng_area_other_rm_1_desc[0]', false);; }, "order": 4},
      {"name": "Other Room Dimensions", "value": (data) => { return get(data, 'post_meta.rets_lvng_area_other_rm_1_dim[0]', false); }, "order": 5},
      {"name": "Other Room Level", "value": (data) => { return get(data, 'tax_input.rets_lvng_area_other_rm_1_lvl.rets_lvng_area_other_rm_1_lvl[0].name', false); }, "order": 6},
      {"name": "Other Room 3", "value": (data) => { return get(data, 'post_meta.rets_lvng_area_other_rm_3_desc[0]', false); }, "order": 7},
      {"name": "Other Room 3 Dimensions", "value": (data) => { return get(data, 'post_meta.rets_lvng_area_other_rm_3_dmns[0]', false); }, "order": 8},
      {"name": "Other Room 3 Level", "value": (data) => { return get(data, 'tax_input.rets_lvng_area_other_rm_3_lvl.rets_lvng_area_other_rm_3_lvl[0].name', false); }, "order": 9},
      {"name": "Living Room Dimensions", "value": (data) => { return get(data, 'post_meta.rets_living_room_dimensions[0]', false); }, "order": 10}
    ], "order": 3},
    {"name": "Kitchen & Dining", "items": [
      {"name": "Kitchen Dimensions", "value": (data) => { return get(data, 'post_meta.rets_kitchen_dimensions[0]', false); }, "order": 1},
      {"name": "Kitchen Floor", "value": (data) => { return get(data, 'tax_input.rets_kitchen_floor.rets_kitchen_floor[0].name', false); }, "order": 2},
      {"name": "Dining Room", "value": (data) => { return get(data, 'tax_input.rets_dining_room.rets_dining_room[0].name', false); }, "order": 3},
      {"name": "Dining Room Dimensions", "value": (data) => { return get(data, 'post_meta.rets_dining_room_dimensions[0]', false); }, "order": 4},
      {"name": "Dining Room Floor", "value": (data) => { return get(data, 'tax_input.rets_dining_room_floor.rets_dining_room_floor[0].name', false); }, "order": 5},
      {"name": "Breakfast Room Dimensions", "value": (data) => { return get(data, 'post_meta.rets_breakfast_room_dimensions[0]', false); }, "order": 6},
      {"name": "Breakfast Room Floor", "value": (data) => { return get(data, 'tax_input.rets_breakfast_room_floor.rets_breakfast_room_floor[0].name', false); }, "order": 7},
    ], "order": 4},
    {"name": "Other", "items": [
      {"name": "Bonus Room Dimensions", "value": (data) => { return get(data, 'post_meta.rets_bonus_room_dimensions[0]', false); }, "order": 1},
      {"name": "Bonus Room Floor", "value": (data) => { return get(data, 'tax_input.rets_bonus_room_floor.rets_bonus_room_floor[0].name', false); }, "order": 2},
      {"name": "Entrance Hall Dimensions", "value": (data) => { return get(data, 'post_meta.rets_entrance_hall_dimensions[0]', false); }, "order": 3},
      {"name": "Entrance Hall Floor", "value": (data) => { return get(data, 'tax_input.rets_entrance_hall_floor.rets_entrance_hall_floor[0].name', false); }, "order": 4},
      {"name": "Office Room Dimensions", "value": (data) => { return get(data, 'post_meta.rets_office_study_dimensions[0]', false); }, "order": 5},
      {"name": "Office Room Floor", "value": (data) => { return get(data, 'post_meta.rets_office_study_floor[0]', false); }, "order": 6},
      {"name": "Storage Room Dimensions", "value": (data) => { return get(data, 'post_meta.rets_storage_dimensions[0]', false); }, "order": 7},
      {"name": "Storage Room Floor", "value": (data) => { return get(data, 'tax_input.rets_storage_floor.rets_storage_floor[0].name', false); }, "order": 8},
      {"name": "Utility Room Dimensions", "value": (data) => { return get(data, 'post_meta.rets_utility_room_dimensions[0]', false); }, "order": 9},
      {"name": "Utility Room Floor", "value": (data) => { return get(data, 'tax_input.rets_utility_room_floor.rets_utility_room_floor[0].name', false); }, "order": 10},
      {"name": "Other Room 2", "value": (data) => { return get(data, 'post_meta.rets_other_area_room_2_desc[0]', false); }, "order": 11},
      {"name": "Other Room 2 Dimensions", "value": (data) => { return get(data, 'post_meta.rets_other_area_room_2_dmns[0]', false); }, "order": 12},
      {"name": "Other Room 2 Level", "value": (data) => { return get(data, 'tax_input.rets_other_area_room_2_lvl.rets_other_area_room_2_lvl[0].name', false); }, "order": 13},
      {"name": "Other Room 4", "value": (data) => { return get(data, 'post_meta.rets_other_area_room_4_desc[0]', false); }, "order": 14},
      {"name": "Other Room 4 Dimensions", "value": (data) => { return get(data, 'post_meta.rets_other_area_room_4_dmns[0]', false); }, "order": 15},
      {"name": "Other Room 4 Level", "value": (data) => { return get(data, 'tax_input.rets_other_area_room_4_lvl.rets_other_area_room_4_lvl[0].name', false); }, "order": 15}
    ]},
    {"name": "Other Rooms", "items": [
      {"name": "Number of Rooms", "value": (data) => { return get(data, 'post_meta.rets_number_of_rooms[0]', false); }, "order": 1},
      {"name": "Other Rooms", "value": (data) => { return get(data, 'tax_input.rets_other_rooms.rets_other_rooms', []).map(d => d.name).join(', ') || null }, "order": 2},
      {"name": "Attic", "value": (data) => { return get(data, 'tax_input.rets_attic_description.rets_attic_description[0].name', false); }, "order": 3},
      {"name": "Basement", "value": (data) => { return YesOrNoFields(data, 'tax_input.rets_basement.rets_basement[0].name'); }, "order": 4}
    ], "order": 5}
  ]
},
  {
    "name": "Features", "children": [
      {"name": "Interior", "items": [
        {"name": "Interior Features", "value": (data) => { return get(data, 'tax_input.rets_interior_features.rets_interior_features', []).map(d => d.name).join(', ') || null; }, "order": 1},
        {"name": "Flooring", "value": (data) => { return get(data, 'tax_input.rets_flooring.rets_flooring', []).map(d => d.name).join(', ') || null; }, "order": 2},
        {"name": "Appliances", "value": (data) => { return get(data, 'tax_input.rets_equipment_appliances.rets_equipment_appliances', []).map(d => d.name).join(', ') || null; }},
        {"name": "Washer & Dryer Location", "value": (data) => { return get(data, 'tax_input.rets_washer_dryer_location.rets_washer_dryer_location', []).map(d => d.name).join(', ') || null; }}
      ], "order": 1},
      {"name": "Exterior", "items": [
        {"name": "Exterior Features", "value": (data) => { return get(data, 'tax_input.rets_exterior_features.rets_exterior_features', []).map(d => d.name).join(', ') || null; }, "order": 1},
        {"name": "Exterior Finish", "value": (data) => { return get(data, 'tax_input.rets_exterior_finish.rets_exterior_finish', []).map(d => d.name).join(', ') || null; }, "order": 2},
        {"name": "Roof", "value": (data) => { return get(data,'tax_input.rets_roof.rets_roof', []).map(d => d.name).join(', ') || null; }, "order": 3},
        {"name": "Pool", "value": (data) => { return get(data, 'tax_input.rets_pool.rets_pool', []).map(d => d.name).join(', ') || null; }, "order": 4},
        {"name": "Deck Dimensions", "value": (data) => { return get(data, 'post_meta.rets_deck_dimensions[0]', false); }, "order": 5},
        {"name": "Deck Floor", "value": (data) => { return get(data, 'tax_input.rets_deck_floor.rets_deck_floor', []).map(d => d.name).join(', ') || null; }, "order": 6},
        {"name": "Patio Dimensions", "value": (data) => { return get(data, 'post_meta.rets_patio_dimensions[0]', false); }, "order": 7},
        {"name": "Patio Floor", "value": (data) => { return get(data, 'tax_input.rets_patio_floor.rets_patio_floor', []).map(d => d.name).join(', ') || null; }, "order": 8},
        {"name": "Porch Dimensions", "value": (data) => { return get(data, 'post_meta.rets_porch_dimensions[0]', false); }, "order": 9},
        {"name": "Porch Floor", "value": (data) => { return get(data, 'tax_input.rets_porch_floor.rets_porch_floor', []).map(d => d.name).join(', ') || null; }, "order": 10},
        {"name": "Screened Porch Dimensions", "value": (data) => { return get(data, 'post_meta.rets_screened_porch_dimensions[0]', false); }, "order": 11},
        {"name": "Screened Porch Floor", "value": (data) => { return get(data, 'tax_input.rets_screened_porch_floor.rets_screened_porch_floor', false); }, "order": 12},
      ], "order": 2},
      {"name": "Heating & Cooling", "items": [
        {"name": "Cooling", "value": (data) => { return get(data, 'tax_input.rets_cooling.rets_cooling', []).map(d => d.name).join(', ') || null; }, "order": 1},
        {"name": "Heating", "value": (data) => { return get(data, 'tax_input.rets_heating.rets_heating', []).map(d => d.name).join(', ') || null; }, "order": 2},
        {"name": "Heating Fuel", "value": (data) => { return get(data, 'tax_input.rets_fuel_heat.rets_fuel_heat', []).map(d => d.name).join(', ') || null; }, "order": 3},
        {"name": "Water Heater", "value": (data) => { return get(data, 'tax_input.rets_water_heater.rets_water_heater', []).map(d => d.name).join(', ') || null; }, "order": 4},
        {"name": "Fireplaces", "value": (data) => { return !!get(data, 'tax_input.rets_fireplace.rets_fireplace[0].name', null); }, "order": 5},
        {"name": "Fireplace Description", "value": (data) => { return get(data, 'tax_input.rets_fireplaces.rets_fireplaces', []).map(d => d.name).join(', ') || null; }, "order": 6}
      ], "order": 3},
      {"name": "Parking", "items": [
        {"name": "Parking", "value": (data) => { return get(data, 'tax_input.rets_parking.rets_parking', []).map(d => d.name).join(', ') || null; }, "order": 1},
        {"name": "Garage Capacity", "value": (data) => { return get(data, 'post_meta.rets_garage[0]', null); }, "order": 2},
        {"name": "Garage Dimensions", "value": (data) => { return get(data, 'post_meta.rets_garage_dimensions[0]', null); }, "order": 3},
        {"name": "Garage Floor", "value": (data) => { return get(data, 'tax_input.rets_garage_floor.rets_garage_floor', []).map(d => d.name).join(', ') || null; }, "order": 4},
        {"name": "Carport Dimensions", "value": (data) => { return get(data, 'post_meta.rets_carport_dimensions[0]', null); }, "order": 5},
        {"name": "Carport Floor", "value": (data) => { return null; }, "order": 6},
      ], "order": 4},
      {"name": "Utility", "items": [
        {"name": "Water & Sewer", "value": (data) => { return get(data, 'tax_input.rets_water_sewer.rets_water_sewer', []).map(d => d.name).join(', ') || null; }, "order": 1}
      ], "order": 5}
    ]
  },
  {"name": "Property", "children": [
    {"name": "Building", "items": [
      {"name": "New Construction", "value": (data) => { return YesOrNoFields(data, 'tax_input.rets_new_construction.rets_new_construction[0].name');  }, "order": 1},
      {"name": "Construction Completion", "value": (data) => { return get(data, 'post_meta.rets_est_fin_year[0]', null); }, "order": 2},
      {"name": "Year Built", "value": (data) => { return get(data, 'post_meta.rets_year_built[0]', null); }, "order": 3},
      {"name": "Builder", "value": (data) => { return get(data, 'post_meta.rets_builder_name[0]', null); }, "order": 4},
      {"name": "Type", "value": (data) => { return get(data, 'post_meta.property_type', []).join(', ') || null; }, "order": 5},
      {"name": "Design", "value": (data) => { return get(data, 'tax_input.rets_design.rets_design', []).map(d => d.name).join(', ') || null; }, "order": 6},
      {"name": "Architectural Style", "value": (data) => { return get(data, 'tax_input.rets_style.rets_style', []).map(d => d.name).join(', ') || null; }, "order": 7},
      {"name": "Foundation", "value": (data) => { return get(data, 'tax_input.rets_foundation.rets_foundation', []).map(d => d.name).join(', ') || null; }, "order": 8},
      {"name": "Accessibility", "value": (data) => { return null; }, "order": 10},
      {"name": "Sustainability", "value": (data) => { return null; }, "order": 11},
      {"name": "Sustainability", "value": (data) => { return null; }, "order": 12},
      {"name": "Total Living Area SQFT", "value": (data) => { return get(data, 'post_meta.rets_living_area[0]', null); }, "order": 13},
      {"name": "Living Area Above Grade SQFT", "value": (data) => { return get(data, 'post_meta.rets_living_area_above_grade[0]', null); }, "order": 14},
      {"name": "Living Area Below Grade SQFT", "value": (data) => { return get(data, 'post_meta.rets_living_area_below_grade[0]', null); }, "order": 15},
      {"name": "Total Other Area SQFT", "value": (data) => { return get(data, 'post_meta.rets_total_other_area_sq_ft[0]', null); }, "order": 16},
      {"name": "Other Area Above Grade SQFT", "value": (data) => { return get(data, 'post_meta.rets_other_area_above_grade[0]', null) }, "order": 17},
      {"name": "Other Area Below Grade", "value": (data) => { return get(data, 'post_meta.rets_other_area_below_grade[0]', null) }, "order": 18},
      {"Name": "Detached Living Area Aqft", "value": (data) => { return get(data, 'post_meta.rets_detached_living_area_sq_ft[0]', null); }, "order": 19}
    ]},
    {"name": "Lot", "items": [
      {"name": "Number", "value": (data) => { return get(data, 'post_meta.rets_lot_number[0]', null); }, "order": 1},
      {"name": "Description", "value": (data) => { return get(data, 'tax_input.rets_lot_description.rets_lot_description', []).map(d => d.name).join(', ') || null; }, "order": 2},
      {"name": "Acres", "value": (data) => { return get(data, 'tax_input.rets_acres.rets_acres', []).map(d => d.name).join(', ') || null; }, "order": 3},
      {"name": "SQFT", "value": (data) => { return get(data, 'post_meta.rets_approx_lot_sq_ft[0]', null); }, "order": 4},
      {"name": "Zoning", "value": (data) => { return get(data, 'post_meta.rets_zoning[0]', null); }, "order": 5},
      {"name": "Restrictive Covenants", "value": (data) => { return YesOrNoFields(data, 'tax_input.rets_restrictive_covenants.rets_restrictive_covenants[0].name'); }, "order": 6}
    ]}
  ]},
  {
    "name": "Location", "children": [
      {"name": "Community", "items": [
        {"name": "Subdivision", "value": (data) => { return get(data, 'tax_input.wpp_location.wpp_location_subdivision', []).map(d => d.name).join(', ') || null; }, "order": 1},
        {"name": "Neighborhood", "value": (data) => { return get(data, 'tax_input.wpp_location.wpp_location_neighborhood', []).map(d => d.name).join(', ') || null; }, "order": 2},
        {"name": "County", "value": (data) => { return get(data, 'tax_input.wpp_location.wpp_location_county', []).map(d => d.name).join(', ') || null; }, "order": 3},
        {"name": "Area", "value": (data) => { return get(data, 'tax_input.rets_listing_area.rets_listing_area', []).map(d => d.name).join(', ') || null; }, "order": 4},
        {"name": "Sub Area", "value": (data) => { return get(data, 'tax_input.rets_sub_area.rets_sub_area', []).map(d => d.name).join(', ') || null; }, "order": 5},
        {"name": "Active Adult Community", "value": (data) => { return null; }, 'order': 6},
        {"name": "Active Adult Community", "value": (data) => { return get(data, 'post_meta.rets_active_adult_community_na[0]', null); }, "order": 7}
      ], "order": 1},
      {"name": "Homeowners Association", "items": [
        {"name": "HOA Office", "value": (data) => { return get(data, 'post_meta.rets_hoa_1_mgmt[0]', null); }, "order": 1},
        {"name": "HOA Office Phone", "value": (data) => { return get(data, 'post_meta.rets_hoa_phone[0]', null); }, "order": 2},
        {"name": "HOA Fees Requirement", "value": (data) => { return get(data, 'tax_input.rets_hoa_1_fees_required.rets_hoa_1_fees_required[0].name', null); }, "order": 3},
        {"name": "HOA Fees", "value": (data) => { return get(data, 'post_meta.rets_hoa_1_fees[0]', null); }, "order": 4},
        {"name": "HOA Fees", "value": (data) => { return get(data, 'tax_input.rets_hoa_1_fee_payment.rets_hoa_1_fee_payment', []).map(d => d.name).join(', ') || null; }, "order": 5},
        {"name": "HOA Office", "value": (data) => { return get(data, 'post_meta.rets_hoa_2_mgmt[0]', []).map(d => d.name).join(', ') || null; }, "order": 6},
        {"name": "HOA 2 Fees Requirement", "value": (data) => { return get(data, 'tax_input.rets_hoa_2_fees_required.rets_hoa_2_fees_required', []).map(d => d.name).join(', ') || null; }, "order": 7},
        {"name": "HOA 2 Fees", "value": (data) => { return get(data, 'post_meta.rets_hoa_2_fees[0]', null); }, "order": 8},
        {"name": "HOA 2 Fees", "value": (data) => { return get(data, 'tax_input.rets_hoa_2_fee_payment.rets_hoa_2_fee_payment', []).map(d => d.name).join(', ') || null; }, "order": 9},
        {"name": "HOA Fees Include", "value": (data) => { return get(data, 'tax_input.rets_ho_fees_include.rets_ho_fees_include', []).map(d => d.name).join(', ') || null; }, "order": 10}
      ], "order": 2},
      {"name": "Schools", "items": [
        {"name": "Elementary School", "value": (data) => { return get(data, 'tax_input.wpp_schools.elementary_school', []).map(d => d.name).join(', ') || null; }, "order": 1},
        {"name": "Middle School", "value": (data) => { return get(data, 'tax_input.wpp_schools.middle_school', []).map(d => d.name).join(', ') || null; }, "order": 2},
        {"name": "High School", "value": (data) => { return get(data, 'tax_input.wpp_schools.high_school', []).map(d => d.name).join(', ') || null; }, "order": 3}
      ], "order": 3},
      {"name": "Address", "items": [
        {"name": "Inside City", "value": (data) => {
          let t = YesOrNoFields(data, 'tax_input.rets_inside_city.rets_inside_city[0].name');
          if (t === 'Yes') {
            let city = get(data, 'tax_input.wpp_location.wpp_location_city', []);
            return t + (city.length ? '' + city.join(', ') : '');
          } else {
            return t;
          }
          return ;
        }, "order": 1},
        {"name": "Street Number", "value": (data) => { return get(data, 'post_meta.rets_street_number[0]', null); }, "order": 2},
        {"name": "Street Directional", "value": (data) => { return get(data, 'post_meta.rets_street_dir_prefix[0]', null); }, "order": 3},
        {"name": "Street", "value": (data) => { return get(data, 'post_meta.rets_street_name[0]', null); }, "order": 4},
        {"name": "Post Directional", "value": (data) => { return null; }, "order": 5},
        {"name": "Unit Number", "value": (data) => { return get(data, 'post_meta.rets_unit_number[0]', null); }, "order": 6},
        {"name": "City", "value": (data) => { return get(data, 'tax_input.wpp_location.wpp_location_city', []).map(d => d.name).join(', ') || null; }, "order": 7},
        {"name": "State", "value": (data) => { return get(data, 'tax_input.wpp_location.wpp_location_state', []).map(d => d.name).join(', ') || null; }, "order": 8},
        {"name": "Zip", "value": (data) => { return get(data, 'tax_input.wpp_location.wpp_location_zipcode', []).map(d => d.name).join(', ') || null; }, "order": 9},
        {"name": "Latitude", "value": (data) => { return get(data, 'post_meta.rets_latitude[0]', null); }, "order": 10},
        {"name": "Longitude", "value": (data) => { return get(data, 'post_meta.rets_longitude[0]', null); }, "order": 11},
        {"name": "Directions", "value": (data) => { return get(data, 'post_meta.rets_directions[0]', null); }, "order": 12}
      ], "order": 4},
    ]
  },
  {"name": "Listing", "children": [
    {"name": "Pricing", "items": [
      {"name": "Price", "value": (data) => { return get(data, 'post_meta.rets_list_price[0]', null); }, "order": 1},
      {"name": "Price Per SQFT", "value": (data) => { return get(data, 'post_meta.rets_price_per_sqft[0]', null); }, "order": 2},
    ], "order": 1},
    {"name": "Status", "items": [
      {"name": "MLS ID", "value": (data) => { return get(data, 'post_meta.rets_mls_number[0]', null); }, "order": 1},
      {"name": "Status", "value": (data) => { return get(data, 'tax_input.wpp_listing_status.listing_status', []).map(d => d.name).join(', ') || null; }, "order": 2},
      {"name": "Published Date", "value": (data) => { return get(data, 'post_meta.rets_list_date[0]', null); }, "order": 3},
      {"name": "Modified Date", "value": (data) => { return get(data, 'post_modified', null); }, "order": 4},
    ], "order": 2},
    {"name": "Terms", "items": [
      {"name": "Special Conditions", "value": (data) => { return null; }, "order": 1}
    ]}
  ]}
]