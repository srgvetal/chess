<?php

// echo json_decode($_POST['fen']);

require_once('check.php');
$cb=check();

if (($cb!='admin.php')&&($cb!='user.php')) { header("Location: ./"); exit(); }

$query = mysql_query("SELECT puzzle_goal FROM puzzles WHERE puzzle_id='".$_POST['puzzle_id']."'");


while ($row = mysql_fetch_array($query, MYSQL_ASSOC)) {
    echo $row['puzzle_goal'];
}

// echo 'test'
// echo "UPDATE puzzles SET puzzle_goal='".$_POST['goal']."' WHERE puzzle_id=".$_POST['puzzle_id'].";";



?>
