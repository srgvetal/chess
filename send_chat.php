<?php

require_once('check.php');
$cb=check();

if ($cb!="/chess/user.php") { print "Permission denied"; exit(); }


#проверяем соединение
if(!mysql_query('SELECT 1')) {
    include('db.php');
}
// var_dump($_POST['text']);

if ($_POST['text']) $text=safeString($_POST['text']); //stripslashes( ?
// if ($_POST['text']) $text=safeString(json_decode($_POST['text']));

if (strlen($text)==0) exit();

mysql_query("INSERT INTO chat(chat_if_admin, user_id, puzzle_id, chat_text, chat_timestamp) VALUES (0, $user_id, ".$_POST['puzzle'].", '".$text."', NOW());");

echo mysql_error();

?>