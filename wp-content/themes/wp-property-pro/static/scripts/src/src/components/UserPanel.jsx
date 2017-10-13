import BootstrapModal from './Modals/components/BootstrapModal.jsx'
import React from 'react';
import {Link} from 'react-router-dom';
import {Lib} from '../lib.jsx';

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
            <Link
              to={"/search/city_raleigh/property_condo/property_house/property_manufactured/property_residential-other/property_townhouse/sale_Sale/search_Buy"}
              className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link"}
              title="Home For Sale"
            >
              <span>
                <img src={bundle.static_images_url + "search-homes.svg"} alt="homes for sale"/>
              </span>
              Homes for Sale
            </Link>
          </li>
          <li className={`${Lib.THEME_CLASSES_PREFIX}divider-bottom`}>
            <Link
              to={"/buy"}
              className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link"}
              title="Home Buying"
            >
              <span>
                <img src={bundle.static_images_url + "home-buying-icon-small.svg"} alt="home buying"/>
              </span>
              Home Buying
            </Link>
          </li>
          <li>
            <Link
              to={"/search/city_raleigh/property_condo/property_house/property_manufactured/property_residential-apartment/property_residential-other/property_townhouse/sale_Rent/search_Rent"}
              className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link"}
              title="Homes for Rent"
            >
              <span>
                <img src={bundle.static_images_url + "search-homes.svg"} alt="homes for rent"/>
              </span>
              Homes for Rent
            </Link>
          </li>
          <li className={`${Lib.THEME_CLASSES_PREFIX}divider-bottom`}>
            <Link
              to={"/rent"}
              className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link"}
              title="Home Renting"
            >
              <span>
                <img src={bundle.static_images_url + "home-renting-icon-small.svg"} alt="home renting"/>
              </span>
              Home Renting
            </Link>
          </li>
          <li>
            <Link
              to={"/sell"}
              className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link"}
              title="Home Selling"
            >
              <span>
                <img src={bundle.static_images_url + "home-selling-icon-small.svg"} alt="home selling"/></span>
                Home Selling
            </Link>
          </li>
          <li className={`${Lib.THEME_CLASSES_PREFIX}divider-bottom`}>
            <Link
              to={"/management"}
              className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link"}
              title="Property Management"
            >
              <span>
                <img src={bundle.static_images_url + "propertymanagement-icon-black.svg"} alt="property management"/></span>
                Property Management
            </Link>
          </li>
          <li>
            <Link
              to={"/about"}
              className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link"}
              title="About Us"
            >
              <span>
                {/* <img src={bundle.static_images_url + "property-management-icon.svg"} alt="property management"/> */}
              </span>
                About Us
            </Link>
          </li>
          <li>
            <Link
              to={"/about/careers/"}
              className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link"}
              title="Careers"
            >
              <span>
                {/* <img src={bundle.static_images_url + "property-management-icon.svg"} alt="property management"/> */}
              </span>
              Careers
            </Link>
          </li>
          <li>
            <Link
              to={"/blog"}
              className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link"}
              title="Blog"
            >
              <span>
                {/* <img src={bundle.static_images_url + "property-management-icon.svg"} alt="property management"/> */}
              </span>
              Blog
            </Link>
          </li>
          <li>
            <Link
              to={"/contact"}
              className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link"}
              title="Contact"
            >
              <span>
                {/* <img src={bundle.static_images_url + "property-management-icon.svg"} alt="property management"/> */}
              </span>
              Contact
            </Link>
          </li>
        </ol>
      </div>
    </BootstrapModal>
  ); 
};

export default UserPanel