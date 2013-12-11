matrix2viz
==========
 
### I'm in the process of copying things over, adding documentation, existing issues and roadmap. It'll take me two weekends to make this ready for consumption. I'll try to finish demo website first so that you can play around and look at existing functionality. (It's possible do so now by checking project out and running locally in the browser).

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
- cell data
- row and column metadata

### Construction
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

