<?php

require_once('check.php');
$cb=check();

if ($_GET['id']&&$cb!='user.php') { header("Location: ./"); exit(); }


?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Chess</title>
    <meta name="description" content="Chess">   
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">

    <link rel='stylesheet' href='css/font-awesome.css' type='text/css'/>
    
    <link rel='stylesheet' href='css/chessboard-0.3.0.css' type='text/css'/>
    <link rel='stylesheet' href='css/style_chess-1.1.css' type='text/css'/>
    <link rel='stylesheet' href='css/main.css' type='text/css'/>
    
    <script src="js/jquery.min.js"></script>

    <script src="js/create-1.1.js" type='text/javascript'></script>
    <script src="js/chessboard-0.3.6_solve.js" type='text/javascript'></script>
    <script src="js/chess-1.0.6.js" type='text/javascript'></script>
    <script src="js/main-solve8x8.js" type='text/javascript'></script>
</head>
<body>

    <div data-role="mainview">

        <header data-role="header">

            <ul data-role="tabs">
                <li data-role="tabitem" id="back"><i class="fa fa-home"></i> Вернуться</li>
                <!-- <li data-role="tabitem" data-page="hello-page" id="createPuzzle">Создать задачу</li> -->
                <li data-role="tabitem" data-page="hello-page" id="solvePuzzle">Решить задачу</li>
                <!-- <li data-role="tabitem" data-page="hello-page" id="solvePuzzle">Начать игру</li> -->
            </ul>

        </header>

        <div data-role="content">
            <div id="board" style="width: 550px" class="inactive"></div>
<script>
    dw=$(window).width();
    if (dw<600) {
        $('#board').css('width',dw*0.9);
        $('.notation-322f9').css('font-size',dw/600+'%');
    }
</script>
            <h3 style="display:block;position:absolute;top:650px;left:30px; font-size:30px; width:500px; " id="goal"></h3>
<script>
        $.ajax({
            url: 'load_goal.php',
            type: 'POST',
            data: { puzzle_id: $_GET['id'] },
            success: function(result) {
                // console.log(result);
                $('#goal').html(result);
            }});
</script>
            <div id="status" style="display:none">ход белых</div>

    <?php include 'history_journey.php'; ?><div id="history"></div>
            

        </div>
    </div>
    <?php include 'chat_window.php'; ?>
    <script src="js/application.js"></script>
</body>
</html>

