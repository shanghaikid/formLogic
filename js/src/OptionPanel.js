// OptionPanel.js
// 
define([
		'dojo/_base/declare',
		'dojo/_base/lang',
		'dojo/query',

		'dijit/_WidgetBase', 
		'dijit/_TemplatedMixin',
		'dijit/_WidgetsInTemplateMixin',
		'dijit/Dialog',

		'dojo/text!./OptionPanel.html'

		], 
function(declare, lang, query, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Dialog, template){

return declare([Dialog, _WidgetsInTemplateMixin], {

	templateString: template,

	postMixInProperties: function(){
		this.title = '为选项 ' + this.title + ' 添加规则';

		this.inherited(arguments);
	},

	postCreate:function() {
		this.containerNode.innerHTML = 'abc';
		this.inherited(arguments);
	},

	onOk: function() {
		console.log('on Ok');
	},

	_onOk: function() {
		this.inherited(arguments);
		this.onOk();
		this.hide();
	},

	destroy: function() {
		this.okBtn.destroy();
		this.cancelBtn.destroy();
		this.inherited(arguments);
		

	}




});
});