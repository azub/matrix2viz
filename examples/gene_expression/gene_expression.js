Ext.require([
    'Matrix2Viz'
]);


if ( typeof M2V == 'undefined') {
    M2V = {};
}

M2V.Util = {};
M2V.Util.dataType = {};

M2V.Util.dataType.renderNA = function (ctx, size) {
};

M2V.Util.dataType.renderGenderCell = function (ctx, gender, row, column, size) {
    var color;
    if (gender === "m") {
        color = "rgb(72,209,204)";
    } else if (gender === "f") {
        color = "rgb(255,105,180)";

    } else M2V.Util.dataType.renderNA(ctx, size);
    ctx.fillStyle = color;
    ctx.fillRect(1, 1, size.width - 2, size.height - 2);
};

M2V.Util.dataType.renderAbsentPresentCell = function (ctx, value, row, column, size) {
    if (value === 0) {
        ctx.fillStyle = "black";
        ctx.fillRect(size.width / 4, size.height / 4, size.width / 2, size.height / 2);
    } else if (value === 1) {
        ctx.strokeStyle = "black";
        ctx.strokeRect(size.width / 4, size.height / 4, size.width / 2, size.height / 2);
    } else M2V.Util.dataType.renderNA(ctx, size);
};

//TODO: provide centering helper function
var renderDefaults = {
    text: function (ctx, box, text) {
        ctx.translate(0, box.height / 2 + 4);  //fontSize
        ctx.fillText(text, 0, 0);
    },
    label: function (ctx, box, text) {
        ctx.translate(0, box.height / 2 + 4);  //fontSize
        ctx.fillText(text, 0, 0);
    },
    group: function (ctx, box, value) {
        ctx.translate(0, box.height / 2 + 4);  //fontSize
        ctx.fillText(value, 0, 0);
    },
    type: function (ctx, box, value) {
        ctx.translate(0, box.height / 2 + 4);  //fontSize
        ctx.fillText(value, 0, 0);
    },
    metaNumber: function (ctx, box, value) {
        ctx.fillStyle = 'rgb(0,100,0)';
        ctx.fillRect(0, 1, box.width * value, box.height - 2);
    }
};

/*
 Cluster data structure:

 binary tree with nodes:
 {
 left
 right
 distance
 isLeaf
 }

 */

/**
 *
 * @type {{dimensions: {numberOfRows: Number, numberOfColumns: *}, getDataAt: Function}}
 */
