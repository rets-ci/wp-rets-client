import React, {Component} from 'react';
import {Lib} from '../../../lib.jsx';
import PropTypes from 'prop-types';
import JSONSchemaFormContainer from '../../Forms/JSONSchemaFormContainer.jsx';

let id = 'Buy';
let formId = 'formModal-' + id;

class Buy extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props);
    this.state = {
      showForm: false
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.open !== this.props.open) {
      this.toggleModal(nextProps.open);
    }
  }

  toggleModal(open) {
    if (open) {
     jQuery('#' + formId).modal('show'); 
     this.setState({
       showForm: true
     });
    } else {
      jQuery('#' + formId).modal('hide'); 
      this.setState({
       showForm: false
     });
    }
  }

  componentDidMount() {
    this.toggleModal(this.props.open);
    let self = this;
    jQuery('#' + formId).on('hidden.bs.modal', e => {
      self.props.closeModal();
    });
  }
  
  render() {
    let {
      showForm
    } = this.state;
    return (
      <div data-keyboard="true" className={`modal ${Lib.THEME_CLASSES_PREFIX}form-modal`} id={formId} tabIndex="-1" role="dialog" aria-labelledby={formId} aria-hidden="true" ref={(r) => this.modalRef = r}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title mx-auto" id="exampleModalLabel">{id}</h5>
              <button type="button" className="close" aria-label="Close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {showForm &&
                <JSONSchemaFormContainer id={id} />
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Buy;