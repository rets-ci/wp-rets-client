import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {
  receivePropertySingleResult,
  receivePropertySingleFetchingError,
  requestPropertySingleResult
} from '../../actions/index.jsx';
import ErrorMessageModal from '../ErrorMessageModal.jsx';
import HeaderPropertySingle from '../Headers/HeaderPropertySingle.jsx';
import get from 'lodash/get';
import Api from '../../containers/Api.jsx';
import LoadingAccordion from '../LoadingAccordion.jsx';
import {Lib} from '../../lib.jsx';
import Single from './Single.jsx';

import Util from 'app_root/components/Util.jsx';

const mapStateToProps = (state, ownProps) => {
  return {
    errorMessage: state.singleProperty.errorMessage,
    isFetching: state.singleProperty.isFetching,
    propertiesModalOpen: get(state, 'propertiesModal.open'),
    propertiesModalResultCount: get(state, 'propertiesModal.resultCount'),
    propertiesModalResultCountErrorMessage: get(state, 'propertiesModal.errorMessage'),
    propertiesModalResultCountIsFetching: get(state, 'propertiesModal.isFetching'),
    property: state.singleProperty.property,
    propertyTypeOptions: get(state, 'propertyTypeOptions.options'),
    propertySubTypes: state.singleProperty.propertySubTypes,
    saleTypesPanelOpen: get(state, 'headerSearch.saleTypesPanelOpen', false)
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    searchProperty: (id, propertyType) => {
      let url = 'https://' + bundle.elasticsearch_host + '/v3/search/advanced?size=1';
      let query = {
        "query": {
          "bool": {
            "must": [
              {"match":{"_id": id}}
            ]
          }
        }
      };
      dispatch(requestPropertySingleResult());
      Api.search(url, query, (err, data) => {
        if (err) {
          dispatch(receivePropertySingleFetchingError(err));
        } else if (!get(data, 'hits.hits[0]', null)) {
          dispatch(receivePropertySingleFetchingError('property not found'));
        } else {
          Api.getSearchPageMetadata(null, propertyType, (err, response) => {
            if (err) {
              dispatch(receivePropertySingleFetchingError(err));
            } else if (!response.aggregations) {
              dispatch(receivePropertySingleFetchingError('response aggregations not found'));
            } else {
              let propertySubtypes = get(response.aggregations, 'property_subtype_based_on_type.property_subtype_slugs.buckets', []).map(d => {
                let obj = {};
                obj['slug'] = d.key;
                obj['title'] = get(d, 'property_subtype_name.buckets[0].key');
                return obj;
              });
              dispatch(receivePropertySingleResult(get(data, 'hits.hits[0]._source'), propertySubtypes));
            }
          });
        }
      });
    }
  }
}

class SingleContainer extends Component {
  static propTypes = {
    agents: PropTypes.array,
    post: (props, propName, componentName) => {
      let errors = [];
      if (props.post && !props.post.post_id) { errors.push('Post ID not defined'); }
      return errors.length ? new Error(errors.join(', ')) : null; 
    },
    errorMessage: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    isFetching: PropTypes.bool.isRequired,
    property: PropTypes.object,
    propertySubTypes: PropTypes.array.isRequired,
    searchProperty: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (!get(this.props, 'post.post_id', null)) {
      console.log('property id is not defined');
    } else {
      this.props.searchProperty(this.props.post.post_id, this.props.post.wpp_listing_type);
    }
  }

  render() {
    let {
      agents,
      history,
      errorMessage,
      isFetching,
      openUserPanel,
      post: {
        wpp_location: location,
        post_id : id,
        wpp_listing_statuses: sale,
        wpp_listing_type: propertyType
      },
      propertyTypeOptions,
      propertiesModalOpen,
      propertiesModalResultCount,
      propertiesModalResultCountErrorMessage,
      propertiesModalResultCountIsFetching,
      property,
      propertySubTypes,
      saleTypesPanelOpen
    } = this.props;
    let propertyMeta = {};
    if (property) { propertyMeta = Util.transformPropertyMeta(property); }
    let searchType = Util.determineSearchType(propertyTypeOptions, propertyType, sale ? sale : null);
    return (
      <div>
        <div className={`${Lib.THEME_CLASSES_PREFIX}toolbar ${Lib.THEME_CLASSES_PREFIX}header-search`}>
          <HeaderPropertySingle
            historyPush={history.push}
            location={location}
            sale={sale}
            propertiesModalOpen={propertiesModalOpen}
            propertiesModalResultCount={propertiesModalResultCount}
            propertiesModalResultCountErrorMessage={propertiesModalResultCountErrorMessage}
            propertiesModalResultCountIsFetching={propertiesModalResultCountIsFetching}
            propertyType={propertyType}
            propertyTypeOptions={propertyTypeOptions}
            propertySubTypes={propertySubTypes}
            openUserPanel={openUserPanel}
            saleTypesPanelOpen={saleTypesPanelOpen}
            searchType={searchType}
          />
        </div>
        {!property ?
          (isFetching ?
            <LoadingAccordion containerHeight="600px" verticallyCentered={true} /> :
            (errorMessage ?
              <ErrorMessageModal errorMessage={errorMessage} />
            :
            <p>Request property id {id} could not be found</p>)
            ):
            <Single
              agents={agents}
              {...propertyMeta}
              all={property}
              saleType={sale}
              searchType={searchType}
            />
        }
      </div>
    );
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleContainer);