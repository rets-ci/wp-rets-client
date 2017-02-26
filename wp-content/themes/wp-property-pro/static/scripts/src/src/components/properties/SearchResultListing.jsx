import React, {Component, PropTypes} from 'react';
import numeral from 'numeral';
import Util from '../Util.jsx';
import {Lib} from '../../lib.jsx';
import _ from 'lodash';

class SearchResultListing extends Component {
  static propTypes = {
    allowPagination: PropTypes.bool.isRequired,
    properties: PropTypes.array.isRequired,
    seeMoreHandler: PropTypes.func.isRequired
  }
  render() {
    return (
      <div className="listing-wrap">
        <div className="row">
          {this.props.properties.map((p, i) =>
             <div className="col-sm-6" key={i}>
               <div className="card">
                 <div className="card-img">
                   <img className="card-img-top" src={Util.getThumbnailUrlBySize(p._source.meta_input.rets_thumbnail_url, Lib.PROPERTY_LISTING_IMAGE_SIZE)} alt="Card image cap" />
                   <ul className="direction-nav">
                      <li><a className="nav-prev" href="#"></a></li>
                      <li><a className="nav-next" href="#"></a></li>
                   </ul>
                 </div>
                 <div className="card-block">
                   <div className="listing-top">
                      <span className="price">{numeral(p._source.tax_input.price[0]).format('$0,0.00')}</span>
                      <span className="action-btn-group">
                        <a href="#" className="favorite active" title="Save as favorite"><i className="fa fa-heart" aria-hidden="true"></i></a>
                        <a href="#" className="hide" title="Hide"><i className="fa fa-eye-slash" aria-hidden="true"></i></a>
                     </span>
                   </div>
                   {
                     _.get(p, '_source._system.addressDetail', '')
                       ? <h4
                         className="card-title">{p._source._system.addressDetail.streetNumber + ' ' + p._source._system.addressDetail.streetName}</h4>
                       : null
                   }
                   {
                     _.get(p, '_source._system.addressDetail', '')
                       ? <p
                         className="card-text">{p._source._system.addressDetail.city}, {p._source._system.addressDetail.zipcode}</p>
                       : null
                   }

                   <ul className="liting-info-box">
                      <li>{p._source.tax_input.bedrooms ? p._source.tax_input.bedrooms[0] + ' Bed' : ''}</li>
                      <li>{p._source.tax_input.bathrooms ? p._source.tax_input.bedrooms[0] + ' Bath' : ''}</li>
                      <li>{p._source.tax_input.price_per_sqft ? p._source.tax_input.bedrooms[0] + ' SF' : ''}</li>
                   </ul>
                 </div>
               </div>
             </div>
           )}
        </div>
        {this.props.allowPagination ?
          <div style={{overflow: 'hidden'}}>
            <div style={{float: 'right'}}>
              <p>Showing {this.props.properties.length} results</p>
              <button onClick={this.props.seeMoreHandler}>See more</button>
            </div>
          </div>
        : null}
      </div>
    );
  }
};

export default SearchResultListing;
