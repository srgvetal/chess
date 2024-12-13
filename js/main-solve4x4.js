var mode, firstmovec=2, wokings=false, cutowncolor=true, manykings_allowed=false, pawnpassage_allowed=false, anycolorturn_allowed=false, half_moves100_allowed=false, insufficient_material_allowed=false, in_threefold_repetition_allowed=false, castling_allowed=false;
var boardsizec=1, boardsize=[];
    boardsize=[8,4];
var movec=0;
var solve=true;

//don't need: manykings, anycolor, half_moves100, suppose: insufficient_material (only chess), in_threefold
//need: wokings, pawnpassage 8x8, 
//
//goals: 1 piece left, at least one pawn taken last row, b/w king has a mate, ...
//
//
$(document).ready(function(){

    $('#solvePuzzle').click(function(){
        mode='solve';
        $('#board.inactive').css('opacity',0);
        $('#board.inactive').removeClass('inactive');
        $('#board').animate({opacity:1},500);
        $('#pieces, #create-buttons').fadeOut();
        $('#createPuzzle').css('opacity', 0.3);
        $('#solvePuzzle').css('opacity', 1);
        $('#status').fadeIn();
    });
    setTimeout(function(){
        $('#solvePuzzle').click();
    },1000);  

    $('#firstMove').click(function(){
        var text=['первый ход белых', 'первый ход черных', 'ходят только белые', 'ходят только черные'];
        firstmovec++;
        if (firstmovec==4) firstmovec=0;
        $(this).html(text[firstmovec]);
    });

var $_GET = {};

document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
    function decode(s) {
        return decodeURIComponent(s.split("+").join(" "));
    }

    $_GET[decode(arguments[1])] = decode(arguments[2]);
});

    $('#boardSize').click(function(){
        location.href='puzzle4x4.php?id='+$_GET['id'];
        exit();
        var textbs=['доска 8х8','доска 4х4'];
        boardsizec++;
        if (boardsizec==2) boardsizec=0;
        $(this).html(textbs[boardsizec]);
    });

});