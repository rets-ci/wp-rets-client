import Api from '../../../containers/Api.jsx';
import {openFormModal} from '../../../actions/index.jsx';
import FormModalContainer from './FormModalContainer.jsx';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

const mapStateToProps = state => {
  return {
    formModalId: state.formModal.id,
    formModalOpen: state.formModal.open
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    closeFormModal: () => {
      dispatch(openFormModal(null, false));
    }
  }
};

class FormModals extends Component {

  static propTypes = {
    formModalId: PropTypes.string,
    formModalOpen: PropTypes.bool
  }

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: false,
      isFetching: false,
      jsonSchemaForm: {}
    };
  }


  schemaURL(id) {
    return `/wp-content/static/json-form-schemas/${id}.json`;
  }

  fetchSchema(url) {
    let self = this;
    this.setState({
      isFetching: true
    });
    Api.makeRequest({
      url: url
    }, (err, data) => {
      if (err) {
        self.setState({
          isFetching: false,
          errorMessage: err
        });
      } else {
        self.setState({
          errorMessage: false,
          isFetching: false,
          jsonSchemaForm: data
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    let {
      formModalId,
      formModalOpen
    } = nextProps;
    if (formModalOpen && formModalId !== this.props.formModalId) {
      this.fetchSchema(this.schemaURL(formModalId));
    }
  }
  
  render() {
    let {
      formModalId,
      formModalOpen
    } = this.props;

    let {
      errorMessage,
      isFetching,
      jsonSchemaForm
    } = this.state;
    if (formModalId && errorMessage) {
      console.log('failed to load modal: ', formModalId);
    }
    return (
      <div>
      {Object.keys(this.state.jsonSchemaForm).length ?
        <FormModalContainer
          title={jsonSchemaForm.title}
          id={formModalId}
          jsonSchemaForm={jsonSchemaForm}
          closeModal={() => this.props.closeFormModal()}
          open={formModalOpen}
        />
        : null
      }
      </div>
    );
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormModals);
