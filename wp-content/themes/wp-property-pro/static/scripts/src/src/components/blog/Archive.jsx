import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Masthead from '../widgets/masthead/Masthead.jsx';
import Subnavigation from '../widgets/subnavigation/Subnavigation.jsx';
import Posts from './components/Posts.jsx';
import {setBlogPosts} from '../../actions/index.jsx';
import {Lib} from '../../lib.jsx';
import _ from 'lodash';

const mapStateToProps = (state) => {
  return {}
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getPosts: (from, categoryId) => {

      jQuery.ajax({
        url: _.get(bundle, 'admin_ajax_url', ''),
        type: 'get',
        data: {
          action: Lib.AJAX_GET_POSTS_ACTION,
          from: from,
          category_id: categoryId
        },
        dataType: 'json',
        success: function (data) {
          if (_.get(data, 'posts', null))
            dispatch(setBlogPosts(_.get(data, 'posts', []), _.get(data, 'allowPagination', false)));
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(textStatus, errorThrown);
        }
      });
    }
  }
};

class ArchiveContent extends Component {
  static propTypes = {
    post: PropTypes.object.isRequired
  };

  componentDidMount() {
    let content = _.get(this.props.post, 'blog_content', {});

    // Initial get posts
    this.props.getPosts(0, _.get(content, 'category_id', 0));
  }

  render() {

    let content = _.get(this.props.post, 'blog_content', {});

    return (
      <div className="container-fluid">
        <div className="row">
          <Masthead widget_cell={_.get(content, 'masthead')}/>
          <Subnavigation widget_cell={_.get(content, 'subnavigation')}
                         currentUrl={_.get(this.props.post, 'post_url', '')}/>
          <Posts seeMoreHandler={this.props.getPosts} categoryId={_.get(content, 'category_id')}/>
        </div>
      </div>
    )
  }
}


const Archive = connect(
  mapStateToProps,
  mapDispatchToProps
)(ArchiveContent);

export default Archive;
