<?php
/********************************************************************************
 MachForm
  
 Copyright 2007-2012 Appnitro Software. This code cannot be redistributed without
 permission from http://www.appnitro.com/
 
 More info at: http://www.appnitro.com/
 ********************************************************************************/
	require('includes/init.php');

	header("p3p: CP=\"IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT\"");
	
	require('config.php');
	require('includes/language.php');
	require('includes/db-core.php');
	require('includes/common-validator.php');
	require('includes/view-logic-functions.php');
	require('includes/post-functions.php');
	require('includes/filter-functions.php');
	require('includes/entry-functions.php');
	require('includes/helper-functions.php');
	require('includes/theme-functions.php');
	require('lib/swift-mailer/swift_required.php');
	require('lib/recaptchalib.php');
	require('lib/php-captcha/php-captcha.inc.php');
	require('lib/text-captcha.php');
	require('hooks/custom_hooks.php');
		
	$dbh 		= mf_connect_db();
	$ssl_suffix = mf_get_ssl_suffix();

	
		$form_id 		= (int) trim($_GET['id']);
		$page_number	= (int) trim($_GET['mf_page']);
		
		$page_number 	= mf_verify_page_access($form_id,$page_number);
		
		$resume_key		= trim($_GET['mf_resume']);
		if(!empty($resume_key)){
			$_SESSION['mf_form_resume_key'][$form_id] = $resume_key;
		}
		
		if(!empty($_GET['done']) && (!empty($_SESSION['mf_form_completed'][$form_id]) || !empty($_SESSION['mf_form_resume_url'][$form_id]))){
			$markup = mf_display_success($dbh,$form_id);
		}else{
			$form_params = array();
			$form_params['page_number'] = $page_number;
			$markup = mf_display_form($dbh,$form_id,$form_params);
		}
	
	header("Content-Type: text/html; charset=UTF-8");
	echo $markup;
	
?>