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
      {"name": "Bath Features", "value": (data) => { return get(data, 'tax_input.rets_bath_features.rets_bath_features', []).map(d => d.name).join(', ') }, "order": 4}
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
      {"name": "Other Rooms", "value": (data) => { return get(data, 'tax_input.rets_other_rooms.rets_other_rooms', []).map(d => d.name).join(', ') }, "order": 2},
      {"name": "Attic", "value": (data) => { return get(data, 'tax_input.rets_attic_description.rets_attic_description[0].name', false); }, "order": 3},
      {"name": "Basement", "value": (data) => { return YesOrNoFields(data, 'tax_input.rets_basement.rets_basement[0].name'); }, "order": 4}
    ], "order": 5}
  ]
},
  {
    "name": "Features", "children": [
      {"name": "Interior", "items": [
        {"name": "Flooring", "value": "tax_input.rets_flooring.rets_flooring"},
        {"name": "Washer Dryer Location", "value": "tax_input.rets_washer_dryer_location.rets_washer_dryer_location"},
        {"name": "Appliances", "value": "tax_input.rets_equipment_appliances.rets_equipment_appliances"},
        {"name": "Interior Features", "value": "tax_input.rets_interior_features.rets_interior_features"}
      ]},
      {"name": "Utility", "items": [
        {"name": "Water / Sewer Access", "value": "tax_input.rets_water_sewer.rets_water_sewer"}
      ]},
      {"name": "Parking", "items": [
        {"name": "Garage", "value": "post_meta.rets_garage[0]", "booleanField": true},
        {"name": "Parking", "value": "tax_input.rets_parking.rets_parking"},
        {"name": "Garage Dimensions", "value": "post_meta.rets_garage_dimensions[0]"},
        {"name": "Carport Dimensions", "value": "post_meta.rets_carport_dimensions[0]"}
      ]},
      {"name": "Exterior", "items": [
        {"name": "Exterior Finish", "value": "tax_input.rets_exterior_finish.rets_exterior_finish"},
        {"name": "Roof", "value": "tax_input.rets_roof.rets_roof"},
        {"name": "Exterior Features", "value": "tax_input.rets_exterior_features.rets_exterior_features"},
        {"name": "Screened Porch Dimensions", "value": "post_meta.rets_screened_porch_dimensions[0]"},
        {"name": "Porch Dimensions", "value": "post_meta.rets_porch_dimensions[0]"},
        {"name": "Patio Dimensions", "value": "post_meta.rets_patio_dimensions[0]"},
        {"name": "Deck Dimensions", "value": "post_meta.rets_deck_dimensions[0]"},
        {"name": "Screened Porch Floor", "value": "tax_input.rets_screened_porch_floor.rets_screened_porch_floor"},
        {"name": "Porch Floor", "value": "tax_input.rets_porch_floor.rets_porch_floor", "booleanField": true},
        {"name": "Patio Floor", "value": "tax_input.rets_patio_floor.rets_patio_floor", "booleanField": true},
        {"name": "Deck Floor", "value": "tax_input.rets_deck_floor.rets_deck_floor", "booleanField": true},
        {"name": "Pool", "value": "tax_input.rets_pool.rets_pool"}
      ]},
      {"name": "Heating & Cooling", "items": [
        {"name": "Air Condition", "value": "tax_input.rets_air_conditioning.rets_air_conditioning"},
        {"name": "Air Conditioning", "value": "tax_input.rets_cooling.rets_cooling"},
        {"name": "Heating", "value": "tax_input.rets_heating.rets_heating"},
        {"name": "Heating Fuel", "value": "tax_input.rets_heating_fuel.rets_heating_fuel"},
        {"name": "Water Heater", "value": "tax_input.rets_water_heater.rets_water_heater"},
        {"name": "Fireplace", "value": "tax_input.rets_fireplace.rets_fireplace", "booleanField": true},
        {"name": "Fireplace Description", "value": "tax_input.rets_fireplaces.rets_fireplaces"},
        {"name": "Heating Fuel", "value": "tax_input.rets_fuel_heat.rets_fuel_heat"}
      ]}
    ]
  },
  {
    "name": "Neighborhood", "children": [
      {"name": "Schools", "items": [
        {"name": "Elementary School", "value": "tax_input.wpp_schools.elementary_school"},
        {"name": "Middle School", "value": "tax_input.wpp_schools.middle_school"},
        {"name": "High School", "value": "tax_input.wpp_schools.high_school"}
      ]},
      {"name": "Homeowners Association", "items": [
        {"name": "HOA 1 Fees Requirement", "value": "tax_input.rets_hoa_1_fees_required.rets_hoa_1_fees_required", "booleanField": true},
        {"name": "HOA 2 Fees Requirement", "value": "tax_input.rets_hoa_2_fees_required.rets_hoa_2_fees_required", "booleanField": true},
        {"name": "HOA 1", "value": "post_meta.rets_hoa_1_mgmt[0]"},
        {"name": "HOA 2", "value": "post_meta.rets_hoa_2_mgmt[0]"},
        {"name": "HOA 1 fees amount", "value": "post_meta.rets_hoa_1_fees[0]"},
        {"name": "HOA 2 fees amount", "value": "post_meta.rets_hoa_2_fees[0]"},
        {"name": "HOA Phone", "value": "post_meta.rets_hoa_phone[0]"},
        {"name": "HOA 1 Fee Payment Frequency", "value": "tax_input.rets_hoa_1_fee_payment.rets_hoa_1_fee_payment"},
        {"name": "HOA 2 Fee Payment Frequency", "value": "tax_input.rets_hoa_2_fee_payment.rets_hoa_2_fee_payment"},
        {"name": "HOA Fees Amount", "value": "post_meta.rets_hoa_fees_amount[0]"},
        {"name": "HOA Payment Frequency", "value": "post_meta.rets_hoa_payment_frequency[0]"},
        {"name": "HOA Fees Include", "value": "tax_input.rets_hoa_fees_include.rets_hoa_fees_include"}
      ]}
    ]
  },
  {"name": "Property & Pricing", "children": [
    {"name": "Pricing & Terms", "items": [
      {"name": "Rental", "value": "tax_input.rets_rental_terms.rets_rental_terms"},
      {"name": "Sale Type", "value": "tax_input.wpp_listing_status.listing_status_sale[0].name"},
      {"name": "Payment Period", "value": "post_meta.rets_payment_period[0]"},
      {"name": "Security Deposit", "value": "post_meta.rets_security_deposit[0]"},
      {"name": "Rental Terms", "value": "tax_input.rets_rental_terms.rets_rental_terms"},
      {"name": "Tenant Pays", "value": "tax_input.rets_tenant_pays.rets_tenant_pays"},
      {"name": "Pet Policy", "value": "tax_input.rets_pets.rets_pets"},
      {"name": "Restrictions", "value": "tax_input.rets_restrictions.rets_restrictions", "booleanField": true},
      {"name": "Price", "value": "post_meta.rets_list_price[0]"},
      {"name": "Price per SQFT", "value": "post_meta.rets_price_per_sqft[0]"},
      {"name": "Date Available", "value": "post_meta.rets_date_available[0]"}
    ]},
    {"name": "Building", "items": [
      {"name": "Accessibility", "value": "tax_input.rets_accessibility.rets_accessibility"},
      {"name": "Builder", "value": "post_meta.rets_builder_name[0]"},
      {"name": "New Construction", "value": "tax_input.rets_new_construction.rets_new_construction", "booleanField": true},
      {"name": "Property Description", "value": "tax_input.property_description.property_description"},
      {"Name": "Detached Living Area Aqft", "value": "post_meta.rets_detached_living_area_sq_ft[0]"},
      {"name": "Green Building Features", "value": "tax_input.rets_green_building_features.rets_green_building_features"},
      {"name": "Green Building Certifications", "value": "tax_input.rets_green_building_cert.rets_green_building_cert"},
      {"name": "Living Area Above Grade", "value": "post_meta.rets_living_area_above_grade[0]"},
      {"name": "Living Area Below Grade", "value": "post_meta.rets_living_area_below_grade[0]"},
      {"name": "Other Area Above Grade", "value": "post_meta.rets_other_area_above_grade[0]"},
      {"name": "Other Area Below Grade", "value": "post_meta.rets_other_area_below_grade[0]"},
      {"name": "Design", "value": "tax_input.rets_design.rets_design"},
      {"name": "Style", "value": "tax_input.rets_style.rets_style"},
      {"name": "Foundation", "value": "tax_input.rets_foundation.rets_foundation"},
      {"name": "Hud Housing", "value": "tax_input.hud_housing.hud_housing"},
      {"name": "Total Living Area SQFT", "value": "post_meta.rets_living_area[0]"},
      {"name": "Total Other Area SQFT", "value": "post_meta.rets_total_other_area_sq_ft[0]"},
      {"name": "Year Built", "value": "post_meta.rets_year_built[0]"}
    ]},
    {"name": "Lot", "items": [
      {"name": "Restrictive Covenants", "value": "tax_input.rets_restrictive_covenants.rets_restrictive_covenants", "booleanField": true},
      {"name": "Lot Number", "value": "post_meta.rets_lot_number[0]"},
      {"name": "Lot Dimensions", "value": "post_meta.rets_lot_size_area[0]"},
      {"name": "Acres", "value": "tax_input.rets_acres.rets_acres"},
      {"name": "Approximate Lot SQFT", "value": "post_meta.rets_approx_lot_sq_ft[0]"},
      {"name": "Lot Description", "value": "tax_input.rets_lot_description.rets_lot_description"},
      {"name": "Zoning", "value": "post_meta.rets_zoning[0]"}
    ]}
  ]}
]