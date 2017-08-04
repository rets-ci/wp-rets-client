import React from 'react';
import {connect} from 'react-redux'
import {toggleUserPanel} from '../actions/index.jsx';
import {Lib} from '../lib.jsx';
import _ from 'lodash';

const mapStateToProps = (state, ownProps) => {
  return {
    panelOpen: state.panel.open,
    location: _.get(ownProps, 'location')
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    closeUserPanel: () => {
      dispatch(toggleUserPanel(false));
    }
  }
};

const UserPanelContent = ({panelOpen, closeUserPanel}) => {

  // Exclude render User panel for guide blog
  let pathname = _.get(location, 'pathname', '');
  let pathRoot = pathname.replace(/\//g, '');
  if (pathRoot.indexOf('guide') !== -1) {
    return null;
  }

  return (
    <section
      className={Lib.THEME_CLASSES_PREFIX + "user-panel px-3 " + (panelOpen ? Lib.THEME_CLASSES_PREFIX + "on" : "")}>
      <a href="#" className={Lib.THEME_CLASSES_PREFIX + "close-panel"} onClick={(event) => {
        closeUserPanel();
        event.preventDefault();
        event.stopPropagation();
      }}><i className="fa fa-times"></i></a>
      <div className={Lib.THEME_CLASSES_PREFIX + "user-info-box"}>
        <div className={`${Lib.THEME_CLASSES_PREFIX}status ${Lib.THEME_CLASSES_PREFIX}notlogged`}>
          <a href="#">
            <img src={bundle.static_images_url + "default-avatar.svg"} alt="default-avatar"
                 className={Lib.THEME_CLASSES_PREFIX + "default-user"}/>
            <h5>Sign up now</h5>
            <p>Search, find and manage property</p>
          </a>
        </div>

        <div className={Lib.THEME_CLASSES_PREFIX + "status"}>
          <a href="#">
            <img src={bundle.static_images_url + "paresh.png"} alt=""
                 className={Lib.THEME_CLASSES_PREFIX + "default-user"}/>
            <h5>Paresh Khatri</h5>
            <p>Home buyer</p>
            <span className={Lib.THEME_CLASSES_PREFIX + "user-info-box-status-image"}><img
              src={bundle.static_images_url + "settings.svg"} alt=""/></span>
          </a>
        </div>
      </div>

      <div className={Lib.THEME_CLASSES_PREFIX + "user-navigation"}>
        <ol className={`${Lib.THEME_CLASSES_PREFIX}user-navigation-list clearfix`}>
          <li><a href="#" className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link"} title="Home For You">
                      <span><img src={bundle.static_images_url + "home-for-you.svg"}
                                 alt="home-for-you"/></span> Home For You <span
            className={Lib.THEME_CLASSES_PREFIX + "tag"}>8</span></a></li>
          <li><a href="#" className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link"} title="Shared Favorites">
                      <span><img src={bundle.static_images_url + "shared-favorites.svg"}
                                 alt="shared-favorites"/></span> Shared Favorites <span
            className={Lib.THEME_CLASSES_PREFIX + "tag"}>8</span></a></li>
          <li><a href="#" className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link"} title="Comments">
            <span><img src={bundle.static_images_url + "comments.svg"} alt="comments"/></span>
            Comments</a></li>
          <li><a href="#" className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link"} title="Search Homes">
                      <span><img src={bundle.static_images_url + "search-homes.svg"}
                                 alt="search-homes"/></span> Search Homes</a></li>
          <li><a href="#" className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link"} title="Favorites">
            <span><img src={bundle.static_images_url + "favorites.svg"} alt="favorites"/></span>
            Favorites</a></li>
          <li><a href="#" className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link"} title="Saved Searches">
                      <span><img src={bundle.static_images_url + "saved-searches.svg"}
                                 alt="saved-searches"/></span> Saved Searches</a></li>
          <li><a href="#" className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link"} title="Buy With Us">
                      <span><img src={bundle.static_images_url + "buy-with-us.svg"}
                                 alt="buy-with-us"/></span> Buy With Us</a></li>
          <li><a href="#" className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link"} title="Home Buyer’s Guide">
                      <span><img src={bundle.static_images_url + "buyers-guide.svg"}
                                 alt="buyers-guide"/></span> Home Buyer’s Guide</a></li>
          <li><a href="#" className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link"} title="Home Buyer’s Blog">
                      <span><img src={bundle.static_images_url + "buyers-blog.svg"}
                                 alt="buyers-blog"/></span> Home Buyer’s Blog</a></li>
        </ol>
      </div>
      <div className={Lib.THEME_CLASSES_PREFIX + "more"}>
        <a
          className={Lib.THEME_CLASSES_PREFIX + "more-link"}
          href="#"
          onClick={(event) => {
            closeUserPanel();
            event.preventDefault();
            event.stopPropagation();
          }}
        >
          <span>☰</span> Menu <i className="fa fa-caret-down"></i>
          </a>
      </div>
    </section>
  )
};

const UserPanel = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserPanelContent);

export default UserPanel
