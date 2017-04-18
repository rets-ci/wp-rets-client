import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import URL from 'urijs';
import {openLocationModal, setSearchProps} from '../../../../actions/index.jsx';
import Api from '../../../../containers/Api.jsx';
import {Lib} from '../../../../lib.jsx';
import _ from 'lodash';

const mapStateToProps = (state) => {
  return {
    open: state.locationModal ? state.locationModal.open : false,
    searchResults: _.get(state, 'searchPropsState.searchProps', []),
    searchType: _.get(state, 'searchType.searchType', ''),
    saleType: _.get(state, 'searchType.saleType', ''),
    propertyTypes: _.get(state, 'searchType.propertyTypes', '')
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    closeModal: () => {
      dispatch(openLocationModal(false));
    },

    searchHandler: (term, saleType, propertyTypes) => {

      let searchParams = {
        term: term,
        saleType: saleType,
        propertyTypes: propertyTypes
      };
      Api.autocompleteQuery(searchParams,
        function (rows) {
          dispatch(setSearchProps(rows));
        }
      );
    },
    topQuery: () => {
      Api.topQuery({
          size: Lib.TOP_AGGREGATIONS_COUNT
        },
        function (rows) {
          dispatch(setSearchProps(rows));
        }
      );
    }
  };
};

class Modal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchValue: ''
    };
    // Set default values
    this.props.topQuery();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.open) {
      this.searchInput.focus();
    }
  }

  handleClose(eve) {
    eve.preventDefault();
    this.props.closeModal();
  }

  handleResultClick(eve, tax, term, searchType, saleType, propertyTypes, url) {
    eve.preventDefault();

    // TODO temporary comment this, until done with elastic search API

    if (url === null) {
      // Properties results page
      let url = new URL();
      url.resource(_.get(wpp, 'instance.settings.configuration.base_slug'));
      url.setSearch({
        [Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX + '[term][' + tax + ']']: term,
        [Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX + '[property_types]']: propertyTypes,
        [Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX + '[sale_type]']: saleType
      });
      browserHistory.push('/' + decodeURIComponent(url.pathname() + url.search()));
    } else {
      // Single property page
      browserHistory.push(url);
    }

    this.props.closeModal();
  }

  handleSearchValueChange(eve) {
    let val = eve.target.value;
    this.setState({searchValue: val});

    if (!val || val.length < Lib.MIN_SEARCH_KEY_LENGTH) {
      this.props.topQuery();
    } else {
      this.props.searchHandler(val, _.get(this.props, 'saleType', ''), _.get(this.props, 'propertyTypes', ''));
    }
  }

  handleKeyPress(event) {
    if (event.keyCode === 27) {
      // ESC key
      this.props.closeModal();
    }
  }

  render() {
    let {
      searchResults,
      searchType,
      saleType,
      propertyTypes
    } = this.props;
    let self = this;
    let resultsElements = searchResults.map((s, k) => {
      return (
        <div className="row">
          <div key={k} className="list-group text-left">
            <div key={k} className={`list-group-item ${Lib.THEME_CLASSES_PREFIX}search-result-group border-0 p-0`}>
              <h4 className={Lib.THEME_CLASSES_PREFIX + "search-title"}>{s.text}</h4>
            </div>
            {s.children.length ?
              <ol>
                {s.children.map((c, i) =>
                  <li key={i}>
                    <a href="#"
                       onClick={(eve) => self.handleResultClick.bind(this)(eve, c.taxonomy, c.term, searchType, saleType, propertyTypes, _.get(c, 'url', null))}>
                      {c.text}
                    </a>
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
      placeholder = 'Address, City, Zip.';
      inputClasses = `form-control ${Lib.THEME_CLASSES_PREFIX}withPadding`
    }

    let searchModalClasses = `${Lib.THEME_CLASSES_PREFIX}search-modal ${Lib.THEME_CLASSES_PREFIX}display`;
    if (!this.props.open) {
      searchModalClasses = `${Lib.THEME_CLASSES_PREFIX}search-modal ${Lib.THEME_CLASSES_PREFIX}hide`;
    }

    return (
      <div className={"modal " + searchModalClasses} onKeyDown={this.handleKeyPress.bind(this)}>
        <div className={`modal-dialog ${Lib.THEME_CLASSES_PREFIX}modal-dialog m-0`}>
          <div className={`modal-content ${Lib.THEME_CLASSES_PREFIX}modal-content`}>
            <div className={`modal-header ${Lib.THEME_CLASSES_PREFIX}modal-header`}>
              <div className="container">
                <div className="row">
                  <form method="get" className="form-inline">
                    <div className="form-group">
                      <label className="sr-only">Search</label>
                      <i className="fa fa-search"></i>
                    </div>
                    <div className="form-group">
                      <label className="sr-only">Input</label>
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
                    {
                      window.innerWidth < Lib.MOBILE_WIDTH
                        ? null
                        : <button type="button"
                                  className={`btn btn-primary ${Lib.THEME_CLASSES_PREFIX}button-search-submit`}>
                          Search</button>
                    }
                  </form>
                </div>
              </div>
              <button type="button" className={`close ${Lib.THEME_CLASSES_PREFIX}close-panel my-auto`} onClick={(e) => {
                e.preventDefault();
                this.props.closeModal();
              }} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className={`modal-body ${Lib.THEME_CLASSES_PREFIX}modal-body`}>
              <div className={`container ${Lib.THEME_CLASSES_PREFIX}search-modal-box`}>
                {resultsElements}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
      ;
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Modal);
