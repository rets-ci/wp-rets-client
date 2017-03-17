import React from 'react';
import {connect} from 'react-redux';
import DefaultLayout from './layouts/DefaultLayout.jsx';
import {Lib} from '../../../lib.jsx';
import _ from 'lodash';

const Callout = ({widget_cell}) => {

    if (!widget_cell){
        return null;
    }

  let primaryColor = _.get(bundle, 'colors.primary_color', null);
  let style =
      primaryColor !== null
        ?
        {
          "backgroundColor": primaryColor
        }
        : {}
    ;

    let container;
    switch (widget_cell.widget.fields.layout) {
        case 'default_layout':
        default:
            container = <DefaultLayout item={widget_cell.widget.fields}/>;
            break;
    }

    return (
    <section className={Lib.THEME_CLASSES_PREFIX+"callout"} style={style}>
      {container}
    </section>
    );
};

export default Callout;