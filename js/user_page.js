$(document).ready(function(){
    var faspinloaded=true;

    function faspinrotating() {
        if (!faspinloaded) setTimeout( function(){faspinrotating();}, 1020 );
        else $('#refresh_news').removeClass('fa-spin');
    }

    $('#refresh_news').click(function(){
        $(this).addClass('fa-spin');
        faspinloaded=false;
        faspinrotating();
        $.ajax({
                url: '/refresh_news_userpage.php',
                data: { user: $_GET['user'] },
                type: 'POST',
                success: function(result) {
                    faspinloaded=true;
                    if (!result) return;
                    else {
                        $('ul.list-unstyled.news').html(result);
                    }
                }});
    });


});