var mode, firstmovec = 0,
    wokings = false,
    cutowncolor = false,
    manykings_allowed = false,
    pawnpassage_allowed = false,
    anycolorturn_allowed = false,
    half_moves100_allowed = false,
    insufficient_material_allowed = false,
    in_threefold_repetition_allowed = false,
    castling_allowed = true;
var boardsizec = 0,
    boardsize = [];
boardsize = [8, 4];
var movec = 0;

//don't need: manykings, anycolor, half_moves100, suppose: insufficient_material (only chess), in_threefold
//need: wokings, pawnpassage 8x8, 
//
//goals: 1 piece left, at least one pawn taken last row, b/w king has a mate, ...
//
//
$(document).ready(function() {
    $('#createPuzzle').click(function() {
        mode = 'create';
        $('.inactive').css('opacity', 0);
        $('.inactive').removeClass('inactive');
        $('#pieces, #create-buttons').fadeIn();
        $('#board, #pieces, #create-buttons').animate({ opacity: 1 }, 500);
        $('#createPuzzle').css('opacity', 1);
        $('#solvePuzzle').css('opacity', 0.3);
        $('#status').hide();
    });
    $('#createPuzzle').click();

    $('#solvePuzzle').click(function() {
        mode = 'solve';
        $('#board.inactive').css('opacity', 0);
        $('#board.inactive').removeClass('inactive');
        $('#board').animate({ opacity: 1 }, 500);
        $('#pieces, #create-buttons').fadeOut(function() { $('#status').fadeIn(); });
        $('#createPuzzle').css('opacity', 0.3);
        $('#solvePuzzle').css('opacity', 1);
        refreshGameStatus();
    });


    var $_GET = {};

    document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function() {
        function decode(s) {
            return decodeURIComponent(s.split("+").join(" "));
        }

        $_GET[decode(arguments[1])] = decode(arguments[2]);
    });


    if ((location.href.indexOf('was') != -1) || (location.href.indexOf('solved') != -1)) {
        $('#board.inactive').css('opacity', 0);
        $('.inactive').removeClass('inactive');
        $('#board').animate({ opacity: 1 }, 500);
    }
    if (location.href.indexOf('solved') != -1) {
        $('#check-was').css('opacity', 1);
        $('#check-new').css('opacity', 0.3);
    }
    if (location.href.indexOf('was') != -1) {
        $('#check-new').css('opacity', 1);
        $('#check-was').css('opacity', 0.3);
    }
    $('#check-was').click(function() {
        if (location.href.indexOf('was') == -1) location.href = 'puzzle-check-was8x8.php?id=' + $_GET['id'] + '&user=' + $_GET['user'];
    })
    $('#check-new').click(function() {
        if (location.href.indexOf('solved') == -1) location.href = 'puzzle-check-solved8x8.php?id=' + $_GET['id'] + '&user=' + $_GET['user'];
    })


    $('#firstMove').click(function() {
        var text = ['первый ход белых', 'первый ход черных', 'ходят только белые', 'ходят только черные'];
        firstmovec++;
        if (firstmovec == 4) firstmovec = 0;
        $(this).html(text[firstmovec]);
    });

    $('#boardSize').click(function() {
        location.href = 'puzzle4x4.php?id=' + $_GET['id'];
        exit();
        var textbs = ['доска 8х8', 'доска 4х4'];
        boardsizec++;
        if (boardsizec == 2) boardsizec = 0;
        $(this).html(textbs[boardsizec]);
    });

   

});
