import ErrorMessage from '../ErrorMessage.jsx';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Form from "react-jsonschema-form";
import LoadingAccordion from '../LoadingAccordion.jsx';
import {inputTextElement, selectTextElement, textareaTextElement} from './JSONSchemaComponents/widgets.jsx';

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
  return props.displayLabel ? (
    <div className={"form-group row"}>
      <label className="sr-only" htmlFor={id}>
          {label}{required ? "*" : null}
      </label>
      {children}
      {rawErrors.map(error => <div style={{color: "blue"}}><h1>{error}</h1></div>)}
      {/* <p className="form-text">{help}</p> */}
    </div>
  ) : <div className="container modal-form-container">
    {props.children}
    {errors}
  </div>;
};

const transformErrors = errors => {
  return errors.map(error => {
    return {
        ...error,
        message: `${error.schema.properties[error.argument].title} is missing or invalid`
    }
  });
};

const widgets = {
  CustomInputTextElement: inputTextElement,
  CustomSelectTextElement: selectTextElement,
  CustomTextareaTextElement: textareaTextElement
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

  submit({formData}) {
    // $.post({
    //   url: 'http://localhost:3200/form',
    //   data: formData,
    //   success: (data, status, jqXHR) => {
    //       console.log('success');
    //   },
    //   error: (xhr, status, error) => {
    //       console.log('any error? ', error);
    //   }
    // });
    console.log('submitted: ', formData);
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
        method="post"
        schema={jsonSchemaForm.schema}
        uiSchema={jsonSchemaForm.uiSchema}
        onSubmit={this.submit.bind(this)}
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