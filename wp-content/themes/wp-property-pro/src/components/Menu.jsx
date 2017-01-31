import React from 'react';
import {render} from 'react-dom'
import {connect} from 'react-redux';
import {addPost} from '../actions/index.jsx';


const mapStateToProps = (state, history) => {
    return {
        menuItems: state.menuState.menuItems,
        history: history
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        loadPage: (url, title, history) => {

            history.pushState({}, title, url);
            jQuery('title').text(title);

            jQuery.ajax({
                url: url,
                type: 'get',
                data: {
                    pageType: 'json'
                },
                dataType: 'json',
                success: function (data) {
                    dispatch(addPost(data.post));
                }
            });
        }
    }
};

const Menu = ({menuItems, loadPage}) => (
    <div className="menu-main_menu-container">
        <ul id="menu-main_menu" className="menu">
            {menuItems.map(function (item, i) {
                    let itemID = "menu-item-" + item.ID;
                    let itemClass = "menu-item menu-item-type-post_type menu-item-object-page menu-item-" + item.ID;
                    return (
                        <li key={i} id={itemID} className={itemClass}>
                            <a href={item.url} onClick={(event) => {
                                loadPage(item.url, item.title, history);
                                event.preventDefault();
                                event.stopPropagation();
                            }}>{item.title}</a>
                        </li>
                    )
                }
            )}
        </ul>
    </div>
);

const MenuContent = connect(
    mapStateToProps,
    mapDispatchToProps
)(Menu);

export default MenuContent