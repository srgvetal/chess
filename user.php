<?php

require_once('check.php');
$cb=check();

if ($cb!='user.php') { header("Location: ./"); exit(); }

?><!DOCTYPE html>
<html lang="ru">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
		<title><?echo "$name $surname"; ?> — Шахматные головоломки</title>

		<!-- Bootstrap -->
		<link href="css/bootstrap.css" rel="stylesheet">
		<link href="css/font-awesome.css" rel="stylesheet">
		<link href="css/style.css" rel="stylesheet">

	    <script src="js/jquery-1.8.2.min.js"></script>

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
									<a href="#" class="dropdown-toggle" data-toggle="dropdown"><?echo "$name $surname ($mail)"; ?> <b class="caret"></b></a>
									<ul class="dropdown-menu">
										<li><a href="logout.php">Выйти <i class="fa fa-sign-out"></i></a></li>
										<!-- <li><a href="#">Профиль</a></li> -->
									</ul>
								</li>
							</ul>
					</div>
				</nav>

				<!-- <h3>Система находится в стадии тестирования. Возможны ошибки!</h3> -->
				<div class="col-md-8">
					<h3>Головоломки</h3>
					<div class="puzzles">
						<ol>
							<?php include "refresh_puzzles_solve.php" ?>
						</ol>
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
			    <?php include 'chat_window.php'; ?>
				<img src=img/bor23.png style="position:absolute; right:10px; bottom:10px; width:50px;margin-top:40px;">


			</div>
		</div>

		<script src="js/bootstrap.js"></script>
	</body>
</html>