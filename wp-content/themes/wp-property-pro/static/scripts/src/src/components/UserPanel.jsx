import BootstrapModal from './Modals/components/BootstrapModal.jsx'
import React from 'react';
import {Lib} from '../lib.jsx';
import _ from 'lodash';

const UserPanel = ({closeUserPanel, historyPush, panelOpen}) => {
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
              onClick={(event) => {
                event.preventDefault();
                historyPush("/listing?wpp_search[term][0][wpp_location]=Durham,%20NC&wpp_search[search_type]=Buy&wpp_search[sale_type]=Sale&wpp_search[property_type][0]=condo&wpp_search[property_type][1]=house&wpp_search[property_type][2]=manufactured&wpp_search[property_type][3]=residential-apartment&wpp_search[property_type][4]=residential-other&wpp_search[property_type][5]=townhouse");
                }}
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
              onClick={(event) => {
                event.preventDefault();
                historyPush("/buy")
              }}
              className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link"}
              title="Home Buying"
            >
              <span>
                <img src={bundle.static_images_url + "home-buying-icon-small.svg"} alt="home buying"/>
              </span>
              Home Buying
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                historyPush("/listing?wpp_search[term][0][wpp_location]=Durham,%20NC&wpp_search[search_type]=Rent&wpp_search[sale_type]=Rent&wpp_search[property_type][0]=condo&wpp_search[property_type][1]=house&wpp_search[property_type][2]=manufactured&wpp_search[property_type][3]=residential-apartment&wpp_search[property_type][4]=residential-other&wpp_search[property_type][5]=townhouse")
              }}
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
              onClick={(event) => {
                event.preventDefault();
                historyPush("/rent");
              }}
              className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link"}
              title="Home Renting"
            >
              <span>
                <img src={bundle.static_images_url + "home-renting-icon-small.svg"} alt="home renting"/>
              </span>
              Home Renting
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                historyPush("/sell")
              }}
              className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link"}
              title="Home Selling"
            >
              <span>
                <img src={bundle.static_images_url + "home-selling-icon-small.svg"} alt="home selling"/></span>
                Home Selling
            </a>
          </li>
          <li className={`${Lib.THEME_CLASSES_PREFIX}divider-bottom`}>
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                historyPush("/management");
              }}
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
              onClick={(event) => {
                event.preventDefault();
                historyPush("/about");
                }}
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
              onClick={(event) => {
                event.preventDefault();
                historyPush("/about/careers/");
              }}
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
              onClick={(event) => {
                event.preventDefault();
                historyPush("/blog");
                }}
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
              onClick={(event) => {
                event.preventDefault();
                historyPush("/contact");
              }}
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