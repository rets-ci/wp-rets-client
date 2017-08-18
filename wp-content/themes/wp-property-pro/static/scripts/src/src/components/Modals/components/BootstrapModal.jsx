import React, {Component} from 'react';
import {Lib} from '../../../lib.jsx';
import PropTypes from 'prop-types';

class BootstrapModal extends Component {
  static propTypes = {
    classes: PropTypes.array,
    closeModal: PropTypes.func.isRequired,
    title: PropTypes.string,
    id: PropTypes.string,
    jsonSchemaForm: PropTypes.object
  }

  static defaultProps = {
    classes: []
  }
  
  constructor(props) {
    super(props);
    this.state = {
      showBody: false
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.open !== this.props.open) {  
      this.toggleModal(this.props.id, nextProps.open);
    }
  }

  toggleModal(formId, open) {
    if (open) {
     jQuery('#' + formId).modal('show'); 
     this.setState({
       showBody: true
     });
    } else {
      jQuery('#' + formId).modal('hide'); 
      this.setState({
       showBody: false
     });
    }
  }

  componentDidMount() {
    let formId = this.props.id;
    this.toggleModal(formId, this.props.open);
    let self = this;
    jQuery('#' + formId).on('hidden.bs.modal', e => {
      self.props.closeModal();
    });
    jQuery('#' + formId + ' .modal-dialog').on('click tap', e => {
      if (jQuery(e.target).hasClass('modal-dialog')) {
        jQuery('#' + formId).modal('hide');
      }
    });
  }

  componentWillUnmount() {
    let formId = this.props.id;
    // cleanup after yourself
    jQuery('#' + formId).modal('hide');
  }
  
  render() {
    let {
      showBody
    } = this.state;
    let {
      children,
      classes,
      closeModal,
      id,
      open,
      ...other
    } = this.props;
    let body = showBody ? children : null;
    let classesArr = ['modal', `${Lib.THEME_CLASSES_PREFIX}modal`].concat(classes)
    let title = this.props.jsonSchemaForm ? this.props.jsonSchemaForm.title : this.props.title;
    return (
      <div data-keyboard="true" className={classesArr.join(' ')} id={id} tabIndex="-1" role="dialog" aria-labelledby={id} aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title mx-auto" id="modalLabel">{title}</h5>
              <button type="button" className="close" aria-label="Close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {showBody &&
                <div>
                  {React.Children.map(this.props.children, (child, i) => React.cloneElement(child, {
                    ...other
                  }))}
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BootstrapModal;