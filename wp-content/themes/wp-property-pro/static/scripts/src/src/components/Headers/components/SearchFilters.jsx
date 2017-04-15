import {openPropertiesModal} from '../../../actions/index.jsx';
import {Lib} from '../../../lib.jsx';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Util from '../../Util.jsx';

const mapStateToProps = (state, ownProps) => {
  return {
    filters: ownProps.filters
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    openPropertiesModal: open => {
      dispatch(openPropertiesModal(open));
    },
    removeSearchFilter(key, value) {
      let updatedURL = Util.removeQueryFromURL(window.location.href, Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX + '[' + key + ']', value);
      Util.goToUrl(updatedURL);
    }
  }
};

class searchFilters extends Component {
  static propTypes = {
    filters: PropTypes.object.isRequired
  }
  render() {
    let {
      filters
    } = this.props;
    let bedroomsFilter = filters['bedrooms'];
    let bedroomsElement;
    let priceFilter = filters['price'];
    let priceElement;
    if (bedroomsFilter) {
      bedroomsElement = (
        <span className={`${Lib.THEME_CLASSES_PREFIX}tag badge badge-default`}>
          <span><i className="fa fa-times" onClick={() => this.props.removeSearchFilter('bedrooms', bedroomsFilter)}></i></span> {bedroomsFilter}+ Beds</span>
      );
    } else {
      bedroomsElement = (<span className={`${Lib.THEME_CLASSES_PREFIX}tag badge badge-default ${Lib.THEME_CLASSES_PREFIX}addfilter`}>
        <a href="#" onClick={() => this.props.openPropertiesModal(true)}>
          <span>+</span> Bedroom
        </a>
      </span>);
    }

    if (priceFilter) {
      priceElement = (
        <span className={`${Lib.THEME_CLASSES_PREFIX}tag badge badge-default`}>
          <span><i className="fa fa-times" onClick={() => this.props.removeSearchFilter('price', priceFilter)}></i></span> {Util.priceFilterSearchTagText(priceFilter)}</span>
      );
    } else {
      priceElement = (<span className={`${Lib.THEME_CLASSES_PREFIX}tag badge badge-default ${Lib.THEME_CLASSES_PREFIX}addfilter`}>
        <a href="#" onClick={() => this.props.openPropertiesModal(true)}>
          <span>+</span> Price
        </a>
      </span>);
    }

    let termFilter = filters['term'];
    let termFilters = Object.keys(termFilter).map(t => {
      return {tax: t, value: termFilter[t]}
    });
    return (
      <div className={Lib.THEME_CLASSES_PREFIX+"search-box-wrap"}>
        <form method="get" className="clearfix hidden-md-down">
          <div className={Lib.THEME_CLASSES_PREFIX+"bs-tags-box"}>
            <div className={Lib.THEME_CLASSES_PREFIX+"bs-tags-input"}>
              {termFilters.map(t =>
                <span key={t.value} className={`${Lib.THEME_CLASSES_PREFIX}tag badge badge-default`}><span><i className="fa fa-times" onClick={() => this.props.openPropertiesModal(true)}></i></span> {t.value}</span>
              )}
              {bedroomsElement}
              {priceElement}
              <span className={`${Lib.THEME_CLASSES_PREFIX}tag badge badge-default ${Lib.THEME_CLASSES_PREFIX}addfilter`}>
                <a href="#" onClick={() => this.props.openPropertiesModal(true)}>
                  <span>+</span>
                  More Filters
                </a>
              </span>
              <input type="text" size="1" placeholder="" />
            </div>
          </div>
          <input type="text" defaultValue="Raleigh,Raleigh2" data-role="tagsinput" className={Lib.THEME_CLASSES_PREFIX+"tagsinput"} />
          <i className="fa fa-search"></i>
        </form>
      </div>
    );
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(searchFilters);
