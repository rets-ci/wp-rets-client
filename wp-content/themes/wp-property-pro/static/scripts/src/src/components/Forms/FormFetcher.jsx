import Api from '../../containers/Api.jsx';
import React, {Component} from 'react';
class FormFetcher extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: false,
      isFetching: false,
      jsonSchemaForm: {}
    };
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
        // this resets the form modal state in case of an error, thus allowing the retriggering of fetchSchema in componentWillReceiveProps
        self.setState({
          errorMessage: err,
          isFetching: false,
          jsonSchemaForm: {}
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

  schemaURL(id) {
    return `/wp-content/static/json-form-schemas/${id}.json`;
  }

  componentDidMount() {
    let {
      formId
    } = this.props;

    this.fetchSchema(this.schemaURL(formId));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.formId !== this.props.formId) {
      this.fetchSchema(this.schemaURL(nextProps.formId));
    }
  }

  render() {
    let {
      formId
    } = this.props;
    let {
      errorMessage
    } = this.state;
    if (formId && errorMessage) {
      console.log('failed to load modal: ', formId);
      console.log('error message: ', errorMessage)
    }
    return (
      <div>
        {Object.keys(this.state.jsonSchemaForm).length ?
          <div>
            {React.Children.map(this.props.children, (child, i) => React.cloneElement(child, {
              jsonSchemaForm: this.state.jsonSchemaForm
            }))}
          </div>
        : null}
      </div>
    );
  }

};

export default FormFetcher;