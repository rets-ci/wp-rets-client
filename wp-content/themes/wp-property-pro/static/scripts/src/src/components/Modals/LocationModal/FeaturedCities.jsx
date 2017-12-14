import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Lib } from 'app_root/lib.jsx';
import LocationCard from 'app_root/components/Modals/LocationModal/LocationCard.jsx';


class FeaturedCities extends Component {

  handleClick = (city) => () => {
    this.props.onClick(city)
  }

  render() {
    return (
      <div className={ `${Lib.THEME_CLASSES_PREFIX}featured-cities-wrapper container` }>
        <div className="row">
          { this.props.cities.map(city =>
            <div className="col-12 col-md-6 col-lg-4" key={city.id} onClick={this.handleClick(city)} >
              <LocationCard data={city} />
            </div>
          )}
        </div>
      </div>
    );
  }
};

FeaturedCities.propTypes = {
  cities: PropTypes.array.isRequired,
}

export default FeaturedCities;
