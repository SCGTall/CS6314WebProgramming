<?php
session_start();

if (isset($_SESSION["usr"])){

	echo "Welcome " . $_SESSION["usr"];
	echo "\nYou visited this page " . $_SESSION["num_visits"] . " times.";
	$_SESSION["num_visits"]++;
}
else{

	echo "Welcome guest";
}

?>
