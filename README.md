matrix2viz
==========

## Status: work in progress... ETA: Decemeber 24, 2013

## Overview

__matrix2viz__ is a customizable matrix visualization written in javascript. It takes care of some boring parts allowing developer to concentrate on more interesting things. 

##### matrix2viz takes care of:
- zoom
- scroll
- resizing of different regions
- cell and label positioning
- cell and label highlighting on hover
- exposes cell/label mouse events
- dendrogram rendering

#### Dependencies
 - Modern web browser
 - ExtJs 4.2

## API

### Key concepts:
Two major parts of visualization are:
- matrix of cells
- labels for the rows and columns
 
Customization boils down to providing data and functions for rendering these data. There are two types of data:
- cell data
- row and column data

#### Cell data
Data object passed to the visualization must implement:

```javascript
getDataAt: function(rowIndex,columnIndex) // returns your cell data object
dimensions: {numberOfRows: ..., numberOfColumns: ...} // dimensions of your data 
```

The framework is data agnostic. In other words, your _getDataAt(rowIndex,columnIndex)_ function can return anything. The returned object is just passed to the rendering function you provide.
	
### Column metadata
#### Config: __columnMetadata: []__
Each column can have metadata associated with it. In the simplest case it could be just a text label. 
Metadata for each column is defined as follows:
```javascript
{
 // [optional] string representing datatype of this column.
 // If all your data are of the same type this is not needed.
 dataType : 'example type', 
 // Any number of properties of any type
 label : 'example label',
 someImportantValue: 123
}
```

#### Config: __rowMetadata: []__

RowMetadata is similar but doesn't have _dataType_ property.

### Renderers
Renderers draw your data using HTML5's _CanvasContext2d_. 

Config:
```javascript
renderers: [
  // if all columns are of the same type pass single object here i.e. not array
  cell: [
   'data type A' : {renderer: ...},
			'data type B' : {renderer: ...},
			'data type C' : {renderer: ...}
  ], 
  columnMetadata: [
  			'property X' : {renderer: ...},
  			'property Y' : {renderer: ...}
  ]
  rowMetadata: [
  			'property 1' : {renderer: ...},
			  'property 2' : {renderer: ...}
  ]
]
```

Each cell renderer is specified as:
```javascript
'data type name' : {
  renderer: function(canvasContext, drawingBoxSize, cellData, rowMetadata, columnMetadata) {...}
}
```
__TODO__: describe each argument of renderer function.

Each column or row renderer is specified as:
```javascript
'property X' : {
  renderer: function(canvasContext, drawingBoxSize, propertyValue)
}
```
__TODO__: describe each argument of renderer function.

### Labels

	ColumnLabel
		propertyName, size
		propertyName, size		
	Row Label
		propertyName, size
		propertyName, size


### Construction
__TODO__: update this section

 The following need to be provided at construction time:
 
- rowMetadataRenderers -- lets matrix2viz know how to render row labels. It can contain multiple sub-elements: text labels, small graphic elements, etc. It's an array of:

```javascript
[
 { name: 'label', size: 90, renderer: DefaultRenderer.text },
 { name: 'metaNumber', size: 10, renderer: DefaultRenderer.barChart }
]
```
- rowOrder (might change soon)

Similarly for columns:
- columns
- columnMetadata
- columnOrder

- dataTypeRenderers: 

```javascript
{
 'gender': {
   render: M2V.Util.dataType.renderGenderCell
 },
 'binary': {
   render: M2V.Util.dataType.renderAbsentPresentCell
 },
 'numeric': {
   render: function(ctx, value, row, column, boxSize) {
    // custom code goes here
  }
}
```

