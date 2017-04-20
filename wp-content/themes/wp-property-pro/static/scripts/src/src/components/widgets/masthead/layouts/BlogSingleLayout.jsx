import React from 'react';
import {Lib} from '../../../../lib.jsx';
import _ from 'lodash';

const BlogSingleLayout = ({widget_cell}) => {

  let twitterLink = null;
  if (_.get(widget_cell, 'widget.fields.post_url', null) && _.get(widget_cell, 'widget.fields.post_title', null))
    twitterLink = 'https://twitter.com/home?' + encodeURIComponent('status=' + _.get(widget_cell, 'widget.fields.post_title') + ' ' + _.get(widget_cell, 'widget.fields.post_url')).replace(/'/g, "%27").replace(/"/g, "%22");

  return (
    <div className="container">
      <div className="row">
        <div className={`container ${Lib.THEME_CLASSES_PREFIX}masthead-title-container`}>
          <header>
            {
              _.get(widget_cell, 'widget.fields.title', '')
                ? <h1 className={Lib.THEME_CLASSES_PREFIX+"masthead-blog-title"}>{widget_cell.widget.fields.title}</h1>
                : null
            }
          </header>
          <div className={`${Lib.THEME_CLASSES_PREFIX}share-post clearfix`}>
            {
              _.get(widget_cell, 'widget.fields.post_url', null)
                ? <a className={`${Lib.THEME_CLASSES_PREFIX}facebook rounded-circle`}
                     href={"https://www.facebook.com/sharer/sharer.php?u=" + widget_cell.widget.fields.post_url}
                     target="_blank" title="Facebook" rel="noopener"><i className="fa fa-facebook-f"></i></a>
                : null
            }
            {
              twitterLink
                ? <a className={`${Lib.THEME_CLASSES_PREFIX}twitter rounded-circle`} href={twitterLink} target="_blank"
                     title="Twitter"><i
                  className="fa fa-twitter"></i></a>
                : null
            }

            {
              _.get(widget_cell, 'widget.fields.post_url', null) && _.get(widget_cell, 'widget.fields.post_title', null)
                ? <a className={`${Lib.THEME_CLASSES_PREFIX}linkedin rounded-circle`}
                     href={"https://www.linkedin.com/shareArticle?mini=true&url=" + widget_cell.widget.fields.post_url + "&title=" + widget_cell.widget.fields.post_title}
                     target="_blank" title="LinkedIn"><i className="fa fa-linkedin"></i></a>
                : null
            }

          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSingleLayout;