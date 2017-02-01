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

const SearchResultRowContent = function ({prop, clickHandler}) {

    if (!prop)
        return (<div></div>);

    let children = prop.children.map((child) => {
        let type = jQuery('#search_type').val();
        let url = '/' + type + '/' + prop.key + '/' + child.id.toLowerCase().replace(/\s+/g, '');
        let title = prop.text + ' ' + child.text;
        return (<li><a href={url} onClick={(event) => {
            clickHandler(title, url, prop.key, child.text);
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