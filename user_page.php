<?php

require_once('check.php');
$cb=check();

if ($cb!="admin.php") { header("Location: ./"); exit(); }

?><!DOCTYPE html>
<html lang="ru">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
		<title>Администратор — Шахматные головоломки</title>

		<!-- Bootstrap -->
		<link href="css/bootstrap.css" rel="stylesheet">
		<link href="css/font-awesome.css" rel="stylesheet">
		<link href="css/style-1.1.css" rel="stylesheet">

		<script src="js/jquery-1.8.2.min.js"></script>
		<script src="js/user_page.js"></script>
	</head>
	<body>

		<div class="container">
			<div class="row">
				<nav class="navbar navbar-default" role="navigation">
					<div class="container-fluid">
						<!-- Brand and toggle get grouped for better mobile display -->
						<div class="navbar-header">
							<span class="navbar-brand">Шахматные головоломки</span>
						</div>
							<ul class="nav navbar-nav navbar-right">
								<li class="dropdown">
									<a href="#" class="dropdown-toggle" data-toggle="dropdown"><?echo "$name $surname ($login)"; ?> <b class="caret"></b></a>
									<ul class="dropdown-menu">
										<li><a href="logout.php">Выйти <i class="fa fa-sign-out"></i></a></li>
										<!-- <li><a href="#">Профиль</a></li> -->
									</ul>
								</li>
							</ul>
					</div>
				</nav>
			</div>
			<div class="row">

				<div class="col-md-12">
					<a href="admin.php">Вернуться к общей панели управления</a>
				</div>
			</div>
			
			<div class="row">
				<div class="col-md-6">
					<h3>Новости <?php include "user_page_whois.php"; ?> <a href="" onclick="return false;"><i class="fa fa-refresh" id="refresh_news"></i></a></h3>
					<ul class="list-unstyled news" style="height:250px;overflow-y:scroll;">
						<?php include "refresh_news_userpage.php"; ?>
					</ul>	
				</div>

			</div>

			<div class="row">

				<div class="col-md-6">
					<h3>Сделал ходы в головоломках:</h3>
					<div class="puzzles wonumbers">
					<ol>
						<?php include "refresh_puzzles_solve_userpage.php"; ?>
					</ol>
					</div>
				</div>

				<div class="col-md-6">
					<!-- <h3>Чат вне головоломок</h3> -->

				</div>

			</div>
		</div>

<script type="text/javascript">
var $_GET = {};

document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
    function decode(s) {
        return decodeURIComponent(s.split("+").join(" "));
    }

    $_GET[decode(arguments[1])] = decode(arguments[2]);
});
</script>
			    <?php include 'chat_window_admin.php'; ?>	

		<script src="js/bootstrap.js"></script>
	</body>
</html>