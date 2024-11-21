<?php

include '_db_ini.php';

mysql_connect($hostname,$username,$password) OR DIE("Не могу создать соединение "); 
mysql_select_db($dbname) or die("alert('Mysql error: ".safeString(mysql_error())."');");  

mysql_query ("SET NAMES utf8");

Header("Cache-Control: no-cache, must-revalidate"); // говорим браузеру что-бы он не кешировал эту страницу
Header("Pragma: no-cache");

// Header("Content-Type: text/javascript; charset=utf-8"); // говорим браузеру что это javascript в кодировке UTF-8
 
// если таблиц нет - их создаём
mysql_query("CREATE TABLE IF NOT EXISTS `users` (
    `user_id` INT(11) unsigned NOT NULL AUTO_INCREMENT,
    `user_login` VARCHAR(30) NOT NULL,
    `user_name` VARCHAR(30),
    `user_surname` VARCHAR(30),
    `user_mail` VARCHAR(30) NOT NULL,
    `user_password` VARCHAR(32) NOT NULL,
    `user_hash` VARCHAR(32) NOT NULL,
    `user_timestamp` DATETIME NOT NULL,
    `user_admin` BOOLEAN DEFAULT 0,
    `ban` BOOLEAN DEFAULT 0,
    `user_timestamp_lastenter` DATETIME DEFAULT NULL,
  PRIMARY KEY  (`user_id`)
 ) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;") or die("alert('Mysql error: ".safeString(mysql_error())."');");

mysql_query("CREATE TABLE IF NOT EXISTS `puzzles` (
    `puzzle_id` INT(11) unsigned NOT NULL AUTO_INCREMENT,
    `puzzle_fen` VARCHAR(128),
    `puzzle_boardsize` VARCHAR(30),
    `puzzle_goal` VARCHAR(1024),
    `puzzle_firstmove` INT(4) unsigned,
    `puzzle_timestamp_create` DATETIME NOT NULL,
  PRIMARY KEY  (`puzzle_id`)
 ) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;") or die("alert('Mysql error: ".safeString(mysql_error())."');");

mysql_query("CREATE TABLE IF NOT EXISTS `puzzlesolves` (
    `puzzlesolve_id` INT(11) unsigned NOT NULL AUTO_INCREMENT,
    `user_id` INT(11) unsigned,
    `puzzle_id` INT(11) unsigned,
    `annotation` TEXT,
    `puzzle_fen_finished` VARCHAR(128),
    `marked_solved` BOOLEAN,
    `puzzlesolve_jhistory` TEXT,
    `puzzlesolve_thistory` TEXT,
    `puzzlesolve_blacklast` BOOLEAN,
  PRIMARY KEY  (`puzzlesolve_id`)
 ) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;") or die("alert('Mysql error: ".safeString(mysql_error())."');");

mysql_query("CREATE TABLE IF NOT EXISTS `chat` (
    `chat_id` INT(11) unsigned NOT NULL AUTO_INCREMENT,
    `user_id` INT(11) unsigned,
    `puzzle_id` INT(11) unsigned,
    `chat_if_admin` BOOLEAN,
    `chat_text` TEXT,
    `chat_timestamp` TIMESTAMP,
    `chat_read` BOOLEAN,
  PRIMARY KEY  (`chat_id`)
 ) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;") or die("alert('Mysql error: ".safeString(mysql_error())."');");

//ALTER TABLE `users` CHANGE `user_timestamp` `user_timestamp` DATETIME NOT NULL;
//ALTER TABLE `puzzles` CHANGE `puzzle_timestamp_create` `puzzle_timestamp_create` DATETIME NOT NULL;
//ALTER TABLE `puzzlesolves` CHANGE `annotation` `annotation` TEXT;
//ALTER TABLE users ADD ban BOOLEAN DEFAULT 0;
//ALTER TABLE users DROP COLUMN user_timestamp_lastenter;
//ALTER TABLE `users` ADD `user_timestamp_lastenter` DATETIME DEFAULT NULL;
//ALTER TABLE `puzzlesolves` ADD `puzzlesolve_jhistory` TEXT;
//ALTER TABLE `puzzlesolves` ADD `puzzlesolve_thistory` TEXT;
//ALTER TABLE `puzzlesolves` ADD `puzzlesolve_blacklast` BOOLEAN;
// ALTER TABLE puzzles MODIFY puzzle_fen VARCHAR(128);
// ALTER TABLE puzzlesolves MODIFY puzzle_fen_finished VARCHAR(128);
// ALTER TABLE puzzles MODIFY puzzle_goal VARCHAR(1024);

function safeString($str)
{
 // $str=htmlspecialchars($str); // заменяем опасные теги (<h1>,<br>, и прочие) на безопасные
 $str=mysql_escape_string($str); // функция экранирует все спец-символы в unescaped_string , вследствие чего, её можно безопасно использовать в mysql_query()
 return $str;
}

# Функция для генерации случайной строки
function generateCode($length=6) {
    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPRQSTUVWXYZ0123456789";
    $code = "";
    $clen = strlen($chars) - 1;  
    while (strlen($code) < $length) {
        $code .= $chars[mt_rand(0,$clen)];  
    }
    return $code;
}



?>