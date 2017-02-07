import React from 'react'
import {connect} from 'react-redux'
import Api from '../containers/Api.jsx';
import SearchResultRow from './SearchResultRow.jsx';
import FilterTerm from './filterTerm.jsx';
import {setSearchProps, setFilterTerms, setMapProps} from '../actions/index.jsx';

const mapStateToProps = (state, history) => {
    return {
        currentState: state,
        searchProps: state.searchPropsState.searchProps,
        filterTerms: state.filterTermsState.filterTerms,
        history: history
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        searchHandler: (state, event) => {

            let searchParams = {
                term: event.target.value
            };

            Api.selectQuery(searchParams,
                function (rows) {
                    jQuery('.search-results').empty();
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

            dispatch(setFilterTerms(terms));
        },
        clearTermFilter: () => {

            dispatch(setFilterTerms([]));
        },
        doSearch: () => {

            let tax = jQuery('.search-term').attr('id').replace('tax-', '');
            let term = jQuery('.search-term span').text();
            let saleType = jQuery('#search_type').val();

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

    if (typeof filterTerms == 'undefined' || !filterTerms.length)
        searchResults = searchProps.map((prop) => {

            return (<SearchResultRow prop={prop} clickHandler={searchItemClick} filterTerms={filterTerms}/>)
        });
    else {
        jQuery('#search-input').val('');
    }

    let filterTermsList = [];
    if (typeof filterTerms != 'undefined')
        filterTermsList = filterTerms.map((item) => {
            return (<FilterTerm term={item.term} tax={item.tax} clearTermFilter={clearTermFilter}/>)
        });

    let style = {
        "overflow-y": "scroll",
        "background": "grey",
        "height": "100px",
        "width": "200px",
    };

    return (
        <div>
            <select id="search_type">
                <option value="Rent" selected="selected">Rent</option>
                <option value="Sale">Buy</option>
            </select>
            <input type="text" onKeyUp={searchHandler.bind(this, currentState)} id="search-input"/>
            <a href="javascript:;" onClick={doSearch}>Search</a>
            <div id="filter-block">
                {filterTermsList}
            </div>
            <ul id="search-result" style={style}>
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