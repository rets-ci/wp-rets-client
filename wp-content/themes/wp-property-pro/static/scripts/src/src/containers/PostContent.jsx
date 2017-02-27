import {connect} from 'react-redux'
import Post from '../components/Post.jsx'
import _ from 'lodash';

const mapStateToProps = (state) => {
  return {
    rows: _.get(state, 'postState.rows')
  }
};

const PostContent = connect(
  mapStateToProps
)(Post);

export default PostContent