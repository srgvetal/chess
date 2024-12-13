<?php

// echo json_decode($_POST['fen']);

require_once('check.php');
$cb=check();

if ($cb!='admin.php') { header("Location: ./"); exit(); }

$query = mysql_query("SELECT puzzle_fen_finished, annotation, puzzlesolve_jhistory, puzzlesolve_thistory, puzzlesolve_blacklast FROM puzzlesolves WHERE puzzle_id='".$_POST['puzzle_id']."' AND user_id='".$_POST['user_id']."' AND ((puzzlesolves.puzzlesolve_jhistory<>'' AND puzzlesolves.puzzlesolve_jhistory IS NOT NULL)) ORDER BY puzzlesolve_timestamp DESC LIMIT 1;");

if (mysql_num_rows($query)) {

$data = mysql_fetch_assoc($query);

// echo "SELECT puzzle_fen_finished FROM puzzlesolves WHERE puzzle_id='".$_POST['puzzle_id']."' AND user_id='".$_POST['user_id']."';";
echo 'var newfen="'.$data['puzzle_fen_finished'].'";';
echo 'var newannotation="'.$data['annotation'].'";';
echo 'var jj='.$data['puzzlesolve_jhistory'].', jhistory=jj.jhistory, jhistory_count=jj.jhistory_count, jhistory_length=jj.jhistory_length;';
echo 'var thistory='.$data['puzzlesolve_thistory'].';';

echo 'var position=jhistory[jhistory_count]';
if ($data['puzzlesolve_blacklast']) echo '+" b"'; else echo '+" w"';
echo ';';
if ($data['puzzlesolve_blacklast']) echo 'var blacklast=true;'; else echo 'var blacklast=false;'; 

} else {
    $query2 = mysql_query("SELECT puzzle_fen_finished, annotation FROM puzzlesolves WHERE puzzle_id='".$_POST['puzzle_id']."' AND user_id='".$_POST['user_id']."' ORDER BY puzzlesolve_timestamp DESC LIMIT 1;");

    $data2 = mysql_fetch_assoc($query2);
    echo 'var newfen="'.$data2['puzzle_fen_finished'].'";';
    echo 'var newannotation="'.$data2['annotation'].'";';
    echo 'var position="'.$data2['puzzle_fen_finished'].'";';
    echo 'var oldresponse=true;';
}



?>
