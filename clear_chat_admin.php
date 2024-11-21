<?php

require_once('check.php');
$cb=check();

if ($cb!="/chess/admin.php") { print "Permission denied"; exit(); }


#проверяем соединение
if(!mysql_query('SELECT 1')) {
    include('db.php');
}

// if ($_POST['text']) $text=safeString(json_decode($_POST['text']));
// if ($_POST['text']) $text=safeString($_POST['text']);
// var_dump($_POST['text']);
// var_dump(json_decode(html_entity_decode($_POST['text'])));
// echo(json_last_error ());

mysql_query("DELETE FROM chat WHERE user_id=".$_POST['user']." AND puzzle_id=".$_POST['puzzle'].";");

?>