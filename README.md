matrix2viz
==========

## Overview

__matrix2viz__ is a matrix visualization ExtJs component. It takes care of some boring parts allowing developer to concentrate on more interesting things. 

##### matrix2viz takes care of:
- exposing cell and label mouse events
- zooming in and out
- synchronized scrolling of matrix and label panels if the entire matrix doesn't fit on the screen
- resizing and layout of visualization parts
- cell and label positioning
- cell and label highlighting on hover
- dendrogram rendering

#### Dependencies
 - Modern web browser
 - ExtJs 4.2

## API

### Key concepts:
Two major parts of visualization are:
- matrix of cells
- labels for the rows and columns
 
...Diagram goes here...

### Configuration

```javascript
var visualization = Ext.create('Matrix2Viz', {
	... configuration ...
}
```

Configuration boils down to providing data and functions for rendering these data. There are two types of data:
- cell data
- row and column data

#### data

_data_ is an object that must provide _dimensions_ property and _getDataAt_ function:

```javascript
data: {
	getDataAt: function(rowIndex, columnIndex) {...}, // returns your cell data object
	dimensions: {numberOfRows: ..., numberOfColumns: ...} // dimensions of your data 
}
```

The framework is data agnostic. In other words, your _getDataAt(rowIndex,columnIndex)_ function can return anything. The returned object is just passed to the rendering function you provide.
	
Each column can have metadata associated with it. In the simplest case it could be just a text label. 

#### columns
```javascript
columns: [
	{
 		// [optional] string representing datatype of this column.
 		// If all your data are of the same type this is not needed.
 		type : 'example type', 
 		
 		// Any number of properties of any type
 		label : 'example label',
 		someImportantValue: 123
	},
	...
]
```

#### rows

Row metadata is similar but doesn't suppot _type_ property.

```javascript
rows: [
		{
 			// Any number of properties of any type
 			label : 'example label',
 			taste: 'very tasty'
		},
		...
]
```

### renderers

Renderers draw your data using HTML5's _CanvasContext2d_. 

Config:
```javascript
renderers: [
  // if all columns are of the same type pass single object here i.e. not array
  cell: [
   'data type A' : {renderer: ...},
			'data type B' : {render: ...},
			'data type C' : {render: ...}
  ], 
  columnMetadata: [
  			'property X' : {render: ...},
  			'property Y' : {render: ...}
  ]
  rowMetadata: [
  			'property 1' : {render: ...},
			  'property 2' : {render: ...}
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

