<div class="clear"></div>
	
	</div><!-- /#main -->
	<img src="images/bottom.png" id="bottom_shadow">
	<div id="footer">
		
		<p class="copyright">Copyright &copy; <a href="http://www.appnitro.com">Appnitro Software</a> 2007-2013</p>
		<div class="clear"></div>
		
	</div><!-- /#footer -->
	

</div><!-- /#container -->

</div><!-- /#bg -->

<?php
	if($disable_jquery_loading !== true){
		echo '<script type="text/javascript" src="js/jquery.min.js"></script>';
	}
?>

<script type="text/javascript" src="js/jquery.support.borderRadius.js"></script>
<script type="text/javascript" src="js/jquery.corner.js"></script>
<script type="text/javascript">
    $(function(){
    	if(!$.support.borderRadius) { 
    	   $('#main, #content, #sidebar, .box').corner("13px");
        }
    });
</script>
<?php if(!empty($footer_data)){ echo $footer_data; } ?>
</body>
</html>