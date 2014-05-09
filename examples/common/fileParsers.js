if ( typeof M2V == 'undefined') {
    M2V = {};
}
M2V.parsers = {};

M2V.parsers.parseSimpleData = function(text) {
    var rawData = $.csv.toArrays(text, {
        separator: '\t'
    });

    var columns = [];
    var colOrder = [];
    var colLabels = rawData.splice(0, 1);
    colLabels = colLabels[0];
    colLabels.splice(0, 1);
    for (var i = 0; i < colLabels.length; i++) {
        var obj = {
            label: colLabels[i]
        };
        columns.push(obj);
        colOrder.push(i);
    }

    var data = [];
    var rows = [];
    var rowOrder = [];
    for (var j = 0; j < rawData.length; j++) {
        var row = rawData[j];
        rows.push({label: row.splice(0, 1)});
        rowOrder.push(j);
        row = _.map(row, function(value) {return parseFloat(value);});
        row = _.normalize(row,[-255,255]);
        data.push(row);
    }

    return {
        data: data,
        rows: rows,
        columns: columns,
        columnOrder: colOrder,
        rowOrder: rowOrder,
        clustering: {
            columnClustering: null,
            rowClustering: null
        }
    };
};

/**
 * Format:
 *
 * rowId type
 *
 * type:
 *  number
 *  string
 *
 */
M2V.parsers.parseDataTypes = function(text) {
    var rawData = $.csv.toArrays(text, {
        separator: '\t'
    });

    var dataTypes = [];
    for (var j = 0; j < rawData.length; j++) {
        var row = rawData[j];
        dataTypes.push(row[1]);
    }

    return dataTypes;
};

/**
 * header:
 *          id
 *
 * rows:
 *
 * @returns {{}}
 */
M2V.parsers.parseRowColumnData = function() {
    var additionalLabels = [];
    for (var j = 0; j < rawData.length; j++) {
        var row = rawData[j];
        dataTypes.push(row[1]);
    }


    return {

    };
};

M2V.parsers.parseClusteringData = function() {

};


M2V.createMatrix = function (definition) {

    //var order = h2m.ClusterHelper.produceClusteredOrder(definition.data);
    var order = {
        columnOrder: definition.columnOrder,
        rowOrder: definition.rowOrder,
        columnClustering: null,
        rowClustering: null
    };

    var dataMatrix = {
        dimensions: {numberOfRows: definition.data.length, numberOfColumns: definition.data[0].length},
        getDataAt: function (rowIndex, columnIndex) {
            return definition.data[rowIndex][columnIndex];
        }
    };

    var matrix = Ext.create('Matrix2Viz', {
        renderTo: "matrix_div",
        width: 900,
        height: 700,

        data: dataMatrix,
        labelFormat: {
            row: [
                {name: 'label', size: 90}
            ],
            column: [
                {name: 'label', size: 100}
            ]
        },
        renderers: {
            cell: {
                'default': {
                    render: function (ctx, value, row, column, size) {
                        var color;
                        if (value > 0) {
                            color = "rgb(" + Math.round(value) + ",0,0)";
                        } else {
                            color = "rgb(0," + Math.round(Math.abs(value)) + ",0)";
                        }
                        ctx.fillStyle = color;
                        ctx.fillRect(1, 1, size.width - 2, size.height - 2);
                    }
                }
            },
            rowMetadata: {
                'label': {
                    render: renderDefaults.text
                }
            },
            columnMetadata: {
                'label': {
                    render: renderDefaults.text
                }
            }
        },

        rows: definition.rows,
        rowOrder: order.rowOrder,
        columns: definition.columns,
        columnOrder: order.columnOrder,
        clustering: order,

        cellSize: {
            width: 20,
            height: 10
        },

        controlPanel: 'DefaultControlPanel',

        // TODO: add row/column options for both
        displayOptions: {
            showRowDendrogram: true,
            showColumnDendrogram: true,
            showRowLabels: true,
            showColumnLabels: true
        }
    });

    var resizer = Ext.create('Ext.resizer.Resizer', {
        handles: 'all',
        target: matrix
    });

    matrix.draw();
};