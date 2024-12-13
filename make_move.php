<?php

// echo json_decode($_POST['fen']);

require_once('check.php');
$cb=check();

if ($cb!='user.php') { header("Location: ./"); exit(); }

// echo 'php: '.$_POST['blacklast'];

$historytemp=json_decode(stripslashes($_POST['history']));

$query = mysql_query("SELECT * FROM puzzlesolves WHERE user_id=$user_id AND puzzle_id='".$_POST['puzzle_id']."'");

// echo mysql_fetch_row($query);
if(mysql_fetch_row($query)) {
mysql_query("UPDATE puzzlesolves SET puzzle_fen_finished='".$_POST['fen']."', annotation='$historytemp',puzzlesolve_jhistory='".$_POST['jhistory']."',puzzlesolve_thistory='".$_POST['thistory']."', puzzlesolve_blacklast='".$_POST['blacklast']."' WHERE user_id=$user_id AND puzzle_id=".$_POST['puzzle_id'].";");
} else {
mysql_query("INSERT INTO puzzlesolves(user_id,puzzle_id,puzzle_fen_finished,annotation,puzzlesolve_jhistory,puzzlesolve_thistory,puzzlesolve_blacklast) VALUES ($user_id,".$_POST['puzzle_id'].",'".$_POST['fen']."','$historytemp','".$_POST['jhistory']."','".$_POST['thistory']."','".$_POST['blacklast']."');");

}


// mysql_real_escape_string(unescaped_string)
// 
// echo $_POST['fen'];
// mysql_query("INSERT INTO puzzlesolves(user_id,puzzle_id,puzzle_fen_finished) VALUES ($user_id,".$_POST['puzzle_id'].",'".$_POST['fen']."');");
    
    // mysql_query("INSERT INTO puzzlesolves(user_id,puzzle_id,puzzle_fen_finished) VALUES ($user_id,".$_POST['puzzle_id'].",'".$_POST['fen']."') ON DUPLICATE KEY UPDATE puzzle_fen_finished='".$_POST['fen']."';");
// } else {
// 
    // echo "UPDATE";
    // mysql_query("UPDATE puzzlesolves SET puzzlesolve_timestamp_modify=NOW() WHERE user_id=$user_id AND puzzle_id=".$_POST['puzzle_id'].";");
    // mysql_query("UPDATE puzzlesolves SET puzzle_fen='".safeString($_POST['fen'])."', puzzle_boardsize='".safeString($_POST['boardsize'])."' WHERE puzzle_id='".$_POST['puzzle_id']."'");
// }


// echo $data.length(); INSERT INTO `puzzlesolves` VALUES SET user_id=7, puzzle_id=12;

// if ($_POST['puzzle_id']) {
//     mysql_query("UPDATE puzzles SET puzzle_fen='".safeString($_POST['fen'])."', puzzle_boardsize='".safeString($_POST['boardsize'])."' WHERE puzzle_id='".$_POST['puzzle_id']."'");
// }



// $query = mysql_query("SELECT puzzle_fen, puzzle_goal FROM puzzles WHERE puzzle_id='".$_POST['puzzle_id']."'");
// $data = mysql_fetch_assoc($query);

// echo $data['puzzle_fen'];


?>
