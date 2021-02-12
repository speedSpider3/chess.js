const http = require('http');
const fs = require('fs');
const { Chess } = require('./chess');

let min = (a, b) => {
	return a < b ? a : b;
}

let max = (a, b) => {
	return a > b ? a : b;
}

let getRandomInRange = (min, max) => {
	return getRandomInt(max - min + 1) + min;
}

let getRandomInt = max => {
	return Math.floor(Math.random() * Math.floor(max));
}

let availableCells = [0, 1, 2, 3, 4, 5, 6, 7];
let pieces = {
	rookA: {index: 0, id: 'r'},	
	rookB: {index: 0, id: 'r'},	
	knightA: {index: 0, id: 'n'},	
	knightB: {index: 0, id: 'n'},	
	bishopA: {index: 0, id: 'b'},	
	bishopB: {index: 0, id: 'b'},
	king: {index: 0, id: 'k'},	
	queen: {index: 0, id: 'q'},	
}

let placeRooks = () => {
	pieces.rookA.index = getRandomInt(8);
	availableCells.splice(pieces.rookA.index, 1);

	let rookBIndex = getRandomInt(availableCells.length);
	pieces.rookB.index = availableCells[rookBIndex];
	while (Math.abs(pieces.rookA.index - pieces.rookB.index) < 2) {
		rookBIndex = availableCells[getRandomInt(availableCells.length)];
		pieces.rookB.index = availableCells[rookBIndex];
	}
	availableCells.splice(rookBIndex, 1);
}

let placeKing = () => {
	let minI = min(pieces.rookA.index, pieces.rookB.index);
	let maxI = max(pieces.rookA.index, pieces.rookB.index);
	pieces.king.index = getRandomInRange(minI + 1, maxI - 1);

	availableCells.splice(availableCells.indexOf(pieces.king.index), 1);
}

let placeBishops = () => {
	pieces.bishopA.index = availableCells[getRandomInt(availableCells.length)];
	availableCells.splice(availableCells.indexOf(pieces.bishopA.index), 1);
	
	pieces.bishopB.index = availableCells[getRandomInt(availableCells.length)];
	if (pieces.bishopA.index % 2 == 0 && pieces.bishopB.index % 2 == 0) {
		do {
			pieces.bishopB.index = availableCells[getRandomInt(availableCells.length)];
		} while (availableCells.indexOf(pieces.bishopB.index) == -1);
	} else if (pieces.bishopB.index % 2 == 1) {
		do {
			pieces.bishopB.index = availableCells[getRandomInt(availableCells.length)]
		} while (availableCells.indexOf(pieces.bishopB.index) == -1);
	}
	availableCells.splice(availableCells.indexOf(pieces.bishopB.index), 1);
}

let placeRemainingPieces = () => {
	pieces.knightA.index = availableCells[getRandomInt(availableCells.length)];
	availableCells.splice(availableCells.indexOf(pieces.knightA.index), 1);

	pieces.knightB.index = availableCells[getRandomInt(availableCells.length)];
	availableCells.splice(availableCells.indexOf(pieces.knightB.index), 1);
	
	pieces.queen.index = availableCells[0];
}

let generate960Board = () => {
	placeRooks();
	placeKing();
	placeBishops();
	placeRemainingPieces();
}

let generateFENString = () => {
	let piecesArr = Object.values(pieces);
	piecesArr.sort((a, b) => a.index - b.index);
	
	let fenString = '';
	piecesArr.forEach(e => fenString += e.id);
	fenString += '/pppppppp/8/8/8/8/PPPPPPPP/';
	piecesArr.forEach(e => fenString += e.id.toUpperCase());
	fenString += ' w KQkq - 0 1';
	return fenString;
}

const server = http.createServer((req, res) => {
	res.writeHead(200, { 'content-type': 'text/html' });
	fs.createReadStream('index.html').pipe(res);
});

server.listen(process.env.PORT || 3000);

generate960Board();
let fen = generateFENString();

const chess = new Chess(fen);
while (!chess.game_over()) {
	const moves = chess.moves();
	const move = moves[getRandomInt(moves.length)];
	chess.move(move);
}
console.log(chess.pgn());