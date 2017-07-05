import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import MobileTabsSearch from './MobileTabsSearch.jsx';
import DropDownSearch from './DropDownSearch.jsx';
import {openLocationModal, setSearchType, setFilterTerms} from '../../../../actions/index.jsx';
import {Lib} from '../../../../lib.jsx';
import Util from '../../../Util.jsx';
import _ from 'lodash';

const mapStateToProps = (state, history) => {
  return {
    currentState: state,
    searchType: _.get(state, 'searchType.searchType', ''),
    filterTerms: _.get(state, 'filterTermsState.filterTerms', []),
    history: history
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    openSearchModal: modifyType => {
      dispatch(openLocationModal(true, modifyType));
    },

    setSearchType: (searchType, saleType, propertyTypes) => {
      dispatch(setSearchType({
          searchType: searchType,
          saleType: saleType,
          propertyTypes: propertyTypes
      }));
    },

    clearTermFilter: () => {
      dispatch(setFilterTerms([]));
    }
  }
};

class SearchContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropDownOpen: false,
      labels: [],
      saleTypes: [],
      propertyTypes: []
    };
  }
  static propTypes = {
    currentState: PropTypes.object.isRequired,
    filterTerms: PropTypes.array,
    searchType: PropTypes.string,
    clearTermFilter: PropTypes.func,
    options: PropTypes.object.isRequired
  };

  componentDidMount() {
    let {
      labels,
      saleTypes,
      propertyTypes
    } = Util.getSearchTypeParameters(this.props.options);
    
    this.setState({
      labels,
      saleTypes,
      propertyTypes
    });
    this.props.setSearchType(labels.length ? labels[0] : '', saleTypes.length ? saleTypes[0] : '', propertyTypes.length ? propertyTypes[0] : '');
  }

  handleSearchDropDownChange(open) {
    this.setState({dropDownOpen: open});
  }

  handleSearchDropDownOptionSelect(option, saleType, propertyTypes) {
    this.setState({
      dropDownOpen: false
    });
    this.props.setSearchType(option, saleType, propertyTypes);
  }

  render() {
    let {
      openSearchModal,
      options
    } = this.props;

    let searchBtnClasses = `btn ${Lib.THEME_CLASSES_PREFIX}btn-search`;

    if (this.state.labels.length === 0) {
      return null;
    } else if (this.state.labels.length === 1) {
      searchBtnClasses += " " + Lib.THEME_CLASSES_PREFIX + "short-padding";
    }

    let placeholder = 'Address, City, Zip, or Neighborhood';
    if (window.innerWidth < Lib.MOBILE_WIDTH) {
      placeholder = 'Address, City, Zip';
    }
    let self = this;
    return (
      <div className={`${Lib.THEME_CLASSES_PREFIX}search-box mx-auto`}>
        <MobileTabsSearch
          labels={this.state.labels}
          saleTypes={this.state.saleTypes}
          propertyTypes={this.state.propertyTypes}
          selectedOption={this.props.searchType}
          handleOptionSelect={this.handleSearchDropDownOptionSelect.bind(this)}
        />
        <DropDownSearch
          labels={this.state.labels}
          saleTypes={this.state.saleTypes}
          propertyTypes={this.state.propertyTypes}
          open={this.state.dropDownOpen}
          selectedOption={this.props.searchType}
          handleChange={this.handleSearchDropDownChange.bind(this)}
          handleOptionSelect={this.handleSearchDropDownOptionSelect.bind(this)}
        />
        <button className={searchBtnClasses} onClick={() => self.props.openSearchModal('replace')} type="button">
          <i className="fa fa-search"></i> {placeholder}
        </button>
      </div>
    );
  }
}

const Search = connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchContent);

export default Search
