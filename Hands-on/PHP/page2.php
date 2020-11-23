<?php
session_start();

echo "username:".$_POST["username"].", password: ".$_POST["password"];

//if username and password is valid
$_SESSION["usr"] = $_POST["username"];


?>
