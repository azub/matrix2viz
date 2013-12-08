Ext.require([
    'Matrix',
    'LabelPanel',
    'VerticalLabelNames',
    'HorizontalLabelNames',
    'DefaultControlPanel'
]);

Ext.define('Matrix2Viz', {
    extend: 'Ext.panel.Panel',
    layout: 'border',
    border: true,
    defaults: {
        collapsible: false,
        split: true
    },

    bubbleEvents: [
        'cell-mouse-in',
        'cell-mouse-out',
        'cell-mouse-click',
        'label_in',
        'label_out',
        'label_click',
        'sub_label_in',
        'sub_label_out',
        'sub_label_click'
    ],
    config: {
        data: null,
        dataTypes: null,
        rows: null,
        columns: null,
        rowOrder: null,
        columnOrder: null,
        columnMetadata: [],
        rowMetadata: [],
        cellSize: null,
        displayOptions: null
    },

    initComponent: function () {
        this.dataDimensions = {
            numRows: this.getRows().length,
            numColumns: this.getColumns().length
        };

        var panelSizes = this.computePanelSizes(
            this.getDisplayOptions(),
            {width: this.width, height: this.height},
            this.getRowMetadata(),
            this.getColumnMetadata()
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
                data: this.getData(),
                dataTypes: this.getDataTypes(),
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
                        xtype: 'DefaultControlPanel',
                        itemId: 'controlPanel',
                        matrix2viz: this
                    },
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
                        propertiesToRender: this.getColumnMetadata(),
                        width: matrixContainerSize.width,
                        labelVisibleLength: panelSizes.horizontalLabelHeight,
                        height: panelSizes.horizontalLabelHeight,
                        border: false
                    },
                    {
                        xtype: 'HorizontalLabelNames',
                        itemId: 'topRightFillPanel',
                        border: false,
                        propertiesToRender: this.getColumnMetadata(),
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
                propertiesToRender: this.getRowMetadata()
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
                        propertiesToRender: this.getRowMetadata(),
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
                        clusterTree: order.columnClustering,
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
                clusterTree: order.rowClustering,
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

    fitToScreen: function () {
        var panelSizes = this.computePanelSizes(
            this.getDisplayOptions(),
            {width: this.width, height: this.height},
            this.getRowMetadata(),
            this.getColumnMetadata()
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