<?
// Скрипт проверки

function check(){

    if ( isset($_COOKIE['id']) and isset($_COOKIE['hash']))
    {   

        # Соединяемся с БД
        require_once('db.php');
        // $query = mysql_query("SELECT *,INET_NTOA(user_ip) FROM users WHERE user_id = '".intval($_COOKIE['id'])."' LIMIT 1");
        $query = mysql_query("SELECT * FROM users WHERE user_id = '".intval($_COOKIE['id'])."' LIMIT 1");
        $userdata = mysql_fetch_assoc($query);

        if(($userdata['user_hash'] !== $_COOKIE['hash']) or ($userdata['user_id'] !== $_COOKIE['id']) )
        // or (($userdata['user_ip'] !== $_SERVER['REMOTE_ADDR'])  and ($userdata['user_ip'] !== "0")))
        {
            setcookie("id", "", time() + 3600*24*30*12);
            setcookie("hash", "", time() + 3600*24*30*12);
            // print "Хм, что-то не получилось ".$userdata['user_id'];
            return "Хм, что-то не получилось";
        }
        else
        {
            global $login, $name, $surname, $user_id, $mail;
            $user_id=$userdata['user_id'];
            $login=$userdata['user_login'];
            $name=$userdata['user_name'];
            $surname=$userdata['user_surname'];
            $mail=$userdata['user_mail'];

            mysql_query("UPDATE users SET user_timestamp_lastenter=NOW() WHERE user_id='".$user_id."'");
            
            if ($userdata['user_admin']==1) return "/chess/admin.php";
            else return "/chess/user.php";
        }
    }
    else
    {
        // print "Включите куки";
        return "Включите куки";
    }
}

?>
