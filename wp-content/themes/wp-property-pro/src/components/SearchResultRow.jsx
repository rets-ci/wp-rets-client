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

const SearchResultRowContent = function ({prop, clickHandler, filterTerms}) {

    if (!prop)
        return (<div></div>);

    let children = prop.children.map((child) => {
        let type = jQuery('#search_type').val();
        let url = '/' + type + '/' + prop.key + '/' + child.id.toLowerCase().replace(/\s+/g, '');
        return (<li><a href={url} onClick={(event) => {
            clickHandler(prop.key, child.text, filterTerms);
            event.preventDefault();
            event.stopPropagation();
        }}
        >{child.id}</a></li>)
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