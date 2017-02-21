import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Api from '../../../../containers/Api.jsx';
import DropDownSearch from './DropDownSearch.jsx';
import {openModal, setSearchType, setFilterTerms, setMapProps} from '../../../../actions/index.jsx';
import {Lib} from '../../../../lib.jsx'
import _ from 'lodash'

const mapStateToProps = (state, history) => {
    return {
        currentState: state,
        searchProps: _.get(state, 'searchPropsState.searchProps', []),
        searchType: _.get(state, 'searchType.searchType', ''),
        filterTerms: _.get(state, 'filterTermsState.filterTerms', []),
        history: history
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        openSearchModal: open => {
          dispatch(openModal(open));
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
        },

        doSearch: () => {
          let tax = jQuery('.search-term').attr('data-tax');
          let term = jQuery('.search-term span').text();
          let searchTypeArray = _.split(jQuery('#' + Lib.THEME_PREFIX + 'search_type').val(), Lib.STRING_ARRAY_DELIMITER);
          let saleType = _.slice(searchTypeArray, 0, 1);
          let propertyTypes = _.slice(searchTypeArray, 1);

          let title = tax + ' - ' + term;
          let url = '/' + saleType + '/' + tax + '/' + term;

          history.pushState({}, title, url);
          jQuery('title').text(title);

          let params = {
              tax: tax,
              term: term,
              saleType: saleType,
              propertyTypes: propertyTypes
          };

          Api.search(params, function (response) {
              dispatch(setMapProps(response));
          });
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
    searchProps: PropTypes.array,
    filterTerms: PropTypes.array,
    searchType: PropTypes.string,
    doSearch: PropTypes.func,
    clearTermFilter: PropTypes.func,
    options: PropTypes.object.isRequired
  };

  componentDidMount() {
    let labels = Object.keys(this.props.options).map(o => {
      let labelsArr = o.split(Lib.STRING_ARRAY_DELIMITER);
      return labelsArr[0];
    });
    let saleTypes = Object.keys(this.props.options).map(o => {
        let labelsArr = o.split(Lib.STRING_ARRAY_DELIMITER);
        return labelsArr[1];
    });
    let propertyTypes = Object.keys(this.props.options).map(o => {
        let labelsArr = o.split(Lib.STRING_ARRAY_DELIMITER);
        return labelsArr.slice(2).join(Lib.STRING_ARRAY_DELIMITER);
    });
    this.setState({
      labels: labels,
      saleTypes: saleTypes,
      propertyTypes: propertyTypes
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
    let self = this;
    return (
      <div className="search-box">
        <DropDownSearch
          labels={this.state.labels}
          saleTypes={this.state.saleTypes}
          propertyTypes={this.state.propertyTypes}
          open={this.state.dropDownOpen}
          selectedOption={this.props.searchType}
          handleChange={this.handleSearchDropDownChange.bind(this)}
          handleOptionSelect={this.handleSearchDropDownOptionSelect.bind(this)}
        />
        <button className="btn btn-search" onClick={() => self.props.openSearchModal(true)} type="button">
          <i className="fa fa-search"></i> Enter neighbohood, address, Zipcode
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
