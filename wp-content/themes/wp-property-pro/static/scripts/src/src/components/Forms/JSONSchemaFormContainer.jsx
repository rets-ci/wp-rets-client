import ErrorMessage from '../ErrorMessage.jsx';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Form from "react-jsonschema-form";
import LoadingAccordion from '../LoadingAccordion.jsx';
import {inputTextElement, radioElement, selectTextElement, textareaTextElement} from './JSONSchemaComponents/widgets.jsx';

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
  console.log('props: ', props);
  let labelsClassname = props.uiSchema['ui:widget'] !== 'CustomRadioElement' ? 'sr-only' : null;
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
  CustomInputTextElement: inputTextElement,
  CustomSelectTextElement: selectTextElement,
  CustomTextareaTextElement: textareaTextElement,
  CustomRadioElement: radioElement
};

class JSONSchemaFormContainer extends Component {
  static propTypes = {
    jsonSchemaForm: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: false,
      isFetching: false,
      jsonSchemaForm: {}
    };
  }

  submit = ({schema, formData}) => {
    let action = schema.action;
    console.log('action: ', action);
    jQuery.post({
      url: '/',
      data: formData,
      success: (data, status, jqXHR) => {
        console.log('success');
      },
      error: (xhr, status, error) => {
        console.log('any error? ', error);
      }
    });
    // console.log('submitted: ', formData);
  }

  render() {
    let {
      errorMessage,
      isFetching,
    } = this.state;

    let {
      jsonSchemaForm
    } = this.props;

    return (
      <Form
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
      </Form>
    );
  }
};

export default JSONSchemaFormContainer;