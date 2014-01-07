// _FormWidgetBase
// 
define([
		'dojo/_base/declare',
		'dojo/_base/lang',
		'src/_BaseClass',
		'src/MultipleChoice',
		'src/Checkboxes',
		'src/Matrix',
		'src/Dropdown',
		], 
function(declare, lang, _BaseClass, MultipleChoice, Checkboxes, Matrix, Dropdown){

	var RulesConfig = {};

	var config = {
		cls: ['checkboxes', 'matrix', 'multiple_choice', 'dropdown'],
		query: ['li.checkboxes', 'li.matrix', 'li.multiple_choice', 'li.dropdown'],
		widgetClass: [Checkboxes, Matrix, MultipleChoice, Dropdown]

	};

	RulesConfig.config = config;

return RulesConfig;
});