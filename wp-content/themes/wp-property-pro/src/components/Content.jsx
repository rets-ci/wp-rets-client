import React from 'react'
import { connect } from 'react-redux'
import PostContent from '../containers/PostContent.jsx'
import Cell from './Cell.jsx';

const mapStateToProps = (state) => {
    return {
        currentState: state
    }
};

const Content = function ({currentState}) {

    if (!currentState.postState.post.custom_content) {
        let cellProps = {
            title: currentState.postState.post.post_title,
            content: currentState.postState.post.post_content,
            type: "",
            cellClass: ""
        };

        return (<Cell cell={cellProps}/>);
    }

    return (
        <div>
            <PostContent />
        </div>
    )
};

const AppContent = connect(
    mapStateToProps
)(Content);

export default AppContent