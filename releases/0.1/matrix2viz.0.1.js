

/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js from "js_file_order.txt" begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


/* Last merge : Tue May 27 06:58:31 PDT 2014  */

/* Merging order :

- Cell.js
- Label.js
- LabelPanel.js
- Dendrogram.js
- Matrix.js
- MiniControlPanel.js
- VerticalLabelNames.js
- HorizontalLabelNames.js
- ClusterHelper.js
- Matrix2Viz.js

*/


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: Cell.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


/**
 *
 * @param cellData
 * @param cellRow
 * @param cellColumn
 * @param ctx
 * @param ctxOverlay
 * @param position
 * @param size
 * @param renderFn -
 * @constructor
 */
function Cell(cellData, cellRow, cellColumn, ctx, ctxOverlay, position, size, renderFn) {
    this.ctx = ctx;
    this.ctxOverlay = ctxOverlay;
    this.data = cellData;
    this.row = cellRow;
    this.column = cellColumn;
    this.position = position;
    this.size = size;
    this.renderCellContent = renderFn;
}

/**
 *
 */
Cell.prototype.draw = function () {
    this.drawOn(this.ctx);
};

Cell.prototype.drawOn = function (ctx) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    // TODO: Allow drawing only within rectangle specified by size.
    // User provided drawing function.
    this.renderCellContent(ctx, this.data, this.row, this.column, this.size);
    ctx.restore()
};

/**
 * TODO: provide more defaults, allow overriding.
 */
Cell.prototype.highlight = function () {
    this.ctxOverlay.save();
    this.ctxOverlay.translate(this.position.x, this.position.y);
    this.renderCellContentHighlight(this.ctxOverlay, this.data, this.row, this.column, this.size);
    this.ctxOverlay.restore()
};

/**
 *
 */
Cell.prototype.clearHighlight = function () {
    this.ctxOverlay.save();
    this.ctxOverlay.translate(this.position.x, this.position.y);
    this.ctxOverlay.clearRect(0, 0, this.size.width, this.size.height);
    this.ctxOverlay.restore()
};

/**
 *
 * @param ctx
 * @param data
 * @param row
 * @param column
 * @param size
 */
Cell.prototype.renderCellContentHighlight = function (ctx, data, row, column, size) {
    ctx.strokeStyle = "rgb(0,0,0)";
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, size.width - 1, size.height - 1);
};


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: Label.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


/**
 * TODO: Rename to reflect new functionality
 * TODO: Namespace everything.
 */
/*
 bubbleEvents: [
 'label_in',
 'label_out',
 'label_click',
 'sub_label_in',
 'sub_label_out',
 'sub_label_click'
 ],
 */

Orientation = {HORIZONTAL: 1, VERTICAL: 2};

function Label(data, renderers, ctx, ctxOverlay) {
    this.data = data;
    this.ctx = ctx;
    this.ctxOverlay = ctxOverlay;
    this.renderers = renderers;
}

Label.prototype.highlight = function (width, height) {
    this.ctxOverlay.save();
    this.ctxOverlay.fillStyle = "rgba(200,0,0,0.1)";
    this.ctxOverlay.fillRect(0, 0, width, height);
    this.ctxOverlay.restore();
    this.width = width;
    this.height = height;
};

Label.prototype.clearHighlight = function () {
    this.ctxOverlay.save();
    this.ctxOverlay.clearRect(0, 0, this.width, this.height);
    this.ctxOverlay.restore();
};

// Label container should call this, it should position(translate) things.
Label.prototype.render = function (orientation, cellSize, subLabels, context) {
    var ctx = context;
    var me = this;

    if (typeof ctx === 'undefined') {
        ctx = me.ctx;
    }
    function centerHorizontally(blockWidth) {
        ctx.translate(cellSize.width / 2 + blockWidth / 2, 0);
    }

    function centerVertically(blockHeight) {
        ctx.translate(0, cellSize.height / 2 + blockHeight / 2);
    }

    function rotate() {
        ctx.rotate(-0.5 * Math.PI);
    }

    function finish() {
        ctx.restore();
    }

    this.ctx.save();
    if (orientation === Orientation.HORIZONTAL) {
        //centerVertically(8);
    } else {
        //centerHorizontally(8);
        rotate();
    }

    for (var i = 0; i < subLabels.length; i++) {
        var property = subLabels[i];
        var box;

        if (orientation === Orientation.HORIZONTAL) {
            box = {width: property.size, height: cellSize.height};
        } else {
            box = {width: property.size, height: cellSize.width};
        }

        ctx.save();
        this.renderers[property.name].render(ctx, box, this.data[property.name]);
        ctx.restore();
        ctx.translate(property.size, 0);
    }

    finish();
};



/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: LabelPanel.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


/**
 *
 * TODO: Think of supporting interface similar to Grid?
 */

Ext.define('LabelPanel', {
    alias: "widget.LabelPanel",
    extend: 'Ext.panel.Panel',
    layout: 'absolute',
    items: [
        {
            xtype: 'component',
            autoEl: 'canvas',
            itemId: 'labelCanvas',
            x: 0,
            y: 0,
            style: {
                'z-index': '0'
            }
        },
        {
            xtype: 'component',
            autoEl: 'canvas',
            itemId: 'labelCanvasOverlay',
            x: 0,
            y: 0,
            style: {
                'z-index': '1'
            }
        }
    ],

    bubbleEvents: [
        'label-mouse-in',
        'label-mouse-out',
        'label-mouse-click'
    ],

    config: {
        labelItems: null,
        order: null,
        orientation: null,
        leftX: 0,
        topY: 0,
        labelVisibleLength: null,
        cellSize: null,
        renderers: null,
        subLabels: []
    },

    initComponent: function () {
        this.highlightedLabel = null;
        this.lastLabel = null;
        this.callParent(arguments);
    },

    initListeners: function () {
        var me = this;
        this.canvasOverlay.on('mousemove', function (event) {
            var scrollTop = me.body.getScrollTop();
            var scrollLeft = me.body.getScrollLeft();
            var x = event.browserEvent.pageX + scrollLeft - me.body.getX();
            var y = event.browserEvent.pageY + scrollTop - me.body.getY();
            me.onMouseMove(x, y);
        });

        this.canvasOverlay.on('mouseout', function (event) {
            me.onMouseMove(-1, -1);
        });

        this.canvasOverlay.on('click', function (event) {
            var scrollTop = me.body.getScrollTop();
            var scrollLeft = me.body.getScrollLeft();
            var x = event.browserEvent.pageX + scrollLeft - me.body.getX();
            var y = event.browserEvent.pageY + scrollTop - me.body.getY();
            var index = me.getLabel(x,y);
            if (index != null) me.fireEvent('label-mouse-click',index);
        });
    },

    getLabel: function (x, y) {
        var index, subIndex;
        if (this.orientation === Orientation.HORIZONTAL) {
            index = Math.floor(y / this.cellSize.height);
            var xEnd = 0;
            for (var i = 0; i < this.subLabels.length; i++) {
                var property = this.subLabels[i];
                xEnd = xEnd + property.size;
                if (x < xEnd) {
                    subIndex = i;
                    break;
                }
            }
        } else {
            index = Math.floor(x / this.cellSize.width);
            var yEnd = this.labelVisibleLength;
            for (var i = 0; i < this.subLabels.length; i++) {
                var property = this.subLabels[i];
                yEnd = yEnd - property.size;
                if (y > yEnd) {
                    subIndex = i;
                    break;
                }
            }
        }

        if (index >= this.labelItems.length || index < 0) {
            return null;
        }

        return {
            data: this.labelItems[ this.getOrder()[index] ][this.subLabels[subIndex].name],
            index: index,
            subIndex: subIndex
        };
    },

    onMouseMove: function (x, y) {
        var label = this.getLabel(x, y);

        if ((this.lastLabel == null && label == null)
            || (this.lastLabel != null && label != null && this.lastLabel.index == label.index && this.lastLabel.subIndex == label.subIndex)) {
            return;
        }

        if (this.lastLabel != null) {
            this.clearHighlight(this.lastLabel.index, this.getCellSize());
            this.fireEvent('label-mouse-out', this.lastLabel);
        }

        this.lastLabel = label;
        if (label != null) {
            this.highlight(label.index, this.getCellSize());
            this.fireEvent('label-mouse-in', label);
        }
    },

    afterRender: function () {
        this.callParent(arguments);

        this.canvas = this.getComponent("labelCanvas").getEl();
        this.ctx = this.canvas.dom.getContext("2d");
        this.canvasOverlay = this.getComponent("labelCanvasOverlay").getEl();
        this.ctxOverlay = this.canvasOverlay.dom.getContext("2d");

        var labels = [];
        this.getLabelItems().forEach(function (item) {
            labels.push(new Label(item, this.getRenderers(), this.ctx, this.ctxOverlay));
        }, this);

        this.labels = labels;

        this.initListeners();
    },

    getScrollbarSize: function () {
        if (!this.scrollbarSize) {
            var db = document.body,
                div = document.createElement('div');

            div.style.width = div.style.height = '100px';
            div.style.overflow = 'scroll';
            div.style.position = 'absolute';

            db.appendChild(div); // now we can measure the div...

            // at least in iE9 the div is not 100px - the scrollbar size is removed!
            this.scrollbarSize = {
                width: div.offsetWidth - div.clientWidth,
                height: div.offsetHeight - div.clientHeight
            };

            db.removeChild(div);
        }
        return this.scrollbarSize;
    },

    refreshCanvasSize: function () {
        if (this.getOrientation() === Orientation.HORIZONTAL) {
            this.canvas.dom.width = this.getLabelVisibleLength();
            this.canvas.dom.height = this.labels.length * this.getCellSize().height + this.getScrollbarSize().height;
            this.canvasOverlay.dom.width = this.getLabelVisibleLength();
            this.canvasOverlay.dom.height = this.labels.length * this.getCellSize().height + this.getScrollbarSize().height;
        } else {
            this.canvas.dom.width = this.labels.length * this.getCellSize().width + this.getScrollbarSize().width;
            this.canvas.dom.height = this.getLabelVisibleLength();
            this.canvasOverlay.dom.width = this.labels.length * this.getCellSize().width + this.getScrollbarSize().width;
            this.canvasOverlay.dom.height = this.getLabelVisibleLength();
        }
    },

    clearHighlight: function (index, cellSize) {
        var width, height;
        this.ctxOverlay.save();
        this.ctxOverlay.translate(this.getLeftX(), this.getTopY());
        if (this.orientation === Orientation.HORIZONTAL) {
            this.ctxOverlay.translate(0, cellSize.height * index);
            width = this.getLabelVisibleLength();
            height = cellSize.height;
        } else {
            this.ctxOverlay.translate(cellSize.width * index, 0);
            width = cellSize.width;
            height = this.getLabelVisibleLength();
        }
        this.labels[index].clearHighlight(width, height);
        this.ctxOverlay.restore();
    },

    highlight: function (index, cellSize) {
        if (this.highlightedLabel != null) {
            this.highlightedLabel.clearHighlight();
        }
        var width, height;
        this.ctxOverlay.save();
        this.ctxOverlay.translate(this.getLeftX(), this.getTopY());
        if (this.orientation === Orientation.HORIZONTAL) {
            this.ctxOverlay.translate(0, cellSize.height * index);
            width = this.getLabelVisibleLength();
            height = cellSize.height;
        } else {
            this.ctxOverlay.translate(cellSize.width * index, 0);
            width = cellSize.width;
            height = this.getLabelVisibleLength();
        }
        this.labels[index].highlight(width, height);
        this.ctxOverlay.restore();

        this.highlightedLabel = this.labels[index];
    },

    updateCellSizes: function (cellSize) {
        this.cellSize = cellSize;
    },

    scrollTop: function (offset) {
        this.canvasOverlay.dom.marginTop = -1 * offset;
        this.canvas.dom.scrollTop.marginTop = -1 * offset;
    },

    getImageData: function() {
        return this.ctx.getImageData(0, 0, this.width, this.height);
    },

    drawOn: function(ctx) {
        ctx.save();

        if (this.getOrientation() == Orientation.HORIZONTAL) {
            ctx.translate(0, 0);
        } else {
            ctx.translate(0, this.getLabelVisibleLength() - 5);
        }

        var me = this;

        this.getOrder().forEach(function drawLabel(index) {
            var label = me.labels[index];
            label.render(me.getOrientation(), me.getCellSize(), me.getSubLabels(), ctx);
            me.moveToNextPosition(ctx);
        });
        ctx.restore();
    },

    /**
     * @private
     * @param ctx
     */
    moveToNextPosition: function(ctx) {
        if (this.getOrientation() === Orientation.HORIZONTAL) {
            ctx.translate(0, this.getCellSize().height);
        } else {
            ctx.translate(this.getCellSize().width, 0);
        }
    },

    /**
     *
     */
    draw: function () {
        this.refreshCanvasSize();
        this.drawOn(this.ctx);
    }

});



/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: Dendrogram.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


/**
 *
 */
Ext.define('Dendrogram', {
    alias: "widget.Dendrogram",
    extend: 'Ext.panel.Panel',
    layout: 'absolute',
    items: [
        {
            xtype: 'component',
            autoEl: 'canvas',
            itemId: 'dendrogramCanvas',
            x: 0,
            y: 0,
            style: {
                'z-index': '0'
            }
        }
    ],

    config: {
        orientation: null,
        itemSize: null,
        numItems: 0,
        clusterTree: null,
        dendrogramHeight: 0
    },

    initComponent: function () {
        this.callParent(arguments);
    },

    afterRender: function () {
        this.callParent(arguments);

        this.canvas = this.getComponent("dendrogramCanvas").getEl();
        this.ctx = this.canvas.dom.getContext("2d");
    },

    setCellSize: function (cellSize) {
        if (this.getOrientation() === "horizontal") {
            this.setItemSize(cellSize.width);
        } else {
            this.setItemSize(cellSize.height);
        }
    },

    refreshCanvasSize: function () {
        if (this.getOrientation() === "horizontal") {
            this.canvas.dom.width = this.getNumItems() * this.getItemSize();
            this.canvas.dom.height = this.getDendrogramHeight();
        } else {
            this.canvas.dom.width = this.getDendrogramHeight();
            this.canvas.dom.height = this.getNumItems() * this.getItemSize();
        }
    },


    /*
        Draw (N) 5 clusters
        Determine max distance to draw. Is it possible?

        Determine tree height.
        Use max tree height to cut off the details based on number of clusters to show AND available space.
            write function(or find existing one) that returns min/max/average of node attribute at specified level.



        First pass:
            just return max y coordinate after cut-off, so that it draws on top of other lines. Could be messy but should work.
        Second pass:
            Make it right and fast.


          __\__
        _|_    |   ->   ___|___
        |  |   |


        node
            finalIndex -- on leaf nodes
            distance
     */





    getImageData: function() {
        return this.ctx.getImageData(0, 0, this.width, this.height);
    },

    draw: function () {
        var isDendrogramCutOffEnabled = false; // TODO: Complete this feature

        this.refreshCanvasSize();

        if (this.clusterTree === null) return;

        var cluster = this.getClusterTree();
        var maxDistance = cluster.distance;
        var ctx = this.ctx;
        var orientation = this.getOrientation();
        var height = this.getDendrogramHeight();
        var cellSize = this.getItemSize();

        postOrderGetCoordinate(cluster);

        /**
         *
         * @param node
         * @returns {x:number, y:number}
         */
        function postOrderGetCoordinate(node) {
            if (typeof node.finalIndex !== "undefined") { // leaf node
                if (orientation === "horizontal") {
                    return {x: node.finalIndex * cellSize + cellSize / 2, y: 0};
                } else {
                    return {x: 0, y: node.finalIndex * cellSize + cellSize / 2};
                }
            } else {
                var xyLeft = postOrderGetCoordinate(node.left);
                var xyRight = postOrderGetCoordinate(node.right);
                var x, y;
                if (orientation === "horizontal") {
                    x = xyLeft.x + (xyRight.x - xyLeft.x) / 2;
                    if (isDendrogramCutOffEnabled && node.level > 2) {
                        y = 0;
                    } else {
                        y = height * (node.distance / maxDistance);
                    }
                } else {
                    y = xyLeft.y + (xyRight.y - xyLeft.y) / 2;
                    if (isDendrogramCutOffEnabled && node.level > 2) {
                        x = 0;
                    } else {
                        x = height * (node.distance / maxDistance);
                    }
                }
                ctx.strokeStyle = "black";
                ctx.beginPath();
                if (orientation === "horizontal") {
                    ctx.moveTo(xyLeft.x, xyLeft.y);
                    ctx.lineTo(xyLeft.x, y);
                } else {
                    ctx.moveTo(xyLeft.x, xyLeft.y);
                    ctx.lineTo(x, xyLeft.y);
                }

                if (orientation === "horizontal") {
                    ctx.moveTo(xyRight.x, xyRight.y);
                    ctx.lineTo(xyRight.x, y);
                } else {
                    ctx.moveTo(xyRight.x, xyRight.y);
                    ctx.lineTo(x, xyRight.y);
                }

                if (orientation === "horizontal") {
                    ctx.moveTo(xyLeft.x, y);
                    ctx.lineTo(xyRight.x, y);
                } else {
                    ctx.moveTo(x, xyLeft.y);
                    ctx.lineTo(x, xyRight.y);
                }
                ctx.stroke();
                return {x: x, y: y};
            }
        }
    }
})
;

/**
 * Created with IntelliJ IDEA.
 * User: work
 * Date: 7/21/13
 * Time: 2:16 PM
 * To change this template use File | Settings | File Templates.
 */

/*
 function Dendrogram(orientation, pixelHeight, canvas, tree, itemSize, numItems) {
 this.canvas = canvas;
 this.height = pixelHeight;
 this.ctx = canvas.getContext("2d");
 this.clusterTree = tree;
 }


 };*/


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: Matrix.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


/**
 * Matrix canvas and overlay canvas (for highlighting/interaction effects)
 *
 * Track mouse events,
 *
 * Instantiate cells.
 *
 * TODO: Colour legend
 * Thoughts:
 *  - Make drawing function responsible for producing colour legend
 *  - They should implement drawColourLegend()
 *  - Default functions will know about range.
 *  - Provide default implementation (pass hash of value:label, or just array of values)
 */
Ext.define('Matrix', {
    alias: "widget.Matrix",
    extend: 'Ext.panel.Panel',
    autoScroll: true,
    layout: 'absolute',
    items: [
        {
            xtype: 'component',
            autoEl: 'canvas',
            itemId: 'matrixCanvas',
            x: 0,
            y: 0,
            style: {
                'z-index': '0'
            }
        },
        {
            xtype: 'component',
            autoEl: 'canvas',
            itemId: 'matrixCanvasOverlay',
            x: 0,
            y: 0,
            style: {
                'z-index': '1'
            }
        }
    ],
    bubbleEvents: [
        'cell-mouse-in',
        'cell-mouse-out',
        'cell-mouse-click'
    ],
    config: {
        /**
        *  @type {{dimensions: {numberOfRows: Number, numberOfColumns: Number}, getDataAt: Function}}
        */
        data: null,
        renderers: null,
        rows: null,
        rowOrder: null,
        columns: null,
        colOrder: null,
        cellSize: null
    },

    /**
     * @override
     */
    initComponent: function () {
        this.lastCellIndex = null;
        this.cells = [];
        this.numberOfRows = this.getData().dimensions.numberOfRows;
        this.numberOfColumns = this.getData().dimensions.numberOfColumns;

        this.calculateMatrixSize();

        this.callParent(arguments);
    },

    /**
     * @override
     */
    afterRender: function () {
        this.callParent(arguments);

        this.matrixCanvas = this.getComponent("matrixCanvas").getEl();
        this.matrixCanvasOverlay = this.getComponent("matrixCanvasOverlay").getEl();

        this.ctx = this.matrixCanvas.dom.getContext("2d");
        this.ctxOverlay = this.matrixCanvasOverlay.dom.getContext("2d");

        this.initListeners();
    },

    /**
     * @private
     */
    refreshCanvasSize: function () {
        this.matrixCanvas.dom.width = this.matrixSize.width;
        this.matrixCanvas.dom.height = this.matrixSize.height;

        this.matrixCanvasOverlay.dom.width = this.matrixSize.width;
        this.matrixCanvasOverlay.dom.height = this.matrixSize.height;
    },

    /**
     *
     */
    initListeners: function () {
        var me = this;
        this.matrixCanvasOverlay.on('mousemove', function (event) {
            var scrollTop = me.body.getScrollTop();
            var scrollLeft = me.body.getScrollLeft();
            var x = event.browserEvent.pageX + scrollLeft - me.body.getX();
            var y = event.browserEvent.pageY + scrollTop - me.body.getY();
            me.onMouseMove(x, y);
        });

        this.matrixCanvasOverlay.on('mouseout', function (event) {
            me.onMouseMove(-1, -1);
        });

        this.matrixCanvasOverlay.on('click', function (event) {
            var scrollTop = me.body.getScrollTop();
            var scrollLeft = me.body.getScrollLeft();
            var x = event.browserEvent.pageX + scrollLeft - me.body.getX();
            var y = event.browserEvent.pageY + scrollTop - me.body.getY();

            var index = me.getCellIndex(x, y);
            if (index == null) {
                return;
            }
            me.fireEvent('cell-mouse-click', index);
        });
    },

    /**
     *
     * @param x
     * @param y
     */
    onMouseMove: function (x, y) {
        var index = this.getCellIndex(x, y);

        if ((this.lastCellIndex == null && index == null)
            || (this.lastCellIndex != null && index != null && this.lastCellIndex.row == index.row && this.lastCellIndex.col == index.col)) {
            return;
        }

        if (this.lastCellIndex != null) {
            var lastCell = this.cells[this.lastCellIndex.row][this.lastCellIndex.col];
            lastCell.clearHighlight();
            this.fireEvent('cell-mouse-out', this.lastCellIndex);
        }

        this.lastCellIndex = index;

        if (index == null) {
            return;
        }

        var cell = this.cells[index.row][index.col];
        cell.highlight();
        this.fireEvent('cell-mouse-in', index);
    },

    /**
     *
     * @param x
     * @param y
     * @returns {{row: number, col: number}}
     */
    getCellIndex: function (x, y) {
        var rowIndex = Math.floor(y / this.cellSize.height);
        var colIndex = Math.floor(x / this.cellSize.width);
        if (rowIndex < 0 || colIndex < 0) return null;
        if (rowIndex >= this.numberOfRows || colIndex >= this.numberOfColumns) return null;
        return {
            row: rowIndex,
            col: colIndex
        };
    },

    setCellSize: function (cellSize) {
        this.cellSize = cellSize;
        this.calculateMatrixSize();
    },

    calculateMatrixSize: function () {
        this.matrixSize = {
            width: this.numberOfColumns * this.getCellSize().width,
            height: this.numberOfRows * this.getCellSize().height
        };
    },

    getPixelSize: function() {
        return this.matrixSize;
    },

    getImageData: function() {
        return this.ctx.getImageData(0, 0, this.getWidth(), this.getHeight());
    },

    /**
     *
     */
    draw: function () {
        this.refreshCanvasSize();
        this.lastCellIndex = null;
        this.cells = [];

        for (var displayRowIndex = 0; displayRowIndex < this.numberOfRows; displayRowIndex++) {
            var rowIndex = this.rowOrder[displayRowIndex];
            var y = displayRowIndex * this.cellSize.height;
            var rowOfCells = [];
            this.cells.push(rowOfCells);
            for (var displayColIndex = 0; displayColIndex < this.numberOfColumns; displayColIndex++) {
                var colIndex = this.colOrder[displayColIndex];
                var x = displayColIndex * this.cellSize.width;
                var cellData = this.getData().getDataAt(rowIndex,colIndex);
                var cellRow = this.rows[rowIndex];
                var cellColumn = this.columns[colIndex];
                var cellType = cellColumn.type || 'default';
                var renderFn = this.getRenderers()[cellType].render;
                var cell = new Cell(cellData, cellRow, cellColumn, this.ctx,
                    this.ctxOverlay, {x: x, y: y}, this.cellSize, renderFn);
                rowOfCells.push(cell);
                cell.draw();
            }
        }
    },

    // TODO: refactor!!!
    drawOn: function (ctx) {
        for (var displayRowIndex = 0; displayRowIndex < this.numberOfRows; displayRowIndex++) {
            var rowIndex = this.rowOrder[displayRowIndex];
            var y = displayRowIndex * this.cellSize.height;
            for (var displayColIndex = 0; displayColIndex < this.numberOfColumns; displayColIndex++) {
                var colIndex = this.colOrder[displayColIndex];
                var x = displayColIndex * this.cellSize.width;
                var cellData = this.getData().getDataAt(rowIndex,colIndex);
                var cellRow = this.rows[rowIndex];
                var cellColumn = this.columns[colIndex];
                var cellType = cellColumn.type || 'default';
                var renderFn = this.getRenderers()[cellType].render;
                var cell = new Cell(cellData, cellRow, cellColumn, ctx,
                    null, {x: x, y: y}, this.cellSize, renderFn);
                cell.draw();
            }
        }
    }
});





/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: MiniControlPanel.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


/**
 *
 */
Ext.define('MiniControlPanel', {
    alias: "widget.MiniControlPanel",
    extend: 'Ext.panel.Panel',
    width: 100,
    height: 100,
    border: false,
    config: {
        matrix2viz: null
    }
});

/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: VerticalLabelNames.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


/**
 * TODO: Rename. Refactor with HorizontalLabelNames.
 */
Ext.define('VerticalLabelNames', {
    alias: "widget.VerticalLabelNames",
    extend: 'Ext.panel.Panel',
    layout: 'absolute',
    items: [
        {
            xtype: 'component',
            autoEl: 'canvas',
            itemId: 'canvas',
            x: 0,
            y: 0,
            style: {
                'z-index': '0'
            }
        },
        {
            xtype: 'component',
            autoEl: 'canvas',
            itemId: 'canvasOverlay',
            x: 0,
            y: 0,
            style: {
                'z-index': '1'
            }
        }
    ],

    config: {
        labelVisibleLength: null,
        propertiesToRender: []
    },

    initComponent: function () {
        this.callParent(arguments);
    },

    afterRender: function () {
        this.callParent(arguments);

        this.canvas = this.getComponent("canvas").getEl();
        this.ctx = this.canvas.dom.getContext("2d");
        this.canvasOverlay = this.getComponent("canvasOverlay").getEl();
        this.ctxOverlay = this.canvasOverlay.dom.getContext("2d");
    },

    refreshCanvasSize: function () {
        this.canvas.dom.width = this.getLabelVisibleLength();
        this.canvas.dom.height = this.getHeight();
        this.canvasOverlay.dom.width = this.getLabelVisibleLength();
        this.canvasOverlay.dom.height = this.getHeight();
    },

    getImageData: function() {
        return this.ctx.getImageData(0, 0, this.width, this.height);
    },

    /**
     *
     */
    draw: function () {
        this.refreshCanvasSize();

        this.ctx.save();
        this.ctx.translate(0, this.getHeight());
        this.ctx.rotate(-0.5 * Math.PI);
        this.ctx.fillStyle = "black";
        for (var i = 0; i < this.propertiesToRender.length; i++) {
            var property = this.propertiesToRender[i];
            this.ctx.translate(0, property.size / 2 + 4);  //fontSize
            this.ctx.fillText(property.name, 0, 0);
            this.ctx.translate(0, property.size / 2 - 4);  //fontSize
        }
        this.ctx.restore();
    }

});



/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: HorizontalLabelNames.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


/**
 * TODO: Rename. Refactor with VerticalLabelNames.
 */
Ext.define('HorizontalLabelNames', {
    alias: "widget.HorizontalLabelNames",
    extend: 'Ext.panel.Panel',
    layout: 'absolute',
    items: [
        {
            xtype: 'component',
            autoEl: 'canvas',
            itemId: 'canvas',
            x: 0,
            y: 0,
            style: {
                'z-index': '0'
            }
        },
        {
            xtype: 'component',
            autoEl: 'canvas',
            itemId: 'canvasOverlay',
            x: 0,
            y: 0,
            style: {
                'z-index': '1'
            }
        }
    ],

    config: {
        labelVisibleLength: null,
        propertiesToRender: []
    },

    initComponent: function () {
        this.callParent(arguments);
    },

    afterRender: function () {
        this.callParent(arguments);

        this.canvas = this.getComponent("canvas").getEl();
        this.ctx = this.canvas.dom.getContext("2d");
        this.canvasOverlay = this.getComponent("canvasOverlay").getEl();
        this.ctxOverlay = this.canvasOverlay.dom.getContext("2d");
    },

    refreshCanvasSize: function () {
        this.canvas.dom.width = this.getWidth();
        this.canvas.dom.height = this.getLabelVisibleLength();
        this.canvasOverlay.dom.width = this.getWidth();
        this.canvasOverlay.dom.height = this.getLabelVisibleLength();
    },

    getImageData: function() {
        return this.ctx.getImageData(0, 0, this.getWidth(), this.getHeight());
    },

    /**
     *
     */
    draw: function () {
        this.refreshCanvasSize();

        this.ctx.save();
        this.ctx.translate(0, this.getLabelVisibleLength());
        this.ctx.fillStyle = "black";
        for (var i = 0; i < this.propertiesToRender.length; i++) {
            var property = this.propertiesToRender[i];
            this.ctx.translate(0, -(property.size / 2 + 4));  //fontSize
            this.ctx.fillText(property.name, 0, 0);
            this.ctx.translate(0, -(property.size / 2 - 4));  //fontSize
        }
        this.ctx.restore();
    }

});



/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ClusterHelper.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


h2m = {};

h2m.ClusterHelper = {};

/**
 * TODO: move this out of this module/folder
 *
 * Clusters data using clusterfck library and extracts linear order of row and columns.
 *
 * @param data
 * @returns {{columnOrder: Array, rowOrder: Array, rowClustering: *, columnClustering: *}}
 */
h2m.ClusterHelper.produceClusteredOrder = function (data) {
    var rowClustering = clusterfck.hcluster(data);
    var columnClustering = clusterfck.hcluster(data.transpose());

    var inOrderTraversal = function (node, output, level) {
        if (node.left) {
            inOrderTraversal(node.left, output, level+1);
        }

        node.level = level;

        if (typeof node.originalIndex !== 'undefined') {
            node.finalIndex = output.length;
            output.push(node.originalIndex);
        }

        if (node.right) {
            inOrderTraversal(node.right, output, level+1);
        }
    };

    var colOrder = [];
    var rowOrder = [];

    inOrderTraversal(columnClustering[0], colOrder, 0);
    inOrderTraversal(rowClustering[0], rowOrder, 0);

    return {
        columnOrder: colOrder,
        rowOrder: rowOrder,
        rowClustering: rowClustering[0],
        columnClustering: columnClustering[0]
    }
};


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: Matrix2Viz.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


Ext.require([
    'Matrix',
    'LabelPanel',
    'VerticalLabelNames',
    'HorizontalLabelNames',
    'MiniControlPanel'
]);

Ext.define('Matrix2Viz', {
    extend: 'Ext.panel.Panel',
    layout: 'border',
    border: true,
    defaults: {
        collapsible: true,
        split: true
    },

    bubbleEvents: [
        'cell-mouse-in',
        'cell-mouse-out',
        'cell-mouse-click',
        'label-mouse-in',
        'label-mouse-out',
        'label-mouse-click'
    ],
    config: {
        data: null,
        renderers: null,
        labelFormat: null,
        rows: null,
        columns: null,
        rowOrder: null,
        columnOrder: null,
        clustering: null,
        cellSize: null,
        displayOptions: null,
        controlPanel: null
    },

    initComponent: function () {
        this.dataDimensions = {
            numRows: this.getRows().length,
            numColumns: this.getColumns().length
        };

        var panelSizes = this.computePanelSizes(
            this.getDisplayOptions(),
            {width: this.width, height: this.height},
            this.getLabelFormat().row,
            this.getLabelFormat().column
        );

        if (this.cellSize == null) {
            this.cellSize = panelSizes.cellSize;
        }

        var matrixContainerSize = {
            width: panelSizes.matrixWidth,
            height: panelSizes.matrixHeight
        };

        this.items = [
            {
                xtype: 'Matrix',
                itemId: 'matrix',
                region: 'center',
                collapsible: false,
                data: this.getData(),
                renderers: this.getRenderers().cell,
                dataDimensions: this.dataDimensions,
                cellSize: this.getCellSize(),
                rowOrder: this.getRowOrder(),
                colOrder: this.getColumnOrder(),
                rows: this.getRows(),
                columns: this.getColumns()
            },
            {
                itemId: 'northPanel',
                xtype: 'panel',
                region: 'north',
                layout: {
                    type: 'hbox',
                    align: 'bottom'
                },
                collapsible: false,
                items: [
                    {
                        xtype: 'box',
                        width: 5
                    },
                    {
                        xtype: 'LabelPanel',
                        itemId: 'horizontalLabelPanel',
                        labelItems: this.getColumns(),
                        order: this.getColumnOrder(),
                        orientation: Orientation.VERTICAL,
                        cellSize: this.getCellSize(),
                        renderers: this.getRenderers().columnMetadata,
                        subLabels: this.getLabelFormat().column,
                        width: matrixContainerSize.width,
                        labelVisibleLength: panelSizes.horizontalLabelHeight,
                        height: panelSizes.horizontalLabelHeight,
                        border: false
                    },
                    {
                        xtype: 'HorizontalLabelNames',
                        itemId: 'topRightFillPanel',
                        border: false,
                        propertiesToRender: this.getLabelFormat().column,
                        labelVisibleLength: panelSizes.horizontalLabelHeight,
                        width: 100
                    }
                ]
            },
            {
                region: 'west',
                collapsible: false,
                labelVisibleLength: panelSizes.verticalLabelWidth,
                width: panelSizes.verticalLabelWidth,
                xtype: 'LabelPanel',
                itemId: 'verticalLabelPanel',
                labelItems: this.getRows(),
                order: this.getRowOrder(),
                orientation: Orientation.HORIZONTAL,
                cellSize: this.getCellSize(),
                height: matrixContainerSize.height,
                renderers: this.getRenderers().rowMetadata,
                subLabels: this.getLabelFormat().row
            },
            {
                xtype: 'panel',
                region: 'south',
                itemId: 'southPanel',
                border: false,
                collapsible: false,
                layout: {
                    type: 'hbox',
                    align: 'top'
                },
                items: [
                    {
                        xtype: 'VerticalLabelNames',
                        itemId: 'bottomLeftFillPanel',
                        border: false,
                        propertiesToRender: this.getLabelFormat().row,
                        labelVisibleLength: panelSizes.verticalLabelWidth,
                        width: 100,
                        height: 100
                    },
                    {
                        xtype: 'box',
                        width: 5
                    },
                    {
                        xtype: 'Dendrogram',
                        itemId: 'dendrogramH',
                        orientation: 'horizontal',
                        dendrogramHeight: panelSizes.dendrogramHeight,
                        itemSize: this.getCellSize().width,
                        numItems: this.getColumns().length,
                        clusterTree: this.getClustering().columnClustering,
                        width: matrixContainerSize.width,
                        height: panelSizes.dendrogramHeight,
                        border: false
                    }
                ]
            },
            {
                xtype: 'Dendrogram',
                region: 'east',
                border: false,
                collapsible: false,
                itemId: 'dendrogramV',
                orientation: 'vertical',
                dendrogramHeight: panelSizes.dendrogramHeight,
                itemSize: this.getCellSize().height,
                numItems: this.getRows().length,
                clusterTree: this.getClustering().rowClustering,
                height: matrixContainerSize.height,
                width: panelSizes.dendrogramHeight
            }
        ];

        this.callParent(arguments);
    },

    afterRender: function () {
        this.callParent(arguments);

        this.verticalLabelPanel = this.getComponent("verticalLabelPanel");
        this.matrix = this.getComponent("matrix");
        this.northPanel = this.getComponent("northPanel");

        this.northPanel.insert(0,
            Ext.create(this.getControlPanel(), {
                itemId: 'controlPanel',
                matrix2viz: this
            })
        );

        this.horizontalLabelPanel = this.northPanel.getComponent("horizontalLabelPanel");
        this.controlPanel = this.northPanel.getComponent("controlPanel");

        this.southPanel = this.getComponent('southPanel');
        this.dendrogramH = this.southPanel.getComponent('dendrogramH');
        this.dendrogramV = this.getComponent('dendrogramV');

        this.bottomLeftFillPanel = this.southPanel.getComponent('bottomLeftFillPanel');
        this.topRightFillPanel = this.northPanel.getComponent('topRightFillPanel');

        var me = this;
        this.verticalLabelPanel.on({
            resize: function (source, width, height, oldWidth, oldHeight, eOpts) {
                me.controlPanel.setWidth(width);
                me.bottomLeftFillPanel.setWidth(width);
            }
        });

        this.northPanel.on({
            afterlayout: function (source, width, height, oldWidth, oldHeight, eOpts) {
                me.northPanel.body.scroll('b', 500);
            }
        });

        this.matrix.on({
            resize: function (source, width, height, oldWidth, oldHeight, eOpts) {
                me.horizontalLabelPanel.setWidth(width);
                me.verticalLabelPanel.setHeight(height);
            },
            'cell-mouse-in': function (index) {
                me.verticalLabelPanel.highlight(index.row, me.getCellSize());
                me.horizontalLabelPanel.highlight(index.col, me.getCellSize());
            },
            'cell-mouse-out': function (index) {
                me.verticalLabelPanel.clearHighlight(index.row, me.getCellSize());
                me.horizontalLabelPanel.clearHighlight(index.col, me.getCellSize());
            }
        });

        this.matrix.body.on('scroll', function (event, target, eOpts) {
            var topOffset = me.matrix.body.getScrollTop();
            var leftOffset = me.matrix.body.getScrollLeft();
            me.verticalLabelPanel.body.setScrollTop(topOffset);
            me.horizontalLabelPanel.body.setScrollLeft(leftOffset);
            me.dendrogramV.body.setScrollTop(topOffset);
            me.dendrogramH.body.setScrollLeft(leftOffset);
        });
    },

    computePanelSizes: function (displayOptions, containerSize, rowMetadata, columnMetadata) {
        var i;
        var dendrogramHeight = displayOptions.showRowDendrogram ? 100 : 0;

        var matrixSize = {
            width: this.getColumns().length * this.getCellSize().width,
            height: this.getRows().length * this.getCellSize().height
        };

        var verticalLabelWidth = 0;
        for (i = 0; i < rowMetadata.length; i++) {
            verticalLabelWidth = verticalLabelWidth + rowMetadata[i].size;
        }
        var horizontalLabelHeight = 0;
        for (i = 0; i < columnMetadata.length; i++) {
            horizontalLabelHeight = horizontalLabelHeight + columnMetadata[i].size;
        }

        var availableWidth = containerSize.width - dendrogramHeight - verticalLabelWidth - 20;//padding
        var availableHeight = containerSize.height - dendrogramHeight - horizontalLabelHeight - 20;

        var cellSize = {
            width: availableWidth / this.dataDimensions.numColumns,
            height: availableHeight / this.dataDimensions.numRows
        };

        var totalWidth = dendrogramHeight + verticalLabelWidth + matrixSize.width + 20;
        var totalHeight = dendrogramHeight + horizontalLabelHeight + matrixSize.height + 20

        var matrixWidth = Math.min(availableWidth, matrixSize.width);
        var matrixHeight = Math.min(availableHeight, matrixSize.height);
        return {
            dendrogramHeight: dendrogramHeight,
            matrixWidth: availableWidth,
            matrixHeight: availableHeight,
            verticalLabelWidth: verticalLabelWidth,
            horizontalLabelHeight: horizontalLabelHeight,
            cellSize: cellSize,
            totalWidth: totalWidth,
            totalHeight: totalHeight
        }
    },

    /**
     * @private
     */
    makeSnug: function () {
        this.matrix.setAutoScroll(false);

        // if matrix is smaller that available container, resize container to fit matrix.
        var fullMatrixSize = this.matrix.getPixelSize();
        if (fullMatrixSize.width < this.matrix.getWidth()) {
            var newDendrogramWidth = this.getWidth() - this.verticalLabelPanel.getWidth() - fullMatrixSize.width - 20;
            this.dendrogramV.setWidth(newDendrogramWidth);
        } else {
            var newDendrogramWidth = Math.max(this.getWidth() - this.verticalLabelPanel.getWidth() - fullMatrixSize.width - 20, 100);
            this.dendrogramV.setWidth(newDendrogramWidth);
        }
        if (fullMatrixSize.height < this.matrix.getHeight()) {
            var newDendrogramHeight = this.getHeight() - this.horizontalLabelPanel.getHeight() - fullMatrixSize.height - 20;
            this.southPanel.setHeight(newDendrogramHeight);
        } else {
            var newDendrogramHeight = Math.max(this.getHeight() - this.horizontalLabelPanel.getHeight() - fullMatrixSize.height - 20, 100);
            this.southPanel.setHeight(newDendrogramHeight);
        }

        this.matrix.setAutoScroll(true);
    },

    /**
     * Public API
     */

    /**
     * @public
     */
    draw: function () {
        this.verticalLabelPanel.draw();
        this.horizontalLabelPanel.draw();
        this.dendrogramH.draw();
        this.dendrogramV.draw();
        this.matrix.draw();
        this.bottomLeftFillPanel.draw();
        this.topRightFillPanel.draw();

        this.makeSnug();
    },


    /**
     * @public
     */
    updateCellSizes: function (cellSize) {
        this.cellSize = cellSize;

        this.verticalLabelPanel.setCellSize(cellSize);
        this.horizontalLabelPanel.setCellSize(cellSize);

        this.dendrogramH.setCellSize(cellSize);
        this.dendrogramV.setCellSize(cellSize);

        this.matrix.setCellSize(cellSize);

        this.draw();
    },

    /**
     * @public
     *
     */
    drawPng: function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.width + 300;
        canvas.height = this.height;

        var ctx = canvas.getContext('2d');

        var imageData = this.verticalLabelPanel.getImageData();
        ctx.putImageData(imageData, 0, this.horizontalLabelPanel.height);

        imageData = this.horizontalLabelPanel.getImageData();
        ctx.putImageData(imageData, this.verticalLabelPanel.width, 0);

        imageData = this.dendrogramH.getImageData();
        ctx.putImageData(imageData, this.verticalLabelPanel.width, this.matrix.getHeight() + this.horizontalLabelPanel.height);

        imageData = this.dendrogramV.getImageData();
        ctx.putImageData(imageData, this.verticalLabelPanel.width + this.matrix.getWidth(), this.horizontalLabelPanel.height);

        imageData = this.matrix.getImageData();
        ctx.putImageData(imageData, this.verticalLabelPanel.width, this.horizontalLabelPanel.height);

        imageData = this.bottomLeftFillPanel.getImageData();
        ctx.putImageData(imageData, 0, this.matrix.getHeight() + this.horizontalLabelPanel.height);

        imageData = this.topRightFillPanel.getImageData();
        ctx.putImageData(imageData, this.verticalLabelPanel.width + this.matrix.getWidth(), 0);

        ctx.save();
        ctx.translate(this.verticalLabelPanel.width + this.matrix.getWidth() + this.dendrogramV.dendrogramHeight, 0);

        var stuff = [
            {
                name: 'gender',
                values: [
                    {label: 'male', value: 'm'},
                    {label: 'female', value: 'f'}
                ]
            },
            {
                name: 'binary',
                values: [
                    {label: 'present', value: 1},
                    {label: 'absent', value: 0}
                ]
            }
        ];

        this.drawLegend(ctx, stuff);

        var new_image_url = canvas.toDataURL('image/png');

        return new_image_url;
    },

    /**
     * @public
     * @param ctx
     * @param cellTypes
     */
    drawLegend: function (ctx, cellTypes) {
        ctx.translate(0, 15);

        for (var j = 0; j < cellTypes.length; j++) {
            var cellType = cellTypes[j];
            ctx.fillStyle = 'black';
            ctx.fillText(cellType.name, 0, 0);

            ctx.translate(20, 10);
            var values = cellType.values;
            for (var i = 0; i < values.length; i++) {
                var value = values[i];
                var renderFn = this.getRenderers().cell[cellType.name].render;
                ctx.save();
                ctx.translate(0, -10);
                renderFn(ctx, value.value, 0, 0, {height: 10, width: 10});
                ctx.restore();

                ctx.save();
                ctx.translate(10, 0);
                ctx.fillText(value.label, 0, 0);
                ctx.restore();

                ctx.translate(0, 10);
            }
            ctx.translate(-20, 10);
        }
    },

    fitToScreen: function () {
        var panelSizes = this.computePanelSizes(
            this.getDisplayOptions(),
            {width: this.width, height: this.height},
            this.getLabelFormat().row,
            this.getLabelFormat().column
        );
        var newCellSize = panelSizes.cellSize;
        this.updateCellSizes(newCellSize);
    },

    zoom: function (cellSize) {

    },

    reorder: function () {
        // clustering
        // sort
        // group
    }
});