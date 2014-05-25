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
