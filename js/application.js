function Application(UIContext) {
    this._uiContextClass = UIContext;
    this._initialized = false;
};
Application.prototype.init = function() {
    if (this._uiContextClass && !this._initialized) {
        this._initialized = true;
        var UI = new this._uiContextClass();
        UI.init();

        // hello-button event handler
        // UI.button('hello-button').click( function() {
        //     var helloLabel = document.getElementById("hello-label");
        //     helloLabel.innerHTML = "...World!";
        // });
    }
};
Application.prototype.initialized = function() {
    return this._initialized;
};


// --------

var SE_select;
var SE_move;
var SE_eat;

//var socket = io();
var board, game;

var removeGreySquares = function() {
  $('#board .square-55d63').css('background', '');
};

var greySquare = function(square) {
  var squareEl = $('#board .square-' + square);

  var background = '#a9a9a9';
  if (squareEl.hasClass('black-3c85d') === true) {
    background = '#696969';
  }

  squareEl.css('background', background);
};

var onDragStart = function(source, piece) {
  // do not pick up pieces if the game is over
  // or if it's not that side's turn
  if (game.game_over() === true ||
      (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false;
  }
  // SE_select.play();
};

function refreshGameStatus() {
  // var status='';
  // if (game.in_check()) status+='ШАХ. ';
  // if (game.turn() === 'w') status+='ход белых';
  // if (game.turn() === 'b') status+='ход черных';
  // if (game.in_checkmate()) status='МАТ. Конец игры';
  // // if (game.in_stalemate()) status='ПАТ. Конец игры';
  // // console.log(game.history());

  // $('#status').html(status);



  //       var lastmove;

  //       // console.log('history length: '+game.history.length);

  //       lastmove=game.history[game.history.length-1];

  //       for (var p in lastmove) {
  //           console.log(p + ': ' + lastmove[p]);
  //           if (typeof lastmove[p]=='object') {
  //               for (var pp in lastmove[p]) console.log('  '+p+'['+pp+']: '+lastmove[p][pp]);
  //           }
  //           if (p=='move') console.log('move san: '+move_to_san(lastmove[p]));
  //       }
  //       // console.log(" ");
}

var onDrop = function(source, target) {

  removeGreySquares();

  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) return 'snapback';
  //socket.emit('move', source, target);
  // SE_move.play();
  // 
  refreshGameStatus();
  
};

var onBClick = function(source, target) {

  removeGreySquares();

  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) return 'snapback';
  //socket.emit('move', source, target);
  // SE_move.play();
};



var onMouseoverSquare = function(square, piece) {
  // get list of possible moves for this square
  // console.log('overSquare');
  var moves = game.moves({
    square: square,
    verbose: true
  });
  // console.log(game.board.position);
  // console.log('a.js: '+piece);

  // exit if there are no moves available for this square
  if (moves.length === 0) return;

  if (game.turn() === 'w' && piece.search(/^w/)) return;
  if (game.turn() === 'b' && piece.search(/^b/)) return;
  // highlight the square they moused over
  greySquare(square);

  // highlight the possible squares for this piece
  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to);
  }
};

var onMouseoutSquare = function(square, piece) {
  removeGreySquares();
};

var onSnapEnd = function() {
  board.position(game.fen());
};

/*
socket.on('login', function(t){
    //console.log(t);
    board.position(t);
});


socket.on('move', function(source, target){
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    });
    board.move(source+"-"+target);
    SE_move.play();
});

socket.on('new game', function(){
    game.reset();
    board.position('start', true);
});*/



$(document).ready(function(){

    board = ChessBoard('board', {
        // position: 'start',
        draggable: true,
        //dropOffBoard: 'trash',
        //sparePieces: true,
        moveSpeed: 'slow',
        snapbackSpeed: 500,
        snapSpeed: 100,
        orientation: 'white',
        showErrors: 'console',

        onDragStart: onDragStart,
        onDrop: onDrop,
        onMouseoutSquare: onMouseoutSquare,
        onMouseoverSquare: onMouseoverSquare,
        onSnapEnd: onSnapEnd
    });

    game = new Chess();

    SE_select = document.createElement('audio');
    // SE_select.setAttribute('src', './Audio/SE/select.ogg');
    SE_move = document.createElement('audio');
    // SE_move.setAttribute('src', './Audio/SE/move.ogg');
    SE_eat = document.createElement('audio');
    // SE_eat.setAttribute('src', './Audio/SE/eat.ogg');
});
