import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import {Lib} from '../../../../lib.jsx';
import Util from '../../../Util.jsx';

const DefaultLayout = ({item}) => {

  let posts = _.get(item, 'posts', []);

  return (
    <div className="container">

      {
        _.get(item, 'title', null)
          ? <h3>{_.get(item, 'title')}</h3>
          : null
      }
      {
        _.get(item, 'subtitle', null)
          ? <p>{_.get(item, 'subtitle')}</p>
          : null
      }
      {
        posts.length
          ? <div className="listing-carousel clearfix">
            <ul>
              {
                posts.map((post, key) => {

                  // TODO Ash you can find gallery_images urls array at post.gallery_images

                    return (
                      <li key={key}>
                        <div className="card">
                          <div className="card-img">
                            <img className="card-img-top"
                                 src={Util.getThumbnailUrlBySize(post.thumbnail, Lib.PROPERTY_LISTING_IMAGE_SIZE)}
                                 alt="Card image cap"/>
                            <ul className="direction-nav">
                              <li><a className="nav-prev" href="#"></a></li>
                              <li><a className="nav-next" href="#"></a></li>
                            </ul>
                          </div>

                          <div className="card-block">
                            <div className="listing-top">
                              <span className="price">$1,249,000</span>
                              <span className="action-btn-group">
              <a href="#" className="favorite active" title="Save as favorite"><i className="fa fa-heart"
                                                                                  aria-hidden="true"></i></a>
              <a href="#" className="hide" title="Hide"><i className="fa fa-eye-slash" aria-hidden="true"></i></a>
              </span>
                            </div>
                            <h4 className="card-title">{post.post_title}</h4>
                            <p className="card-text">Durham, NC 27712</p>
                            <ul className="liting-info-box">
                              <li>3 Bed</li>
                              <li>2 Bath</li>
                              <li>1,142 SF</li>
                            </ul>
                          </div>
                        </div>
                      </li>
                    )
                  }
                )
              }
            </ul>

          </div>
          : null
      }
      <div className="listing-control-nav">
        <a href="#" className="prev-nav"><i className="fa fa-angle-left"></i></a>
        <a href="#" className="next-nav"><i className="fa fa-angle-right"></i></a>
      </div>
    </div>
  );
};

export default DefaultLayout;