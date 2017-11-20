import {Lib} from '../../../lib.jsx';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import qs from 'qs';
import URI from 'urijs';
import Util from '../../Util.jsx';
import get from 'lodash/get';
import pickBy from 'lodash/pickBy';
import {setSearchType} from 'app_root/actions/index.jsx';

const mapStateToProps = (state, ownProps) => {
  return {}
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changeSearchType: (searchType) => {
      dispatch(setSearchType(searchType));
    }
  };
};

class SaleTypeHeaderSelection extends Component {
  static propTypes = {
    historyPush: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    closePanel: PropTypes.func.isRequired,
    location: PropTypes.object,
    termFilters: PropTypes.array
  }

  handleSaleSelectionItemClick = (currentURL, termFilters, location, searchType, propertyTypeOptions, historyPush) => {
    let searchOptions = Util.getSearchDataFromPropertyTypeOptionsBySearchType(searchType, propertyTypeOptions);
    if (searchOptions.error) {
      // TODO: better handle these types of error
      console.log('%c ' + searchOptions.msg, 'color: #ff0000');
      return;
    }

    let {
      property_type,
      sale_type
    } = searchOptions;

    let params = [];
    let searchTypeArrayParams = Util.createSearchTypeArrayParams(property_type, sale_type);
    params = params.concat(searchTypeArrayParams);
    if (location) {
      params.push({
        key: location.term_type.replace('location_', ''),
        values: [location.slug]
      })
    } else if (termFilters) {
      params = params.concat(termFilters.map(d => ({key: d.term, values: [d.slug]})));
    }
    let searchURL = Util.createSearchURL('/search', params);
    historyPush(searchURL);
    this.props.closePanel();

    this.props.changeSearchType(searchType);

  }

  render() {
    let {
      historyPush,
      location,
      open,
      propertyTypeOptions,
      termFilters
    } = this.props;

    let containerClasses = `${Lib.THEME_CLASSES_PREFIX}sale-type-selection hidden-sm-down`;
    if (!open) {
      containerClasses += ` ${Lib.THEME_CLASSES_PREFIX}remove`;
    }
    return (
      <div className={containerClasses}>
        <div className="container d-flex justify-content-center">
          <div className={`${Lib.THEME_CLASSES_PREFIX}selection-container`}>
            <a href="#" onClick={event => {
              event.preventDefault();
              this.handleSaleSelectionItemClick(this.props.currentURL, termFilters, location, 'Buy', propertyTypeOptions, historyPush)
            }}>
              <img src={bundle.static_images_url + "buy-icon-red.svg"} alt="Buy"/>
              <span>Buy</span>
            </a>
          </div>
          <div className={`${Lib.THEME_CLASSES_PREFIX}selection-container`}>
            <a href="#" onClick={event => {
              event.preventDefault();
              this.handleSaleSelectionItemClick(this.props.currentURL, termFilters, location, 'Rent', propertyTypeOptions, historyPush)
            }}>
              <img src={bundle.static_images_url + "rent-icon-red.svg"} alt="Rent"/>
              <span>Rent</span>
            </a>
          </div>
          <div className={`${Lib.THEME_CLASSES_PREFIX}selection-container`}>
            <a href="#" onClick={event => {
              event.preventDefault();
              this.handleSaleSelectionItemClick(this.props.currentURL, termFilters, location, 'Commercial', propertyTypeOptions, historyPush);
            }}>
              <img src={bundle.static_images_url + "commercial-icon-red.svg"} alt="Commercial"/>
              <span>Commercial</span>
            </a>
          </div>
          <div className={`${Lib.THEME_CLASSES_PREFIX}selection-container`}>
            <a href="#" onClick={event => {
              event.preventDefault();
              this.handleSaleSelectionItemClick(this.props.currentURL, termFilters, location, 'Land', propertyTypeOptions, historyPush);
            }}>
              <img src={bundle.static_images_url + "land-icon-red.svg"} alt="Land"/>
              <span>Land</span>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SaleTypeHeaderSelection);