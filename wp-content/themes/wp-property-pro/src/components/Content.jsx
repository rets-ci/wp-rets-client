import React from 'react'
import {connect} from 'react-redux'
import PostContent from '../containers/PostContent.jsx'
import Cell from './Cell.jsx'
import _ from 'lodash'

const mapStateToProps = (state) => {
    return {
        currentState: state
    }
};

const Content = function ({currentState}) {

    let customContent = _.get(currentState, 'postState.post.custom_content', false);

    if (!customContent) {
        let cellProps = {
            title: _.get(currentState, 'postState.post.post_title', ''),
            content: _.get(currentState, 'postState.post.post_content', ''),
            type: '',
            cellClass: ''
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