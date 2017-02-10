import { connect } from 'react-redux'
import Post from '../components/Post.jsx'

const mapStateToProps = (state) => {
    return {
        rows: state.postState.rows
    }
};

const mapDispatchToProps = (dispatch) => {
    return {}
};

const PostContent = connect(
    mapStateToProps,
    mapDispatchToProps
)(Post);

export default PostContent