import Api from '../../containers/Api.jsx';
import {setSearchResults} from '../../actions/index.jsx';
import LoadingIcon from '../LoadingIcon.jsx';
import {Lib} from '../../lib.jsx';
import Map from './Map.jsx';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import SearchResultListing from './SearchResultListing.jsx';
import _ from 'lodash';

const mapStateToProps = state => {
  return {
    query: _.get(state, 'searchResults.query', []),
    displayedResults: _.get(state, 'searchResults.displayedResults', []),
    results: _.get(state, 'searchResults.searchResults', []),
    resultsTotal: _.get(state, 'searchResults.totalProps', 0)
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    doSearchWithParams: (params) => {
      let {
        from,
        tax,
        term,
        saleType,
        propertyTypes,
        locationFilter,
        geoCoordinates
      } = params;
      let pt = propertyTypes.split(Lib.STRING_ARRAY_DELIMITER);
      let searchParams = {
        bottomRight: geoCoordinates ? geoCoordinates.bottomRight : null,
        from: from,
        locationFilter: locationFilter || false,
        propertyTypes: pt,
        saleType: saleType,
        size: Lib.PROPERTY_PER_PAGE,
        tax: tax,
        term: term,
        topLeft: geoCoordinates ? geoCoordinates.topLeft : null
      };
      let query = Api.createESSearchQuery(searchParams);
      Api.search(query, function (response) {
        if (_.get(response, 'hits.total', null)) {
          dispatch(setSearchResults(query, _.get(response, 'hits.hits', []), _.get(response, 'hits.total', 0), false));
        } else {
          console.log('query with params returned no data');
        }
      });
    },
    doSearchWithQuery: (query, append) => {
      Api.search(query, response => {
        if (_.get(response, 'hits.total', null)) {
          dispatch(setSearchResults(query, _.get(response, 'hits.hits', []), _.get(response, 'hits.total', 0), append));
        } else {
          console.log('query with standard query returned no data');
        }
      });
    }
  };
};

class MapSearchResults extends Component {
  static propTypes = {
    doSearchWithParams: PropTypes.func.isRequired,
    doSearchWithQuery: PropTypes.func.isRequired,
    params: PropTypes.object,
    results: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.displayedProperties = [];
  }

  componentDidMount() {
    // TODO temporary comment this, until done with elastic search API
    // let saleType = this.props.params.sale;
    // let tax = this.props.params.tax;
    // let term = this.props.params.term;

    let saleType = this.props.location.query['wpp_search[sale_type]'];
    let tax = this.props.location.query['wpp_search[tax]'];
    let term = this.props.location.query['wpp_search[term]'];

    let propertyTypes = this.props.location.query['wpp_search[property_types]'];
    this.props.doSearchWithParams({
      tax: tax,
      term: term,
      saleType: saleType,
      propertyTypes: propertyTypes
    });
  }

  seeMoreHandler() {
    let modifiedQuery = this.props.query;
    modifiedQuery.from = this.props.displayedResults.length;
    this.props.doSearchWithQuery(modifiedQuery, true);
  }

  render() {
    let {
      sale,
      tax,
      term
    } = this.props.params;
    let {
      displayedResults,
      results
    } = this.props;
    let propertyTypes = this.props.location.query['wpp_search[property_types]'];
    return (
      <div>
        {displayedResults.length ?
          <div>
            <section className="container-fluid search-map-container">
              <div className="listing-map">
                <div className="caption">
           	   	  <span>Only showing {displayedResults.length} listings. Zoom in, or use filters to narrow your search.</span>
           	    </div>
                <Map properties={displayedResults} searchByCoordinates={(locationFilter, geoCoordinates) => this.props.doSearchWithParams({tax: tax, term: term, saleType: sale, propertyTypes: propertyTypes, locationFilter: locationFilter, geoCoordinates: geoCoordinates})} />
              </div>
              <div className="listing-sidebar">
              	<div className="headtitle">
               	  <h1>{term} Homes for {sale}</h1>
               	  <p>There are {this.props.resultsTotal} homes for sale that are priced between $250,000 and $500,00 with three to five betweens and two to three bathrooms.</p>
                </div>
                <SearchResultListing allowPagination={this.props.resultsTotal > this.props.displayedResults.length} properties={displayedResults} seeMoreHandler={this.seeMoreHandler.bind(this)} />
              </div>
            </section>
          </div>
        : <LoadingIcon style={{position: 'absolute', left: '50%', top: '30%'}} />}
      </div>
    )
  }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MapSearchResults);
