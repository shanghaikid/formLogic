// _Rule.js
// 
define([
		'dojo/_base/declare',
		'dojo/_base/lang',
		'dojo/_base/array',
		'dojo/string',
		'dojo/query',
		'dojo/on',
		'dojo/json',
		'dojo/dom-construct',
		'dojo/dom-attr',
		'src/OptionPanel',
		'src/RulesConfig'

		], 
function(declare, lang, array, string, query, on, json, domConstruct, domAttr, OptionPanel, RulesConfig){

return declare(null, {

	_initRuleDefinition: function() {
		return RulesConfig[this.declaredClass] || null;
	},

	_createButton: function(labelNode, isAdd, isWidget, pos) {
		var text = isWidget ? "题逻辑" : "选项逻辑";
		var htmlstr = isAdd ? "<button>添加"  + text + "</button>" : "<button>删除"+text+"</button>";
		var className = isAdd ? "addRule rbtn" : "removeRule rbtn";
		return domConstruct.create('div',{ innerHTML:htmlstr, 'class':className }, labelNode, pos || this.buttonPos);
	},

	createItemRuleButton: function(labelNode, item) {
		var questionButton = this._createButton(labelNode, true);
		var it = item;
		on(questionButton, 'click', lang.hitch(this, function(e){
			e.preventDefault();
			new OptionPanel({
				title: labelNode.innerText,
				onOk: lang.hitch(this, function(rule){this.onAddItemRule(questionButton, labelNode, it, rule);}),
				self: this,
				page: this.page,
				source: item,
				type: 'item'
			}).show();
		}));
	},


	createItemRemoveRuleButton: function(labelNode, item, rule) {
		var it = item;
		var questionButton = this._createButton(labelNode);
		domAttr.set(questionButton, 'title', rule.label);
		on(questionButton, 'click', lang.hitch(this, function(e){
			e.preventDefault();
			new OptionPanel({
				title: labelNode.innerText,
				onOk: lang.hitch(this, function(rule){this.onRemoveItemRule(questionButton, labelNode, it, rule);}),
				self: this,
				page: this.page,
				rule: rule,
				source: item,
				type: 'delete'
			}).show();
		}));
	},

	onAddItemRule: function(btn, labelNode, item, rule){
		// remove the button
		domConstruct.destroy(btn);
		// create the remove item rule button
		this.createItemRemoveRuleButton(labelNode, item, rule);
		// create an extra add item rule button beside the remove one
		this.createItemRuleButton(labelNode, item);
	},

	onRemoveItemRule: function(btn, labelNode, item, rule){
		// remove the button
		domConstruct.destroy(btn);
		//this.createItemRuleButton(labelNode, item);
	},

	buttonPos: 'after',

	createWidgetLogicButton: function(labelNode) {
		var widgetLogicButton = this._createButton(labelNode, true, true);
		on(widgetLogicButton, 'click', lang.hitch(this, function(e){
			e.preventDefault();
			new OptionPanel({
				title: labelNode.innerText,
				onOk: lang.hitch(this, function(rule){this.onAddWidgetRule(widgetLogicButton, labelNode, rule);}),
				self: this,
				page: this.page,
				type: 'widget'
			}).show();
		}));
	},

	createWidgetRemoveRuleButton: function(labelNode, rule) {
		var widgetLogicButton = this._createButton(labelNode, false, true);
		domAttr.set(widgetLogicButton, 'title', rule.label);
		on(widgetLogicButton, 'click', lang.hitch(this, function(e){
			e.preventDefault();
			new OptionPanel({
				title: labelNode.innerText,
				onOk: lang.hitch(this, function(rule){this.onRemoveWidgeRule(widgetLogicButton, labelNode, rule);}),
				self: this,
				rule: rule,
				page: this.page,
				type: 'delete'
			}).show();
		}));
	},

	onAddWidgetRule: function(btn, labelNode, rule){
		// remove the btn
		domConstruct.destroy(btn);
		// create the remove rule btn
		this.createWidgetRemoveRuleButton(this._getCaption(), rule);
		// create the add rule btn
		this.createWidgetLogicButton(this._getCaption());
	},

	onRemoveWidgeRule: function(btn){
		domConstruct.destroy(btn);
		this.rule = null;
		//this.createWidgetLogicButton(this._getCaption());
	},

	// parse rule from the string
	parseRule : function(rule) {
		var result = null,
			tmp;
		if(rule !== null) {
			result = {};
			tmp = rule.substring(1, rule.length -1).split(',');
			console.log(tmp);
			array.forEach(tmp, function(rule) {
				var keypair = this._parseSingleRule(rule);
				result[keypair[0]] = keypair[1];
			}, this);

		}
		return result;
	},

	// trim each single item
	_parseSingleRule: function(rule){
		var tmp = rule.split(':');
		tmp[0] = string.trim(tmp[0]);
		tmp[1] = string.trim(tmp[1]);
		return tmp;
	},

	//{target: "li_4", status: "checked", action: "check", param: "all"} 
	stringfy: function(obj){
		var str = '{';
		this.objEach(obj, function(value, key){
			str += key.toString() + ":"+ value.toString();
			str += ', ';
		});
		str = str.substring(0, str.length - 2);
		str += '}';
		return str;
	},

	// useful funciton
	objEach: function(obj, f, scope){
		for(var key in obj){
			if(obj.hasOwnProperty(key)){
				f.call(scope, obj[key], key);
			}
		}
	},

	// for action not in the list
	a: function(){console.warn('none action executed');},

	// not implement, undo function
	undoAction: function(){
		console.log('let us undo');
	},

	// default execute rule function
	execute: function(rule, e, force) {
		console.log('executed rule is', rule);
		// rule status
		var status = rule.status || null;
		// rule target
		var target = this._getTarget(rule);
		// rule condition
		var verified = force || this._verify(rule, e);

		if (!verified) {
			this.undoAction();
			return;
		}
		// get the rule params
		var p = rule.param === null || rule.param === 'all' ? undefined : rule.param;
		// get the rule actions
		var a = target.actionMap[rule.action] || this.a;

		//console.log('target obj is', target);
		// execute the action
		a.apply(target, [p]);
	},

	// verify the status of current item
	_verify: function(rule, e) {
		var s = rule.condition || this.defaultStatusValue;
		var itemStatus = this._getItemStatus(e.target);
		//console.log('s,itemStatus', s, itemStatus);
		return s == itemStatus;
	}

});
});