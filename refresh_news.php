<?php

require_once('check.php');
$cb=check();

if ($cb!="admin.php") { print "Permission denied"; exit(); }


#проверяем соединение
if(!mysql_query('SELECT 1')) {
    include('db.php');
}

$news=array();

//Зарегистрировался
$query = mysql_query("SELECT user_name, user_surname, UNIX_TIMESTAMP(user_timestamp) FROM users WHERE ban=0 ORDER BY user_timestamp DESC");

while ($row = mysql_fetch_array($query, MYSQL_NUM)) {
    $row[2]+=TIME_INC_TO_OMSK;
    $key=date('Y.m.d H:i:s', $row[2]);
    $key.=' Xreg';
    $news[$key]="<li><span class='date'>".date('d.m', $row[2])."</span> <b>Зарегистрировался <span class='text'>$row[0] $row[1]</span></b></li>";
}

//сделал ходы
// $query2 = mysql_query("SELECT user_name, user_surname, UNIX_TIMESTAMP(puzzlesolves.puzzlesolve_timestamp), DISTINCT puzzlesolves.puzzle_id, DISTINCT users.user_id, puzzles.puzzle_boardsize FROM users INNER JOIN puzzlesolves ON users.user_id=puzzlesolves.user_id INNER JOIN puzzles ON puzzlesolves.puzzle_id=puzzles.puzzle_id ORDER BY user_timestamp DESC");
$query2 = mysql_query("SELECT user_name, user_surname, UNIX_TIMESTAMP(puzzlesolves.puzzlesolve_timestamp), puzzlesolves.puzzle_id, users.user_id, puzzles.puzzle_boardsize FROM users INNER JOIN puzzlesolves ON users.user_id=puzzlesolves.user_id INNER JOIN puzzles ON puzzlesolves.puzzle_id=puzzles.puzzle_id WHERE ((puzzlesolves.puzzlesolve_jhistory<>'' AND puzzlesolves.puzzlesolve_jhistory IS NOT NULL) OR puzzlesolves.annotation<>'') AND users.ban=0 ORDER BY user_timestamp DESC");

while ($row2 = mysql_fetch_array($query2, MYSQL_NUM)) {
    $row2[2]+=TIME_INC_TO_OMSK;
    $key=date('Y.m.d H:i:s', $row2[2]);
    $key.=' Zmove';
    $time=date('H:i',$row2[2]);
    $news[$key]="<li><span class='date'>".date('d.m', $row2[2])." $time</span> <span class='text'>$row2[0] $row2[1]</span> сделал ходы в <a href='puzzle-check-solved".$row2[5].".php?id=".$row2[3]."&user=".$row2[4]."'>головоломке $row2[3]</a></li>";
}

//открыл головоломку ходы
$query6 = mysql_query("SELECT user_name, user_surname, UNIX_TIMESTAMP(puzzlesolves.puzzlesolve_timestamp), puzzlesolves.puzzle_id, users.user_id, puzzles.puzzle_boardsize FROM users INNER JOIN puzzlesolves ON users.user_id=puzzlesolves.user_id INNER JOIN puzzles ON puzzlesolves.puzzle_id=puzzles.puzzle_id WHERE (puzzlesolves.puzzlesolve_jhistory='' OR puzzlesolves.puzzlesolve_jhistory IS NULL) AND puzzlesolves.annotation='' AND users.ban=0 ORDER BY user_timestamp DESC");

while ($row6 = mysql_fetch_array($query6, MYSQL_NUM)) {
    $row6[2]+=TIME_INC_TO_OMSK;
    $key=date('Y.m.d H:i:s', $row6[2]);
    $key.=' Ymove';
    $time=date('H:i',$row6[2]);
    $news[$key]="<li><span class='date'>".date('d.m', $row6[2])." $time</span> <span class='text'>$row6[0] $row6[1]</span> открыл <a href='puzzle-check-solved".$row6[5].".php?id=".$row6[3]."&user=".$row6[4]."'>головоломку $row6[3]</a></li>";
}

// echo mysql_error();

//чат в головоломках
$query3 = mysql_query("SELECT user_name, user_surname, UNIX_TIMESTAMP( chat2.chat_timestamp ) , chat2.puzzle_id, users.user_id, puzzles.puzzle_boardsize, chat2.chat_text
FROM users
INNER JOIN (SELECT chat3.puzzle_id, chat3.user_id, chat3.chat_timestamp, chat3.chat_text FROM (
SELECT puzzle_id, user_id, chat_timestamp, chat_text FROM chat WHERE chat_if_admin<>'1' ORDER BY chat_timestamp DESC
) AS chat3 GROUP BY puzzle_id, user_id) AS chat2 ON users.user_id = chat2.user_id
INNER JOIN puzzles ON chat2.puzzle_id = puzzles.puzzle_id
WHERE users.ban =0
ORDER BY chat2.chat_timestamp DESC");

// echo mysql_error();

while ($row3 = mysql_fetch_array($query3, MYSQL_NUM)) {
    $row3[2]+=TIME_INC_TO_OMSK;
    $key=date('Y.m.d H:i:s', $row3[2]);
    $key.=' Xchat';
    $time=date('H:i',$row3[2]);
    $news[$key]="<li><span class='date'>".date('d.m', $row3[2])." $time</span> <span class='italic'><span class='text'>$row3[0] $row3[1]</span> в <a href='puzzle-check-solved".$row3[5].".php?id=".$row3[3]."&user=".$row3[4]."'>головоломке $row3[3]</a>, сказал: \"$row3[6]\"</span></li>";
}

//онлайн
$query4 = mysql_query("SELECT user_name, user_surname, UNIX_TIMESTAMP( user_timestamp_lastenter ), user_id FROM users WHERE user_id<>$user_id AND user_timestamp_lastenter IS NOT NULL");
while ($row4 = mysql_fetch_array($query4, MYSQL_NUM)) {
    if (time()-$row4[2]>60) $byl='был '; else $byl='';
//со временем исключить фамилию "С...в"

    $row4[2]+=TIME_INC_TO_OMSK;
    $key=date('Y.m.d H:i:s', $row4[2]);
    $key.=' Aenter';
    $time=date('H:i',$row4[2]);
    $news[$key]="<li><span class='date'>".date('d.m', $row4[2])." $time</span> <b><a href='user_page.php?user=$row4[3]'><span class='text'>$row4[0] $row4[1]</span></a> ".$byl."в системе</b></li>";

}

//чат вне головоломок
$query5 = mysql_query("SELECT users.user_name, users.user_surname, UNIX_TIMESTAMP( chat.chat_timestamp ) , chat.chat_text, users.user_id
FROM users
INNER JOIN (SELECT * FROM 
    (SELECT * FROM chat WHERE chat_if_admin<>'1' AND puzzle_id=0 ORDER BY UNIX_TIMESTAMP( chat_timestamp ) DESC)
 AS chat2) AS chat ON users.user_id = chat.user_id 
WHERE users.ban =0");

// echo mysql_error();

while ($row5 = mysql_fetch_array($query5, MYSQL_NUM)) {
    $row5[2]+=TIME_INC_TO_OMSK;
    $key=date('Y.m.d H:i:s', $row5[2]);
    $key.=' Xchat';
    $time=date('H:i',$row5[2]);
    $news[$key]="<li><span class='date'>".date('d.m', $row5[2])." $time</span> <span class='italic'><a href='user_page.php?user=$row5[4]'><span class='text'>$row5[0] $row5[1]</a> сказал: \"$row5[3]\"</span></span></li>";

//user_name, user_surname, user_id, chat_text    
}


//query6 выше (открыл головоломку)



// var_dump($news);

krsort($news);
foreach ($news as $key => $val) {
    echo "$val\n";
}

?>