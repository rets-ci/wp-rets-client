import HeaderDefault from '../Headers/HeaderDefault.jsx';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import LoadingCircle from 'app_root/components/LoadingCircle.jsx';
import Masthead from '../widgets/masthead/Masthead.jsx';
import Subnavigation from '../widgets/subnavigation/Subnavigation.jsx';
import Posts from './components/Posts.jsx';
import PropTypes from 'prop-types';
import {setBlogPosts} from '../../actions/index.jsx';
import {Lib} from '../../lib.jsx';
import get from 'lodash/get';

const mapStateToProps = (state) => {
  return {
    posts: get(state, 'blogPostsState.posts', []),
    allowPagination: get(state, 'blogPostsState.allowPagination', false)
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getPosts: (from, categoryId, existing_posts, callback) => {
      jQuery.ajax({
        url: get(bundle, 'admin_ajax_url', ''),
        type: 'get',
        data: {
          action: Lib.AJAX_GET_POSTS_ACTION,
          from: from,
          category_id: categoryId
        },
        dataType: 'json',
        success: function (data) {
          if (get(data, 'posts', null)){
            let posts = get(data, 'posts', []);

            if(from && existing_posts){
              posts = posts.concat(existing_posts);
            }

            if(typeof callback !== 'undefined'){
              callback();
            }

            dispatch(setBlogPosts(posts, get(data, 'allowPagination', false)));
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(textStatus, errorThrown);
        }
      });
    }
  }
};

class ArchiveContent extends Component {
  constructor(props) {
    super(props);

    this.state = {loading: true};
  }

  componentDidMount() {
    let content = get(this.props.post, 'blog_content', {});

    let self = this;

    // Initial get posts
    this.props.getPosts(0, get(content, 'category_id', 0), this.props.posts, () => {
      self.setState({
        loading: false
      });
    });
  }

  render() {
    let {
      history,
      openUserPanel,
      openLoginModal
    } = this.props;
    let content = get(this.props.post, 'blog_content', {});

    return (
      <div>
        <section className={`${Lib.THEME_CLASSES_PREFIX}toolbar ${Lib.THEME_CLASSES_PREFIX}header-default row no-gutters`}>
          <HeaderDefault historyPush={history.push} openUserPanel={openUserPanel} openLoginModal={openLoginModal} />
        </section>
        <div className="container-fluid">
          <div className="row">
            <Masthead widget_cell={get(content, 'masthead')}/>
            <Subnavigation widget_cell={get(content, 'subnavigation')}
                          currentUrl={get(this.props.post, 'post_url', '')}/>
            {
              !this.state.loading
              ? <Posts posts={this.props.posts} allowPagination={this.props.allowPagination} seeMoreHandler={this.props.getPosts} categoryId={get(content, 'category_id')}/>
                : <div className="m-auto"> <LoadingCircle /></div>
            }

          </div>
        </div>
      </div>
    )
  }
}

ArchiveContent.propTypes = {
  post: PropTypes.object.isRequired
};

const Archive = connect(
  mapStateToProps,
  mapDispatchToProps
)(ArchiveContent);

export default Archive;
