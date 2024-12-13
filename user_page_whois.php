<?php

require_once('check.php');
$cb=check();

if ($cb!="admin.php") { print "Permission denied"; exit(); }

if ($_GET['user']) $user_toview=$_GET['user']; else
if ($_POST['user']) $user_toview=$_POST['user']; else {
    print "User id is not defined"; exit();
}


#проверяем соединение
if(!mysql_query('SELECT 1')) {
    include('db.php');
}

$news=array();

//Зарегистрировался
$query = mysql_query("SELECT user_name, user_surname FROM users WHERE ban=0 AND user_id=$user_toview");

$row = mysql_fetch_array($query, MYSQL_NUM);

echo "$row[0] $row[1]";

?>