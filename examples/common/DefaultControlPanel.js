/**
 *
 */
Ext.define('DefaultControlPanel', {
    alias: "widget.DefaultControlPanel",
    extend: 'MiniControlPanel',
    width: 100,
    height: 100,
    border: false,
    layout: 'vbox',
//    config: {
//        matrix2viz: null
//    },

    initComponent: function () {
        this.items = [
            {
                xtype: 'panel',
                layout: 'hbox',
                width: 95,
                height: 35,
                items: [
                    {
                        xtype: 'button',
                        text: 'legend',
                        width: 40,
                        height: 20,
                        handler: function() {
                            var window = Ext.create('Ext.window.Window', {
                                title: 'Legend',
                                height: 200,
                                width: 400,
                                layout: 'fit',
                                items: [
                                    {
                                        xtype: 'component',
                                        autoEl: 'canvas',
                                        itemId: 'legendCanvas'
                                    }
                                ]
                            });
                            window.show();

                            var stuff = [
                                {
                                    name:'gender',
                                    values:[
                                        {label:'male', value:'m'},
                                        {label:'female', value:'f'}
                                    ]
                                },
                                {
                                    name:'binary',
                                    values:[
                                        {label:'present', value:1},
                                        {label:'absent', value:0}
                                    ]
                                }
                            ];

                            var element = window.getComponent('legendCanvas').getEl();
                            var ctx = element.dom.getContext("2d");
                            this.drawLegend(ctx, stuff);
                        },
                        scope: this.getMatrix2viz()
                    },
                    {
                        xtype: 'button',
                        text: 'png',
                        width: 30,
                        height: 20,
                        handler: function() {
                            var window = Ext.create('Ext.window.Window', {
                                title: 'PNG',
                                height: 200,
                                width: 400,
                                layout: 'fit',
                                items: [
                                    {
                                        xtype: 'component',
                                        autoEl: 'img',
                                        itemId: 'pngImage'
                                    }
                                ]
                            });
                            window.show();
                            var url = this.drawPng();
                            var element = window.getComponent('pngImage').getEl().dom;
                            element.src = url;
                        },
                        scope: this.getMatrix2viz()
                    }
                ]
            },
            {
                xtype: 'panel',
                layout: 'hbox',
                width: 95,
                height: 35,
                items: [
                    {
                        xtype: 'button',
                        text: '5',
                        width: 20,
                        height: 20,
                        handler: function() {
                            this.updateCellSizes({width: 5, height: 5});
                        },
                        scope: this.getMatrix2viz()
                    },
                    {
                        xtype: 'button',
                        text: '10',
                        width: 20,
                        height: 20,
                        handler: function() {
                            this.updateCellSizes({width: 10, height: 10});
                        },
                        scope: this.getMatrix2viz()
                    },
                    {
                        xtype: 'button',
                        text: '15',
                        width: 20,
                        height: 20,
                        handler: function() {
                            this.updateCellSizes({width: 15, height: 15});
                        },
                        scope: this.getMatrix2viz()
                    },
                    {
                        xtype: 'button',
                        text: 'Fit',
                        width: 30,
                        height: 20,
                        handler: function() {
                            this.fitToScreen();
                        },
                        scope: this.getMatrix2viz()
                    }
                ]
            }

/*
 {
 xtype: 'button',
 itemId: 'zoomButton',
 enableToggle: true,
 text: 'Zoom',
 width: 70,
 height: 20,
 toggleHandler: function (button, state) {
 if (state) {
 this.updateCellSizes({width: 5, height: 5});
 } else {
 this.updateCellSizes({width: 15, height: 15})
 }
 },
 scope: this.getMatrix2viz()
 }
 */
        ];
        this.callParent(arguments);
    }
});