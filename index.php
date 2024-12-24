<?php

require_once('check.php');
$cb=check();

if ($cb=="admin.php"||$cb=="user.php") { header("Location: $cb"); exit(); }

?>
<!DOCTYPE html>
<html lang="ru">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
		<title>Вход — Шахматные головоломки</title>

		<!-- Bootstrap -->
		<link href="css/bootstrap.css" rel="stylesheet">
		<link href="css/font-awesome.css" rel="stylesheet">
		<link href="css/style.css" rel="stylesheet">

		<script src="js/jquery.min.js"></script>
		<script src="js/reg1-1.js"></script>
	</head>
	<body class="login">


		<div class="container">
			<div class="row">
					<div class="col-xs-12 col-xs-offset-0 col-sm-6 col-sm-offset-3 col-md-5 col-md-offset-4 col-lg-4 col-lg-offset-4">


							<div class="" id="loginModal">

								<div class="modal-header">
									<!-- <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button> -->
									<h2><span>Шахматные головоломки</span></h2>
									<!-- <h3>Есть аккаунт?</h3> -->
								</div>

								<div class="modal-body">
									<div class="tabs well">
										<ul class="nav nav-tabs" id="tabs">
											<li class="active"><a href="#login" data-toggle="tab" onclick="$('#forget-tab').hide();">Войти</a></li>
											<li><a href="#reg" data-toggle="tab" onclick="$('#forget-tab').hide();">Создать аккаунт</a></li>
											<li id="forget-tab" style="display:none;"><a href="#forget" data-toggle="tab">Восстановить пароль</a></li>
											<li id="recover-tab" style="display:none;"><a href="#recover" data-toggle="tab">Восстановить пароль</a></li>
										</ul>

										<div id="myTabContent" class="tab-content">

											<div class="tab-pane active in" id="login">
										
												<form action="login.php" method="POST">
													<fieldset>
														<div class="control-group">
															<!-- nickname -->
															<label class="control-label" for="login-nickname">Эл. почта</label>
															<input type="text" id="login-nickname" name="login-nickname" class="form-control">
															<label class="control-label" for="login-password">Пароль</label>
															<input type="password" id="login-password" name="login-password" class="form-control">
														</div>
														<div class="control-group">
															<div class="controls">
																<button type="submit" class="btn btn-success">Войти</button>
																<div style="display:inline; position:absolute; margin:17px 0 0 115px;">
<!-- 																	<a href="#forget" data-toggle="tab" onclick="$('.active').removeClass('active');$('#forget-tab').addClass('active');$('#forget-tab').show();">Забыли пароль?</a>
 -->																</div>
															</div>
														<div class="alert alert-danger" style="display:none">
														    <strong>Ошибка</strong>
														</div>
														</div>
													</fieldset>
												</form>                
											</div>


											<div class="tab-pane fade" id="reg">
												<form action="reg.php" method="POST">
<!-- 													<label for="reg-nickname">Логин</label>
													<input type="text" id="reg-nickname" name="reg-nickname" class="form-control">
 -->													<label for="reg-mail">Эл. почта</label>
													<input type="text" id="reg-mail" name="reg-mail" class="form-control">
													<label for="reg-password">Пароль</label>
													<input type="password" id="reg-password" name="reg-password" class="form-control">
													<label for="reg-password2">Пароль ещё раз</label>
													<input type="password" id="reg-password2" name="reg-password2" class="form-control">
													<label for="reg-name">Как к вам обращаться</label>
													<input type="text" id="reg-name" name="reg-name" class="form-control">
<!-- 													<label for="reg-surname">Фамилия</label>
													<input type="text" id="reg-surname" name="reg-surname" class="form-control">
 -->													<div>
														<button type="submit" class="btn btn-primary">Зарегистрироваться</button>
													</div>
													<div class="alert alert-danger" style="display:none">
													    <strong>Ошибка</strong>
													</div>
												</form>
											</div>


<!-- 											<div class="tab-pane" id="forget">
										
												<form action="forget.php" method="POST">
													<fieldset>
														<div class="control-group">
															<label class="control-label" for="login-nickname-forget">Эл. почта или логин</label>
															<input type="text" id="login-nickname" name="login-nickname-forget" class="form-control">
														</div>
														<div class="control-group">
															<div class="controls">
																<button type="submit" class="btn btn-success">Прислать письмо со ссылкой</button>
															</div>
														</div>
													</fieldset>
												</form>                
											</div> -->


											<div class="tab-pane" id="recover">
										
												<form action="recover.php" method="POST">
													<fieldset>
														<div class="control-group">
															<label for="reg-password">Пароль</label>
															<input type="password" id="reg-password" name="reg-password" class="form-control">
															<label for="reg-password2">Пароль повторно</label>
															<input type="password" id="reg-password2" name="reg-password2" class="form-control">
														</div>
														<div class="control-group">
															<div class="controls">
																<button type="submit" class="btn btn-success">Сохранить</button>
															</div>
														</div>
													</fieldset>
												</form>                
											</div>


									</div>
								</div>
							</div>
					</div>


					</div>
			</div>
		</div>

		<script src="js/bootstrap.js"></script>
	</body>
</html>