<!DOCTYPE html>
<html>
<head>
	<title>Top-Five Baby Names</title>
	<style type="text/css">
	table {
		margin: 10px;
		border: 3px solid black;
		text-align: left;
		padding: 1px;
	}

	th, td {
		border: 1px solid black;
		padding: 5px;
	}

    .select {
    	margin: 10px;
    	padding: 10px;
    }
 
  </style>
</head>
<body>
	<div class="select">
		<h2>Top-Five Baby Names</h2>
		<form method="POST">
			<p>
				<label>Year: </label>
				<!-- Use php to dynamicly decided selected attribute. -->
				<select name="year">
					<?php
						if ($_POST["year"] == "null" || $_POST["gender"] == ""){
							echo "<option value='null' selected='selected'>All years</option>";
						}
						else{
							echo "<option value='null'>All years</option>";
						}
						if ($_POST["year"] == "2005"){
							echo "<option value='2005' selected='selected'>2005</option>";
						}
						else{
							echo "<option value='2005'>2005</option>";
						}
						if ($_POST["year"] == "2006"){
							echo "<option value='2006' selected='selected'>2006</option>";
						}
						else{
							echo "<option value='2006'>2006</option>";
						}
						if ($_POST["year"] == "2007"){
							echo "<option value='2007' selected='selected'>2007</option>";
						}
						else{
							echo "<option value='2007'>2007</option>";
						}
						if ($_POST["year"] == "2008"){
							echo "<option value='2008' selected='selected'>2008</option>";
						}
						else{
							echo "<option value='2008'>2008</option>";
						}
						if ($_POST["year"] == "2009"){
							echo "<option value='2009' selected='selected'>2009</option>";
						}
						else{
							echo "<option value='2009'>2009</option>";
						}
						if ($_POST["year"] == "2010"){
							echo "<option value='2010' selected='selected'>2010</option>";
						}
						else{
							echo "<option value='2010'>2010</option>";
						}
						if ($_POST["year"] == "2011"){
							echo "<option value='2011' selected='selected'>2011</option>";
						}
						else{
							echo "<option value='2011'>2011</option>";
						}
						if ($_POST["year"] == "2012"){
							echo "<option value='2012' selected='selected'>2012</option>";
						}
						else{
							echo "<option value='2012'>2012</option>";
						}
						if ($_POST["year"] == "2013"){
							echo "<option value='2013' selected='selected'>2013</option>";
						}
						else{
							echo "<option value='2013'>2013</option>";
						}
						if ($_POST["year"] == "2014"){
							echo "<option value='2014' selected='selected'>2014</option>";
						}
						else{
							echo "<option value='2014'>2014</option>";
						}
						if ($_POST["year"] == "2015"){
							echo "<option value='2015' selected='selected'>2015</option>";
						}
						else{
							echo "<option value='2015'>2015</option>";
						}
					?>
				</select>
			</p>
			<p>
				<label>Gender: </label>
				<select name="gender">
					<?php
						if ($_POST["gender"] == "null" || $_POST["gender"] == ""){
							echo "<option value='null' selected='selected'>Both</option>";
						}
						else{
							echo "<option value='null'>Both</option>";
						}
						if ($_POST["gender"] == "m"){
							echo "<option value='m' selected='selected'>Male</option>";
						}
						else{
							echo "<option value='m'>Male</option>";
						}
						if ($_POST["gender"] == "f"){
							echo "<option value='f' selected='selected'>Female</option>";
						}
						else{
							echo "<option value='f'>Female</option>";
						}
					?>
				</select>
			</p>
			<input type="submit" value="Submit">
		</form>
	</div>
	<hr>

	<?php

		$year = $_POST["year"];
		$gender = $_POST["gender"];

		if ($year != "" || $gender != ""){
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
		}

	?>
	</body>
</html>
























