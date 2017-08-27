import ErrorMessage from '../ErrorMessage.jsx';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Form from "react-jsonschema-form";
import LoadingAccordion from '../LoadingAccordion.jsx';
import {Lib} from '../../lib.jsx';
import {
  datePickerElement,
  inputTextElement,
  radioElement,
  selectTextElement,
  textareaTextElement
} from './JSONSchemaComponents/widgets.jsx';

import '../../../node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.js';
import '../../../node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker3.css';

function CustomFieldTemplate(props) {
  const {
      id,
      classNames,
      label,
      help,
      required,
      description,
      errors,
      children,
      rawErrors=[]
  } = props;
  let labelsClassname = props.uiSchema['ui:widget'] !== 'CustomRadioElement' ? 'sr-only' : 'col-form-legend col-sm-12';
  return !props.hidden ? 
    (
      props.displayLabel ? (
        <div className={"form-group row"}>
          <label className={labelsClassname} htmlFor={id}>
              {label}{required ? "*" : null}
          </label>
          {children}
          {rawErrors.map(error => <div style={{color: "blue"}}><h1>{error}</h1></div>)}
          {help}
        </div>
      ) : <div className="container modal-form-container">
        {props.children}
        {errors}
      </div>
    ) : <div>{children}</div>;
}

const transformErrors = errors => {
  return errors.map(error => {
    return {
        ...error,
        message: `${error.schema.properties[error.argument].title} is missing or invalid`
    }
  });
};

// Note about the widgets object: modifying the following object might break 'CustomFieldTemplate' which will break the form funcionality
const widgets = {
  CustomDateElement: datePickerElement,
  CustomInputTextElement: inputTextElement,
  CustomSelectTextElement: selectTextElement,
  CustomTextareaTextElement: textareaTextElement,
  CustomRadioElement: radioElement
};

class JSONSchemaFormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formSuccess: false,
      errorMessage: false,
      isFetching: false,
      jsonSchemaForm: {}
    };
  }

  componentWillUnMount = () => {
    this.setState({
      formSuccess: false
    });
  }

  submit = ({schema, formData}) => {
    let action = schema.action;
    let self = this;
    jQuery.post({
      url: action,
      data: formData,
      success: (data, status, jqXHR) => {
        self.setState({
          formSuccess: true
        });
        if (self.props.closeModal) {
          self.props.closeModal();
        }
      },
      error: (xhr, status, error) => {
        console.log('any error? ', error);
      }
    });
  }

  render() {
    let {
      errorMessage,
      formSuccess,
      isFetching
    } = this.state;

    let {
      jsonSchemaForm,
      closeModal,
      showConfirmation
    } = this.props;

    let successElement = (
      <div className={`${Lib.THEME_CLASSES_PREFIX}form-success-message-container`}>
        <img src={bundle.static_images_url + "form-confirmation-image.png"} alt="Form Confirmation Image" />
        <div>
          <h3>Request Received</h3>
          <p className={Lib.THEME_CLASSES_PREFIX + "form-confirmation-paragraph"}>The form was submitted successfully</p>
        </div>
      </div>
    );

    let formElement = (<Form
      action={jsonSchemaForm.schema.action}
      FieldTemplate={CustomFieldTemplate}
      formData={jsonSchemaForm.initialData}
      method="post"
      schema={jsonSchemaForm.schema}
      uiSchema={jsonSchemaForm.uiSchema}
      onSubmit={this.submit}
      noHtml5Validate={true}
      showErrorList={false}
      transformErrors={transformErrors}
      widgets={widgets}
    >
      <button type="submit" className="btn btn-primary mx-auto d-block">Submit</button>
    </Form>);
    return (
      <div className={`${Lib.THEME_CLASSES_PREFIX}form`}>
        {formSuccess && this.props.showConfirmation ?
          <div>
            {successElement}
          </div>
        :
        <div>
          {formElement}
        </div>
        }
      </div>
    );
  }
};

export default JSONSchemaFormContainer;