<html>
<?php
session_start();

$username= $_POST["username"];
$password= $_POST["password"];


if(empty($username) || empty($password)){

	header('Location: page1.html');
}


$con = mysqli_connect("localhost", "root", "root", "test");

if($con){

	$sql = "SELECT * FROM users WHERE username='$username' AND password='$password' ";

	echo $sql;
	
	$result = mysqli_query($con, $sql);

	if (mysqli_num_rows($result) != 0 ){

		echo "User has signed in \n";
		$_SESSION["usr"] = $username;
		$_SESSION["num_visits"] = 0;


	}


}
else{
	echo "Unable to connect to database!";
	echo "Debugging errno: " . mysqli_connect_errno();

}


?>
</html>