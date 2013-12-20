// bind elements




$.aop.after( {target: window, method: 'SomeSharePointFunction'},

  function() {

    alert('About to execute SomeSharePointFunction');

  }

);

SomeSharePointFunction();