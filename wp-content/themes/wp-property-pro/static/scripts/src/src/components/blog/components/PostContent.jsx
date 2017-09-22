import PropTypes from 'prop-types';
import React, {Component} from 'react';
import renderHTML from 'react-render-html';
import {Lib} from '../../../lib.jsx';
import get from 'lodash/get';

class PostContent extends Component {
  static propTypes = {
    content: PropTypes.string.isRequired
  };

  render() {
    return (
      get(this.props, 'content', null)
        ? <section className={Lib.THEME_CLASSES_PREFIX + "post-content"}>
          <div className="container">
            <div className="row">
              <div className={`${Lib.THEME_CLASSES_PREFIX}post-content-container mx-auto text-justify`}>
              {renderHTML(this.props.content)}
            </div>
            </div>
          </div>
        </section>
        : null
    )
  }
}

export default PostContent;
