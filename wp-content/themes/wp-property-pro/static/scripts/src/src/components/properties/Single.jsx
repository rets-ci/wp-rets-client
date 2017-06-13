import _ from 'lodash';
import {Lib} from '../../lib.jsx'
import React, {Component, PropTypes} from 'react';
import renderHTML from 'react-render-html';

class Single extends Component {
  static propTypes = {
    post: PropTypes.object.isRequired
  };

  componentDidMount() {

    return false;

    let scripts = _.get(this.props.post, 'scripts', '');
    for (let i in scripts) {
      let script = scripts[i];

      let scriptNode = document.createElement("script");

      scriptNode.type = 'text/javascript';

      if (_.get(script, 'src', null)) {
        scriptNode.src = _.get(script, 'src');
      }
      if (_.get(script, 'content', null)) {
        scriptNode.text = _.get(script, 'content');
      }

      scriptNode.async = true;

      document.body.appendChild(scriptNode);
    }
  }

  render() {
    return (
      <div className={Lib.THEME_CLASSES_PREFIX + "single-container"} style={{color: '#000000'}}>
        <div className="row no-gutters">
          <div className="jumbotron">
            {
              _.get(this.props.post, 'post_title', null)
                ? <h1>{_.get(this.props.post, 'post_title')}</h1>
                : null
            }
            {
              _.get(this.props.post, 'post_content', null)
                ? <div>{renderHTML(_.get(this.props.post, 'post_content'))}</div>
                : null
            }
            {
              //  _.get(this.props.post, 'output', null)
              //  ? renderHTML(_.get(this.props.post, 'output'))
              //: null
            }
          </div>
        </div>
      </div>
    );
  }
}


export default Single;