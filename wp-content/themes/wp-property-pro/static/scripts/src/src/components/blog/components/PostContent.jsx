import React, {Component, PropTypes} from 'react';
import {Lib} from '../../../lib.jsx';

class PostContent extends Component {
  static propTypes = {
    content: PropTypes.string.required
  };

  render() {

    return (
      <section className={Lib.THEME_CLASSES_PREFIX + "post-content"}>
        <div className="container">{content}</div>
      </section>
    )
  }
}

export default PostContent;
