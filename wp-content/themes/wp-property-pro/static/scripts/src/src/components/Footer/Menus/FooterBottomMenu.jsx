import React from 'react';

const FooterTop = ({menu}) => {

    return (
        <div className="col-md-12 col-lg-7">
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
