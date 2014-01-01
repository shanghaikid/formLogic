// _Rule.js
// 
define([
		'dojo/_base/declare',
		'dojo/_base/lang',
		'dojo/_base/array',
		'dojo/string',
		'dojo/query',
		'dojo/on',
		'dojo/dom-construct',
		'src/OptionPanel'

		], 
function(declare, lang, array, string, query, on, domConstruct, OptionPanel){

return declare(null, {

	_createButton: function(labelNode, isAdd) {
		var htmlstr = isAdd ? "<button>+规则" + labelNode.innerHTML + "</button>" : "<button>-规则</button>";
		var className = isAdd ? "addRule" : "removeRule";
		return domConstruct.create('div',{ innerHTML:htmlstr, class:className }, labelNode, this.buttonPos);
	},

	createItemRuleButton: function(labelNode, item) {
		var questionButton = this._createButton(labelNode, true);
		var it = item;
		on(questionButton, 'click', lang.hitch(this, function(e){
			e.preventDefault();
			new OptionPanel({
				title: labelNode.innerHTML,
				onOk: lang.hitch(this, function(){this.onAddItemRule(questionButton, labelNode, it);}),
				a: this
			}).show();
			
			
		}));
	},

	onAddItemRule: function(btn, labelNode, item){
		domConstruct.destroy(btn);
		this.createItemRemoveRuleButton(labelNode, item);
	},

	createItemRemoveRuleButton: function(labelNode, item) {
		var it = item;
		var questionButton = this._createButton(labelNode);
		on(questionButton, 'click', lang.hitch(this, function(e){
			this.onRemoveItemRule(questionButton, labelNode, it);
			e.preventDefault();
		}));
	},

	onRemoveItemRule: function(btn, labelNode, item){
		domConstruct.destroy(btn);
		if (item.rule) item.rule = null;
		this.createItemRuleButton(labelNode, item);
	},

	buttonPos: 'after',

	createWidgetLogicButton: function(captionNode) {
		var widgetLogicButton = this._createButton(captionNode, true);
		on(widgetLogicButton, 'click', lang.hitch(this, function(e){
			this.onAddWidgetRule(widgetLogicButton);
			e.preventDefault();
		}));
	},

	onAddWidgetRule: function(btn){
		domConstruct.destroy(btn);
		this.createWidgetRemoveRuleButton(this._getCaption());
	},

	createWidgetRemoveRuleButton: function(captionNode) {
		var widgetLogicButton = this._createButton(captionNode);
		on(widgetLogicButton, 'click', lang.hitch(this, function(e){
			this.onRemoveWidgeRule(widgetLogicButton);
			e.preventDefault();
		}));
	},

	onRemoveWidgeRule: function(btn){
		domConstruct.destroy(btn);
		this.rule = null;
		this.createWidgetLogicButton(this._getCaption());
	},

// {target:'li_4', status: 'checked', action:'check', param:'all'} 
// ["target:'li_4'", " status: 'checked'", " action:'check'", " param:'all'"] 

	// parse rule from the string
	parseRule : function(rule) {
		var result = null,
			tmp;
		if(rule !== null) {
			result = {};
			tmp = rule.substring(1, rule.length -1).split(',');
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