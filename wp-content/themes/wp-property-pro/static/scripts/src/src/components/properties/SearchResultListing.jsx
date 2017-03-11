import React, {Component, PropTypes} from 'react';
import numeral from 'numeral';
import Util from '../Util.jsx';
import {Lib} from '../../lib.jsx';
import _ from 'lodash';
import Waypoint from 'react-waypoint';

class SearchResultListing extends Component {
  static propTypes = {
    allowPagination: PropTypes.bool.isRequired,
    properties: PropTypes.array.isRequired,
    seeMoreHandler: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {loading: false};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.properties !== this.props.properties) {
      console.log('resetting loading');
      this.setState({loading: false});
    }
  }

  render() {
    return (
      <div className="listing-wrap" ref={(r) => this.listingWrapElement = r}>
        <div className="row">
          {this.props.properties.map((p, i) =>
             <div className="col-sm-6" key={i}>
               <div className="card">
                 <div className="card-img">
                   <img className="card-img-top" src={p._source.post_meta ? Util.getThumbnailUrlBySize(p._source.post_meta.rets_thumbnail_url, '400x230') : ''} alt="Card image cap" />
                   <ul className="direction-nav">
                      <li><a className="nav-prev" href="#"></a></li>
                      <li><a className="nav-next" href="#"></a></li>
                   </ul>
                 </div>
                 <div className="card-block">
                   <div className="listing-top">
                      <span className="price">{numeral(_.get(p, '_source.post_meta.rets_price_per_sqft[0]', 0)).format('$0,0.00')}</span>
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
                      <li>{p._source.post_meta.rets_beds ? p._source.post_meta.rets_beds[0] + ' Bed' : ''}</li>
                      <li>{p._source.post_meta.rets_total_baths ? p._source.post_meta.rets_total_baths[0] + ' Bath' : ''}</li>
                      <li>{p._source.post_meta.rets_price_per_sqft ? p._source.post_meta.rets_price_per_sqft[0] + ' SF' : ''}</li>
                   </ul>
                 </div>
               </div>
             </div>
           )}
        </div>
        {this.props.allowPagination ?
          <div style={{overflow: 'hidden'}}>
            <div style={{float: 'right'}}>
              {this.state.loading ?
                <div className="spinner">
                  <div className="double-bounce1"></div>
                  <div className="double-bounce2"></div>
                </div>
              : null}
              <p>Showing {this.props.properties.length} results</p>
              <Waypoint
                onEnter={() => { this.setState({loading: true}); this.props.seeMoreHandler(); }}
              />
            </div>
          </div>
        : null}
      </div>
    );
  }
};

export default SearchResultListing;
