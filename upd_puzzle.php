<?php

// echo json_decode($_POST['fen']);

require_once('check.php');
$cb=check();

if ($cb!='/admin.php') { header("Location: /"); exit(); }

// echo "UPDATE puzzles SET puzzle_fen='".safeString($_POST['fen'])."', puzzle_boardsize='".safeString($_POST['boardsize'])."' WHERE puzzle_id='".$_POST['puzzle_id']."'";
//



if ($_POST['puzzle_id']) {
    mysql_query("UPDATE puzzles SET puzzle_fen='".safeString($_POST['fen'])."', puzzle_boardsize='".safeString($_POST['boardsize'])."' WHERE puzzle_id='".$_POST['puzzle_id']."'");

    mysql_query("DELETE FROM puzzlesolves WHERE puzzle_id=".$_POST['puzzle_id'].";");

}



?>
