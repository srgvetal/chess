<?php
?>

<div style="display:block;position:absolute;right:8%;bottom:105px;width:30%;padding-bottom:10px;max-height:50%;overflow-y:auto;" id="chat_window">
<?php 
include 'refresh_chat_admin.php';

?>
</div>
<div style="display:block;position:absolute;right:8%;bottom:30px;height:70px;width:30%;">

<input type="text" style="width:90%;height:20px;" id="chat_text" placeholder="Напишите сообщение..." /><input type="button" style="width:25px;height:25px;" value="&gt;" id="new_message"><br/>
<input type="button" value="Очистить чат" id="clear_chat" style="margin:5px 0 0 150px"/>
</div>
<script>

var once_scroll=false;

function refresh_chat() {
    if ($_GET['id']) get_id_puzzle=$_GET['id']; else get_id_puzzle=0;

    $.ajax({
        url: 'refresh_chat_admin.php',
        type: 'POST',
        data: { user: $_GET['user'],
            puzzle: get_id_puzzle },
        success: function(result) {
            prev_text=$('#chat_window').html();
            $('#chat_window').html(result);
            if ((once_scroll)||(prev_text!=$('#chat_window').html())) { $('#chat_window').scrollTop(10000); once_scroll=false; }
            // console.log($('#chat_window').innerHeight()+' '+$('#chat_window').scrollTop());
        }});
}
setInterval(function(){refresh_chat()},<?php echo CHAT_REFRESH_TIMEOUT; ?>);


$('#new_message').click(function(){
    // console.log(JSON.stringify($('#chat_text').val()));
    if ($_GET['id']) get_id_puzzle=$_GET['id']; else get_id_puzzle=0;
    
    $.ajax({
        url: 'send_chat_admin.php',
        type: 'POST',
        data: { user: $_GET['user'],
            puzzle: get_id_puzzle,
            text: $('#chat_text').val() },
            // text: JSON.stringify($('#chat_text').val()) },
        success: function(result) {
            once_scroll=true;
            refresh_chat();
            $('#chat_text').val('');
            console.log(result);
        }});
    return false;
});

$('#chat_text').keydown(function(event){
     if ( event.which == 13 ) $('#new_message').click();
});

$('#clear_chat').click(function(){
if ($_GET['id']) get_id_puzzle=$_GET['id']; else get_id_puzzle=0;


if (confirm("Очистить чат?"))
    $.ajax({
        url: 'clear_chat_admin.php',
        type: 'POST',
        data: { user: $_GET['user'],
            puzzle: get_id_puzzle },
        success: function(result) {
            refresh_chat();
        }});
    return false;
});

</script>
<?php
?>