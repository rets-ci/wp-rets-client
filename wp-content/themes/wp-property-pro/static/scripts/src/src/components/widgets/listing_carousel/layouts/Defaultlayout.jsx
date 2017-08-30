import PropTypes from 'prop-types';
import React, {Component} from 'react';
import PropertyCard from '../../../PropertyCard.jsx';
import Swiper from 'react-id-swiper';
import {Lib} from '../../../../lib.jsx';
import _ from 'lodash';

export default class DefaultLayout extends Component {
  static propTypes = {
    item: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.swiper = null;
  }

  handleNavigation(direction) {
    if (direction === 'next') {
      this.swiper.slideNext();
    } else if (direction === 'prev') {
      this.swiper.slidePrev();
    }
  }

  render() {
    let { item } = this.props;
    let posts = _.get(item, 'posts', []);

    const swiperParams = {
      slidesPerView: 3,
      slidesPerGroup: 3,
      spaceBetween: 20,
      breakpoints: {
        1199: {
          slidesPerView: 2,
          slidesPerGroup: 2,
        },
        767: {
          slidesPerView: 1,
          slidesPerGroup: 1,
        }
      },
      onInit: (swiper) => {
        this.swiper = swiper;
      },
    };

    return (
      <div className={Lib.THEME_CLASSES_PREFIX + "listing-carousel-container"}>
        <div className={`${Lib.THEME_CLASSES_PREFIX}listing-carousel-info mx-auto text-center`}>
          {
            _.get(item, 'title', null)
              ? <h3 className="mx-auto">{_.get(item, 'title')}</h3>
              : null
          }
          {
            _.get(item, 'subtitle', null)
              ? <p>{_.get(item, 'subtitle')}</p>
              : null
          }
        </div>
        {
          posts.length > 0 &&
            <div className={`${Lib.THEME_CLASSES_PREFIX}listing-carousel`}>
              <Swiper {...swiperParams} containerClass={`swiper-container ${Lib.THEME_CLASSES_PREFIX}listing-carousel-container`}>
                {
                  posts.map((post, key) => {
                    return (
                      <div className="swiper-slide" key={key}>
                        <PropertyCard data={post} />
                      </div>
                    )
                  })
                }
              </Swiper>
            </div>
        }
        <div className={`${Lib.THEME_CLASSES_PREFIX}listing-control-nav text-center`}>
          <a href="#" className={`${Lib.THEME_CLASSES_PREFIX}nav-prev mr-3 rounded-circle`}
              onClick={e => {
                e.preventDefault();
                this.handleNavigation.bind(this)('prev');
              }}>
             <i className="fa fa-angle-left"></i>
          </a>
          <a href="#" className={`${Lib.THEME_CLASSES_PREFIX}nav-next rounded-circle`}
              onClick={e => {
                e.preventDefault();
                this.handleNavigation.bind(this)('next');
              }}>
             <i className="fa fa-angle-right"></i>
          </a>
        </div>
      </div>
    );
  }
};
