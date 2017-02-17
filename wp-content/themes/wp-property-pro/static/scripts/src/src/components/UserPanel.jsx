import React from 'react';
import {connect} from 'react-redux'
import {setUserData} from '../actions/index.jsx';
import _ from 'lodash'

const mapStateToProps = (state) => {
    return {
        userData: _.get(state, 'userDataState', {})
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        closeUserPanel: () => {
            let userData = Object.assign({}, ownProps.userData, {
                panelOpened: false
            });

            dispatch(setUserData(userData));
        }
    }
};

const UserPanelContent = ({userData, closeUserPanel}) => (
    <div className={"user-panel " + (_.get(userData, 'panelOpened', false) === true ? "on" : "")}>
        <a href="#" className="close-panel" onClick={(event) => {
            closeUserPanel();
            event.preventDefault();
            event.stopPropagation();
        }}><i className="fa fa-times"></i></a>
        <div className="user-info-box">
            <div className="status notlogged">
                <a href="#">
                    <img src={bundle.template_url + "/static/images/src/default-avatar.svg"} alt="default-avatar"
                         className="default-user"/>
                    <h5>Sign up now</h5>
                    <p>Search, find and manage property</p>
                </a>
            </div>

            <div className="status">
                <a href="#">
                    <img src={bundle.template_url + "/static/images/src/paresh.png"} alt="" className="default-user"/>
                    <h5>Paresh Khatri</h5>
                    <p>Home buyer</p>
                    <span><img src={bundle.template_url + "/static/images/src/settings.svg"} alt=""/></span>
                </a>
            </div>
        </div>

        <div className="user-navigation">
            <ol className="clearfix">
                <li><a href="#" title="Home For You">
                    <span><img src={bundle.template_url + "/static/images/src/home-for-you.svg"}
                               alt="home-for-you"/></span> Home For You <span className="tag">8</span></a></li>
                <li><a href="#" title="Shared Favorites">
                    <span><img src={bundle.template_url + "/static/images/src/shared-favorites.svg"}
                               alt="shared-favorites"/></span> Shared Favorites <span className="tag">8</span></a></li>
                <li><a href="#" title="Comments">
                    <span><img src={bundle.template_url + "/static/images/src/comments.svg"} alt="comments"/></span>
                    Comments</a></li>
                <li><a href="#" title="Search Homes">
                    <span><img src={bundle.template_url + "/static/images/src/search-homes.svg"}
                               alt="search-homes"/></span> Search Homes</a></li>
                <li><a href="#" title="Favorites">
                    <span><img src={bundle.template_url + "/static/images/src/favorites.svg"} alt="favorites"/></span>
                    Favorites</a></li>
                <li><a href="#" title="Saved Searches">
                    <span><img src={bundle.template_url + "/static/images/src/saved-searches.svg"}
                               alt="saved-searches"/></span> Saved Searches</a></li>
                <li><a href="#" title="Buy With Us">
                    <span><img src={bundle.template_url + "/static/images/src/buy-with-us.svg"}
                               alt="buy-with-us"/></span> Buy With Us</a></li>
                <li><a href="#" title="Home Buyer’s Guide">
                    <span><img src={bundle.template_url + "/static/images/src/buyers-guide.svg"}
                               alt="buyers-guide"/></span> Home Buyer’s Guide</a></li>
                <li><a href="#" title="Home Buyer’s Blog">
                    <span><img src={bundle.template_url + "/static/images/src/buyers-blog.svg"}
                               alt="buyers-blog"/></span> Home Buyer’s Blog</a></li>
            </ol>
        </div>
        <div className="more">
            <a href="#"><span>☰</span> Menu <i className="fa fa-caret-down"></i></a>
        </div>
    </div>
);

const UserPanel = connect(
    mapStateToProps,
    mapDispatchToProps
)(UserPanelContent);

export default UserPanel