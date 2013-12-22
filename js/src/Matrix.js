// Checkboxes
// 
define([
		'dojo/_base/declare',
		'dojo/_base/array',
		'dojo/query',
		'dojo/dom-class',
		'src/_FormWidgetBase',
		'dojo/NodeList-traverse'
		], 

function(declare, array, query, domClass, _FormWidgetBase){

return declare('Matrix', [_FormWidgetBase], {


	elementClass: '.element.checkbox',

	items: null,

	caption: '',

	_type: '',

	constructor: function() {
		this.initWidget();
	},

	initWidget: function() {
		//this.inherited(arguments);

		// set caption
		this.caption = this._getCaption();
		// set type
		this._type = this._getType();
		// set Items
		this.items = [];
		this._getMatrixItmes();
		console.log('item', this.items);


	},

	_getCaption: function() {
		return query('caption', this.domNode)[0].innerText;
	},

	_getType: function() {
		var single = query('input[type=radio]', this.domNode).length > 0 ? 'single' : undefined,
			multi = query('input[type=checkbox]', this.domNode).length > 0 ? 'multi' : undefined;
		return single || multi;
	},

	_getMatrixItmes: function() {
		var items = query('tr', this.domNode);
		items.shift();
		array.forEach(items, function(item) {
			var question = query('td.first_col', item)[0].innerText;
			this.items.push(
				{	
					domNode: item,
					question: question
				}
			);
		}, this);
	}





});
});