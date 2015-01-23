<?php
  session_start();
  session_unset();
  srand();
  $challenge = "";
  ob_start();
  
  for ($i = 0; $i < 80; $i++) {
    $challenge .= dechex(rand(0, 15));
  }
  $_SESSION[challenge] = $challenge;
  $test_db_path= "bcknd/db/test.db";
  $sql = file_get_contents("unit_ui_test/data.sql");

  @chown($test_db_path,0664);
  ob_flush();
  if (!@unlink($test_db_path))
	  echo "Unlink failed!"; 
  $dbhandle = new SQLite3( "bcknd/db/test.db" );
  
  $dbhandle->exec( $sql );
  $dbhandle->close();
?>
<html>
<head>
	
    <title id="page-title">ORM Jasmine Unit Test </title>

    <link rel="stylesheet" type="text/css" href="unit_ui_test/jasmine_unit_testing/lib/jasmine/jasmine.css">

    <script type="text/javascript" src="extjs/ext-all-debug.js"></script>

    <script type="text/javascript" src="md5.js"></script>
    <script type="text/javascript">
    	var bcknd = "bcknd/";
    	var un="test";
    	var pw="test";
    	var ch="<?php echo $challenge; ?>";
    </script>

    <script type="text/javascript" src="unit_ui_test/jasmine_unit_testing/lib/jasmine/jasmine.js"></script>
    <script type="text/javascript" src="unit_ui_test/jasmine_unit_testing/lib/jasmine/jasmine-html.js"></script>

    <!-- include specs here -->
	<script type="text/javascript" src="unit_ui_test/jasmine_unit_testing/specs/01-InitTest.js"></script>
	<script type="text/javascript" src="unit_ui_test/jasmine_unit_testing/specs/02-ViewportTest.js"></script>
	<script type="text/javascript" src="unit_ui_test/jasmine_unit_testing/specs/03-TreeTest.js"></script>
	<script type="text/javascript" src="unit_ui_test/jasmine_unit_testing/specs/04-Relations-Test.js"></script>
	

    <!-- test launcher -->
    <script type="text/javascript">
Ext.Loader.setConfig({
    enabled : true,
    paths   : {
        "Rob" : "./app/",
        "Ext.ux" : './extjs/ux/',
    } 
});
	Ext.onReady(function() {
	Ext.Ajax.request({
		url: './bcknd/authenticate.php',
        method: 'POST',
      	params: {
			response: hex_md5(ch+pw),
			username: un,
		},
		success: function(response, opts) {
			Ext.DomHelper.append( Ext.getBody(), '<iframe id="ifr" src="index2.html" style=" margin-top: 0px; height: 400px; width: 600px; top: 100px; position: absolute;"></iframe>');
			setTimeout(function() {
				var w = document.getElementsByTagName('iframe')[0].contentWindow;
				oExt=Ext;
				Ext=w.Ext;
				oExt.History.init();
				oExt.History.on("change", function(t, p) { 
					Rob.ORM.getController("Navigation").selectHistoryNode(t,p);
				});
				Ext.History.getToken=function() { return oExt.History.getToken() };
				Rob=w.Rob;
				jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
				jasmine.getEnv().execute();
			}, 4000);
		},
		failure: function(response, opts) {
			Ext.MessageBox.show({
			  title: 'Error loggin in',
			  msg: action.result.message,
			  buttons: Ext.Msg.OK,
			  icon: Ext.MessageBox.ERROR
			});
		}
	});
    });
    </script>

</head>
<body>
</body>
</html>
