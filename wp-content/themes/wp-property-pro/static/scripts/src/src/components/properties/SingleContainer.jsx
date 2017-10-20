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
    property: state.singleProperty.property
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    searchProperty: (id) => {
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
          dispatch(receivePropertySingleResult(get(data, 'hits.hits[0]._source')));
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
      this.props.searchProperty(this.props.post.post_id);
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
        location: locationTerm,
        post_id : id,
        sale_type: saleType,
        search_type: searchType
      },
      property
    } = this.props;

    let propertyMeta = {};
    if (property) {
      propertyMeta = Util.transformPropertyMeta(property);
    }

    return (
      <div>
        <div className={`${Lib.THEME_CLASSES_PREFIX}toolbar ${Lib.THEME_CLASSES_PREFIX}header-search`}>
          <HeaderPropertySingle historyPush={history.push} locationTerm={locationTerm} saleType={saleType} searchType={searchType} openUserPanel={openUserPanel}/>
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
              locationTerm={locationTerm}
              saleType={saleType}
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