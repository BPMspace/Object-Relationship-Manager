<?php

define("sprefix", "com.mitsm.configurator.");
session_start();

function check_special_name($table) {
	switch(strtolower($table)) {
		case "group":
			return '"' . $table . '"';
			break;
		default:
			break;
	}

	return $table;
}

function get_tables () {

	$error = 0;
	$user = $_SESSION[username];

	$dbhandle = new SQLite3("./db/$user.db");

	$stm = 'SELECT name FROM sqlite_master WHERE type = "table"';

	$res = $dbhandle->query($stm);
	$e = $dbhandle->lastErrorMsg();
	if (!$res) die("Cannot execute statemen $e t. $stm" . $e);

	$r = array();
	while($row = $res->fetchArray(SQLITE3_NUM)) {
		array_push($r, $row[0]);
	} 

	$dbhandle->close();
	return $r;
}

function get_all ($table) {

	$error = 0;
	$user = $_SESSION[username];

	$table = check_special_name($table);

	$dbhandle = new SQLite3("./db/$user.db");

	$stm = "SELECT data from $table";

	$res = $dbhandle->query($stm);
	$e = $dbhandle->lastErrorMsg();
	if (!$res) die("Cannot execute statemen $e t. $stm" . $e);

	$json = "[";

	while($row = $res->fetchArray(SQLITE3_NUM)) {
		if ($json != "[") 
			$json .= ", ";
		$json .= $row[0];
	} 
	$json .= "]";

	$dbhandle->close();
	return $json;
}

function delete_from($key, $table) {

	$error = 0;
	$user = $_SESSION[username];

	$table = check_special_name($table);

	$dbhandle = new SQLite3("./db/$user.db");

	$stm = "DELETE FROM $table WHERE key == \"$key\"";

	$res = $dbhandle->query($stm);
	if (!$res) die("Error $e t. $stm \n" . $dbhandle->lastErrorMsg());

	$dbhandle->close();
	return json_encode(array('status' => "success"));
}

function define_table($name) {
	$error = 0;
	$user = $_SESSION[username];

	$name = check_special_name($name);

	$dbhandle = new SQLite3("./db/$user.db");

	$stm = "CREATE table $name(key text PRIMARY KEY, data text NOT NULL)";

	$res = $dbhandle->query($stm);
	if (!$res) die("Error $e t. $stm \n" . $dbhandle->lastErrorMsg());

	$dbhandle->close();
	return json_encode(array('status' => "success"));
}

function insert_or_update($j, $table) {

	$error = 0;
	$user = $_SESSION[username];

	$table = check_special_name($table);

	$dbhandle = new SQLite3("./db/$user.db");

	$data = json_encode($j);
	$key = $j->id;

	$stm = "INSERT OR REPLACE INTO $table(key, data) VALUES('$key', '$data')";
	//error_log($stm);

	$res = $dbhandle->query($stm);
	if (!$res) die("Error $e t. $stm \n" . $dbhandle->lastErrorMsg());

	$dbhandle->close();
	return $data;
}

function check_id($t, $j) {
	if ($j->id == "") {
		exit();
	}
}

function store_gen($t, $j) {
	check_id($t, $j);
	return insert_or_update($j, $t);
}

function delete_gen($t, $id) {
	if ($id == "") {
		return "ERROR";
	}
	return delete_from($id, $t);
}

function mk_key($type, $value) {
	$value = str_replace(" ", "_", strtolower($value));
	$value = constant("sprefix") . $type . $value;
	return $value;
}

function is_authenticated() {
  return isset($_SESSION[authenticated]) && $_SESSION[authenticated] == "yes";
}

function require_authentication() {
	if (!is_authenticated()) {
		header("Location:index.php");
	}
}

function fixup_ids($data) {
	$str = json_encode($data);
	$tables = array_keys(get_object_vars($data));
	foreach ($tables as $table) {
		foreach ($data->$table as $item) {
			$id = $item->id;
			$newid = sprintf('%04X%04X%04X%04X%04X%04X%04X%04X', mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(16384, 20479), mt_rand(32768, 49151), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535));
			$str = preg_replace("/$id/",$newid, $str);
		}
	}
	return json_decode($str);
}

function import_table($data, $all, $overwrite) {
	$all_tables = array_keys(get_object_vars($data));
	if ($all)
		$tables = $all_tables;
	else
		$tables = array("objects", "attributes", "relations");

	if (!$overwrite)
		$data = fixup_ids($data);

	// Although we import no data, tables must exist
	$tables_create = array_diff($all_tables, get_tables());
	foreach ($tables_create as $table) {
		define_table($table);
	}
	foreach ($tables as $table) {
		foreach ($data->$table as $item) {
			insert_or_update($item, $table);
		}
	}
	return json_encode(array('success'=>true));

}

function export_table($all) {
	$data = array();
	if ($all)
		$tables = get_tables();
	else
		$tables = array("objects", "attributes", "relations");

	foreach ($tables as $table) {
		$data[$table] = json_decode(get_all($table));
	}
	return json_encode($data);

}

function export_table_xml($all) {
	function normalizeSimpleXML($obj, &$xml) {
		$i = 0;
		$data = $obj;
		if (is_object($data)) {
			$data = get_object_vars($data);
		}
		if (is_array($data)) {
			foreach ($data as $key => $value) {
				if (is_object($value))
					normalizeSimpleXML($value, $xml->addChild($key));
				else
					normalizeSimpleXML($value, $xml->addChild($key, $value));
			}
		}
	}
	$xml = new SimpleXMLElement("<export verson='1'></export>");
	
	if (all)
		$tables = get_tables();
	else
		$tables = array("objects", "attributes", "relations");

	foreach ($tables as $table) {
		$data = json_decode(get_all($table));
		normalizeSimpleXML($data, $xml->addChild($table));
	}

	// Prettyfy the output
	$dom = dom_import_simplexml($xml)->ownerDocument;
	$dom->formatOutput = true;
	return $dom->saveXML();
}

if (!is_authenticated()) 
	exit();

?>
