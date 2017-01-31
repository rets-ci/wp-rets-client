import React from 'react'
import {connect} from 'react-redux'

const mapStateToProps = (state) => {
    return {
        currentState: state
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {}
};

const SearchResultRowContent = function ({prop}) {

    if (!prop)
        return (<div></div>);

    let children = prop.children.map((child) => {
        return (<li><a href="#">{child.id}</a></li>)
    });

    return (
        <li>{prop.text}
            <ul>{children}</ul>
        </li>
    )
};

const SearchResultRow = connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchResultRowContent);

export default SearchResultRow