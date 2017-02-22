import Api from '../../containers/Api.jsx';
import {setMapProps} from '../../actions/index.jsx';
import {Lib} from '../../lib.jsx'
import Map from './Map.jsx';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import SearchResultListing from './SearchResultListing.jsx';
import Toppanel from './Toppanel.jsx';
import _ from 'lodash';

const mapStateToProps = (state) => {
  return {
    results: _.get(state, 'mapPropsState.mapProps', [])
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    doSearch: (tax, term, saleType, propertyTypes) => {
      let pt = propertyTypes.split(Lib.STRING_ARRAY_DELIMITER);
      let params = {
        propertyTypes: pt,
        saleType: saleType,
        size: 10,
        tax: tax,
        term: term
      };
      Api.search(params, function (response) {
        dispatch(setMapProps(response.hits.hits.length ? response.hits.hits : []));
      });
    }
  };
};

class MapSearchResults extends Component {
  static propTypes = {
    doSearch: PropTypes.func.isRequired,
    results: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    let saleType = this.props.params.sale;
    let tax = this.props.params.tax;
    let term = this.props.params.term;
    let propertyTypes = this.props.location.query['wpp_search[property_types]'];
    this.props.doSearch(tax, term, saleType, propertyTypes);
  }

  render() {
    let {
      sale,
      term
    } = this.props.params;
    return (
      <div>
        {this.props.results.length ?
          <div>
            <Toppanel searchTerm={term} />
            <section className="container-fluid search-map-container">
              <div className="listing-map">
                <div className="caption">
           	   	  <span>Only showing {this.props.results.length} listings. Zoom in, or use filters to narrow your search.</span>
           	    </div>
                <Map properties={this.props.results} />
              </div>
              <div className="listing-sidebar">
              	<div className="headtitle">
               	  <h1>{term} Homes for {sale}</h1>
               	  <p>There are 250 homes for sale that are priced between $250,000 and $500,00 with three to five betweens and two to three bathrooms.</p>
                </div>
                <SearchResultListing properties={this.props.results} />
              </div>
            </section>
          </div>
        : <p>Loading results...</p>}
      </div>
    )
  }
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MapSearchResults);
