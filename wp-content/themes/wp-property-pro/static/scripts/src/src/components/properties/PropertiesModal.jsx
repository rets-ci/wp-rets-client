import {openPropertiesModal} from '../../actions/index.jsx';
import {connect} from 'react-redux';
import {Lib} from '../../lib.jsx';
import React, {Component, PropTypes} from 'react';

const mapStateToProps = state => {
  return {}
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    openPropertiesModal: open => {
      dispatch(openPropertiesModal(open));
    }
  }
};

class PropertiesModal extends Component {
  render() {
    return (
      <div className={Lib.THEME_CLASSES_PREFIX + "search-modal" + " " + Lib.THEME_CLASSES_PREFIX + "advanced-filter"} style={{display: this.props.open ? 'block' : 'none'}}>
        <a onClick={() => this.props.openPropertiesModal(false)}href="#" className={Lib.THEME_CLASSES_PREFIX + "close-panel" + " " + Lib.THEME_CLASSES_PREFIX + "hidden-md-down"}>
          <i className="fa fa-times"></i></a>
        <form method="get" className="clearfix hidden-md-down">
          <div className="container">
            <i className="fa fa-search"></i>
            <div className={Lib.THEME_CLASSES_PREFIX + "bs-tags-box"}>
               <div className={Lib.THEME_CLASSES_PREFIX + "bs-tags-input"}>
                  <span className={Lib.THEME_CLASSES_PREFIX + "tag badge badge-default"}><span><i className="fa fa-times"></i></span> Raleigh</span>
                  <span className={Lib.THEME_CLASSES_PREFIX + "tag badge badge-default"}><span><i className="fa fa-times"></i></span> Raleigh</span>
                  <input type="text" size="1" placeholder="Select bedroom type, amenities" />
               </div>
            </div>
              <input type="text" value="Raleigh,Raleigh2" data-role="tagsinput" className={Lib.THEME_CLASSES_PREFIX + "tagsinput"} />
            <div className="button-group">
               <a href="#" className="btn-reset">Reset</a>
               <a href="#" className="btn btn-primary">View 746 Properties</a>
            </div>
          </div>
        </form>
        <div className="search-filter-nav hidden-lg-up">
          <div className="container">
            <ul className="clearfix">
              <li>
                <a href="#" title="Buy">
                  <img src="img/buy-icon.svg" alt="Buy" />
                  <span>Buy</span>
                </a>
              </li>
              <li>
                <a href="#" title="Rent">
                  <img src="img/rent-icon.svg" alt="Rent" />
                  <span>Rent</span>
                </a>
              </li>
              <li>
                <a href="#" title="Commercial">
                  <img src="img/commercial-icon.svg" alt="Commercial" />
                  <span>Commercial</span>
                </a>
              </li>
              <li>
                <a href="#" title="Land">
                  <img src="img/land-icon.svg" alt="Land" />
                  <span>Land</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="search-modal-box">
           <div className="container">
             <div className="filter-section">
               <h3>Location <span>(City, School, Neighborhood, Zip)</span></h3>
               <div className="filter-type">
                 <span className={Lib.THEME_CLASSES_PREFIX + "tag badge badge-default selected"}>Raleigh</span>
                 <a href="#" className="btn btn-primary">+ More Locations</a>
               </div>
             </div>
             <div className="filter-section">
               <h3>Bedrooms <span>(Minimum)</span></h3>
               <a href="#" className="btn btn-primary selected">1+</a>
               <a href="#" className="btn btn-primary">2+</a>
               <a href="#" className="btn btn-primary">3+</a>
               <a href="#" className="btn btn-primary">4+</a>
             </div>
             <div className="filter-section">
               <h3>Price</h3>
               <div className="range-slider">
                 <div className="slider-line"></div>
                 <div className="range-grid">
                    <span className="range-grid-col">No Min</span>
                    <span className="range-grid-col">1000</span>
                    <span className="range-grid-col active">1500</span>
                    <span className="range-grid-col active">2000</span>
                    <span className="range-grid-col active">2500</span>
                    <span className="range-grid-col active">3000</span>
                    <span className="range-grid-col active">3500</span>
                    <span className="range-grid-col">4000</span>
                    <span className="range-grid-col">4500</span>
                    <span className="range-grid-col">5000</span>
                    <span className="range-grid-col">No Max</span>
                 </div>
                 <span className="slider-bar"></span>
                 <span className="bs-slider from type_last" style={{left: "0%"}}>100K</span>
                 <span className="bs-slider to" style={{right: "0%"}}>600K</span>
               </div>
               <input id="priceSlider" className="bs-hidden-input" />
             </div>

             <div className="additional-filter">
                <div className="filter-section">
                   <h3>Bathrooms <span>(Minimum)</span></h3>
                   <a href="#" className="btn btn-primary selected">1+</a>
                   <a href="#" className="btn btn-primary">2+</a>
                   <a href="#" className="btn btn-primary">3+</a>
                   <a href="#" className="btn btn-primary">4+</a>
                 </div>
             </div>
             <a href="#" className="view-link">+ View More Filters</a>
           </div>
        </div>
        <div className="filter-footernav hidden-lg-up">
          <div className="container">
            <button className="btn btn-reset">Reset</button>
            <span className="nav-item-right">
              <a href="#" className="btn-cancel">Cancel</a> <i>|</i> <a href="#" className="btn-apply">Apply</a>
            </span>
          </div>
        </div>
     </div>
    )
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertiesModal);
