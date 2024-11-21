<?php

// echo json_decode($_POST['fen']);

require_once('check.php');
$cb=check();

if ($cb!='/chess/admin.php') { header("Location: /chess/"); exit(); }


$query = mysql_query("SELECT * FROM puzzles WHERE puzzle_id='".$_POST['puzzle_id']."'");


if(mysql_fetch_row($query)) {
mysql_query("UPDATE puzzles SET puzzle_goal='".$_POST['goal']."' WHERE puzzle_id=".$_POST['puzzle_id'].";");
} else {
mysql_query("INSERT INTO puzzles(puzzle_goal) VALUES ('".$_POST['puzzle_id']."');");

}

// echo "UPDATE puzzles SET puzzle_goal='".$_POST['goal']."' WHERE puzzle_id=".$_POST['puzzle_id'].";";



?>
