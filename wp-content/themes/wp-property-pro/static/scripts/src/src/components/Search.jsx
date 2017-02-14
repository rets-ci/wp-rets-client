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

const SearchContent = function ({currentState, searchHandler, searchProps, filterTerms, searchItemClick, doSearch, clearTermFilter, options}) {

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

    let select_options_content = [];
    let select_options_array = [];

    for (let key in options) {

        if (options[key] === false)
            continue;

        let option_array = _.split(key, Lib.STRING_ARRAY_DELIMITER);
        let label = _.slice(option_array, 0, 1);
        select_options_array.push(_.slice(option_array, 1).join(Lib.STRING_ARRAY_DELIMITER))
        select_options_content.push(<option
            value={_.slice(option_array, 1).join(Lib.STRING_ARRAY_DELIMITER)}>{label}</option>);
    }

    let search_types;

    if (select_options_content.length > 1)
        search_types = (
            <select id={Lib.THEME_PREFIX + "search_type"}>
                {select_options_content}
            </select>
        );
    else if (select_options_content.length === 1)
        search_types = (
            <input type="hidden" id={Lib.THEME_PREFIX + "search_type"} value={select_options_array[0]}/>
        );

    if (!search_types)
        return (
            <div></div>
        );

    return (
        <div>
            {search_types}
            <input type="text" onKeyUp={searchHandler.bind(this, currentState)}
                   id={Lib.THEME_PREFIX + "search-input"}/>
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
