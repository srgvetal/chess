<?php

require_once('check.php');
$cb=check();

if ($cb!='admin.php') { header("Location: ./"); exit(); }

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
		<link href="css/style.css" rel="stylesheet">

		<script src="js/jquery-1.8.2.min.js"></script>
		<script src="js/admin.js"></script>
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

			

				<div class="col-md-5">
					<h3>Новости <a href="" onclick="return false;"><i class="fa fa-refresh" id="refresh_news"></i></a></h3>
					<ul class="list-unstyled news" style="height:300px;overflow-y:scroll;">
						<?php include "refresh_news.php"; ?>
					</ul>
					<a href="#" onclick="$('.news').css('height','').css('overflow-y','');$(this).hide();">увидеть сразу все новости</a>



					<div class="brbr-spacer hidden-xs hidden-sm"></div>

					<div>
						<h3>Пользователи</h3>
						<ul class="list-unstyled users" style="height:150px;overflow-y:scroll;">
							<?php include "refresh_users.php"; ?>						
						</ul>		
					<a href="#" onclick="$('.users').css('height','').css('overflow-y','');$(this).hide();">увидеть сразу всех пользователей</a>
					</div>
				</div>

				<div class="col-md-7">
					<h3>Головоломки</h3>
					<div class="puzzles">
					<ol>
						<?php include "refresh_puzzles.php" ?>
					</ol>
	
						<div style="clear:left"></div>
						<br/>
						<a href="puzzle4x4.php?id=new" class="btn btn-primary">Создать</a>
					</div>

	
				</div>
			</div>
		</div>

		<script src="js/bootstrap.js"></script>
	</body>
</html>