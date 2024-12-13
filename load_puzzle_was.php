<?php

// echo json_decode($_POST['fen']);

require_once('check.php');
$cb=check();

if ($cb!='admin.php') { header("Location: ./"); exit(); }

$query = mysql_query("SELECT puzzle_fen, puzzle_goal, annotation FROM puzzles INNER JOIN puzzlesolves ON puzzlesolves.puzzle_id=puzzles.puzzle_id WHERE puzzles.puzzle_id='".$_POST['puzzle_id']."' AND user_id='".$_POST['user_id']."';");
$data = mysql_fetch_assoc($query);

// echo ("SELECT puzzle_fen, puzzle_goal, annotation FROM puzzles INNER JOIN puzzlesolves ON puzzlesolves.puzzle_id=puzzles.puzzle_id WHERE puzzles.puzzle_id='".$_POST['puzzle_id']."' AND user_id='".$_POST['user_id']."';");
echo 'var newfen="'.$data['puzzle_fen'].'";';
echo 'var newannotation="'.$data['annotation'].'";';


?>
