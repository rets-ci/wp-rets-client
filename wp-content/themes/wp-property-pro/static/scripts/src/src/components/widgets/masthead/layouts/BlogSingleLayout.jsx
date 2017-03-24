import React from 'react';
import {Lib} from '../../../../lib.jsx';
import _ from 'lodash';

const BlogSingleLayout = ({widget_cell}) => {
  return (
    <div className={`container ${Lib.THEME_CLASSES_PREFIX}masthead-title-container`}>
      <header>
        {
          _.get(widget_cell, 'widget.fields.title', '')
            ? <h1>{widget_cell.widget.fields.title}</h1>
            : null
        }
      </header>
      <div className={`${Lib.THEME_CLASSES_PREFIX}share-post clearfix`}>
        {
          _.get(widget_cell, 'widget.fields.post_url', null)
            ? <a className={Lib.THEME_CLASSES_PREFIX + "facebook"}
                 href={"https://www.facebook.com/sharer/sharer.php?u=" + widget_cell.widget.fields.post_url}
                 target="_blank" title="Facebook"><i className="fa fa-facebook-f"></i></a>
            : null
        }
        <a className={Lib.THEME_CLASSES_PREFIX + "twitter"} href="#" target="_blank" title="Twitter"><i
          className="fa fa-twitter"></i></a>
        {
          _.get(widget_cell, 'widget.fields.post_url', null) && _.get(widget_cell, 'widget.fields.post_title', null)
            ? <a className={Lib.THEME_CLASSES_PREFIX + "linkedin"}
                 href={"https://www.linkedin.com/shareArticle?mini=true&url=" + widget_cell.widget.fields.post_url + "&title=" + widget_cell.widget.fields.post_title}
                 target="_blank" title="LinkedIn"><i className="fa fa-linkedin"></i></a>
            : null
        }

      </div>
    </div>
  );
};

export default BlogSingleLayout;