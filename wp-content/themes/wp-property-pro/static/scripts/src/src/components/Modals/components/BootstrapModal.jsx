import React, {Component} from 'react';
import {Lib} from '../../../lib.jsx';
import PropTypes from 'prop-types';

import '../../../../../../styles/app/bootstrap-modal.scss';

class BootstrapModal extends Component {
  static propTypes = {
    alignHead: PropTypes.string,
    classes: PropTypes.array,
    closeModal: PropTypes.func.isRequired,
    modalFooter: PropTypes.object,
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
      alignHead,
      children,
      classes,
      closeModal,
      id,
      modalFooter,
      open,
      ...other
    } = this.props;
    let body = showBody ? children : null;
    let containerClasses = ['modal', `${Lib.THEME_CLASSES_PREFIX}modal`].concat(classes);
    let headerClasses = ['modal-title'];
    if (alignHead) {
      if (alignHead === 'left') {
        headerClasses.push('text-left')
      } else if (alignHead === 'right') {
        headerClasses.push('text-right')
      } else {
        headerClasses.push('mx-auto');
      }
    } else {
      headerClasses.push('mx-auto');;
    }
    let title = this.props.jsonSchemaForm ? this.props.jsonSchemaForm.title : this.props.title;
    let footer = modalFooter ? (<div className="modal-footer">{modalFooter}</div>) : null;
    return (
      <div data-keyboard="true" className={containerClasses.join(' ')} id={id} tabIndex="-1" role="dialog" aria-labelledby={id} aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className={headerClasses.join(' ')} id="modalLabel">{title}</h5>
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
            {footer}
          </div>
        </div>
      </div>
    );
  }
}

export default BootstrapModal;