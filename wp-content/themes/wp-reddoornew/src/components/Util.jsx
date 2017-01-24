import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'


class Util extends React.Component {

    static stringStyleToObject(stringStyle) {

        let style = {};
        let styleArray = stringStyle.split("\n");

        for (let i in styleArray) {
            let styleRow = styleArray[i].split(":");
            let styleRowObject = {};
            styleRowObject[styleRow[0]] = styleRow[1];
            style = Object.assign({}, style, styleRowObject);
        }

        return style;
    }
}

export default Util;