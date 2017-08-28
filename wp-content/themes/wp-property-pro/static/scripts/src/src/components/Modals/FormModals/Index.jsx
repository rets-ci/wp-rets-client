import Api from '../../../containers/Api.jsx';
import BootstrapModal from '../components/BootstrapModal.jsx';
import FormFetcher from '../../Forms/FormFetcher.jsx';
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
      showModal: false
    };
  }

  componentWillReceiveProps(nextProps) {
    let {
      formModalId,
      formModalOpen
    } = nextProps;
    if (formModalOpen && formModalId !== this.props.formModalId) {
      this.setState({
        showModal: true
      });
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
      {this.state.showModal ?
        <FormFetcher formId={formModalId}>
          <BootstrapModal
            id={Lib.FORM_MODAL_PREFIX_ACTION + formModalId}
            closeModal={() => this.props.closeFormModal()}
            open={formModalOpen}
          >
            <JSONSchemaFormContainer showConfirmation={true} />
          </BootstrapModal>
        </FormFetcher>
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
