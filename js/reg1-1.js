$(document).ready(function(){
    $('#login form').submit(function( event ){
        event.preventDefault();
        var $form = $( this );
        $.ajax({
                url: $form.attr('action'),
                type: 'POST',
                submit: 'submit',
                data: $form.serialize(),        
                success: function(result) {
                    if (!result) location.reload();
                    else {
                        $('#login .alert strong').html(result);
                        $('#login .alert').slideDown();
                    }
                }});
        return false;
    });

    $('#login form input').keydown(function(){
        $('#login .alert').hide();
    });



    $('#reg form').submit(function( event ) {
        event.preventDefault();
        var $form = $( this );
        $.ajax({
                url: $form.attr('action'),
                type: 'POST',
                submit: 'submit',
                data: $form.serialize(),        
                success: function(result) {
                    if (!result) location.reload();
                    else {
                        $('#reg .alert strong').html(result);
                        $('#reg .alert').slideDown();
                    }
                }});
        return false;
    });

    $('#reg form input').keydown(function(){
        $('#reg .alert').hide();
    });


    $('#reg forget').submit(function( event ) {
        event.preventDefault();
        var $form = $( this );
        $.ajax({
                url: $form.attr('action'),
                type: 'POST',
                submit: 'submit',
                data: $form.serialize(),        
                success: function(result) {
                    if (!result) location.reload();
                    else {
                        $('#reg .alert strong').html(result);
                        $('#reg .alert').slideDown();
                    }
                }});
        return false;
    });

    $('#reg form input').keydown(function(){
        $('#reg .alert').hide();
    });



});