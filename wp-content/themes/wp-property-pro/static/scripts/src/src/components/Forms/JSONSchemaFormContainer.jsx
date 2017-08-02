import Api from '../../containers/Api.jsx';
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
      {help}
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
    id: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: false,
      isFetching: false,
      jsonSchemaForm: {},
    };
  }

  componentDidMount() {
    this.fetchSchema('/wp-content/static/json-form-schemas/Buy.json');
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
        self.setState({
          isFetching: false,
          errorMessage: err
        });
      } else {
        self.setState({
          errorMessage: false,
          isFetching: false,
          jsonSchemaForm: data
        });
      }
    });
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
      jsonSchemaForm
    } = this.state;
    return (
      <div>
        {!Object.keys(this.state.jsonSchemaForm).length ?
          (isFetching ?
            <LoadingAccordion /> :
            (errorMessage ?
              <ErrorMessage message={errorMessage} />
            :
              <p>Couldn't find the requested form</p>)
            ):
              <Form
                action="https://pocloudcentral.crm.powerobjects.net/PowerWebForm/PowerWebFormData.aspx?t=CCGr6i%2b2CU2A1Z%2bLiVlRh28AcgBnADAANQAyADkANwBlAGYAZAA%3d&formId=powf_629EB2C7BE16E61180E9C4346BACE2D4&tver=2013&c=1"
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
        }
      </div>
    );
  }
};

export default JSONSchemaFormContainer;