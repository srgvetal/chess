<?php
// Страница авторизации


# Соединяемся с БД
require_once('db.php');

// if(isset($_POST['submit']))
// {
    # Вытаскиваем из БД запись, у которой логин равняется введенному
    $query2 = mysql_query("SELECT user_id, user_password FROM users WHERE LOWER(user_mail)='".mysql_real_escape_string(mb_strtolower($_POST['login-nickname']))."' AND ban=0 LIMIT 1");
    if (mysql_num_rows($query2)) $data = mysql_fetch_assoc($query2);
    else {
        $query = mysql_query("SELECT user_id, user_password FROM users WHERE LOWER(user_login)='".mysql_real_escape_string(mb_strtolower($_POST['login-nickname']))."' AND ban=0 LIMIT 1");
        if (mysql_num_rows($query)) $data = mysql_fetch_assoc($query); 
        else {
                print "Эл. почта не найдена, создайте аккаунт";
                exit();
            }
    }

    // исправляю свою ошибку
    if (($data['user_password'])=='74be16979710d4c4e7c6647856088456') {
        $data['user_password']=md5(md5($_POST['login-password']));
        mysql_query("UPDATE users SET user_password='".$data['user_password']."' WHERE user_id='".$data['user_id']."'");
    }


    # Сравниваем пароли
    if ($data['user_password'] === md5(md5($_POST['login-password'])))
    {
        # Генерируем случайное число и шифруем его
        $hash = md5(generateCode(10));

        // if($_POST['attach_ip'])
        // {
            // Если пользователя выбрал привязку к IP
            # Переводим IP в строку
            // $insip = ", user_ip=INET_ATON('".$_SERVER['REMOTE_ADDR']."')";
            # Записываем в БД новый хеш авторизации и IP
            // mysql_query("UPDATE users SET user_hash='".$hash."' ".$insip." WHERE user_id='".$data['user_id']."'");
        // } else {

            # Записываем в БД новый хеш авторизации
        mysql_query("UPDATE users SET user_hash='".$hash."', user_timestamp_lastenter=NOW() WHERE user_id='".$data['user_id']."'");
        // }

        # Ставим куки
        setcookie("id", $data['user_id'], time()+60*60*24*30);
        setcookie("hash", $hash, time()+60*60*24*30);

        # Переадресовываем браузер на страницу проверки нашего скрипта
        // require_once('check.php');
        // $cb=check();
        // print "-$cb-";
        // header("Location: index.php");
        exit();
    }
    else
    {
        print "Неправильный пароль";
        exit();
    }
// }
?>