/** The list of cells yet to be inhabited */
const availableCells = [0, 1, 2, 3, 4, 5, 6, 7];

/** All of the pieces and their FEN identification character */
const pieces = {
	rookA: { index: 0, id: 'r' },
	rookB: { index: 0, id: 'r' },
	knightA: { index: 0, id: 'n' },
	knightB: { index: 0, id: 'n' },
	bishopA: { index: 0, id: 'b' },
	bishopB: { index: 0, id: 'b' },
	king: { index: 0, id: 'k' },
	queen: { index: 0, id: 'q' },
}

/**
 * Returns a random integer in the range min-max
 * @param {Number} min the bottom of the range, inclusive
 * @param {Number} max the top of the range, inclusive
 */
const getRandomInRange = (min, max) => getRandomInt(max - min + 1) + min;

/**
 * Returns a number between 0 (inclusive) and max (exclusive)
 * @param {Number} max the top of the range, exclusive
 */
const getRandomInt = max => Math.floor(Math.random() * Math.floor(max));

/**
 * Removes the cell matching the piece's index from the list of available cells
 * @param {Piece} piece 
 */
const claimCell = piece => availableCells.splice(piece.index, 1);

/**
 * Returns true if the piece is on a white cell
 * @param {Piece} piece 
 */
const isOnWhite = piece => piece.index % 2 == 0;

/**
 * Places the piece in a random available cell. Note that this does not remove
 * a cell from the list of available cells.
 * @param {Piece} piece 
 * @see placeAndClaimRandomCell
 */
const placeInRandomCell = piece => piece.index = availableCells[getRandomInt(availableCells.length)];

/**
 * Places the piece in a random available cell and removes it from the list of
 * available cells.
 * @param {Piece} piece 
 */
const placeAndClaimRandomCell = piece => {
	placeInRandomCell(piece);
	claimCell(piece);
}

/** 
 * Places both rooks such that there is at least one space between them
 */
const placeRooks = () => {
	placeAndClaimRandomCell(pieces.rookA);

	do {
		placeInRandomCell(pieces.rookB);
		// if the rooks do not have a space between them, try again
	} while (Math.abs(pieces.rookA.index - pieces.rookB.index) < 2);
	claimCell(pieces.rookB);
}

/**
 *  Places the king somewhere between the position of the two rooks 
 */
const placeKing = () => {
	let leftRook = Math.min(pieces.rookA.index, pieces.rookB.index);
	let rightRook = Math.max(pieces.rookA.index, pieces.rookB.index);
	pieces.king.index = getRandomInRange(leftRook + 1, rightRook - 1);

	claimCell(pieces.king);
}

/**
 * Places the two bishops such that they are on different colors 
 */
const placeBishops = () => {
	placeAndClaimRandomCell(pieces.bishopA);

	do {
		placeInRandomCell(pieces.bishopB);
		// if both pieces are on the same color, try to place again
	} while (isOnWhite(pieces.bishopA) == isOnWhite(pieces.bishopB));
	claimCell(pieces.bishopB);
}

/**
 * Places the two knights and the queen on random spaces 
 */
const placeRemainingPieces = () => {
	placeAndClaimRandomCell(pieces.knightA);
	placeAndClaimRandomCell(pieces.knightB);
	placeAndClaimRandomCell(pieces.queen);
}

/** 
 * Generates a board using the Fischer random chess rules
 */
const generate960Board = () => {
	placeRooks();
	placeKing();
	placeBishops();
	placeRemainingPieces();
}

/**
 * Constructs a FEN string based on the pieces object 
 */
const generateFENString = () => {
	let piecesArr = Object.values(pieces);
	piecesArr.sort((a, b) => a.index - b.index);

	let fenString = '';
	piecesArr.forEach(e => fenString += e.id);
	fenString += '/pppppppp/8/8/8/8/PPPPPPPP/';
	piecesArr.forEach(e => fenString += e.id.toUpperCase());
	fenString += ' w KQkq - 0 1';
	return fenString;
}

generate960Board();
let fen = generateFENString();

console.log(fen);
const chess = new Chess(fen);

var onDragStart = function (source, piece, position, orientation) {
	if (chess.game_over() === true ||
		(chess.turn() === 'w' && piece.search(/^b/) !== -1) ||
		(chess.turn() === 'b' && piece.search(/^w/) !== -1)) {
		return false;
	}
};

var theBoard = Chessboard('board1', cfg);

var onDrop = function (source, target) {
	var move = chess.move({
		from: source,
		to: target,
		promotion: 'q'
	});

	if (move === null) return 'snapback';

}

var onSnapEnd = function () {
	theBoard.position(chess.fen());
};

var cfg = {
	draggable: true,
	dropOffBoard: 'snapback',
	sparePieces: false,
	position: fen,
	onDragStart: onDragStart,
	onDrop: onDrop,
	onSnapEnd: onSnapEnd
};

theBoard = Chessboard('board1', cfg);