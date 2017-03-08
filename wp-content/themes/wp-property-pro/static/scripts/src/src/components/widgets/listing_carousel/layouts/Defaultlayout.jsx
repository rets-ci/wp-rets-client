import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import PropertyCard from '../../../PropertyCard.jsx';
import Swiper from '../../../Swiper.jsx';

require('swiper-css');

export default class DefaultLayout extends Component {
  static propTypes = {
    item: PropTypes.object
  };
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.swiper = Swiper.init(this.swiperElement, {
      slidesPerView: 'auto',
      nextButton: this.swiperElementNext,
      prevButton: this.swiperElementPrev,
      spaceBetween: 20
    });
  }

  render() {
    let {
      item
    } = this.props;
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
            ?
              <div className="listing-carousel clearfix">
                <div className="swiper-container" ref={(r) => this.swiperElement = r} style={{width: '100%', height: '400px'}}>
                  <div className="swiper-wrapper">
                    {
                      posts.map((post, key) => {
                        return (
                          <PropertyCard data={post} key={key} />
                        )
                      })
                    }
                    </div>
                </div>
              </div>
            : null
        }
        <div className="listing-control-nav">
          <a href="#" className="prev-nav" ref={(r) => this.swiperElementPrev = r}><i className="fa fa-angle-left"></i></a>
          <a href="#" className="next-nav" ref={(r) => this.swiperElementNext = r}><i className="fa fa-angle-right"></i></a>
        </div>
      </div>
    );
  }
};
