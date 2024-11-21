<?php

require_once('db.php');

// if(isset($_POST['submit']))
// {
    $err = array();

    # проверям логин
    // if(!preg_match("/^[a-zA-Z0-9_]+$/",$_POST['reg-nickname']))
    // {
    //     $err[] = "Логин может состоять только из букв английского алфавита и цифр";
    // }

    // if(strlen($_POST['reg-nickname']) < 3 or strlen($_POST['reg-nickname']) > 30)
    // {
    //     $err[] = "Логин должен быть не меньше 3-х символов и не больше 30";
    // }

    # проверяем, не сущестует ли пользователя с таким именем
    $query = mysql_query("SELECT COUNT(user_id) FROM users WHERE LOWER(user_mail)='".mysql_real_escape_string(mb_strtolower($_POST['reg-mail']))."'");
    if(mysql_result($query, 0) > 0)
    {
        $err[] = "Такая почта уже зарегистрирована";
    }

    if(trim($_POST['reg-name'])=="") {
        $err[] = "Отсутствует имя";
    }

    // if(trim($_POST['reg-surname'])=="") {
    //     $err[] = "Отсутствует фамилия";
    // }

    if(!preg_match("/^[-a-z0-9!#$%&'*+\/=?^_`{|}~]+(?:\.[-a-z0-9!#$%&'*+\/=?^_`{|}~]+)*@(?:[a-z0-9]([-a-z0-9]{0,61}[a-z0-9]))*?\.(?:aero|arpa|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|xxx|[a-z][a-z])$/i",$_POST['reg-mail']))
    {
        $err[] = "Указана некорректная почта";
    }

    if(trim($_POST['reg-password'])=="") {
        $err[] = "Пустой пароль";
    } else if($_POST['reg-password']!=$_POST['reg-password2']) {
        $err[] = "Пароли не совпадают";
    }


    # Если нет ошибок, то добавляем в БД нового пользователя
    if(count($err) == 0)
    {

        $hash = md5(generateCode(10));

        # Убираем лишние пробелы и делаем двойное шифрование
        $password = md5(md5(trim($_POST['reg-password'])));

        mysql_query("INSERT INTO users SET user_login='".safeString($_POST['reg-nickname'])."', user_name='".safeString($_POST['reg-name'])."', user_surname='".safeString($_POST['reg-surname'])."', user_mail='".safeString($_POST['reg-mail'])."', user_password='$password', user_hash='$hash', user_timestamp=NOW();");


    $query2 = mysql_query("SELECT user_id, user_password FROM users WHERE LOWER(user_mail)='".mysql_real_escape_string(mb_strtolower($_POST['reg-mail']))."' AND ban=0 LIMIT 1");
    if (mysql_num_rows($query2)) $data2 = mysql_fetch_assoc($query2);
    else {
            print "Неправильные логин/пароль";
            exit();
        }
    
        mysql_query("UPDATE users SET user_timestamp_lastenter=NOW() WHERE user_id='".$data2['user_id']."'");

        setcookie("id", $data2['user_id'], time()+60*60*24*30);
        setcookie("hash", $hash, time()+60*60*24*30);

        // require_once('check.php');
        // $cb=check();
        // print $cb;        
        // header("Location: check.php");
        exit();
    }
    else
    {
        // print "<b>При регистрации произошли следующие ошибки:</b><br>";
        foreach($err AS $error)
        {
            print "<p>$error</p>";
        }
    }
// }
?>