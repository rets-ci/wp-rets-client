import BootstrapModal from '../components/BootstrapModal.jsx';
import Api from '../../../containers/Api.jsx';
import {openFormModal} from '../../../actions/index.jsx';
import JSONSchemaFormContainer from '../../Forms/JSONSchemaFormContainer.jsx';
import {Lib} from '../../../lib.jsx';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';

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
        // this resets the form modal state in case of an error, thus allowing the retriggering of fetchSchema in componentWillReceiveProps
        self.setState({
          isFetching: false,
          errorMessage: err
        });
        self.props.closeFormModal();
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
      console.log('error message: ', errorMessage)
    }
    return (
      <div>
      {Object.keys(this.state.jsonSchemaForm).length ?
        <BootstrapModal
          title={jsonSchemaForm.title}
          id={Lib.FORM_MODAL_PREFIX_ACTION + formModalId}
          jsonSchemaForm={jsonSchemaForm}
          closeModal={() => this.props.closeFormModal()}
          open={formModalOpen}
        >
          <JSONSchemaFormContainer jsonSchemaForm={jsonSchemaForm} />
        </BootstrapModal>
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
