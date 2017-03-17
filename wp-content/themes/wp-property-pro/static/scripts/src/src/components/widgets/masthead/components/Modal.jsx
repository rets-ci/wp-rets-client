import {openModal, setSearchProps} from '../../../../actions/index.jsx';
import Api from '../../../../containers/Api.jsx';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {Lib} from '../../../../lib.jsx';
import _ from 'lodash';

const mapStateToProps = (state) => {
  return {
    open: state.modal ? state.modal.openModal : false,
    searchResults: _.get(state, 'searchPropsState.searchProps', []),
    searchType: _.get(state, 'searchType.searchType', ''),
    saleType: _.get(state, 'searchType.saleType', ''),
    propertyTypes: _.get(state, 'searchType.propertyTypes', '')
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
      closeModal: () => {
        dispatch(openModal(false));
      },

      searchHandler: (term) => {
        let searchParams = {
          term: term
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
      // browserHistory.push(`/${saleType}/${tax}/${term}/?wpp_search[sale_type]=${saleType}&wpp_search[property_types]=${propertyTypes}&_taxonomy=${tax}&_term=${term}`);

      if(url === null){
        // Properties results page
        browserHistory.push(`/${_.get(wpp, 'instance.settings.configuration.base_slug')}?wpp_search[tax]=${tax}&wpp_search[term]=${term}&wpp_search[sale_type]=${saleType}&wpp_search[property_types]=${propertyTypes}&_taxonomy=${tax}&_term=${term}`);
      }else{
        // Single property page
        browserHistory.push(url);
      }

      this.props.closeModal();
    }

    handleSearchValueChange(eve) {
      let val = eve.target.value;
      this.setState({searchValue: val});

      if(!val || val.length < Lib.MIN_SEARCH_KEY_LENGTH){
        this.props.topQuery();
      }else{
        this.props.searchHandler(val);
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
                <div key={k} className={Lib.THEME_CLASSES_PREFIX+"search-result-group"}>
                    <div key={k} className={Lib.THEME_CLASSES_PREFIX+"search-title"}>
                        <div className="container">
                            <h4>{s.text}</h4>
                        </div>
                    </div>
                    {s.children.length ?
                        <ol>
                            {s.children.map((c, i) =>
                                <li key={i}>
                                    <a href="#"
                                       onClick={(eve) => self.handleResultClick.bind(this)(eve, c.taxonomy, c.text, searchType, saleType, propertyTypes, _.get(c, 'url', null))}>
                                        <div className="container">{c.text}</div>
                                    </a>
                                </li>
                            )}
                        </ol>
                        : null}
                </div>
            )
        });

      let placeholder = 'Address, City, Zip, or Neighborhood.';
      let inputClasses = 'form-control';
      if(window.innerWidth < Lib.MOBILE_WIDTH){
        placeholder = 'Address, City, Zip.';
        inputClasses = `form-control ${Lib.THEME_CLASSES_PREFIX}withPadding`
      }

        return (
            <div className={Lib.THEME_CLASSES_PREFIX+"search-modal"} onKeyDown={this.handleKeyPress.bind(this)} style={{display: this.props.open ? 'block' : 'none'}}>
                <a href="#" className={Lib.THEME_CLASSES_PREFIX+"close-panel"} onClick={(e) => {e.preventDefault(); this.props.closeModal();}}>
                    <i className="fa fa-times"></i>
                </a>
                <form method="get" className="form-inline">
                    <div className="container">
                        <i className="fa fa-search"></i>
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
                      {
                        window.innerWidth < Lib.MOBILE_WIDTH
                          ? null
                          : <button type="button" className="btn btn-primary">Search</button>
                      }
                    </div>
                </form>
                <div className={Lib.THEME_CLASSES_PREFIX+"search-modal-box"}>
                    {resultsElements}
                </div>
            </div>
        );
    }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Modal);
