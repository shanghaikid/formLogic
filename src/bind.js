// bind elements
// $.aop.after( {target: window, method: 'SomeSharePointFunction'},

//   function() {

//     alert('About to execute SomeSharePointFunction');

//   }

// );

// {
// 	'multiple_choice' : {},
// 	'checkboxes' : {},
// 	'matrix': {},
// 	'dropdown' : {}
// }

$("form.appnitro :input").bind('click', function() {
	console.log(this);
})