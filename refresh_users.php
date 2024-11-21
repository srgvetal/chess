<?php

require_once('check.php');
$cb=check();

if ($cb!="/chess/admin.php") { print "Permission denied"; exit(); }


#проверяем соединение
if(!mysql_query('SELECT 1')) {
    include('db.php');
}

$query = mysql_query("SELECT user_name, user_surname, UNIX_TIMESTAMP(user_timestamp), user_mail, user_id FROM users WHERE ban=0 ORDER BY user_timestamp DESC");

while ($row = mysql_fetch_array($query, MYSQL_NUM)) {
    // printf ("<li><span class='date'>%s</span> <span class='text'>%s %s</span></li>", date('d.m.Y', $row[2]), $row[0], $row[1]);  
    echo ("<li><span class='text'><u><a href='user_page.php?user=".$row[4]."'>$row[0] $row[1]</a></u> <small>($row[3])</small></span></li>");  
}

?>