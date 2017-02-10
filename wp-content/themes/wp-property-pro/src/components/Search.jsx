import React from 'react'
import {connect} from 'react-redux'
import Api from '../containers/Api.jsx';
import SearchResultRow from './SearchResultRow.jsx';
import FilterTerm from './filterTerm.jsx';
import {setSearchProps, setFilterTerms, setMapProps} from '../actions/index.jsx';
import {Lib} from '../lib.jsx'
import _ from 'lodash'

const mapStateToProps = (state, history) => {
    return {
        currentState: state,
        searchProps: _.get(state, 'searchPropsState.searchProps', []),
        filterTerms: _.get(state, 'filterTermsState.filterTerms', []),
        history: history
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        searchHandler: (state, event) => {

            let searchParams = {
                term: _.get(event, 'target.value', '')
            };

            Api.selectQuery(searchParams,
                function (rows) {
                    dispatch(setSearchProps(rows));
                }
            );
        },
        searchItemClick: (tax, term, filterTerms) => {

            let terms = filterTerms || [];
            terms.push({
                tax: tax,
                term: term
            });

            jQuery('#' + Lib.THEME_PREFIX + 'search-input').val('');

            dispatch(setFilterTerms(terms));
        },
        clearTermFilter: () => {

            dispatch(setFilterTerms([]));
        },
        doSearch: () => {

            let tax = jQuery('.search-term').attr('data-tax');
            let term = jQuery('.search-term span').text();
            let saleType = jQuery('#' + Lib.THEME_PREFIX + 'search_type').val();

            let title = tax + ' - ' + term;
            let url = '/' + saleType + '/' + tax + '/' + term;

            history.pushState({}, title, url);
            jQuery('title').text(title);

            let params = {
                tax: tax,
                term: term,
                saleType: saleType
            };

            Api.search(params, function (response) {
                dispatch(setMapProps(response));
            });
        }
    }
};

const SearchContent = function ({currentState, searchHandler, searchProps, filterTerms, searchItemClick, doSearch, clearTermFilter}) {

    let searchResults = [];
    let filterTermsList = [];

    if (filterTerms.length) {
      filterTermsList = filterTerms.map((item) => {
        return (<FilterTerm term={item.term} tax={item.tax} clearTermFilter={clearTermFilter}/>)
      });
    } else {
      searchResults = searchProps.map((prop) => {
        return (<SearchResultRow prop={prop} clickHandler={searchItemClick} filterTerms={filterTerms}/>)
      });
    }

    return (
        <div>
            <select id={Lib.THEME_PREFIX + "search_type"}>
                <option value="Rent" selected="selected">Rent</option>
                <option value="Sale">Buy</option>
            </select>
            <input type="text" onKeyUp={searchHandler.bind(this, currentState)} id={Lib.THEME_PREFIX + "search-input"}/>
            <a href="javascript:;" onClick={doSearch}>Search</a>
            <div id={Lib.THEME_PREFIX + "filter-block"}>
                {filterTermsList}
            </div>
            <ul id={Lib.THEME_PREFIX + "search-result"}>
                {searchResults}
            </ul>
        </div>
    )
};

const Search = connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchContent);

export default Search
