import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import MobileTabsSearch from './MobileTabsSearch.jsx';
import DropDownSearch from './DropDownSearch.jsx';
import {openLocationModal, setSearchType, setFilterTerms} from '../../../../actions/index.jsx';
import {Lib} from '../../../../lib.jsx';
import Util from '../../../Util.jsx';
import get from 'lodash/get';

const mapStateToProps = (state, history) => {
  return {
    searchType: get(state, 'searchType.searchType', ''),
    filterTerms: get(state, 'filterTermsState.filterTerms', [])
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    openSearchModal: () => {
      dispatch(openLocationModal(true));
    },

    setSearchType: (searchType, saleType, propertyTypes) => {
      dispatch(setSearchType(searchType));
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
      propertyTypes: []
    };
  }
  static propTypes = {
    filterTerms: PropTypes.array,
    searchType: PropTypes.string,
    clearTermFilter: PropTypes.func,
    options: PropTypes.object.isRequired
  };

  handleSearchDropDownChange(open) {
    this.setState({dropDownOpen: open});
  }

  handleSearchDropDownOptionSelect(option) {
    this.setState({
      dropDownOpen: false
    });
    this.props.setSearchType(option);
  }

  render() {
    let searchTypes = Object.keys(this.props.options);
    let searchBtnClasses = `btn ${Lib.THEME_CLASSES_PREFIX}btn-search`;

    if (searchTypes.length === 0) {
      return null;
    } else if (searchTypes.length === 1) {
      searchBtnClasses += " " + Lib.THEME_CLASSES_PREFIX + "short-padding";
    }

    let placeholder = 'Click to Open Search';
    let self = this;
    return (
      <div className={`${Lib.THEME_CLASSES_PREFIX}search-box mx-auto`}>
        <MobileTabsSearch
          labels={searchTypes}
          selectedOption={this.props.searchType}
          handleOptionSelect={this.handleSearchDropDownOptionSelect.bind(this)}
        />
        <DropDownSearch
          labels={searchTypes}
          open={this.state.dropDownOpen}
          selectedOption={this.props.searchType}
          handleChange={this.handleSearchDropDownChange.bind(this)}
          handleOptionSelect={this.handleSearchDropDownOptionSelect.bind(this)}
        />
        <div className={searchBtnClasses} onClick={self.props.openSearchModal}>
          <span>{placeholder}</span>
          <i className="fa fa-arrow-right"></i>
        </div>
      </div>
    );
  }
}

const Search = connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchContent);

export default Search
