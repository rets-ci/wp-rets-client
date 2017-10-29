import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import ErrorMessageModal from '../ErrorMessageModal.jsx';
import Api from '../../containers/Api.jsx';
import LoadingAccordion from '../LoadingAccordion.jsx';
import {Lib} from '../../lib.jsx';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import MapSearchResults from './MapSearchResults.jsx';

import Util from 'app_root/components/Util.jsx';

class MapSearchResultsContainer extends Component {
  static propTypes = {
  }
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
    this.currentURL;
  }

  componentWillMount() {
    //run the query
    let path = this.props.history.location.pathname;
    this.currentURL = path;
    this.fetchData(path);
  }

  componentWillReceiveProps(nextProps) {
    
    // decide whether to re-fetch meta data
    let currentPathCollection = Util.URLSearchParse('search', this.currentURL);
    let currentSearchQueryObject = Util.searchCollectionToObject(currentPathCollection);
    let currentTermDetails = Util.reddoorTermDetailsFromSearchParam(currentPathCollection);

    let nextPathCollection = Util.URLSearchParse('search', nextProps.history.location.pathname);
    let nextSearchQueryObject = Util.searchCollectionToObject(nextPathCollection);
    let nextTermDetails = Util.reddoorTermDetailsFromSearchParam(nextPathCollection);
    if (!isEqual(currentTermDetails, nextTermDetails) || !isEqual(currentSearchQueryObject['property_type'], nextSearchQueryObject['property_type'])) {
      this.fetchData(nextProps.history.location.pathname)
    }
    this.currentURL = nextProps.history.location.pathname;
  }

  fetchData = (path) => {
    let searchQueryParamsCollection = Util.URLSearchParse('search', path);
    let searchQueryObject = Util.searchCollectionToObject(searchQueryParamsCollection);
    let termDetails = Util.reddoorTermDetailsFromSearchParam(searchQueryParamsCollection);
    let term = termDetails;
    let propertyType = searchQueryObject['property_type'] = searchQueryObject.property_type[0];
    Api.getSearchPageMetadata(term, propertyType, (err, response) => {
      if (err) {
        //TODO: handle the error
        console.log('error thrown')
      }
      let termDetails = [];
      if (response.aggregations) {
        termDetails = term.map(d => {
          let termText = get(response, 'aggregations[' + d.slug + '.inside.buckets[0].key');
          return {
            ...d,
            text: termText
          }
        });
        // property subtypes
        let propertySubtypes = get(response.aggregations, 'property_subtype_based_on_type.property_subtype_slugs.buckets', []).map(d => {
          let obj = {};
          obj['slug'] = d.key;
          obj['title'] = get(d, 'property_subtype_name.buckets[0].key');
          return obj;
        });
        let data = {
          propertySubtypes: propertySubtypes,
          queryDefaults: {
            property_subtype: propertySubtypes.map(d => d.slug),
            sale_type: ['Rent', 'Sale']
          },
          termDetails
        };
        this.setState({
          data
        });
      }
    });
  }

  render() {
    let {
      agents,
      history
    } = this.props;
    let {
      data
    } = this.state;
    return Object.keys(data).length ?
      <div className="h-100">
        <MapSearchResults
          agents={agents}
          {...data}
          history={history}
          currentPathname={history.location.pathname}
        />
      </div>
    : null
  }

};

export default MapSearchResultsContainer;