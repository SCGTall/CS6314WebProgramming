<?php

	$year = $_GET["year"];
	if ($year == ""){
		$year = "null";
	}

	$gender = $_GET["gender"];
	if ($gender == ""){
		$gender = "null";
	}

	$con = mysqli_connect("localhost", "root", "root", "SSA");
	if (!$con){
		echo "Unable to connnect to database";
		echo "Debugging errno: " . mysqli_connect_errno();
	}
	else{
		$sql = "SELECT * FROM BabyNames";
		if ($year != "null" && $year != ""){
			if ($gender != "null" && $gender != ""){
				$sql .= " WHERE year = '$year' AND gender = '$gender'";
			}
			else{
				$sql .= " WHERE year = '$year'";
			}
		}
		else{
			if ($gender != "null" && $gender != ""){
				$sql .= " WHERE gender = '$gender'";
			}
		}
		$sql .= " ORDER BY year,gender,ranking";
		$result = mysqli_query($con, $sql);
		$table = "<table><tr><th>Name</th><th>Year</th><th>Gender</th><th>Ranking</th></tr>";
		while ($row = mysqli_fetch_array($result)){
			$table .= "<tr><td>".$row["name"]."</td><td>".$row["year"]."</td><td>".$row["gender"]."</td><td>".$row["ranking"]."</td></tr>";
		}
		$table .= "</table>";
		echo $table;
	}
?>