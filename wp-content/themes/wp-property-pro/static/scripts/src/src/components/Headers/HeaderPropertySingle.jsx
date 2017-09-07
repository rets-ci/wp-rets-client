import {
  openSaleTypesPanel,
  openLocationModal,
  openPropertiesModal,
  setPropertiesModalResultCountLoading,
  togglePropertiesModalModeInLocationModal,
  updatePropertiesModalResultCount
} from '../../actions/index.jsx';
import Api from '../../containers/Api.jsx';
import PropTypes from 'prop-types';
import PropertiesModal from '../Modals/PropertiesModal.jsx';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import SaleTypeHeaderSelection from './components/SaleTypeHeaderSelection.jsx';
import SearchFilters from './components/SearchFilters.jsx';
import {Lib} from '../../lib.jsx';
import _ from 'lodash';
import NavigationIcons from './components/NavigationIcons.jsx';
import UserPanelIcon from './components/UserPanelIcon.jsx';

const mapStateToProps = (state, ownProps) => {
  return {
    propertiesModalOpen: _.get(state, 'propertiesModal.open'),
    propertiesModalResultCountButtonLoading: _.get(state, 'propertiesModal.resultCountButtonLoading'),
    propertiesModalResultCount: _.get(state, 'propertiesModal.resultCount'),
    propertyTypeOptions: _.get(state, 'propertyTypeOptions.options'),
    saleTypesPanelOpen: _.get(state, 'headerSearch.saleTypesPanelOpen', false)
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    closeLocationModal: () => {
      dispatch(openLocationModal(false));
    },

    doPropertiesModalSearch: (filters) => {
      dispatch(setPropertiesModalResultCountLoading(true));
      Api.makeStandardPropertySearch(filters, (err, query, response) => {
        // we are ignoring handling the error here intentionally as the error is handled as soon as the modal is closed
        dispatch(setPropertiesModalResultCountLoading(false));
        dispatch(updatePropertiesModalResultCount(_.get(response, 'hits.total', null)));
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
    let searchType = this.props.searchType === 'Sale' ? 'Buy' : this.props.searchType;

    let propertySingleStaticFilters = {
      sale_type: this.props.saleType,
      search_type: searchType,
      term: [{'wpp_location': this.props.locationTerm}]
    };

    return (
      <div className={`${Lib.THEME_CLASSES_PREFIX}header-search-container ${Lib.THEME_CLASSES_PREFIX}header-property-single container-fluid`} >
        <PropertiesModal
          closeLocationModal={this.props.closeLocationModal}
          closeModal={() => this.props.openPropertiesModal(false)}
          doSearch={this.props.doPropertiesModalSearch}
          open={this.props.propertiesModalOpen}
          openLocationModal={this.props.openLocationModal}
          propertyTypeOptions={this.props.propertyTypeOptions}
          resultCount={this.props.propertiesModalResultCount}
          resultCountButtonLoading={this.props.propertiesModalResultCountButtonLoading}
          searchFilters={propertySingleStaticFilters}
          turnOffPropertiesModalModeInLocationModal={() => this.props.togglePropertiesModalModeInLocationModal(false)}
          turnOnPropertiesModalModeInLocationModal={() => this.props.togglePropertiesModalModeInLocationModal(true)}
        />
        <SaleTypeHeaderSelection
          closePanel={this.closeSaleTypePanel}
          locationTerm={this.props.locationTerm}
          propertyTypeOptions={this.props.propertyTypeOptions}
          open={this.props.saleTypesPanelOpen}
        />
        <div className={`${Lib.THEME_CLASSES_PREFIX}header-search-navigation row`}>
          <div className={`${Lib.THEME_CLASSES_PREFIX}navigation-menu-left col-1 p-0 hidden-md-up d-flex align-items-center`}>
            <UserPanelIcon openUserPanel={this.props.openUserPanel} />
          </div>
          <div className={`${Lib.THEME_CLASSES_PREFIX}logo col-1 col-md-2 col-lg-1 my-auto p-0`}>
            {
              _.get(bundle, 'logos.square_logo', null)
                ?
                <a href={_.get(bundle, 'site_url', '')} onClick={(eve) => {
                  eve.preventDefault();
                  browserHistory.push('')
                }} title={_.get(bundle, 'site_name', '')}>
                  <img src={bundle.logos.square_logo} alt={_.get(bundle, 'site_name', '')}
                       className={`${Lib.THEME_CLASSES_PREFIX}logo ${Lib.THEME_CLASSES_PREFIX}square-logo`}/>
                </a>
                : null
            }
          </div>
          <div className={`hidden-sm-down col-md-2 d-flex justify-content-center align-items-center ${Lib.THEME_CLASSES_PREFIX}drop-nav`}>
            <a href="#" onClick={this.handleSaleTypeClick}>{searchType} <i className="fa fa-caret-down"></i></a>
          </div>
          <div className={Lib.THEME_CLASSES_PREFIX + "search-box-wrap col-10 col-md-7 col-lg-8 d-flex align-items-center"}>
            <SearchFilters filters={propertySingleStaticFilters} propertyTypeOptions={this.props.propertyTypeOptions} />
          </div>
          <div className={Lib.THEME_CLASSES_PREFIX + "top-nav-bar col-0 col-md-1 d-flex align-items-center justify-content-end"}>
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