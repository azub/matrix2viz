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
