var   //demoday
   // START_FEN = '8/8/8/8/8/8/8/8'
  START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';

var jhistory=[], jhistory_count=0, jhistory_length=0;
var thistory=[], thistory_count=0, thistory_length=0;
var ANIMATION_HAPPENING = false;
var trogalundo=false;
var oldresponse=false;
  // START_FEN = 'q1111111/1111q111/1111111q/11111q11/11q11111/111111q1/1q111111/111q1111',
  // START_FEN = '8/8/8/8/11P1k111/8/1K111111/8';
  // START_FEN = '8/8/8/8/8/8/8/8',



// start anonymous scope
;(function() {
'use strict';

// TOC:
// Chess Util Functions :34
// Constants :212
// Module Scope Variables :241
// Stateful :255
// JS Util Functions :272
// Validation / Errors :310
// DOM Misc :511
// Markup Building :558
// Animations :705
// Control Flow :981
// Public Methods :1307
// Browser Events :1488
// Initialization :1647
//



//---------------------------------------------------------------------------------------------------------------------------------------
// Chess Util Functions
//---------------------------------------------------------------------------------------------------------------------------------------
var COLUMNS = 'abcdefgh'.split('');

function validMove(move) {
  // move should be a string
  if (typeof move !== 'string') return false;

  // move should be in the form of "e2-e4", "f6-d5"
  var tmp = move.split('-');
  if (tmp.length !== 2) return false;

  return (validSquare(tmp[0]) === true && validSquare(tmp[1]) === true);
}

function validSquare(square) {
  if (typeof square !== 'string') return false;
  return (square.search(/^[a-h][1-8]$/) !== -1);
}

function validPieceCode(code) {
  if (typeof code !== 'string') return false;
  return (code.search(/^[bw][KQRNBP]$/) !== -1);
}

// TODO: this whole function could probably be replaced with a single regex
function validFen(fen) {
  if (typeof fen !== 'string') return false;

  // cut off any move, castling, etc info from the end
  // we're only interested in position information
  fen = fen.replace(/ .+$/, '');

  // FEN should be 8 sections separated by slashes
  var chunks = fen.split('/');
  if (chunks.length !== 8) return false;

  // check the piece sections
  for (var i = 0; i < 8; i++) {
    if (chunks[i] === '' ||
        chunks[i].length > 8 ||
        chunks[i].search(/[^kqrbnpKQRNBP1-8]/) !== -1) {
      return false;
    }
  }

  return true;
}

function validPositionObject(pos) {
  /**
   * 
   */
  if (typeof pos !== 'object') return false;

  for (var i in pos) {
   // console.info('validPositionObject(pos), pos: '+pos+'  i: '+i);
    if (pos.hasOwnProperty(i) !== true) continue;

    if (validSquare(i) !== true || validPieceCode(pos[i]) !== true) {
      return false;
    }
  }

  return true;
}

// convert FEN piece code to bP, wK, etc
function fenToPieceCode(piece) {
  // black piece
  if (piece.toLowerCase() === piece) {
    return 'b' + piece.toUpperCase();
  }

  // white piece
  return 'w' + piece.toUpperCase();
}

// convert bP, wK, etc code to FEN structure
function pieceCodeToFen(piece) {
  var tmp = piece.split('');

  // white piece
  if (tmp[0] === 'w') {
    return tmp[1].toUpperCase();
  }

  // black piece
  return tmp[1].toLowerCase();
}

// convert FEN string to position object
// returns false if the FEN string is invalid
function fenToObj(fen) {
  if (validFen(fen) !== true) {
    return false;
  }

  // cut off any move, castling, etc info from the end
  // we're only interested in position information
  fen = fen.replace(/ .+$/, '');

  var rows = fen.split('/');
  var position = {};

  var currentRow = 8;
  for (var i = 0; i < 8; i++) {
    var row = rows[i].split('');
    var colIndex = 0;

    // loop through each character in the FEN section
    for (var j = 0; j < row.length; j++) {
      // number / empty squares
      if (row[j].search(/[1-8]/) !== -1) {
        var emptySquares = parseInt(row[j], 10);
        colIndex += emptySquares;
      }
      // piece
      else {
        var square = COLUMNS[colIndex] + currentRow;
        position[square] = fenToPieceCode(row[j]);
        colIndex++;
      }
    }

    currentRow--;
  }

  return position;
}

// position object to FEN string
// returns false if the obj is not a valid position object
function objToFen(obj) {
  if (validPositionObject(obj) !== true) {
    return false;
  }

  var fen = '';

  var currentRow = 8;
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      var square = COLUMNS[j] + currentRow;

      // piece exists
      if (obj.hasOwnProperty(square) === true) {
        fen += pieceCodeToFen(obj[square]);
      }

      // empty space
      else {
        fen += '1';
      }
    }

    if (i !== 7) {
      fen += '/';
    }

    currentRow--;
  }

  // squeeze the numbers together
  // haha, I love this solution...
  fen = fen.replace(/11111111/g, '8');
  fen = fen.replace(/1111111/g, '7');
  fen = fen.replace(/111111/g, '6');
  fen = fen.replace(/11111/g, '5');
  fen = fen.replace(/1111/g, '4');
  fen = fen.replace(/111/g, '3');
  fen = fen.replace(/11/g, '2');

  return fen;
}

window['ChessBoard'] = window['ChessBoard'] || function(containerElOrId, cfg) {
'use strict';

cfg = cfg || {};

//---------------------------------------------------------------------------------------------------------------------------------------
// Constants
//---------------------------------------------------------------------------------------------------------------------------------------

var MINIMUM_JQUERY_VERSION = '1.7.0',  
  START_POSITION = fenToObj(START_FEN);

// use unique class names to prevent clashing with anything else on the page
// and simplify selectors
var CSS = {
  alpha: 'alpha-d2270',
  black: 'black-3c85d',
  board: 'board-b72b1',
  chessboard: 'chessboard-63f37',
  clearfix: 'clearfix-7da63',
  highlight1: 'highlight1-32417',
  highlight2: 'highlight2-9c5d2',
  highlight3: 'highlight3',
  notation: 'notation-322f9',
  numeric: 'numeric-fc462',
  piece: 'piece-417db',
  row: 'row-5277c',
  sparePieces: 'spare-pieces-7492f',
  sparePiecesBottom: 'spare-pieces-bottom-ae20f',
  sparePiecesTop: 'spare-pieces-top-4028b',
  square: 'square-55d63',
  white: 'white-1e1d7'
};

//---------------------------------------------------------------------------------------------------------------------------------------
// Module Scope Variables
//---------------------------------------------------------------------------------------------------------------------------------------

// DOM elements
var containerEl,
  boardEl,
  clickedPieceEl,
  draggedPieceEl,
  sparePiecesTopEl,
  sparePiecesBottomEl;

// constructor return object
var widget = {};

//---------------------------------------------------------------------------------------------------------------------------------------
// Stateful
//---------------------------------------------------------------------------------------------------------------------------------------

var  BOARD_BORDER_SIZE = 2,
  CURRENT_ORIENTATION = 'white',
  CURRENT_POSITION = {},
  SQUARE_SIZE,
  DRAGGED_PIECE,
  DRAGGED_PIECE_LOCATION,
  DRAGGED_PIECE_SOURCE,
  DRAGGING_A_PIECE = true,
  SPARE_PIECE_ELS_IDS = {},
  SQUARE_ELS_IDS = {},
  SQUARE_ELS_OFFSETS;

//---------------------------------------------------------------------------------------------------------------------------------------
// JS Util Functions
//---------------------------------------------------------------------------------------------------------------------------------------

// http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
function createId() {
  return 'xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/x/g, function(c) {
    var r = Math.random() * 16 | 0;
    return r.toString(16);
  });
}

function deepCopy(thing) {
  return JSON.parse(JSON.stringify(thing));
}

function parseSemVer(version) {
  var tmp = version.split('.');
  return {
    major: parseInt(tmp[0], 10),
    minor: parseInt(tmp[1], 10),
    patch: parseInt(tmp[2], 10)
  };
}

// returns true if version is >= minimum
function compareSemVer(version, minimum) {
  version = parseSemVer(version);
  minimum = parseSemVer(minimum);

  var versionNum = (version.major * 10000 * 10000) +
    (version.minor * 10000) + version.patch;
  var minimumNum = (minimum.major * 10000 * 10000) +
    (minimum.minor * 10000) + minimum.patch;

  return (versionNum >= minimumNum);
}

//---------------------------------------------------------------------------------------------------------------------------------------
// Validation / Errors
//---------------------------------------------------------------------------------------------------------------------------------------

function error(code, msg, obj) {
  // do nothing if showErrors is not set
  if (cfg.hasOwnProperty('showErrors') !== true ||
      cfg.showErrors === false) {
    return;
  }

  var errorText = 'ChessBoard Error ' + code + ': ' + msg;

  // print to console
  if (cfg.showErrors === 'console' &&
      typeof console === 'object' &&
      typeof console.log === 'function') {
    console.log(errorText);
    if (arguments.length >= 2) {
      console.log(obj);
    }
    return;
  }

  // alert errors
  if (cfg.showErrors === 'alert') {
    if (obj) {
      errorText += '\n\n' + JSON.stringify(obj);
    }
    window.alert(errorText);
    return;
  }

  // custom function
  if (typeof cfg.showErrors === 'function') {
    cfg.showErrors(code, msg, obj);
  }
}

// check dependencies
function checkDeps() {
  // if containerId is a string, it must be the ID of a DOM node
  if (typeof containerElOrId === 'string') {
    // cannot be empty
    if (containerElOrId === '') {
      window.alert('ChessBoard Error 1001: ' +
        'The first argument to ChessBoard() cannot be an empty string.' +
        '\n\nExiting...');
      return false;
    }

    // make sure the container element exists in the DOM
    var el = document.getElementById(containerElOrId);
    if (! el) {
      window.alert('ChessBoard Error 1002: Element with id "' +
        containerElOrId + '" does not exist in the DOM.' +
        '\n\nExiting...');
      return false;
    }

    // set the containerEl
    containerEl = $(el);
  }

  // else it must be something that becomes a jQuery collection
  // with size 1
  // ie: a single DOM node or jQuery object
  else {
    containerEl = $(containerElOrId);

    if (containerEl.length !== 1) {
      window.alert('ChessBoard Error 1003: The first argument to ' +
        'ChessBoard() must be an ID or a single DOM node.' +
        '\n\nExiting...');
      return false;
    }
  }

  // JSON must exist
  if (! window.JSON ||
      typeof JSON.stringify !== 'function' ||
      typeof JSON.parse !== 'function') {
    window.alert('ChessBoard Error 1004: JSON does not exist. ' +
      'Please include a JSON polyfill.\n\nExiting...');
    return false;
  }

  // check for a compatible version of jQuery
  if (! (typeof window.$ && $.fn && $.fn.jquery &&
      compareSemVer($.fn.jquery, MINIMUM_JQUERY_VERSION) === true)) {
    window.alert('ChessBoard Error 1005: Unable to find a valid version ' +
      'of jQuery. Please include jQuery ' + MINIMUM_JQUERY_VERSION + ' or ' +
      'higher on the page.\n\nExiting...');
    return false;
  }

  return true;
}

function validAnimationSpeed(speed) {
  if (speed === 'fast' || speed === 'slow') {
    return true;
  }

  if ((parseInt(speed, 10) + '') !== (speed + '')) {
    return false;
  }

  return (speed >= 0);
}


// var cfg = {};
// cfg.showErrors = 'console';
// cfg.orientation = 'black';
// cfg.showNotation = true;


// validate config / set default options
function expandConfig() {
  
  if (typeof cfg === 'string' || validPositionObject(cfg) === true) {
    cfg = {
      position: cfg
    };
  }

  // default for orientation is white
  if (cfg.orientation !== 'black') {
    cfg.orientation = 'white';
  }
  CURRENT_ORIENTATION = cfg.orientation;

  // default for showNotation is true
  if (cfg.showNotation !== false) {
    cfg.showNotation = true;
  }

  // default for draggable is false
  if (cfg.draggable !== true) {
    cfg.draggable = false;
  }

  // default for dropOffBoard is 'snapback'
  if (cfg.dropOffBoard !== 'trash') {
    cfg.dropOffBoard = 'snapback';
  }

  // default for sparePieces is false
  if (cfg.sparePieces !== true) {
    cfg.sparePieces = false;
  }

  // draggable must be true if sparePieces is enabled
  if (cfg.sparePieces === true) {
    cfg.draggable = true;
  }

  // default piece theme is wikipedia
  if (cfg.hasOwnProperty('pieceTheme') !== true ||
      (typeof cfg.pieceTheme !== 'string' &&
       typeof cfg.pieceTheme !== 'function')) {
    cfg.pieceTheme = 'img/chesspieces/wikipedia/{piece}.png';
  }

  // animation speeds
  if (cfg.hasOwnProperty('appearSpeed') !== true ||
      validAnimationSpeed(cfg.appearSpeed) !== true) {
    cfg.appearSpeed = 200;
  }
  if (cfg.hasOwnProperty('moveSpeed') !== true ||
      validAnimationSpeed(cfg.moveSpeed) !== true) {
    cfg.moveSpeed = 200;
  }
  if (cfg.hasOwnProperty('snapbackSpeed') !== true ||
      validAnimationSpeed(cfg.snapbackSpeed) !== true) {
    cfg.snapbackSpeed = 50;
  }
  if (cfg.hasOwnProperty('snapSpeed') !== true ||
      validAnimationSpeed(cfg.snapSpeed) !== true) {
    cfg.snapSpeed = 25;
  }
  if (cfg.hasOwnProperty('trashSpeed') !== true ||
      validAnimationSpeed(cfg.trashSpeed) !== true) {
    cfg.trashSpeed = 100;
  }

  // make sure position is valid
  if (cfg.hasOwnProperty('position') === true) {
    if (cfg.position === 'start') {
      CURRENT_POSITION = deepCopy(START_POSITION);
    }

    else if (validFen(cfg.position) === true) {
      CURRENT_POSITION = fenToObj(cfg.position);
    }

    else if (validPositionObject(cfg.position) === true) {
      CURRENT_POSITION = deepCopy(cfg.position);
    }

    else {
      error(7263, 'Invalid value passed to config.position.', cfg.position);
    }
  }

  return true;
}

//---------------------------------------------------------------------------------------------------------------------------------------
// DOM Misc
//---------------------------------------------------------------------------------------------------------------------------------------

// calculates square size based on the width of the container
// got a little CSS black magic here, so let me explain:
// get the width of the container element (could be anything), reduce by 1 for
// fudge factor, and then keep reducing until we find an exact mod 8 for
// our square size
function calculateSquareSize() {
  var containerWidth = parseInt(containerEl.css('width'), 10);

  // defensive, prevent infinite loop
  if (! containerWidth || containerWidth <= 0) {
    return 0;
  }

  // pad one pixel
  var boardWidth = containerWidth - 1;

  while (boardWidth % 8 !== 0 && boardWidth > 0) {
    boardWidth--;
  }

  return (boardWidth / 8);
}

// create random IDs for elements
function createElIds() {
  // squares on the board
  for (var i = 0; i < COLUMNS.length; i++) {
    for (var j = 1; j <= boardsize[boardsizec]; j++) {
      var square = COLUMNS[i] + j;
      SQUARE_ELS_IDS[square] = square + '-' + createId();
    }
  }

  // spare pieces
  var pieces = 'KQRBNP'.split('');
  for (var i = 0; i < pieces.length; i++) {
    var whitePiece = 'w' + pieces[i];
    var blackPiece = 'b' + pieces[i];
    SPARE_PIECE_ELS_IDS[whitePiece] = whitePiece + '-' + createId();
    SPARE_PIECE_ELS_IDS[blackPiece] = blackPiece + '-' + createId();
  }
}

//---------------------------------------------------------------------------------------------------------------------------------------
// Markup Building
//---------------------------------------------------------------------------------------------------------------------------------------

function buildBoardContainer() {
  var html = '<div class="' + CSS.chessboard + '">';

  if (cfg.sparePieces === true) {
    html += '<div class="' + CSS.sparePieces + ' ' +
      CSS.sparePiecesTop + '"></div>';
  }

  html += '<div class="' + CSS.board + '"></div>';

  if (cfg.sparePieces === true) {
    html += '<div class="' + CSS.sparePieces + ' ' +
      CSS.sparePiecesBottom + '"></div>';
  }

  html += '</div>';

  return html;
}

/*
var buildSquare = function(color, size, id) {
  var html = '<div class="' + CSS.square + ' ' + CSS[color] + '" ' +
  'style="width: ' + size + 'px; height: ' + size + 'px" ' +
  'id="' + id + '">';

  if (cfg.showNotation === true) {

  }

  html += '</div>';

  return html;
};
*/

function buildBoard(orientation) {
  if (orientation !== 'black') {
    orientation = 'white';
  }

  var html = '';

  // algebraic notation / orientation
  var alpha = deepCopy(COLUMNS);
  var row = boardsize[boardsizec];
  if (orientation === 'black') {
    alpha.reverse();
    row = 1;
  }

  var squareColor = 'white';
  for (var i = 0; i < boardsize[boardsizec]; i++) {
    html += '<div class="' + CSS.row + '">';
    for (var j = 0; j < boardsize[boardsizec]; j++) {
      var square = alpha[j] + row;

      html += '<div class="' + CSS.square + ' ' + CSS[squareColor] + ' ' +
        'square-' + square + '" ' +
        'style="width: ' + SQUARE_SIZE + 'px; height: ' + SQUARE_SIZE + 'px" ' +
        'id="' + SQUARE_ELS_IDS[square] + '" ' +
        'data-square="' + square + '">';

      if (cfg.showNotation === true) {
        // alpha notation
        if ((orientation === 'white' && row === 1) ||
            (orientation === 'black' && row === 8)) {
          html += '<div class="' + CSS.notation + ' ' + CSS.alpha + '">' +
            alpha[j] + '</div>';
        }

        // numeric notation
        if (j === 0) {
          html += '<div class="' + CSS.notation + ' ' + CSS.numeric + '">' +
            row + '</div>';
        }
      }

      html += '</div>'; // end .square

      squareColor = (squareColor === 'white' ? 'black' : 'white');
    }
    html += '<div class="' + CSS.clearfix + '"></div></div>';

    squareColor = (squareColor === 'white' ? 'black' : 'white');

    if (orientation === 'white') {
      row--;
    }
    else {
      row++;
    }
  }

  return html;
}

function buildPieceImgSrc(piece) {
  if (typeof cfg.pieceTheme === 'function') {
    return cfg.pieceTheme(piece);
  }

  if (typeof cfg.pieceTheme === 'string') {
    return cfg.pieceTheme.replace(/{piece}/g, piece);
  }

  // NOTE: this should never happen
  error(8272, 'Unable to build image source for cfg.pieceTheme.');
  return '';
}

function buildPiece(piece, hidden, id) {
  var html = '<img src="' + buildPieceImgSrc(piece) + '" ';
  if (id && typeof id === 'string') {
    html += 'id="' + id + '" ';
  }
  html += 'alt="" ' +
  'class="' + CSS.piece + '" ' +
  'data-piece="' + piece + '" ' +
  'style="width: ' + SQUARE_SIZE + 'px;' +
  'height: ' + SQUARE_SIZE + 'px;';
  if (hidden === true) {
    html += 'display:none;';
  }
  html += '" />';

  return html;
}

function buildSparePieces(color) {
  var pieces = ['wK', 'wQ', 'wR', 'wB', 'wN', 'wP'];
  if (color === 'black') {
    pieces = ['bK', 'bQ', 'bR', 'bB', 'bN', 'bP'];
  }

  var html = '';
  for (var i = 0; i < pieces.length; i++) {
    html += buildPiece(pieces[i], false, SPARE_PIECE_ELS_IDS[pieces[i]]);
  }

  return html;
}

//---------------------------------------------------------------------------------------------------------------------------------------
// Animations
//---------------------------------------------------------------------------------------------------------------------------------------

function animateSquareToSquare(src, dest, piece, completeFn) {
  // get information about the source and destination squares
  var srcSquareEl = $('#' + SQUARE_ELS_IDS[src]);
  var srcSquarePosition = srcSquareEl.offset();
  var destSquareEl = $('#' + SQUARE_ELS_IDS[dest]);
  var destSquarePosition = destSquareEl.offset();

  // create the animated piece and absolutely position it
  // over the source square
  var animatedPieceId = createId();
  $('body').append(buildPiece(piece, true, animatedPieceId));
  var animatedPieceEl = $('#' + animatedPieceId);
  animatedPieceEl.css({
    display: '',
    position: 'absolute',
    top: srcSquarePosition.top,
    left: srcSquarePosition.left
  });

  // remove original piece from source square
  srcSquareEl.find('.' + CSS.piece).remove();

  // on complete
  var complete = function() {
    ANIMATION_HAPPENING = false;
    // add the "real" piece to the destination square
    destSquareEl.append(buildPiece(piece));

    // remove the animated piece
    animatedPieceEl.remove();

    // run complete function
    if (typeof completeFn === 'function') {
      completeFn();
    }
  };

  // animate the piece to the destination square
  var opts = {
    duration: cfg.moveSpeed,
    complete: complete
  };
  ANIMATION_HAPPENING = true;
  animatedPieceEl.animate(destSquarePosition, opts);
}

function animateSparePieceToSquare(piece, dest, completeFn) {
  var srcOffset = $('#' + SPARE_PIECE_ELS_IDS[piece]).offset();
  var destSquareEl = $('#' + SQUARE_ELS_IDS[dest]);
  var destOffset = destSquareEl.offset();

  // create the animate piece
  var pieceId = createId();
  $('body').append(buildPiece(piece, true, pieceId));
  var animatedPieceEl = $('#' + pieceId);
  animatedPieceEl.css({
    display: '',
    position: 'absolute',
    left: srcOffset.left,
    top: srcOffset.top
  });

  // on complete
  var complete = function() {
    ANIMATION_HAPPENING = false;
    // add the "real" piece to the destination square
    destSquareEl.find('.' + CSS.piece).remove();
    destSquareEl.append(buildPiece(piece));

    // remove the animated piece
    animatedPieceEl.remove();

    // run complete function
    if (typeof completeFn === 'function') {
      completeFn();
    }
  };

  // animate the piece to the destination square
  var opts = {
    duration: cfg.moveSpeed,
    complete: complete
  };
  ANIMATION_HAPPENING = true;
  animatedPieceEl.animate(destOffset, opts);
}

// execute an array of animations
function doAnimations(a, oldPos, newPos) {

  var numFinished = 0;
  function onFinish() {
    numFinished++;

    // exit if all the animations aren't finished
    if (numFinished !== a.length) return;

    drawPositionInstant();
    ANIMATION_HAPPENING = false;

    // run their onMoveEnd function
    if (cfg.hasOwnProperty('onMoveEnd') === true &&
      typeof cfg.onMoveEnd === 'function') {
      cfg.onMoveEnd(deepCopy(oldPos), deepCopy(newPos));
    }
  }

  for (var i = 0; i < a.length; i++) {
    // clear a piece
    if (a[i].type === 'clear') {
      $('#' + SQUARE_ELS_IDS[a[i].square] + ' .' + CSS.piece)
        .fadeOut(cfg.trashSpeed, onFinish);
    }

    // add a piece (no spare pieces)
    if (a[i].type === 'add' && cfg.sparePieces !== true) {
      $('#' + SQUARE_ELS_IDS[a[i].square])
        .append(buildPiece(a[i].piece, true))
        .find('.' + CSS.piece)
        .fadeIn(cfg.appearSpeed, onFinish);
    }

    // add a piece from a spare piece
    if (a[i].type === 'add' && cfg.sparePieces === true) {
      animateSparePieceToSquare(a[i].piece, a[i].square, onFinish);
    }

    // move a piece
    if (a[i].type === 'move') {
      animateSquareToSquare(a[i].source, a[i].destination, a[i].piece,
        onFinish);
    }
  }
}

// returns the distance between two squares
function squareDistance(s1, s2) {
  s1 = s1.split('');
  var s1x = COLUMNS.indexOf(s1[0]) + 1;
  var s1y = parseInt(s1[1], 10);

  s2 = s2.split('');
  var s2x = COLUMNS.indexOf(s2[0]) + 1;
  var s2y = parseInt(s2[1], 10);

  var xDelta = Math.abs(s1x - s2x);
  var yDelta = Math.abs(s1y - s2y);

  if (xDelta >= yDelta) return xDelta;
  return yDelta;
}

// returns an array of closest squares from square
function createRadius(square) {
  var squares = [];

  // calculate distance of all squares
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      var s = COLUMNS[i] + (j + 1);

      // skip the square we're starting from
      if (square === s) continue;

      squares.push({
        square: s,
        distance: squareDistance(square, s)
      });
    }
  }

  // sort by distance
  squares.sort(function(a, b) {
    return a.distance - b.distance;
  });

  // just return the square code
  var squares2 = [];
  for (var i = 0; i < squares.length; i++) {
    squares2.push(squares[i].square);
  }

  return squares2;
}

// returns the square of the closest instance of piece
// returns false if no instance of piece is found in position
function findClosestPiece(position, piece, square) {
  // create array of closest squares from square
  var closestSquares = createRadius(square);

  // search through the position in order of distance for the piece
  for (var i = 0; i < closestSquares.length; i++) {
    var s = closestSquares[i];

    if (position.hasOwnProperty(s) === true && position[s] === piece) {
      return s;
    }
  }

  return false;
}

// calculate an array of animations that need to happen in order to get
// from pos1 to pos2
function calculateAnimations(pos1, pos2) {
  // make copies of both
  pos1 = deepCopy(pos1);
  pos2 = deepCopy(pos2);

  var animations = [];
  var squaresMovedTo = {};

  // remove pieces that are the same in both positions
  for (var i in pos2) {
    if (pos2.hasOwnProperty(i) !== true) continue;

    if (pos1.hasOwnProperty(i) === true && pos1[i] === pos2[i]) {
      delete pos1[i];
      delete pos2[i];
    }
  }

  // find all the "move" animations
  for (var i in pos2) {
    if (pos2.hasOwnProperty(i) !== true) continue;

    var closestPiece = findClosestPiece(pos1, pos2[i], i);
    if (closestPiece !== false) {
      animations.push({
        type: 'move',
        source: closestPiece,
        destination: i,
        piece: pos2[i]
      });

      delete pos1[closestPiece];
      delete pos2[i];
      squaresMovedTo[i] = true;
    }
  }

  // add pieces to pos2
  for (var i in pos2) {
    if (pos2.hasOwnProperty(i) !== true) continue;

    animations.push({
      type: 'add',
      square: i,
      piece: pos2[i]
    })

    delete pos2[i];
  }

  // clear pieces from pos1
  for (var i in pos1) {
    if (pos1.hasOwnProperty(i) !== true) continue;

    // do not clear a piece if it is on a square that is the result
    // of a "move", ie: a piece capture
    if (squaresMovedTo.hasOwnProperty(i) === true) continue;

    animations.push({
      type: 'clear',
      square: i,
      piece: pos1[i]
    });

    delete pos1[i];
  }

  return animations;
}

//---------------------------------------------------------------------------------------------------------------------------------------
// Control Flow
//---------------------------------------------------------------------------------------------------------------------------------------
var mDownMClick=false,
    mDownMClickDelay=50;//srgvetal


function drawPositionInstant() {
  ANIMATION_HAPPENING = false;
  // clear the board
  boardEl.find('.' + CSS.piece).remove();

  // add the pieces
  for (var i in CURRENT_POSITION) {
    if (CURRENT_POSITION.hasOwnProperty(i) !== true) continue;

    $('#' + SQUARE_ELS_IDS[i]).append(buildPiece(CURRENT_POSITION[i]));
  }
}

function drawBoard() {
  boardEl.html(buildBoard(CURRENT_ORIENTATION));
  drawPositionInstant();

  if (cfg.sparePieces === true) {
    if (CURRENT_ORIENTATION === 'white') {
      sparePiecesTopEl.html(buildSparePieces('black'));
      sparePiecesBottomEl.html(buildSparePieces('white'));
    }
    else {
      sparePiecesTopEl.html(buildSparePieces('white'));
      sparePiecesBottomEl.html(buildSparePieces('black'));
    }
  }
}

// given a position and a set of moves, return a new position
// with the moves executed
function calculatePositionFromMoves(position, moves) {
  //console.log(position);
  position = deepCopy(position);

  for (var i in moves) {
    if (moves.hasOwnProperty(i) !== true) continue;

    // skip the move if the position doesn't have a piece on the source square
    if (position.hasOwnProperty(i) !== true) continue;

    var piece = position[i];
    delete position[i];
    position[moves[i]] = piece;
  }

  return position;
}

function setCurrentPosition(position) {
  var oldPos = deepCopy(CURRENT_POSITION);
  var newPos = deepCopy(position);
  var oldFen = objToFen(oldPos);
  var newFen = objToFen(newPos);

  // console.log(oldFen);
  // console.log(newFen);

  // do nothing if no change in position
  if (oldFen === newFen) return;

  // run their onChange function
  if (cfg.hasOwnProperty('onChange') === true &&
    typeof cfg.onChange === 'function') {
    cfg.onChange(oldPos, newPos);
  }

  // console.log(position);
  // update state
  CURRENT_POSITION = position;
}

function isXYOnSquare(x, y) {
  for (var i in SQUARE_ELS_OFFSETS) {
    if (SQUARE_ELS_OFFSETS.hasOwnProperty(i) !== true) continue;

    var s = SQUARE_ELS_OFFSETS[i];
    if (x >= s.left && x < s.left + SQUARE_SIZE &&
        y >= s.top && y < s.top + SQUARE_SIZE) {
      // //console.log('x: '+x+'  y: '+y+'  i: '+i);
      return i;
    }
  }

  // //console.log('x: '+x+'  y: '+y+'  offboard');
  return 'offboard';
}

// records the XY coords of every square into memory
function captureSquareOffsets() {
  SQUARE_ELS_OFFSETS = {};

  for (var i in SQUARE_ELS_IDS) {
    if (SQUARE_ELS_IDS.hasOwnProperty(i) !== true) continue;

    SQUARE_ELS_OFFSETS[i] = $('#' + SQUARE_ELS_IDS[i]).offset();
  }
}

function removeSquareHighlights() {
  boardEl.find('.' + CSS.square)
    .removeClass(CSS.highlight1 + ' ' + CSS.highlight2);
}

function snapbackDraggedPiece() {
  // there is no "snapback" for spare pieces
  if (DRAGGED_PIECE_SOURCE === 'spare') {
    trashDraggedPiece();
    return;
  }

  removeSquareHighlights();

  // animation complete
  function complete() {
    drawPositionInstant();
    draggedPieceEl.css('display', 'none');

    // run their onSnapbackEnd function
    if (cfg.hasOwnProperty('onSnapbackEnd') === true &&
      typeof cfg.onSnapbackEnd === 'function') {
      cfg.onSnapbackEnd(DRAGGED_PIECE, DRAGGED_PIECE_SOURCE,
        deepCopy(CURRENT_POSITION), CURRENT_ORIENTATION);
    }
  }

  // get source square position
  var sourceSquarePosition =
    $('#' + SQUARE_ELS_IDS[DRAGGED_PIECE_SOURCE]).offset();

  // animate the piece to the target square
  var opts = {
    duration: cfg.snapbackSpeed,
    complete: complete
  };
  ANIMATION_HAPPENING = true;
  draggedPieceEl.animate(sourceSquarePosition, opts);

  // set state
  DRAGGING_A_PIECE = false;
}

function trashDraggedPiece() {
  removeSquareHighlights();

  // remove the source piece
  var newPosition = deepCopy(CURRENT_POSITION);
  delete newPosition[DRAGGED_PIECE_SOURCE];
  setCurrentPosition(newPosition);

  // redraw the position
  drawPositionInstant();

  // hide the dragged piece
  draggedPieceEl.fadeOut(cfg.trashSpeed);

  // set state
  DRAGGING_A_PIECE = false;
}

function dropDraggedPieceOnSquare(square) {
  removeSquareHighlights();

  // update position
  //console.log(CURRENT_POSITION);
  //console.log(DRAGGED_PIECE);
  var newPosition = deepCopy(CURRENT_POSITION);
  delete newPosition[DRAGGED_PIECE_SOURCE];
  newPosition[square] = DRAGGED_PIECE;
  setCurrentPosition(newPosition);

  // get target square information
  var targetSquarePosition = $('#' + SQUARE_ELS_IDS[square]).offset();

  // animation complete
  var complete = function() {
    ANIMATION_HAPPENING = false;
    drawPositionInstant();
    draggedPieceEl.css('display', 'none');

    // execute their onSnapEnd function
    if (cfg.hasOwnProperty('onSnapEnd') === true &&
      typeof cfg.onSnapEnd === 'function') {
      cfg.onSnapEnd(DRAGGED_PIECE_SOURCE, square, DRAGGED_PIECE);
    }
  };

  // snap the piece to the target square
  var opts = {
    duration: cfg.snapSpeed,
    complete: complete
  };
  ANIMATION_HAPPENING = true;
  draggedPieceEl.animate(targetSquarePosition, opts);

  // set state
  DRAGGING_A_PIECE = false;
}

function beginDraggingPiece(source, piece, x, y) {

  return;

  // run their custom onDragStart function
  // their custom onDragStart function can cancel drag start
  if (typeof cfg.onDragStart === 'function' &&
      cfg.onDragStart(source, piece,
        deepCopy(CURRENT_POSITION), CURRENT_ORIENTATION) === false) {
    return;
  }

  // set state
  DRAGGING_A_PIECE = true;
  DRAGGED_PIECE = piece;
  DRAGGED_PIECE_SOURCE = source;

  // if the piece came from spare pieces, location is offboard
  if (source === 'spare') {
    DRAGGED_PIECE_LOCATION = 'offboard';
  }
  else {
    DRAGGED_PIECE_LOCATION = source;
  }

  // capture the x, y coords of all squares in memory
  captureSquareOffsets();

  // create the dragged piece
  draggedPieceEl.attr('src', buildPieceImgSrc(piece))
    .css({
      display: '',
      position: 'absolute',
      left: x - (SQUARE_SIZE / 2),
      top: y - (SQUARE_SIZE / 2)
    });

  if (source !== 'spare') {
    // highlight the source square and hide the piece
    $('#' + SQUARE_ELS_IDS[source]).addClass(CSS.highlight1)
      .find('.' + CSS.piece).css('display', 'none');
  }
}

function updateDraggedPiece(x, y) {
  // put the dragged piece over the mouse cursor
  draggedPieceEl.css({
    left: x - (SQUARE_SIZE / 2),
    top: y - (SQUARE_SIZE / 2)
  });

  // get location
  var location = isXYOnSquare(x, y);

  // do nothing if the location has not changed
  if (location === DRAGGED_PIECE_LOCATION) return;

  // remove highlight from previous square
  if (validSquare(DRAGGED_PIECE_LOCATION) === true) {
    $('#' + SQUARE_ELS_IDS[DRAGGED_PIECE_LOCATION])
      .removeClass(CSS.highlight2);
  }

  // add highlight to new square
  if (validSquare(location) === true) {
    $('#' + SQUARE_ELS_IDS[location]).addClass(CSS.highlight2);
  }

  // run onDragMove
  if (typeof cfg.onDragMove === 'function') {
    cfg.onDragMove(location, DRAGGED_PIECE_LOCATION,
      DRAGGED_PIECE_SOURCE, DRAGGED_PIECE,
      deepCopy(CURRENT_POSITION), CURRENT_ORIENTATION);
  }

  // update state
  DRAGGED_PIECE_LOCATION = location;
}

function showHistory() {
  var text_history='';
  for (var i = 1; i <= jhistory_length; i++) {
    if (i<=jhistory_count) text_history+='<div>'; else text_history+='<div class="disabled">'; 
    if (!anycolorturn_allowed) { if (Math.ceil(i/2)!=i/2) text_history+= Math.ceil(i/2) + '. '; } else text_history+= i+'. ';
    text_history+=thistory[i];
    text_history+='</div>';
  }
  $('#history').html(text_history);

  if (document.getElementById('history_journey_first')) {
    document.getElementById('history_journey_first').className="";
    document.getElementById('history_journey_last').className="";
    document.getElementById('history_journey_undo').className="";
    document.getElementById('history_journey_redo').className="";  
      if (jhistory_count==0) {

        document.getElementById('history_journey_first').className="disabled";
        document.getElementById('history_journey_undo').className="disabled";
      } 
      if (jhistory_count==jhistory_length) {
        document.getElementById('history_journey_last').className="disabled";
        document.getElementById('history_journey_redo').className="disabled";
      }
  }

  var status='';
  if (game.in_check()) status+='ШАХ. ';
  // console.log('application.js: '+blacklast);
  if (blacklast) status+='ход черных'; else status+='ход белых';
  // if (game.turn() === 'w') status+='ход белых';
  // if (game.turn() === 'b') status+='ход черных';
  if (game.in_checkmate()) status='МАТ. Конец игры';
  // if (game.in_stalemate()) status='ПАТ. Конец игры';
  // console.log(game.history());
  if ('#status') $('#status').html(status);

}

function stopDraggedPiece(location) {
  // console.log(CURRENT_POSITION);
  // determine what the action should be
  var action = 'drop';
  if (location === 'offboard' && cfg.dropOffBoard === 'snapback') {
    action = 'snapback';
  }
  if (location === 'offboard' && cfg.dropOffBoard === 'trash') {
    action = 'trash';
  }

  // run their onDrop function, which can potentially change the drop action
  if (cfg.hasOwnProperty('onDrop') === true &&
    typeof cfg.onDrop === 'function') {
    var newPosition = deepCopy(CURRENT_POSITION);

    // source piece is a spare s\piece and position is off the board
    //if (DRAGGED_PIECE_SOURCE === 'spare' && location === 'offboard') {...}
    // position has not changed; do nothing

    // source piece is a spare piece and position is on the board
    if (DRAGGED_PIECE_SOURCE === 'spare' && validSquare(location) === true) {
      // add the piece to the board
      newPosition[location] = DRAGGED_PIECE;
    }

    // source piece was on the board and position is off the board
    if (validSquare(DRAGGED_PIECE_SOURCE) === true && location === 'offboard') {
      // remove the piece from the board
      delete newPosition[DRAGGED_PIECE_SOURCE];
    }

    // source piece was on the board and position is on the board
    if (validSquare(DRAGGED_PIECE_SOURCE) === true &&
      validSquare(location) === true) {
      // move the piece
      delete newPosition[DRAGGED_PIECE_SOURCE];
      newPosition[location] = DRAGGED_PIECE;
    }

    var oldPosition = deepCopy(CURRENT_POSITION);

    var result = cfg.onDrop(DRAGGED_PIECE_SOURCE, location, DRAGGED_PIECE,
      newPosition, oldPosition, CURRENT_ORIENTATION);

    if (result === 'snapback' || result === 'trash') {
      action = result;
    } else {
      var rusification={};
      rusification={'P':'','R':'Л','N':'К','B':'С','Q':'Ф','K':'Кр'};

      jhistory_count++;
      jhistory_length=jhistory_count;
      jhistory[jhistory_count]=objToFen(newPosition);

      thistory[jhistory_count]=rusification[DRAGGED_PIECE[1]]+''+DRAGGED_PIECE_SOURCE+'-'+location;

      showHistory();

  // console.log(CURRENT_POSITION);

        // console.log(jhistory_count);

      if ((window.location.href.indexOf('solve')!=-1)&&((window.location.href.indexOf('solved')==-1))) {
        var historytemp=$('#history').html();
        // console.log('send: '+historytemp);
      //   $.ajax({
      //   url: 'make_move.php',
      //   type: 'POST',
      //   data: { puzzle_id: $_GET['id'],
      //   // goal: 
      //   // fen: JSON.stringify(fen),
      //    fen: objToFen(newPosition),
      //    history: JSON.stringify(historytemp),
      //    jhistory: JSON.stringify({'jhistory':jhistory,'jhistory_count':jhistory_count,'jhistory_length':jhistory_length}),
      //    thistory: JSON.stringify(thistory)
      //   // boardsize: boardsizesend`
      // },
      //   success: function(result) {
      //     // console.info('received: '+result);
      //       if (!result) {}
      //       else {
      //       }
      //   }});

      }
if ((!oldresponse)&&(document.getElementById('history_journey_first'))) {
      document.getElementById('history_journey_first').onclick = function() { hj_first(); }
      document.getElementById('history_journey_last').onclick = function() { hj_last(); }
      document.getElementById('history_journey_undo').onclick = function() { hj_undo(); }
      document.getElementById('history_journey_redo').onclick = function() { hj_redo(); }
}
    }
  }

  //console.log(action);
  // action='trash';//demoday
  // do it!
  if (action === 'snapback') {
    snapbackDraggedPiece();
  }
  else if (action === 'trash') {
    trashDraggedPiece();
  }
  else if (action === 'drop') {
    dropDraggedPieceOnSquare(location);
  }
}

//---------------------------------------------------------------------------------------------------------------------------------------
// Public Methods
//---------------------------------------------------------------------------------------------------------------------------------------

// clear the board
widget.clear = function(useAnimation) {
  widget.position({}, useAnimation);
};

/*
// get or set config properties
// TODO: write this, GitHub Issue #1
widget.config = function(arg1, arg2) {
  // get the current config
  if (arguments.length === 0) {
    return deepCopy(cfg);
  }
};
*/

// remove the widget from the page
widget.destroy = function() {
  // remove markup
  containerEl.html('');
  draggedPieceEl.remove();

  // remove event handlers
  containerEl.unbind();
};

// shorthand method to get the current FEN
widget.fen = function() {
  return widget.position('fen');
};

// flip orientation
widget.flip = function() {
  widget.orientation('flip');
};

/*
// TODO: write this, GitHub Issue #5
widget.highlight = function() {

};
*/

// move pieces
widget.move = function() {
  // no need to throw an error here; just do nothing
  if (arguments.length === 0) return;

  var useAnimation = true;

  // collect the moves into an object
  var moves = {};
  for (var i = 0; i < arguments.length; i++) {
    // any "false" to this function means no animations
    if (arguments[i] === false) {
      useAnimation = false;
      continue;
    }

    // skip invalid arguments
    if (validMove(arguments[i]) !== true) {
      error(2826, 'Invalid move passed to the move method.', arguments[i]);
      continue;
    }

    var tmp = arguments[i].split('-');
    moves[tmp[0]] = tmp[1];
  }

  // calculate position from moves
  var newPos = calculatePositionFromMoves(CURRENT_POSITION, moves);

console.log(newPos);
  // update the board
  widget.position(newPos, useAnimation);

  // return the new position object
  return newPos;
};

widget.orientation = function(arg) {
  // no arguments, return the current orientation
  if (arguments.length === 0) {
    return CURRENT_ORIENTATION;
  }

  // set to white or black
  if (arg === 'white' || arg === 'black') {
    CURRENT_ORIENTATION = arg;
    drawBoard();
    return;
  }

  // flip orientation
  if (arg === 'flip') {
    CURRENT_ORIENTATION = (CURRENT_ORIENTATION === 'white') ? 'black' : 'white';
    drawBoard();
    return;
  }

  error(5482, 'Invalid value passed to the orientation method.', arg);
};

widget.position = function(position, useAnimation) {
  // no arguments, return the current position
  if (arguments.length === 0) {
    return deepCopy(CURRENT_POSITION);
  }

  // get position as FEN
  if (typeof position === 'string' && position.toLowerCase() === 'fen') {
    return objToFen(CURRENT_POSITION);
  }

  // default for useAnimations is true
  if (useAnimation !== false) {
    useAnimation = true;
  }

  // start position
  if (typeof position === 'string' && position.toLowerCase() === 'start') {
    position = deepCopy(START_POSITION);
  }

  // convert FEN to position object
  if (validFen(position) === true) {
    position = fenToObj(position);
  }

  // validate position object
  if (validPositionObject(position) !== true) {
    error(6482, 'Invalid value passed to the position method.', position);
    return;
  }

  if (useAnimation === true) {
    // start the animations
    doAnimations(calculateAnimations(CURRENT_POSITION, position),
      CURRENT_POSITION, position);

    // set the new position
    setCurrentPosition(position);
  }
  // instant update
  else {
    setCurrentPosition(position);
    drawPositionInstant();
  }
};

widget.resize = function() {
  // calulate the new square size
  SQUARE_SIZE = calculateSquareSize();

  // set board width
  boardEl.css('width', (SQUARE_SIZE * boardsize[boardsizec]) + 'px');

  // set drag piece size
  draggedPieceEl.css({
    height: SQUARE_SIZE,
    width: SQUARE_SIZE
  });

  // spare pieces
  if (cfg.sparePieces === true) {
    containerEl.find('.' + CSS.sparePieces)
      .css('paddingLeft', (SQUARE_SIZE + BOARD_BORDER_SIZE) + 'px');
  }

  // redraw the board
  drawBoard();
};

// set the starting position
widget.start = function(useAnimation) {
  widget.position('start', useAnimation);
};

//---------------------------------------------------------------------------------------------------------------------------------------
// Browser Events
//---------------------------------------------------------------------------------------------------------------------------------------

function isTouchDevice() {
  return ('ontouchstart' in document.documentElement);
}

// reference: http://www.quirksmode.org/js/detect.html
function isMSIE() {
  return (navigator && navigator.userAgent &&
      navigator.userAgent.search(/MSIE/) !== -1);
}

function stopDefault(e) {
  e.preventDefault();
}

var CLICKED_PIECE, CLICKED_PIECE_SOURCE;

function mousedownSquare(e) {

  // console.log(CLICKED_PIECE);
  // console.log(DRAGGED_PIECE);

  // do nothing if we're not draggable
  if (cfg.draggable !== true) return;

  if (mode!='solve') return;



  var square = $(this).attr('data-square');

  // no piece on this square
  if (validSquare(square) !== true ||
      CURRENT_POSITION.hasOwnProperty(square) !== true) {
    $('.'+CSS.highlight2).removeClass(CSS.highlight2);
    if (CLICKED_PIECE) {


      // var location = isXYOnSquare(e.pageX, e.pageY);
      // //console.log('CLICKED_PIECE if, location: '+location);

      if (validSquare(CLICKED_PIECE_SOURCE) === true &&
        validSquare(square) === true) {
        // move the piece
         // delete clickedNewPosition[CLICKED_PIECE_SOURCE];
         // clickedNewPosition[location] = CLICKED_PIECE;
         onBClick(CLICKED_PIECE_SOURCE,square);
      }

    }
    return;
  }

  //console.log(square);
  //console.log(CURRENT_POSITION[square]);

  mDownMClick = true;
  CLICKED_PIECE = CURRENT_POSITION[square];
  CLICKED_PIECE_SOURCE = square;
  var clickedNewPosition = deepCopy(CLICKED_PIECE);

  if (square !== 'spare') $('#' + SQUARE_ELS_IDS[square]).addClass(CSS.highlight2);

  

  setTimeout(function(){
    if (mDownMClick) {
      CLICKED_PIECE = null;
      CLICKED_PIECE_SOURCE = null;
      $('#' + SQUARE_ELS_IDS[square]).removeClass(CSS.highlight2);
      beginDraggingPiece(square, CURRENT_POSITION[square], e.pageX, e.pageY);
    }
  },mDownMClickDelay);


  
}

function touchstartSquare(e) {
  // do nothing if we're not draggable
  if (cfg.draggable !== true) return;

  var square = $(this).attr('data-square');

  // no piece on this square
  if (validSquare(square) !== true ||
      CURRENT_POSITION.hasOwnProperty(square) !== true) {
    return;
  }

  e = e.originalEvent;
  beginDraggingPiece(square, CURRENT_POSITION[square],
    e.changedTouches[0].pageX, e.changedTouches[0].pageY);
}

function mousedownSparePiece(e) {
  // do nothing if sparePieces is not enabled
  if (cfg.sparePieces !== true) return;

  var piece = $(this).attr('data-piece');

  beginDraggingPiece('spare', piece, e.pageX, e.pageY);
}

function touchstartSparePiece(e) {
  // do nothing if sparePieces is not enabled
  if (cfg.sparePieces !== true) return;

  var piece = $(this).attr('data-piece');

  e = e.originalEvent;
  beginDraggingPiece('spare', piece,
    e.changedTouches[0].pageX, e.changedTouches[0].pageY);
}

function mousemoveWindow(e) {
  // do nothing if we are not dragging a piece
  if (DRAGGING_A_PIECE !== true) return;

  updateDraggedPiece(e.pageX, e.pageY);
}

function touchmoveWindow(e) {
  // do nothing if we are not dragging a piece
  if (DRAGGING_A_PIECE !== true) return;

  // prevent screen from scrolling
  e.preventDefault();

  updateDraggedPiece(e.originalEvent.changedTouches[0].pageX,
    e.originalEvent.changedTouches[0].pageY);
}

function mouseupWindow(e) {
  mDownMClick=false;

  // do nothing if we are not dragging a piece
  if (DRAGGING_A_PIECE !== true) return;

  // get the location
  var location = isXYOnSquare(e.pageX, e.pageY);

  //console.log(location);
  stopDraggedPiece(location);
}

function touchendWindow(e) {
  // do nothing if we are not dragging a piece
  if (DRAGGING_A_PIECE !== true) return;

  // get the location
  var location = isXYOnSquare(e.originalEvent.changedTouches[0].pageX,
    e.originalEvent.changedTouches[0].pageY);

  stopDraggedPiece(location);
}

function mouseenterSquare(e) {
  // do not fire this event if we are dragging a piece
  // NOTE: this should never happen, but it's a safeguard
  if (DRAGGING_A_PIECE !== false) return;
  if (mode != 'solve') return;

  if (cfg.hasOwnProperty('onMouseoverSquare') !== true ||
    typeof cfg.onMouseoverSquare !== 'function') return;

  // get the square
  var square = $(e.currentTarget).attr('data-square');

  // NOTE: this should never happen; defensive
  if (validSquare(square) !== true) return;

  // get the piece on this square
  var piece = false;
  if (CURRENT_POSITION.hasOwnProperty(square) === true) {
    piece = CURRENT_POSITION[square];
  }
  // console.log('b.js: '+piece);

  // execute their function
  cfg.onMouseoverSquare(square, piece, deepCopy(CURRENT_POSITION),
    CURRENT_ORIENTATION);
}

function mouseleaveSquare(e) {
  // do not fire this event if we are dragging a piece
  // NOTE: this should never happen, but it's a safeguard
  if (DRAGGING_A_PIECE !== false) return;

  if (cfg.hasOwnProperty('onMouseoutSquare') !== true ||
    typeof cfg.onMouseoutSquare !== 'function') return;

  // get the square
  var square = $(e.currentTarget).attr('data-square');

  // NOTE: this should never happen; defensive
  if (validSquare(square) !== true) return;

  // get the piece on this square
  var piece = false;
  if (CURRENT_POSITION.hasOwnProperty(square) === true) {
    piece = CURRENT_POSITION[square];
  }

  // execute their function
  cfg.onMouseoutSquare(square, piece, deepCopy(CURRENT_POSITION),
    CURRENT_ORIENTATION);
}

//---------------------------------------------------------------------------------------------------------------------------------------
// Initialization
//---------------------------------------------------------------------------------------------------------------------------------------

function addEvents() {
  // prevent browser "image drag"
  $('body').on('mousedown mousemove', '.' + CSS.piece, stopDefault);

  // mouse drag pieces
  boardEl.on('mousedown', '.' + CSS.square, mousedownSquare);
  containerEl.on('mousedown', '.' + CSS.sparePieces + ' .' + CSS.piece,
    mousedownSparePiece);

  // mouse enter / leave square
  boardEl.on('mouseenter', '.' + CSS.square, mouseenterSquare);
  boardEl.on('mouseleave', '.' + CSS.square, mouseleaveSquare);

  // IE doesn't like the events on the window object, but other browsers
  // perform better that way
  if (isMSIE() === true) {
    // IE-specific prevent browser "image drag"
    document.ondragstart = function() { return false; };

    $('body').on('mousemove', mousemoveWindow);
    $('body').on('mouseup', mouseupWindow);
  }
  else {
    $(window).on('mousemove', mousemoveWindow);
    $(window).on('mouseup', mouseupWindow);
  }

  // touch drag pieces
  if (isTouchDevice() === true) {
    boardEl.on('touchstart', '.' + CSS.square, touchstartSquare);
    containerEl.on('touchstart', '.' + CSS.sparePieces + ' .' + CSS.piece,
      touchstartSparePiece);
    $(window).on('touchmove', touchmoveWindow);
    $(window).on('touchend', touchendWindow);
  }
}

function initDom() {
  // build board and save it in memory
  containerEl.html(buildBoardContainer());
  boardEl = containerEl.find('.' + CSS.board);

  if (cfg.sparePieces === true) {
    sparePiecesTopEl = containerEl.find('.' + CSS.sparePiecesTop);
    sparePiecesBottomEl = containerEl.find('.' + CSS.sparePiecesBottom);
  }

  // create the drag piece
  var draggedPieceId = createId();
  $('body').append(buildPiece('wP', true, draggedPieceId));
  draggedPieceEl = $('#' + draggedPieceId);

  // get the border size
  BOARD_BORDER_SIZE = parseInt(boardEl.css('borderLeftWidth'), 10);

  // set the size and draw the board
  widget.resize();
}

function init() {
  if (checkDeps() !== true ||
      expandConfig() !== true) return;

  // create unique IDs for all the elements we will create
  createElIds();

  initDom();
  addEvents();
}

// go time
init();

//srgvetal
//
var $_GET = {};

document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
    function decode(s) {
        return decodeURIComponent(s.split("+").join(" "));
    }

    $_GET[decode(arguments[1])] = decode(arguments[2]);
});


if (($_GET['id'])&&($_GET['id']!='new')) {
  // console.log('load puzzle');
  // console.log($_GET['id']);
  $.ajax({
    url: 'load_puzzle_solved.php',
    type: 'POST',
    data: { puzzle_id: $_GET['id'], user_id: $_GET['user']},
    success: function(result) {
      // console.info(result+'');
          // var oldresponse=false;

          if (result) {
            var x = eval;
            x(result);

           if(window.location.href.indexOf('4x4')!=-1) anycolorturn_allowed=true; else anycolorturn_allowed=false;
            
           // console.log(oldresponse+' '+newannotation);
            if (oldresponse) { document.getElementById('history').innerHTML=newannotation; document.getElementById('history_journey').innerHTML='<span class=disabled style="font-size:25px">исх. позиция - нажмите "Было"</span>'; }
            else showHistory();
            // console.log(newfen);            
            // var newPosition = deepCopy(CURRENT_POSITION);
        //     var newPosition = fenToObj(result);
           setCurrentPosition(fenToObj(position));
           drawPositionInstant();


        // jhistory[0]=objToFen(newPosition);
 


            check_wokings();
            // console.log('here');

            setInterval(refreshBoard,2000);
          // setTimeout(function(){setCurrentPosition(fenToObj(result));
          // drawPositionInstant();},500);
        }
        
        if (!result) {}
        else {
        }
    }});
}


function refreshBoard(){
  // console.log('refreshBoard');
  if (ANIMATION_HAPPENING) return;

  $.ajax({
    url: 'load_puzzle_solved.php',
    type: 'POST',
    data: { puzzle_id: $_GET['id'], user_id: $_GET['user']},
    success: function(result) {
          // var oldresponse=false;
          if (result) {
            // console.log(result);
            var jhistory_old=jhistory,jhistory_count_old=jhistory_count,jhistory_length_old=jhistory_length;
            var x = eval;
            x(result);

            if (oldresponse) return;
            // console.log(jhistory_count_old+' '+jhistory_length);

            if ( trogalundo&&(!
            ((jhistory_count_old==(jhistory_length-1))&&(jhistory_length_old!=jhistory_length)) ) ) jhistory_count=jhistory_count_old;

  //           if (jhistory_old.toString()==jhistory.toString()) return;

            showHistory();
            var position=fenToObj(jhistory[jhistory_count]);
            // console.log(jhistory[jhistory_count]);
  doAnimations(calculateAnimations(CURRENT_POSITION, position),
      CURRENT_POSITION, position);
  setCurrentPosition(position);
        }
        
        if (!result) {}
        else {
        }
    }});


};



function saveFen(fen){
}


    $('#pieces img').click(function(){
        if (mode!='create') return;

        $('#pieces img').removeClass('sel');
            $(this).addClass('sel');
            selPiececode=$(this).attr('id');
    });

    $('#board .square-55d63').click(function(){
        if (mode!='create') return;

        var squareFor=$(this).attr('data-square');

        if (CURRENT_POSITION.hasOwnProperty(squareFor) === true) {
          var newPosition = deepCopy(CURRENT_POSITION);
          delete newPosition[squareFor];
          setCurrentPosition(newPosition);
          drawPositionInstant();
          saveFen(objToFen(newPosition));

        } else {
          
          if (!selPiececode) return;
          // $(this).attr('class').match(/\-([a-h][1-8])/g);
          // squareFor=(squareFor+'').replace('-','');

          // console.log(CURRENT_POSITION);
          var newPosition = deepCopy(CURRENT_POSITION);
          
          // console.log(selPiececode);
          // console.log(squareFor);
          // console.log(CURRENT_POSITION);
          // console.log(newPosition);
          // console.log(newPosition[squareFor]);

          newPosition[squareFor] = selPiececode;
          // console.log(newPosition);

          setCurrentPosition(newPosition);
          // console.log(newPosition);
          // console.log(objToFen(newPosition));
          saveFen(objToFen(newPosition));

          // console.log(CURRENT_POSITION);
          drawPositionInstant();

          $('#pieces img').removeClass('sel');

          selPiececode=null;
        }

    });

    $('#clearBoard').click(function(){
      var newPosition={};
      setCurrentPosition(newPosition);
      drawPositionInstant();
      saveFen(objToFen(newPosition));
    });

    function check_wokings() {
      wokings=true;
      // console.log('wokings: '+wokings);
      for (var key in CURRENT_POSITION) if (CURRENT_POSITION[key][1]=='K') wokings=false;
    }

    $('#solvePuzzle').click(function(){
      // board.position(game.fen(objToFen(CURRENT_POSITION)));
      check_wokings()

      var firstmove=[];
      firstmove=['w','b','w','b'];
      if (firstmovec>1) anycolorturn_allowed=true; else anycolorturn_allowed=false;
      var castlingstr=' KQkq';
      castlingstr=' -';
      game.load(objToFen(CURRENT_POSITION)+' '+firstmove[firstmovec]+castlingstr+' - 0 1');

      // START_FEN=objToFen(CURRENT_POSITION);
      // START_POSITION=CURRENT_POSITION;
      // game.DEFAULT_POSITION=CURRENT_POSITION;
    });

function hj_do() {
  var position=fenToObj(jhistory[jhistory_count]);  
  doAnimations(calculateAnimations(CURRENT_POSITION, position),
      CURRENT_POSITION, position);
  setCurrentPosition(position);

      var firstmove=[];
      firstmove=['w','b','w','b'];
      if (firstmovec>1) anycolorturn_allowed=true; else anycolorturn_allowed=false;
      var castlingstr=' KQkq';
      castlingstr=' -';
      var i=jhistory_count, moveblacklast;
      moveblacklast='w'; blacklast=false;
    if ((!anycolorturn_allowed)&&(Math.ceil(i/2)!=i/2)) { moveblacklast='b'; blacklast=true; }
      blacklast_write=blacklast;
    // console.log(blacklast+' '+moveblacklast);
      game.load(objToFen(CURRENT_POSITION)+' '+moveblacklast+castlingstr+' - 0 1');

  // drawPositionInstant();
  showHistory();
  // console.log(CURRENT_POSITION);
  // 
  // 
      if ((window.location.href.indexOf('solve')!=-1)&&((window.location.href.indexOf('solved')==-1))) {
        var historytemp=$('#history').html();
        // console.log('send: '+historytemp);
      //   $.ajax({
      //   url: 'make_move.php',
      //   type: 'POST',
      //   data: { puzzle_id: $_GET['id'],
      //   // goal: 
      //   // fen: JSON.stringify(fen),
      //    fen: objToFen(CURRENT_POSITION),
      //    history: JSON.stringify(historytemp),
      //    jhistory: JSON.stringify({'jhistory':jhistory,'jhistory_count':jhistory_count,'jhistory_length':jhistory_length}),
      //    thistory: JSON.stringify(thistory)
      //   // boardsize: boardsizesend`
      // },
      //   success: function(result) {
      //     // console.info('received: '+result);
      //       if (!result) {}
      //       else {
      //       }
      //   }});

      }

}

function hj_first() {
  trogalundo=true;
  if (ANIMATION_HAPPENING) return;
  jhistory_count=0;
  hj_do();
}
function hj_last() {
  trogalundo=true;
  if (ANIMATION_HAPPENING) return;
  jhistory_count=jhistory_length;
  hj_do();
}
function hj_undo() {
  trogalundo=true;
  if (ANIMATION_HAPPENING) return;
  if (jhistory_count!=0) jhistory_count--;
  hj_do();
}
function hj_redo() {
  trogalundo=true;
  if (ANIMATION_HAPPENING) return;
  if (jhistory_count!=jhistory_length) jhistory_count++;
  hj_do();
}

window.onload=function() {

if (document.getElementById('history_journey_first')) {
  document.getElementById('history_journey_first').onclick = function() { hj_first(); }
  document.getElementById('history_journey_last').onclick = function() { hj_last(); }
  document.getElementById('history_journey_undo').onclick = function() { hj_undo(); }
  document.getElementById('history_journey_redo').onclick = function() { hj_redo();}
}

}

// return the widget object
return widget;

}; // end window.ChessBoard

// expose util functions
window.ChessBoard.fenToObj = fenToObj;
window.ChessBoard.objToFen = objToFen;

var selPiececode, squareFor;




})(); // end anonymous wrapper

