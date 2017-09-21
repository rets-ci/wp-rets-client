import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import SearchFilters from './components/SearchFilters.jsx';
import {Lib} from '../../lib.jsx';
import SaleTypeHeaderSelection from './components/SaleTypeHeaderSelection.jsx';
import {openSaleTypesPanel} from '../../actions/index.jsx';
import _ from 'lodash';
import NavigationIcons from './components/NavigationIcons.jsx';
import UserPanelIcon from './components/UserPanelIcon.jsx';

const mapStateToProps = (state, ownProps) => {
  return {
    propertyTypeOptions: _.get(state, 'propertyTypeOptions.options'),
    saleTypesPanelOpen: _.get(state, 'headerSearch.saleTypesPanelOpen', false)
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

  closeSaleTypePanel = () => {
    this.props.doOpenSaleTypesPanel(false);
  }

  handleSaleTypeClick(event) {
    event.preventDefault();

    this.props.doOpenSaleTypesPanel(!this.props.saleTypesPanelOpen);
  }

  static propTypes = {
    historyPush: PropTypes.func.isRequired,
    propertyTypeOptions: PropTypes.object.isRequired,
    searchFilters: PropTypes.object.isRequired,
    openUserPanel: PropTypes.func.isRequired
  };

  render() {
    let {
      historyPush,
      propertyTypeOptions,
      searchFilters
    } = this.props;
    
    let containerClasses = `row ${Lib.THEME_CLASSES_PREFIX}sale-type-selection hidden-sm-down`;
    if (!this.props.saleTypesPanelOpen) {
      containerClasses += ` ${Lib.THEME_CLASSES_PREFIX}sale-type-selection-hide`;
    }

    let searchType = searchFilters['search_type'];

    return (
      <div className={Lib.THEME_CLASSES_PREFIX + "header-search-container"}>
        <SaleTypeHeaderSelection
          currentURL={window.location.href}
          closePanel={this.closeSaleTypePanel}
          historyPush={historyPush}
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
                  this.props.historyPush('');
                }} title={_.get(bundle, 'site_name', '')}>
                  <img src={bundle.logos.square_logo} alt={_.get(bundle, 'site_name', '')}
                       className={`${Lib.THEME_CLASSES_PREFIX}logo ${Lib.THEME_CLASSES_PREFIX}square-logo`}/>
                </a>
                : null
            }
          </div>
          <div className={`hidden-sm-down col-md-2 d-flex justify-content-center align-items-center ${Lib.THEME_CLASSES_PREFIX}drop-nav`}>
            <a href="#" onClick={this.handleSaleTypeClick.bind(this)}>{searchType} <i className="fa fa-caret-down"></i></a>
          </div>
          <div className={Lib.THEME_CLASSES_PREFIX + "search-box-wrap col-10 col-md-7 col-lg-8 d-flex align-items-center"}>
            <SearchFilters filters={searchFilters} propertyTypeOptions={propertyTypeOptions} />
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
)(HeaderSearch);
