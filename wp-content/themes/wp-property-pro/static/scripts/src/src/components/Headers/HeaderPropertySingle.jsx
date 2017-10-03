import {
  openSaleTypesPanel,
  openLocationModal,
  openPropertiesModal,
  requestPropertiesModalResultCount,
  receivePropertiesModalResultCount,
  receivePropertiesModalResultCountFetchingError,
  togglePropertiesModalModeInLocationModal,
} from '../../actions/index.jsx';
import Api from '../../containers/Api.jsx';
import PropTypes from 'prop-types';
import PropertiesModal from '../Modals/PropertiesModal.jsx';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import SaleTypeHeaderSelection from './components/SaleTypeHeaderSelection.jsx';
import SearchFilters from './components/SearchFilters.jsx';
import {Lib} from '../../lib.jsx';
import get from 'lodash/get';
import NavigationIcons from './components/NavigationIcons.jsx';
import UserPanelIcon from './components/UserPanelIcon.jsx';
import Util from '../Util.jsx';

const mapStateToProps = (state, ownProps) => {
  return {
    propertiesModalOpen: get(state, 'propertiesModal.open'),
    propertiesModalResultCountErrorMessage: get(state, 'propertiesModal.errorMessage'),
    propertiesModalResultCountIsFetching: get(state, 'propertiesModal.isFetching'),
    propertiesModalResultCount: get(state, 'propertiesModal.resultCount'),
    propertyTypeOptions: get(state, 'propertyTypeOptions.options'),
    saleTypesPanelOpen: get(state, 'headerSearch.saleTypesPanelOpen', false)
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    closeLocationModal: () => {
      dispatch(openLocationModal(false));
    },

    doPropertiesModalSearch: (filters) => {
      dispatch(requestPropertiesModalResultCount());
      Api.makeStandardPropertySearch(filters, (err, query, response) => {
        if (err) { return dispatch(receivePropertiesModalResultCountFetchingError(err)); }
        dispatch(receivePropertiesModalResultCount(get(response, 'hits.total', null)));
      });
    },

    openLocationModal: () => {
      dispatch(openLocationModal(true));
    },

    openPropertiesModal: open => {
      dispatch(openPropertiesModal(open));
    },

    doOpenSaleTypesPanel: (open) => {
      dispatch(openSaleTypesPanel(open));
    },

    togglePropertiesModalModeInLocationModal: on => {
      dispatch(togglePropertiesModalModeInLocationModal(on));
    }
  };
};

class HeaderPropertySingle extends Component {
  static propTypes = {
    doOpenSaleTypesPanel: PropTypes.func.isRequired,
    historyPush: PropTypes.func.isRequired,
    locationTerm: PropTypes.string.isRequired,
    openUserPanel: PropTypes.func.isRequired,
    propertyTypeOptions: PropTypes.object.isRequired,
    saleTypesPanelOpen: PropTypes.bool.isRequired,
    searchType: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
  }

  closeSaleTypePanel = () => {
    this.props.doOpenSaleTypesPanel(false);
  }


  handleSaleTypeClick = event => {
    event.preventDefault();
    this.props.doOpenSaleTypesPanel(!this.props.saleTypesPanelOpen);
  }

  render() {
    let searchOptions = Util.getSearchDataFromPropertyTypeOptionsBySearchType(this.props.searchType, this.props.propertyTypeOptions);
    let searchType = this.props.searchType === 'Sale' ? 'Buy' : this.props.searchType;
    let propertySingleStaticFilters = {
      property_type: searchOptions.propertyTypes.map(d => d.slug),
      sale_type: this.props.saleType,
      search_type: searchType,
      term: [{'wpp_location': this.props.locationTerm}]
    };

    let containerClass = `${Lib.THEME_CLASSES_PREFIX}header-search-container ${Lib.THEME_CLASSES_PREFIX}header-property-single`;
    if (this.props.saleTypesPanelOpen) {
      containerClass += ` ${Lib.THEME_CLASSES_PREFIX}with-sale-types-panel-open`;
    }
    return (
      <div className={containerClass}>
        <PropertiesModal
          closeLocationModal={this.props.closeLocationModal}
          closeModal={() => this.props.openPropertiesModal(false)}
          doSearch={this.props.doPropertiesModalSearch}
          errorMessage={this.props.propertiesModalResultCountErrorMessage}
          historyPush={this.props.historyPush}
          open={this.props.propertiesModalOpen}
          openLocationModal={this.props.openLocationModal}
          propertyTypeOptions={this.props.propertyTypeOptions}
          resultCount={this.props.propertiesModalResultCount}
          resultCountButtonLoading={this.props.propertiesModalResultCountIsFetching}
          searchFilters={propertySingleStaticFilters}
          turnOffPropertiesModalModeInLocationModal={() => this.props.togglePropertiesModalModeInLocationModal(false)}
          turnOnPropertiesModalModeInLocationModal={() => this.props.togglePropertiesModalModeInLocationModal(true)}
        />
        <SaleTypeHeaderSelection
          closePanel={this.closeSaleTypePanel}
          historyPush={this.props.historyPush}
          locationTerm={this.props.locationTerm}
          propertyTypeOptions={this.props.propertyTypeOptions}
          open={this.props.saleTypesPanelOpen}
        />
        <div className={`${Lib.THEME_CLASSES_PREFIX}header-search-navigation d-flex align-items-center`}>
          <div className={`${Lib.THEME_CLASSES_PREFIX}navigation-menu-left hidden-md-up px-3`}>
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
            <SearchFilters filters={propertySingleStaticFilters} propertyTypeOptions={this.props.propertyTypeOptions} />
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
)(HeaderPropertySingle);