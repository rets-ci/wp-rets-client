import React from 'react'
import {connect} from 'react-redux'
import Api from '../containers/Api.jsx';
import SearchResultRow from './SearchResultRow.jsx';
import {setSearchProps} from '../actions/index.jsx';
import {setMapProps} from '../actions/index.jsx';

const mapStateToProps = (state, history) => {
    return {
        currentState: state,
        searchProps: state.searchPropsState.searchProps,
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
        searchItemClick: (title, url, tax, term) => {
            history.pushState({}, title, url);
            jQuery('title').text(title);

            let params = {
                tax: tax,
                term: term,
                saleType: jQuery('#search_type').val()
            };

            Api.search(params, function(response){
                dispatch(setMapProps(response));
            });
        }
    }
};

const SearchContent = function ({currentState, searchHandler, searchProps, searchItemClick}) {

    let searchResults = searchProps.map((prop) => {

        return (<SearchResultRow prop={prop} clickHandler={searchItemClick}/>)
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
            <input type="text" onKeyUp={searchHandler.bind(this, currentState)}/>
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