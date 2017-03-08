import React, {Component, PropTypes} from 'react';
import SwiperParent from 'swiper';

require('swiper-css');

export default class Swiper{

  static init(swiperElement, params) {
    return new SwiperParent(swiperElement, params);
  }
};
