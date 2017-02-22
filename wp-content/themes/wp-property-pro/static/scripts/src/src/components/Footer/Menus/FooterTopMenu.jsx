import React from 'react';

const FooterTop = ({menu}) => {

    return (
        <div className="col-6 col-sm-6 col-lg-3">
            <h5>{menu.title}</h5>
            <ul>
                {
                    menu.items.map((item, i) =>
                        <li key={i}><a href={item.url}>{item.title}</a></li>
                    )
                }
            </ul>
        </div>
    );
};

export default FooterTop;
