import React from 'react';

const FooterTop = ({menu}) => {

    return (
        <div className="col-md-12 col-lg-5">
            <div className="social">
                <span>{menu.title}</span>
                {
                    menu.items.map((item) =>
                        <a className={item.title.toLowerCase()} href={item.url} target="_blank" title={item.title}><i
                            className={`fa fa-${item.title.toLowerCase() === 'facebook ' ? item.title.toLowerCase()+'-f' : item.title.toLowerCase()}`}></i></a>
                    )
                }
            </div>
        </div>
    );
};

export default FooterTop;