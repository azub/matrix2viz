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
                    if (node.level > 2) {
                        y = 0;
                    } else {
                        y = height * (node.distance / maxDistance);
                    }
                } else {
                    y = xyLeft.y + (xyRight.y - xyLeft.y) / 2;
                    if (node.level > 2) {
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
