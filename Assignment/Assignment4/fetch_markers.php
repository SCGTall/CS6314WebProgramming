<?php
require("phpsqlajax_dbinfo.php");

// Opens a connection to a MySQL server
$con = mysqli_connect("localhost", $username, $password, $database);
if (!$con){
  echo "Unable to connnect to database";
  echo "Debugging errno: " . mysqli_connect_errno();
}

// Select all the rows in the markers table
$query = "SELECT * FROM Markers WHERE 1";
$result = mysqli_query($con, $query);
if (!$result) {
  die('Invalid query: ' . mysql_error());
}

// Initialize array
$arr = array();

// Iterate through the rows, adding JSON nodes for each
while ($row = mysqli_fetch_assoc($result)){
  $arr[] = $row;
}

// Print array in JSON format
$dbdata = array();
$dbdata['markers'] = $arr;
echo json_encode($dbdata);

?>