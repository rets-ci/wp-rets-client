import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import {browserHistory} from 'react-router';

class HeaderSearch extends Component {
  static propTypes = {
    searchTerm: PropTypes.string
  };
  render() {
    return (
      <section className="top-panel">
        <div className="container-fluid">
          <div className="row">
            <div className="logo">
              {
                _.get(bundle, 'logos.square_logo', null)
                  ?
                  <a href={bundle.site_url} onClick={(eve) => {eve.preventDefault();browserHistory.push('')}} title={bundle.site_name}>
                    <img src={bundle.logos.square_logo} alt={bundle.site_name} className="logo square-logo" />
                  </a>
                  : null
              }
            </div>
            <span className="drop-nav">
              <a href="#">Rent <i className="fa fa-caret-down"></i></a>
            </span>
            <div className="search-box-wrap">
              <form method="get" className="clearfix hidden-md-down">
                <div className="bs-tags-box">
                  <div className="bs-tags-input">
                    <span className="tag badge badge-default"><span><i className="fa fa-times"></i></span> {this.props.searchTerm}</span>
                    <span className="tag badge badge-default addfilter"><a href="#"><span>+</span> Bedroom</a></span>
                    <span className="tag badge badge-default addfilter"><a href="#"><span>+</span> Price</a></span>
                    <span className="tag badge badge-default addfilter"><a href="#"><span>+</span> More Filters</a></span>
                    <input type="text" size="1" placeholder="" />
                  </div>
                </div>
                <input type="text" defaultValue="Raleigh,Raleigh2" data-role="tagsinput" className="tagsinput" />
                <i className="fa fa-search"></i>
              </form>
            </div>
            <div className="top-nav-bar">
              <ul>
                <li><a href="#" title="Favorites" className="favorite"><i className="fa fa-heart"></i></a></li>
                <li><a href="#" title="Notification" className="notification"><i className="fa fa-bell"></i> <span className="indicator"><i className="fa fa-circle"></i></span></a></li>
                <li><a href="#" onClick={this.props.openUserPanel} className="side-navigation"><span>☰</span></a></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default HeaderSearch;
