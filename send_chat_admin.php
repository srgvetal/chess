<?php

require_once('check.php');
$cb=check();

if ($cb!="/admin.php") { print "Permission denied"; exit(); }


#проверяем соединение
if(!mysql_query('SELECT 1')) {
    include('db.php');
}

// if ($_POST['text']) $text=safeString(json_decode($_POST['text']));
if ($_POST['text']) $text=safeString($_POST['text']); //stripslashes( ?
// var_dump($_POST['text']);
// var_dump(json_decode(html_entity_decode($_POST['text'])));
// echo(json_last_error ());
// 
if (strlen($text)==0) exit();

mysql_query("INSERT INTO chat(chat_if_admin, user_id, puzzle_id, chat_text, chat_timestamp) VALUES (1, ".$_POST['user'].", ".$_POST['puzzle'].", '".$text."', NOW());");

?>