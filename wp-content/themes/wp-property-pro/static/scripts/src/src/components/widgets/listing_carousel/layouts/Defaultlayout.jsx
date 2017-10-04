import PropTypes from 'prop-types';
import Slider from 'react-slick';
import React, {Component} from 'react';
import PropertyCard from '../../../PropertyCard.jsx';
import Swiper from 'react-id-swiper';
import {Lib} from '../../../../lib.jsx';
import get from 'lodash/get';

require('slick-css');

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

  next = () => {
    this.slider.slickNext()
  }

  previous = () => {
    this.slider.slickPrev()
  }

  render() {
    let { item } = this.props;
    let posts = get(item, 'posts', []);

    const slickParams = {
      arrows: false,
      dots: false,
      infinite: false,
      lazyLoad: true,
      nextArrow: null,
      prevArrow: null,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 100000,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3
          }
        }
      ],
      speed: 500
    };

    return (
      <div className={Lib.THEME_CLASSES_PREFIX + "listing-carousel-container"}>
        <div className={`${Lib.THEME_CLASSES_PREFIX}listing-carousel-info mx-auto text-center`}>
          {
            get(item, 'title', null)
              ? <h3 className="mx-auto">{get(item, 'title')}</h3>
              : null
          }
          {
            get(item, 'subtitle', null)
              ? <p>{get(item, 'subtitle')}</p>
              : null
          }
        </div>
        {
          posts.length > 0 &&
            <div className={`${Lib.THEME_CLASSES_PREFIX}listing-carousel`}>
              <Slider ref={c => this.slider = c } {...slickParams}>
                {
                  posts.map((post, key) => {
                    return (
                      <div key={key}>
                        <PropertyCard data={post} />
                      </div>
                    )
                  })
                }
              </Slider>
            </div>
        }
        {
          posts.length ?
            <div className={`${Lib.THEME_CLASSES_PREFIX}listing-control-nav text-center`}>
              <a href="#" className={`${Lib.THEME_CLASSES_PREFIX}nav-prev mr-3 rounded-circle`}
                 onClick={e => {
                     e.preventDefault();
                     this.previous();
                 }}>
                <i className="fa fa-angle-left"></i>
              </a>
              <a href="#" className={`${Lib.THEME_CLASSES_PREFIX}nav-next rounded-circle`}
                 onClick={e => {
                     e.preventDefault();
                     this.next();
                 }}>
                <i className="fa fa-angle-right"></i>
              </a>
            </div>
          : null
        }

      </div>  
    );
  }
};
