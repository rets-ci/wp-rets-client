import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    return {
        menuItems: state.menuState.menuItems
    }
};

const Menu = ({menuItems}) => (
    <div className="menu-main_menu-container">
        <ul id="menu-main_menu" className="menu">
            {menuItems.map(function(item, i){
                let itemID = "menu-item-"+item.ID;
                let itemClass = "menu-item menu-item-type-post_type menu-item-object-page menu-item-"+item.ID;
                console.log(itemID);
                return (
                    <li key={i} id={itemID} className={itemClass}>
                        <a href={item.url}>{item.title}</a>
                    </li>
                )
            }

            )}
        </ul>
    </div>
);

const MenuContent = connect(
    mapStateToProps
)(Menu);

export default MenuContent