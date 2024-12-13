<?php

require_once('check.php');
$cb=check();

if ($cb!="admin.php") { print "Permission denied"; exit(); }
if (!isset($_GET['user'])) { print "User id is not defined"; exit(); }

#проверяем соединение
if(!mysql_query('SELECT 1')) {
    include('db.php');
}

$query = mysql_query("SELECT puzzles.puzzle_id, puzzles.puzzle_fen, puzzles.puzzle_boardsize, puzzles.puzzle_goal
FROM puzzles
INNER JOIN puzzlesolves ON puzzles.puzzle_id=puzzlesolves.puzzle_id AND puzzlesolves.user_id=".$_GET['user']." 
ORDER BY puzzle_id");
// $data = mysql_fetch_assoc($query);

echo mysql_error();

while ($row = mysql_fetch_array($query, MYSQL_ASSOC)) {
    
    $goal=$row['puzzle_goal'];
    echo ("<a href='puzzle-check-solved".$row['puzzle_boardsize'].".php?id=".$row['puzzle_id']."&user=".$_GET['user']."' title='".$goal."'><li class='wonumbers'><span class='numberr'>".$row['puzzle_id']."</span><img src='img/chessboard".$row['puzzle_boardsize']."_thumb.png'/><div style='font-size:75%;display:block;position:absolute;margin-top:-40px;width:70px;padding:4px 0 0 4px;color:black;max-height:40px;line-height:110%;text-shadow:1px 1px 1px white, -1px -1px 1px white, 1px -1px 1px white, -1px 1px 1px white;font-weight:bold;overflow-y:hidden'>".$goal."</div></a></li>");
}

?>