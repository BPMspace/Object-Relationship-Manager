<?php

	require("serv.inc");
	$ret =  json_encode(array('status' => "success"));
	$headers = array('status' => "HTTP/1.0 200 OK", 'content' => "Content-type: text/json");

	$rawpostdata = "";
	$func = $_GET["fn"];
	$table = $_GET["table"];

	if (isset($HTTP_RAW_POST_DATA)) {

		$rawpostdata = file_get_contents("php://input");
		try {
			$rawpostdata = json_decode($rawpostdata); // because I am using JSON Writer. You will need to change this to a function that suits your writer

			if(!is_array($rawpostdata))
				$rawpostdata = array($rawpostdata);

		} catch (Exception $e) {
			syslog(1, "Error reading data");
			$rawpostdata="error";
		}
	}
	
	if ($func == "load") {
		$ret = get_all($table);
	} elseif ($func == "define") {
		$ret = define_table($table);
	} elseif ($func == "import") {
		$content = "";
		$headers['content'] = "Content-type: text/html";

		try {
			$tmpName  = $_FILES['fileupload']['tmp_name'];
			$fp = fopen($tmpName, 'r');
			$content = json_decode(fread($fp, filesize($tmpName)));
			fclose($fp);
		} catch (Exception $e) {
			syslog(1, "Error decoding export file content");
			$content = array();
		}
		$all = $_POST["importData"];
		$as_new = $_POST["importOverwrite"];
		$ret = import_table($content, $all, $as_new);
	} elseif ($func == "export") {
		$ret = export_table($_GET["all"] == "true");
		header('Content-disposition: attachment; filename=export.json');
		header('Content-Transfer-Encoding: binary');
	} else {
		if (!$rawpostdata)
			die("error in $func unknown $rawpostdata");
	
		foreach ($rawpostdata as $item) {
			if ($func == "update") {
				$ret = store_gen($table, $item);
			} elseif ($func == "new") {
				$ret = store_gen($table, $item);
			} elseif ($func == "destroy") {
				$ret = delete_gen($table, $item->id);
			}
			else die("this is $func to $table unknown");
		}
	}

	foreach ($headers as $t => $value) {
		header($value);
	}
	echo $ret
?>

