import React, {Component} from 'react';
import {Lib} from '../../../lib.jsx';
import PropTypes from 'prop-types';
import JSONSchemaFormContainer from '../../Forms/JSONSchemaFormContainer.jsx';


class FormModalContainer extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    title: PropTypes.string,
    id: PropTypes.string,
    jsonSchemaForm: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props);
    this.state = {
      showForm: false
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.open !== this.props.open) {  
      this.toggleModal(this.formId(this.props.id), nextProps.open);
    }
  }

  formId(id) {
    return Lib.FORM_MODAL_PREFIX_ACTION + id;
  }

  toggleModal(formId, open) {
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
    let formId = this.formId(this.props.id);
    this.toggleModal(formId, this.props.open);
    let self = this;
    jQuery('#' + formId).on('hidden.bs.modal', e => {
      self.props.closeModal();
    });
  }
  
  render() {
    let {
      showForm
    } = this.state;
    let {
      title,
      id,
      jsonSchemaForm
    } = this.props;
    return (
      <div data-keyboard="true" className={`modal ${Lib.THEME_CLASSES_PREFIX}modal ${Lib.THEME_CLASSES_PREFIX}form-modal`} id={this.formId(this.props.id)} tabIndex="-1" role="dialog" aria-labelledby={this.formId(this.props.id)} aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title mx-auto" id="modalLabel">{title}</h5>
              <button type="button" className="close" aria-label="Close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {showForm &&
                <JSONSchemaFormContainer jsonSchemaForm={jsonSchemaForm} />
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default FormModalContainer;