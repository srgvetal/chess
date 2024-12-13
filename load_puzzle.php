<?php

// echo json_decode($_POST['fen']);

require_once('check.php');
$cb=check();

if (($cb!='admin.php')&&($cb!='user.php')) { header("Location: ./"); exit(); }

$query = mysql_query("SELECT puzzle_fen, puzzle_goal FROM puzzles WHERE puzzle_id='".$_POST['puzzle_id']."'");
$data = mysql_fetch_assoc($query);

echo $data['puzzle_fen'];


?>
