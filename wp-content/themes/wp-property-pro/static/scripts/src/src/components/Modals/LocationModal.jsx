import {
  setSearchProps,
  raiseErrorMessage,
  receiveLocationModalPosts,
  resetErrorMessage,
  requestLocationModalResetFetching,
  requestLocationModalPosts
} from '../../actions/index.jsx';
import ErrorMessage from '../ErrorMessage.jsx';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import URL from 'urijs';
import Api from '../../containers/Api.jsx';
import LoadingAccordion from '../LoadingAccordion.jsx';
import {Lib} from '../../lib.jsx';
import _ from 'lodash';
import Util from '../Util.jsx';

const mapStateToProps = (state, ownProps) => {
  return {
    errorMessage: state.errorMessage,
    isFetching: state.locationModal.isFetching,
    propertiesModalMode: _.get(state, 'locationModal.propertiesModalMode'),
    open: state.locationModal ? state.locationModal.open : false,
    propertyTypeOptions: _.get(state, 'propertyTypeOptions.options'),
    searchResults: _.get(state, 'locationModal.items', []),
    searchType: _.get(state, 'searchType.searchType', '')
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    searchHandler: (term, saleType, propertyTypes, errorMessage) => {

      let searchParams = {
        term: term,
        saleType: saleType,
        propertyTypes: propertyTypes
      };
      // reset the searchProps
      dispatch(requestLocationModalPosts());
      Api.autocompleteQuery(searchParams,
        function (err, rows) {
          if (err) {
            dispatch(requestLocationModalResetFetching());
            return dispatch(raiseErrorMessage(err));
          }
          if (!err && errorMessage) {
            dispatch(resetErrorMessage());
          }
          dispatch(receiveLocationModalPosts(rows));
        }
      );
    },
    topQuery: errorMessage => {
      // reset the searchProps
      dispatch(requestLocationModalPosts());
      Api.topQuery({
          size: Lib.TOP_AGGREGATIONS_COUNT
        },
        function (err, rows) {
          if (err) {
            dispatch(requestLocationModalResetFetching());
            return dispatch(raiseErrorMessage(err));
          }
          if (!err && errorMessage) {
            dispatch(resetErrorMessage());
          }
          dispatch(receiveLocationModalPosts(rows));
        }
      );
    }
  };
};

class LocationModal extends Component {

  static propTypes = {
    closeModal: PropTypes.func.isRequired,
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
      this.props.topQuery(nextProps.errorMessage);
    }
  }

  handleClose(eve) {
    eve.preventDefault();
    this.props.closeModal();
  }

  handleResultClick = (eve, tax, term, text, searchType, modifyType, url, historyPush) => {
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
            [tax]: text
          });
        } else {
          let url = new URL();
          url.resource(_.get(wpp, 'instance.settings.configuration.base_slug'));
          //TODO: this is a temporary replacement of "Sale" to "Buy" value until we decide on the exact set of sale type values
          let modifiedSearchType = searchType === 'Sale' ? 'Buy' : searchType;
          let URLSearchObject = {
            [Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX + '[term][0][' + tax + ']']: encodeURIComponent(text),
            [Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX + '[search_type]']: modifiedSearchType,
            [Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX + '[sale_type]']: saleType,
          };
          URLSearchObject = Object.assign({}, URLSearchObject, propertyTypes.map((p, i) => {
            return {
              [`${Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX}[property_type][${i}]`]: p.slug
            }
          }).reduce((a, b) => {
            let key = Object.keys(b)[0];
            a[key] = b[key];
            return a;
          }, {}));
          url.setSearch(URLSearchObject);
          historyPush('/' + decodeURIComponent(url.pathname() + url.search()));
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
      this.props.topQuery(this.props.errorMessage);
    } else {
      this.props.searchHandler(val, saleType, propertyTypes.map(p => p.slug), this.props.errorMessage);
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
        <div className="row" key={k}>
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
                           onClick={(eve) => self.handleResultClick(eve, c.taxonomy, c.term, c.text, searchType, modifyType, _.get(c, 'url', null), history.push)}>
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

    let searchModalClasses = `${Lib.THEME_CLASSES_PREFIX}search-modal ${Lib.THEME_CLASSES_PREFIX}display`;
    if (!this.props.open) {
      searchModalClasses = `${Lib.THEME_CLASSES_PREFIX}search-modal ${Lib.THEME_CLASSES_PREFIX}hide`;
    }

    return (
      <div className={`modal ${searchModalClasses} ${Lib.THEME_CLASSES_PREFIX}location-modal`} onKeyDown={this.handleKeyPress.bind(this)}>
        <div className={`modal-dialog ${Lib.THEME_CLASSES_PREFIX}modal-dialog m-0`}>
          <div className={`modal-content border-0 ${Lib.THEME_CLASSES_PREFIX}modal-content`}>
            <div className={`modal-header ${Lib.THEME_CLASSES_PREFIX}modal-header`}>
              <div className="container">

                <div className="d-flex flex-row">
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
                {!resultsElements.length ?
                  (isFetching ?
                    <LoadingAccordion /> :
                    (errorMessage ?
                      <ErrorMessage message={errorMessage} />
                    :
                      <p className={`${Lib.THEME_CLASSES_PREFIX}gentle-error`}>Nothing to show. Please try a different search</p>)
                    ):
                  resultsElements
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
