import React from 'react'
import {connect} from 'react-redux'
import Api from './Api.jsx';

const mapStateToProps = (state) => {
    return {
        currentState: state
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        searchHandler: (state, event) => {

            if (event.key !== 'Enter')
                return false;

            let searchParams = {
                locationCountry: event.target.value,
                saleType: 'Rent',
                locationFilter: false
            };

            Api.search(searchParams, function(response){

                let map = state.mapState.map;

                Api.refreshMapMarkers(map, response);
            });
        }
    }
};

const SearchContent = function ({currentState, searchHandler}) {

    return (
        <div>
            <input type="text" onKeyUp={searchHandler.bind(this, currentState)}/>
        </div>
    )
};

const Search = connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchContent);

export default Search