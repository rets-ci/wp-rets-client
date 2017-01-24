const post = (state = {}, action) => {
    switch (action.type) {
        case 'ADD_POST':
            return Object.assign({}, state, {
                post: action.post,
                rows: action.post.post_content
            });
        default:
            return state
    }
}
export default post