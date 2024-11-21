var $_GET = {};
var blacklast=false, blacklast_read=false, blacklast_write=false;
var DEFAULT_POSITIONN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
// var DEFAULT_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';


document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
    function decode(s) {
        return decodeURIComponent(s.split("+").join(" "));
    }

    $_GET[decode(arguments[1])] = decode(arguments[2]);
});


$(document).ready(function(){
    $('#back').click(function(){
        if ($_GET['user']) location.href="/user_page.php?user="+$_GET['user'];
        else location.href="/admin.php";
    });
});


