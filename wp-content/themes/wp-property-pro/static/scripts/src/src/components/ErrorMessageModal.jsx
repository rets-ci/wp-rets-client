import BootstrapModal from './Modals/components/BootstrapModal.jsx';
import {Lib} from '../lib.jsx';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

class ErrorMessageModal extends Component {
  static propTypes = {
    errorMessage: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  closeFormModal = () => {
    this.setState({
      open: false
    });
  }

  componentDidMount() {
    if (this.props.errorMessage) {
      this.setState({open: true});
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errorMessage && this.props.errorMessage !== nextProps.errorMessage) {
      this.setState({open: true});
    }
  }

  render() {
    let {
      open
    } = this.state;
    let {
      errorMessage
    } = this.props;
    let modalFooter = (
      <button type="button" className="btn btn-primary propertypro-primary-button" data-dismiss="modal" onClick={() => window.location.reload()}>Refresh</button>
    );
    return (
      <BootstrapModal
        alignHead="left"
        id="error-message-modal"
        closeModal={() => console.log('close')}
        title="Error modal"
        modalFooter={modalFooter}
        open={open}
        >
        <p>{errorMessage}</p>
      </BootstrapModal>
    )
  }
}

export default ErrorMessageModal;