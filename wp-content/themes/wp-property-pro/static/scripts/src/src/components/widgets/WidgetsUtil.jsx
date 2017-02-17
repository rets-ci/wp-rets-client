import React from 'react'
import _ from 'lodash'


class WidgetsUtil extends React.Component {

    static getWidgetByKey(key, rows) {
        let widget_cell;
        for (let row_index in rows) {

            let cells = rows[row_index].cells;

            if (widget_cell = _.find(cells, function (cell) {
                    return cell.widget.panels_info.class === key;
                }))
                break;
        }

        return widget_cell;
    }

}

export default WidgetsUtil;