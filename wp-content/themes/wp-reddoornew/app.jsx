var Root = React.createClass({
    render: function () {

        var rows = this.props.rows;

        var rowsItems = rows.map(function (row) {
            return (
                <Row cells={row.cells}/>
            );
        }, this);

        return (
            <div className="root">
                {rowsItems}
            </div>
        )
    }
});

var Row = React.createClass({
    render: function () {

        var cells = this.props.cells;
        var cells_count = this.props.cells.length;

        var cellsItems = cells.map(function (cell) {
            return (
                <Cell
                    type={cell.widget.panels_info.class}
                    title={cell.widget.title}
                    content={cell.widget.text}
                    cellClass={cells_count}
                />
            );
        }, this);

        return (
            <div className="row">
                {cellsItems}
                <div className="clear"></div>
            </div>

        )
    }
});

var Cell = React.createClass({


    render: function () {

        var type = this.props.type;
        var title = this.props.title;
        var content = this.props.content;
        var cellClass = this.props.cellClass;

        var classes = "cell-" + cellClass + " " + type;

        return (
            <div className={classes}>
                <div className="cell-title">{title}</div>
                <div className="cell-content">{content}</div>
            </div>
        )
    }
});

jQuery.post(ajaxurl, {action: "get_api"}, function (response) {
    response = JSON.parse(response);
    ReactDOM.render(<Root rows={response.rows}/>, document.getElementById('content'));
});