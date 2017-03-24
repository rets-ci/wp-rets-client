import React, {Component, PropTypes} from 'react';
import renderHTML from 'react-render-html';
import {Lib} from '../../../lib.jsx';
import _ from 'lodash';

class PostContent extends Component {
  static propTypes = {
    content: PropTypes.string.required
  };

  render() {
    return (
      _.get(this.props, 'content', null)
        ? <section className={Lib.THEME_CLASSES_PREFIX + "post-content"}>
          <div className="container">{renderHTML(this.props.content)}</div>
        </section>
        : null
    )
  }
}

export default PostContent;
