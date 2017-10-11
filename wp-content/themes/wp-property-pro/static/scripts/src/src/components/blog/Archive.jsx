import HeaderDefault from '../Headers/HeaderDefault.jsx';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Masthead from '../widgets/masthead/Masthead.jsx';
import Subnavigation from '../widgets/subnavigation/Subnavigation.jsx';
import Posts from './components/Posts.jsx';
import PropTypes from 'prop-types';
import {setBlogPosts} from '../../actions/index.jsx';
import {Lib} from '../../lib.jsx';
import get from 'lodash/get';

const mapStateToProps = (state) => {
  return {}
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getPosts: (from, categoryId) => {

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
          if (get(data, 'posts', null))
            dispatch(setBlogPosts(get(data, 'posts', []), get(data, 'allowPagination', false)));
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
    let content = get(this.props.post, 'blog_content', {});

    // Initial get posts
    this.props.getPosts(0, get(content, 'category_id', 0));
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
            <Posts seeMoreHandler={this.props.getPosts} categoryId={get(content, 'category_id')}/>
          </div>
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
