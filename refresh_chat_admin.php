<?php

require_once('check.php');
$cb=check();

if ($cb!="/chess/admin.php") { print "Permission denied"; exit(); }


#проверяем соединение
if(!mysql_query('SELECT 1')) {
    include('db.php');
}


if ($_POST['user']) $user=$_POST['user'];
if ($_GET['user']) $user=$_GET['user'];
if ($_GET['id']) $puzzle=$_GET['id']; else
if ($_POST['puzzle']) $puzzle=$_POST['puzzle']; else
$puzzle=0;




$query = mysql_query("SELECT chat_if_admin, chat_text, chat_timestamp, chat_read FROM chat WHERE user_id=$user AND puzzle_id=$puzzle ORDER BY chat_timestamp");

$weekday=Array();
$weekday=Array('Mon'=>'Пн','Tue'=>'Вт','Wed'=>'Ср','Thu'=>'Чт','Fri'=>'Пт','Sat'=>'Сб','Sun'=>'Вс');
if ($query)
while ($row = mysql_fetch_array($query, MYSQL_ASSOC)) {
    echo('<div>');
    if ($row['chat_if_admin']) echo '<b>';
    $timestamp=strtotime($row['chat_timestamp'])+TIME_INC_TO_OMSK-3600;
    echo $weekday[date('D', $timestamp)].', ';
    echo date('H:i', $timestamp).': ';
    echo $row['chat_text'];
    if ($row['chat_if_admin']) echo '</b>';
    echo('</div>');

}

?>