import {
  setSearchProps,
  receiveLocationModalFetchingError,
  receiveLocationModalPosts,
  requestLocationModalPosts
} from '../../actions/index.jsx';
import ErrorMessage from '../ErrorMessage.jsx';
import GroupTransition from '../GroupTransition.jsx';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import URL from 'urijs';
import Api from '../../containers/Api.jsx';
import LoadingAccordion from '../LoadingAccordion.jsx';
import {Lib} from '../../lib.jsx';
import get from 'lodash/get';
import Util from '../Util.jsx';

const mapStateToProps = (state, ownProps) => {
  return {
    errorMessage: state.locationModal.errorMessage,
    isFetching: state.locationModal.isFetching,
    propertiesModalMode: get(state, 'locationModal.propertiesModalMode'),
    open: state.locationModal ? state.locationModal.open : false,
    propertyTypeOptions: get(state, 'propertyTypeOptions.options'),
    searchResults: get(state, 'locationModal.items', []),
    searchType: get(state, 'searchType.searchType', '')
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    searchHandler: (term, saleType, propertyTypes) => {

      let searchParams = {
        term: term,
        saleType: saleType,
        propertyTypes: propertyTypes
      };
      dispatch(requestLocationModalPosts());
      Api.autocompleteQuery(searchParams,
        function (err, rows) {
          if (err) { return dispatch(receiveLocationModalFetchingError(err)); }
          dispatch(receiveLocationModalPosts(rows));
        }
      );
    },
    topQuery: () => {
      dispatch(requestLocationModalPosts());
      Api.topQuery({
          size: Lib.TOP_AGGREGATIONS_COUNT
        },
        function (err, rows) {
          if (err) { return dispatch(receiveLocationModalFetchingError(err)); }
          dispatch(receiveLocationModalPosts(rows));
        }
      );
    }
  };
};

class LocationModal extends Component {

  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    errorMessage: PropTypes.string,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    onTermSelect: PropTypes.func,
    open: PropTypes.bool.isRequired,
    propertiesModalMode: PropTypes.bool.isRequired,
    propertyTypeOptions: PropTypes.object.isRequired,
    searchHandler: PropTypes.func.isRequired,
    topQuery: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      timeoutId: 0
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.open) {
      this.searchInput.focus();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open && this.props.open !== nextProps.open) {
      this.setState({
        searchValue: ''
      });
      this.props.topQuery();
    }
  }

  handleClose(eve) {
    eve.preventDefault();
    this.props.closeModal();
  }

  handleResultClick = (eve, tax, term, termType, text, searchType, modifyType, url, historyPush) => {
    eve.preventDefault();
    let searchOptions = Util.getSearchDataFromPropertyTypeOptionsBySearchType(searchType, this.props.propertyTypeOptions);
    if (searchOptions.error) {
      console.log('%c ' + searchOptions.msg, 'color: #ff0000');
    } else {
      let {
        propertyTypes,
        saleType
      } = searchOptions;
      if (url === null) {
        // Properties results page
        if (this.props.propertiesModalMode) {
          this.props.onTermSelect({
            term: Util.reddoorConvertTermTypeToSearchURLPrefix(termType),
            slug: term,
            tax: tax,
            text: text
          });
        } else {
          if (!termType) { console.log('term type is not found, search functionality won\'t work as expected'); }

          let modifiedSearchType = searchType === 'Sale' ? 'Buy' : searchType;
          let termTypeOnlyString = Util.getReddoorSearchTerm(tax, termType);
          let params = [
            {
              key: 'sale',
              values: [saleType]
            },
            {
              key: 'search',
              values: [modifiedSearchType]
            },
            {
              key: termTypeOnlyString,
              values: [term]
            },
            ...propertyTypes.map(p => ({key: 'property', values: [p.slug]}))
          ];
          let searchURL = Util.createSearchURL('/search', params);
          
          historyPush(searchURL);
          this.props.closeModal();
        }
      } else {
        // Single property page
        historyPush(url)
        this.props.closeModal();
      }
    }
  }

  search() {
    let searchOptions = Util.getSearchDataFromPropertyTypeOptionsBySearchType(this.props.searchType, this.props.propertyTypeOptions);
    let {
      propertyTypes,
      saleType
    } = searchOptions;
    let val = this.state.searchValue;
    if (!val) {
      this.props.topQuery();
    } else {
      this.props.searchHandler(val, saleType, propertyTypes.map(p => p.slug));
    }
  }

  handleSearchValueChange(eve) {
    let val = eve.target.value;

    if(this.state.timeoutId){
      clearTimeout(this.state.timeoutId);
    }

    let timeoutId = setTimeout(this.search.bind(this), Lib.LOCATION_MODAL_REQUESTS_DELAY);

    this.setState({
      searchValue: val,
      timeoutId: timeoutId
    });
  }

  handleKeyPress(event) {
    if (event.keyCode === 27) {
      // ESC key
      this.props.closeModal();
    }
  }

  render() {
    let {
      errorMessage,
      history,
      isFetching,
      searchResults,
      searchType,
      modifyType
    } = this.props;
    let self = this;
    let resultsElements = searchResults.map((s, k) => {
      return (
        <div className="row" key={s.key}>
          <div className={`${Lib.THEME_CLASSES_PREFIX}search-result-group`}>
            <div className="container">
              <div className="row">
                <h4 className={Lib.THEME_CLASSES_PREFIX + "search-title"}>{s.text}</h4>
              </div>
            </div>
            {s.children.length ?
              <ol className="list-group">
                {s.children.map((c, i) =>
                  <li className={`list-group-item ${Lib.THEME_CLASSES_PREFIX}search-result-item border-0 p-0`} key={i}>
                    <div className="container">
                      <div className="row">
                        <a href="#" className="m-0"
                           onClick={(eve) => self.handleResultClick(eve, c.taxonomy, c.term, c.termType, c.text, searchType, modifyType, get(c, 'url', null), history.push)}>
                          {c.text}
                        </a>
                      </div>
                    </div>
                  </li>
                )}
              </ol>
              : null}
          </div>
        </div>
      )
    });

    let placeholder = 'Address, City, Zip, or Neighborhood.';
    let inputClasses = 'form-control';
    if (window.innerWidth < Lib.MOBILE_WIDTH) {
      placeholder = '';
      inputClasses = `form-control ${Lib.THEME_CLASSES_PREFIX}with-padding`
    }

    let searchModalClasses = `${Lib.THEME_CLASSES_PREFIX}search-modal active`;
    if (!this.props.open) {
      searchModalClasses = `${Lib.THEME_CLASSES_PREFIX}search-modal remove`;
    }

    return (
      <div className={`modal ${searchModalClasses} ${Lib.THEME_CLASSES_PREFIX}location-modal`} onKeyDown={this.handleKeyPress.bind(this)}>
        <div className={`modal-dialog ${Lib.THEME_CLASSES_PREFIX}modal-dialog m-0`}>
          <div className={`modal-content border-0 ${Lib.THEME_CLASSES_PREFIX}modal-content`}>
            <div className={`modal-header ${Lib.THEME_CLASSES_PREFIX}modal-header`}>
              <div className="container">

                <div className="d-flex flex-row filter-container">
                  <div className="p-2 my-auto">
                    <i className="fa fa-search"></i>
                  </div>

                  <div className="p-2 col-xl-10 col-lg-9 my-auto">
                    <input
                      autoComplete="off"
                      className={inputClasses}
                      id={Lib.THEME_PREFIX + "search-input"}
                      onChange={this.handleSearchValueChange.bind(this)}
                      ref={(input) => {
                        this.searchInput = input;
                      }}
                      type="text"
                      value={this.state.searchValue}
                      placeholder={placeholder}
                    />
                  </div>

                  <div className="p-2 my-auto hidden-sm-down">
                    <button type="button" className={`btn btn-primary ${Lib.THEME_CLASSES_PREFIX}button ${Lib.THEME_CLASSES_PREFIX}secondary-button`}>
                      Search
                    </button>
                  </div>

                  <button type="button" className={`close p-2 my-auto ${Lib.THEME_CLASSES_PREFIX}close-panel`} onClick={(e) => {
                      e.preventDefault();
                      this.props.closeModal();
                    }} aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>

                </div>
              </div>
            </div>
            
            <div className={`modal-body ${Lib.THEME_CLASSES_PREFIX}modal-body`}>
              <div className={`container-fluid ${Lib.THEME_CLASSES_PREFIX}search-modal-box`}>
              {
                !this.props.open
                  ? null
                  : searchResults.length
                    ? <GroupTransition>{ resultsElements }</GroupTransition>
                    : isFetching
                      ? <LoadingAccordion />
                      : errorMessage
                        ? <ErrorMessage message={errorMessage} />
                        : <p className={`${Lib.THEME_CLASSES_PREFIX}gentle-error`}>Nothing to show. Please try a different search</p>
              }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(LocationModal));
