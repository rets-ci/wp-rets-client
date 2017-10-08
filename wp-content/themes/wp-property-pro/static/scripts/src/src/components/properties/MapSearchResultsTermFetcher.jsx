import Api from '../../containers/Api.jsx';
import HeaderSearch from '../Headers/HeaderSearch.jsx';
import {Lib} from '../../lib.jsx';
import React, {Component} from 'react';
import get from 'lodash/get';
import MapSearchResults from './MapSearchResults.jsx';
import Util from '../Util.jsx';

class MapSearchResultsTermFetcher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQueryParams: {}
    };
  }
  componentWillMount() {
    let searchQueryParamsCollection = Util.URLSearchParse('search', window.location.href);
    let termDetails = Util.reddoorTermDetailsFromSearchParam(searchQueryParamsCollection);
    this.fetchTermNames(termDetails, (err, data) => {
      if (err) {
        console.log('some error', err);
      } else {
        let searchQueryParamsTerms = [];
        termDetails.forEach(d => {
          let {
            term,
            slug,
            tax
          } = d;
          let termText = get(data, 'aggregations[' + slug + '.inside.buckets[0].key');
          if (!termText) {
            console.log(`the term ${termText} was not found in ES result`);
          } else {
            // now that we have the terms, remove them from the collection
            searchQueryParamsCollection = searchQueryParamsCollection.filter(d => d.key !== term);
            searchQueryParamsTerms.push({
              prefix: term,
              slug: slug,
              tax: tax,
              text: termText
            });
          }
        });
        let searchQueryObject = Util.searchCollectionToObject(searchQueryParamsCollection);
        searchQueryObject = Util.reddoorSearchFormatObject(searchQueryObject);
        searchQueryObject['term'] = searchQueryParamsTerms;
        this.setState({
          searchQueryParams: searchQueryObject
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    console.log('search results TermFetcher componentWillReceiveProps');
  }

  fetchTermNames = (termDetails, callback) => {
    let url = 'https://' + bundle.elasticsearch_host + '/v3/search/advanced?size=0';
    let query = {};
    // TODO: you still have to handle school scenario
    query.aggs = {};
    termDetails.forEach(t => {
      let {
        slug,
        term
      } = t;
      query.aggs[slug] = {
        "filter": {
          "term": {
            [`tax_input.wpp_location.wpp_location_${term}.slug`]: slug
          }
        },
        "aggs": {
          "inside": {
            "terms": {
              "field": `tax_input.wpp_location.wpp_location_${term}.name.raw`,
              "size": 1
            }
          }
        }
      }
    });
    Api.search(url, query, callback);
  }

  render() {
    let {
      history,
      openUserPanel,
    } = this.props;

    let {
      searchQueryParams
    } = this.state;
    return (
      <div className="h-100">
        {Object.keys(searchQueryParams).length ?
          <div className="h-100">
            <section className={`${Lib.THEME_CLASSES_PREFIX}toolbar ${Lib.THEME_CLASSES_PREFIX}header-search`}>
              <HeaderSearch historyPush={history.push} openUserPanel={openUserPanel} searchFilters={searchQueryParams} />
            </section>
            <MapSearchResults
              {...this.props}
              searchQueryParams={searchQueryParams}
            />
          </div>
        : null}
      </div>
    )
  }
};

export default MapSearchResultsTermFetcher;