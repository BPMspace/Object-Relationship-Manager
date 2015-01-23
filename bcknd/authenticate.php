<?php 

	// TODO read from database
	function getPasswordForUser($username) {
		$error = 0;
		$dbhandle = new SQLite3("./users.db");

		$stm = "SELECT password from users where username = \"$username\"";

		$res = $dbhandle->query($stm);
		$e = $dbhandle->lastErrorMsg();
		if (!$res) die("Cannot execute statemen $e t. $stm" . $e);

		while($row = $res->fetchArray(SQLITE3_NUM)) {
			return $row[0];
		} 
		return "";
	}
	function validate($challenge, $response, $password) {
		return md5($challenge . $password) == $response;
	}
	function authenticate() {
	  if (isset($_SESSION[challenge]) && isset($_REQUEST[username]) && isset($_REQUEST[response])) {
	    $password = getPasswordForUser($_REQUEST[username]);
	    if (validate($_SESSION[challenge], $_REQUEST[response], $password)) {
	      $_SESSION[authenticated] = "yes";
	      $_SESSION[username] = $_REQUEST[username];
	      unset($_SESSION[challenge]);
	    } else {
	      echo '{"success":false,"message":"Incorrect user name or password."}';
	      exit;
	    }
	  } else {
	    echo '{"success":false,"message":"Session expired"}';
	    exit;
	  }
	}
	session_start();
	authenticate();
	echo '{"success":true}';
	exit();
?>
