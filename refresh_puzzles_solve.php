<?php

require_once('check.php');
$cb=check();

if ($cb!="/chess/admin.php"&&$cb!="/chess/user.php") { print "Permission denied"; exit(); }


#проверяем соединение
if(!mysql_query('SELECT 1')) {
    include('db.php');
}

$query = mysql_query("SELECT puzzle_id, puzzle_fen, puzzle_boardsize, puzzle_goal FROM puzzles ORDER BY puzzle_id");
// $data = mysql_fetch_assoc($query);

while ($row = mysql_fetch_array($query, MYSQL_ASSOC)) {
    
    $goal=$row['puzzle_goal'];
    echo ("<a href='/puzzle-solve".$row['puzzle_boardsize'].".php?id=".$row['puzzle_id']."' title='".$goal."'><li><img src='img/chessboard".$row['puzzle_boardsize']."_thumb.png'/><div style='font-size:75%;display:block;position:absolute;margin-top:-40px;width:70px;padding:4px 0 0 4px;color:black;max-height:40px;line-height:110%;text-shadow:1px 1px 1px white, -1px -1px 1px white, 1px -1px 1px white, -1px 1px 1px white;font-weight:bold;overflow-y:hidden;overflow-x:hidden'>".$goal."</div></a></li>");
}

?>