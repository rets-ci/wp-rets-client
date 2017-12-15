import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import SearchFilters from './components/SearchFilters.jsx';
import {Lib} from '../../lib.jsx';
import SaleTypeHeaderSelection from './components/SaleTypeHeaderSelection.jsx';
import {openSaleTypesPanel} from '../../actions/index.jsx';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import NavigationIcons from './components/NavigationIcons.jsx';
import UserPanelIcon from './components/UserPanelIcon.jsx';

const mapStateToProps = (state, ownProps) => {
  return {
    propertyTypeOptions: get(state, 'propertyTypeOptions.options'),
    saleTypesPanelOpen: get(state, 'headerSearch.saleTypesPanelOpen', false)
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    doOpenSaleTypesPanel: (open) => {
      dispatch(openSaleTypesPanel(open));
    }
  };
};

class HeaderSearch extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    doOpenSaleTypesPanel: PropTypes.func.isRequired,
    historyPush: PropTypes.func.isRequired,
    propertyTypeOptions: PropTypes.array.isRequired,
    saleTypesPanelOpen: PropTypes.bool.isRequired,
    searchFilters: PropTypes.object.isRequired,
    openUserPanel: PropTypes.func.isRequired
  };

  closeSaleTypePanel = () => {
    this.props.doOpenSaleTypesPanel(false);
  }

  handleSaleTypeClick = event => {
    event.preventDefault();
    this.props.doOpenSaleTypesPanel(!this.props.saleTypesPanelOpen);
  }

  shouldComponentUpdate(nextProps) {
    let shouldUpdate = (
      !isEqual(nextProps.propertyTypeOptions, this.props.propertyTypeOptions) ||
      !isEqual(nextProps.searchFilters, this.props.searchFilters) ||
      nextProps.saleTypesPanelOpen !== this.props.saleTypesPanelOpen
    );
    return shouldUpdate;
  }

  render() {
    let {
      historyPush,
      propertyTypeOptions,
      searchFilters,
      saleTypesPanelOpen
    } = this.props;
    
    let searchType = searchFilters['search_type'];
    let containerClass = `${Lib.THEME_CLASSES_PREFIX}header-search-container`;
    if (saleTypesPanelOpen) {
      containerClass += ` ${Lib.THEME_CLASSES_PREFIX}with-sale-types-panel-open`;
    }
    return (
      <div className={containerClass}>
        <SaleTypeHeaderSelection
          currentURL={window.location.href}
          closePanel={this.closeSaleTypePanel}
          termFilters={searchFilters.term}
          historyPush={historyPush}
          propertyTypeOptions={this.props.propertyTypeOptions}
          open={this.props.saleTypesPanelOpen}
        />
        <div className={`${Lib.THEME_CLASSES_PREFIX}header-search-navigation d-flex align-items-center`}>
          <div className={`${Lib.THEME_CLASSES_PREFIX}navigation-menu-left hidden-md-up mr-2`}>
            <UserPanelIcon openUserPanel={this.props.openUserPanel} />
          </div>
          <div className={`${Lib.THEME_CLASSES_PREFIX}logo`}>
            {
              get(bundle, 'logos.square_logo', null)
                ?
                <a href={get(bundle, 'site_url', '')} onClick={(eve) => {
                  eve.preventDefault();
                  this.props.historyPush('');
                }} title={get(bundle, 'site_name', '')}>
                  <img src={bundle.logos.square_logo} alt={get(bundle, 'site_name', '')}
                       className={`${Lib.THEME_CLASSES_PREFIX}logo ${Lib.THEME_CLASSES_PREFIX}square-logo`}/>
                </a>
                : null
            }
          </div>
          <div className={`${Lib.THEME_CLASSES_PREFIX}drop-nav hidden-sm-down`} onClick={this.handleSaleTypeClick}>
            <a href="#">
              {searchType}
              { this.props.saleTypesPanelOpen
                  ? <i className="fa fa-caret-down up ml-2"></i>
                  : <i className="fa fa-caret-down ml-2"></i>
              }
            </a>
          </div>
          <div className={`${Lib.THEME_CLASSES_PREFIX}search-box-wrap`}>
            <SearchFilters filters={searchFilters} historyPush={historyPush} propertyTypeOptions={propertyTypeOptions} />
          </div>
          <div className={`${Lib.THEME_CLASSES_PREFIX}top-nav-bar d-flex align-items-center hidden-sm-down`}>
            <NavigationIcons openUserPanel={this.props.openUserPanel} />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderSearch);
