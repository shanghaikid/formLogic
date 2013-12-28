// _Rule.js
// 
define([
		'dojo/_base/declare',
		'dojo/_base/lang',
		'dojo/_base/array',
		'dojo/string'

		], 
function(declare, lang, array, string){

return declare(null, {
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
	a: function(){console.log('none action executed');},

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