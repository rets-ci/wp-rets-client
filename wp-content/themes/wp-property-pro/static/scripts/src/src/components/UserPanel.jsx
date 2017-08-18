import BootstrapModal from './Modals/components/BootstrapModal.jsx'
import React from 'react';
import {Lib} from '../lib.jsx';
import _ from 'lodash';

const UserPanel = ({closeUserPanel, panelOpen, browserHistoryPush}) => {
  return (
    <BootstrapModal
      classes={["sidebar", "sidebar-right"]}
      id={'UserPanel'}
      closeModal={closeUserPanel}
      open={panelOpen}
      >
      <div className={Lib.THEME_CLASSES_PREFIX + "user-navigation"}>
        <ol className={`${Lib.THEME_CLASSES_PREFIX}user-navigation-list clearfix`}>
          <li>
            <a
              href="#"
              onClick={(event) => {event.preventDefault(); browserHistoryPush("/listing?wpp_search[term][0][wpp_location]=Durham%2C%20NC&wpp_search[property_types]=condo-house-manufactured-residential-apartment-residential-other-townhouse&wpp_search[sale_type]=Buy")}}
              className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link"}
              title="Home For Sale"
            >
              <span>
                <img src={bundle.static_images_url + "search-homes.svg"} alt="homes for sale"/>
              </span>
              Homes for Sale
            </a>
          </li>
          <li className={`${Lib.THEME_CLASSES_PREFIX}divider-bottom`}>
            <a
              href="#"
              onClick={(event) => {event.preventDefault(); browserHistoryPush("/buy")}}
              className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link"}
              title="Home Buying"
            >
              <span>
                <img src={bundle.static_images_url + "home-buying-icon.svg"} alt="home buying"/>
              </span>
              Home Buying
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(event) => {event.preventDefault(); browserHistoryPush("/listing?wpp_search[term][0][wpp_location]=Durham%2C%20NC&wpp_search[property_types]=condo-house-manufactured-residential-apartment-residential-other-townhouse&wpp_search[sale_type]=Rent")}}
              className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link"}
              title="Homes for Rent"
            >
              <span>
                <img src={bundle.static_images_url + "search-homes.svg"} alt="homes for rent"/>
              </span>
              Homes for Rent
            </a>
          </li>
          <li className={`${Lib.THEME_CLASSES_PREFIX}divider-bottom`}>
            <a
              href="#"
              onClick={(event) => {event.preventDefault(); browserHistoryPush("/rent")}}
              className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link"}
              title="Home Renting"
            >
              <span>
                <img src={bundle.static_images_url + "home-renting-icon.svg"} alt="home renting"/>
              </span>
              Home Renting
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(event) => {event.preventDefault(); browserHistoryPush("/sell")}}
              className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link"}
              title="Home Selling"
            >
              <span>
                <img src={bundle.static_images_url + "home-selling-icon.svg"} alt="home selling"/></span>
                Home Selling
            </a>
          </li>
          <li className={`${Lib.THEME_CLASSES_PREFIX}divider-bottom`}>
            <a
              href="#"
              onClick={(event) => {event.preventDefault(); browserHistoryPush("/management")}}
              className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link"}
              title="Property Management"
            >
              <span>
                <img src={bundle.static_images_url + "propertymanagement-icon-black.svg"} alt="property management"/></span>
                Property Management
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(event) => {event.preventDefault(); browserHistoryPush("/about")}}
              className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link"}
              title="About Us"
            >
              <span>
                {/* <img src={bundle.static_images_url + "property-management-icon.svg"} alt="property management"/> */}
              </span>
                About Us
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(event) => {event.preventDefault(); browserHistoryPush("/about/careers/")}}
              className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link"}
              title="Careers"
            >
              <span>
                {/* <img src={bundle.static_images_url + "property-management-icon.svg"} alt="property management"/> */}
              </span>
              Careers
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(event) => {event.preventDefault(); browserHistoryPush("/blog")}}
              className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link"}
              title="Blog"
            >
              <span>
                {/* <img src={bundle.static_images_url + "property-management-icon.svg"} alt="property management"/> */}
              </span>
              Blog
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(event) => {event.preventDefault(); browserHistoryPush("/contact")}}
              className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link"}
              title="Contact"
            >
              <span>
                {/* <img src={bundle.static_images_url + "property-management-icon.svg"} alt="property management"/> */}
              </span>
              Contact
            </a>
          </li>
        </ol>
      </div>
    </BootstrapModal>
  ); 
};

export default UserPanel