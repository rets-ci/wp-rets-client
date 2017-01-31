import React from 'react'
import {connect} from 'react-redux'
import Api from './Api.jsx';
import SearchResultRow from './SearchResultRow.jsx';
import {setProps} from '../actions/index.jsx';

const mapStateToProps = (state) => {
    return {
        currentState: state,
        props: state.propsState.props
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        searchHandler: (state, event) => {

            if (event.key === 'Enter')
                return false;

            let searchParams = {
                term: event.target.value
            };

            Api.selectQuery(searchParams,
                function (rows) {

                // alert(rows.length);
                    jQuery('.search-results').empty();
                        dispatch(setProps(rows));


                    // if (response.regular[0].options.length) {
                    //     for (let i in response.regular[0].options) {
                    //         let option = response.regular[0].options[i];
                    //
                    //         if (!option.payload)
                    //             continue;
                    //
                    //         console.log(response.hits.hits[i]);
                    //     }
                    // }

                    // jQuery('.search-results').append()
                }
                //     function (response) {
                //
                //     if (typeof response.regular == 'undefined')
                //         return;
                //
                //     jQuery('.search-results').empty();
                //
                //     if (response.regular[0].options.length) {
                //         for (let i in response.regular[0].options) {
                //             let option = response.regular[0].options[i];
                //
                //             if (!option.payload)
                //                 continue;
                //
                //             console.log(response.hits.hits[i]);
                //         }
                //     }
                //
                //     // jQuery('.search-results').append()
                // }
            );
        }
    }
};

const SearchContent = function ({currentState, searchHandler, props}) {

    let searchResults = props.map((prop) => {

        return (<SearchResultRow prop={prop} />)
    });

    return (
        <div>
            <input type="text" onKeyUp={searchHandler.bind(this, currentState)}/>
            <ul id="search-result">
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