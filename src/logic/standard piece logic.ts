import { pieceInfo } from "../App";
import { isWhiteFromId, add_rowCols, getColorMultiplier } from "./utils";

function pos_exists_in_board(row: number, col: number): boolean {
	if (8 > row && row >= 0 && 8 > col && col >= 0) {
		return true;
	}
	return false;
}

function pieceInTheWay(
	board: number[][],
	row: number,
	col: number,
	isWhitesMove: boolean
): number {
	const pieceId = board[row][col];

	const pieceColorIsWhite = isWhiteFromId(pieceId);
	if (pieceId === 0) {
		return 0;
	}
	if (isWhitesMove ? pieceColorIsWhite : !pieceColorIsWhite) {
		// same color piece cant eat
		return 2;
	}
	return 1;
}

function laserPieceMove(
	board: number[][],
	row: number,
	col: number,
	moves_direction: [number, number][]
): [number, number][] {
	const possible_moves: [number, number][] = [];
	const pieceId = board[row][col];
	const isWhitePiece = isWhiteFromId(pieceId);
	for (let d = 0; d < 4; d++) {
		for (let i = 1; i < 8; i++) {
			const move_pos: [number, number] = [
				moves_direction[d][0] * i,
				moves_direction[d][1] * i,
			];
			const new_pos = add_rowCols([row, col], move_pos);
			const [new_pos_row, new_pos_col] = new_pos;
			if (!pos_exists_in_board(new_pos_row, new_pos_col)) {
				break;
			}
			const pieceInTheWayOutput = pieceInTheWay(
				board,
				new_pos_row,
				new_pos_col,
				isWhitePiece
			);
			if (pieceInTheWayOutput === 0 || pieceInTheWayOutput === 1) {
				//if another colors piece you can eat it but not further than that
				possible_moves.push(new_pos);
			}
			if (pieceInTheWayOutput === 1 || pieceInTheWayOutput === 2) {
				break;
			}
		}
	}
	return possible_moves;
}

function bishopPieceMove(
	board: number[][],
	row: number,
	col: number
): [number, number][] {
	const moves: [number, number][] = [
		[1, 1],
		[-1, 1],
		[1, -1],
		[-1, -1],
	]; // oblique path
	return laserPieceMove(board, row, col, moves);
}
function rookPieceMove(
	board: number[][],
	row: number,
	col: number
): [number, number][] {
	const moves: [number, number][] = [
		[1, 0],
		[0, 1],
		[-1, 0],
		[0, -1],
	]; //linear path
	return laserPieceMove(board, row, col, moves);
}
function queenPieceMove(
	board: number[][],
	row: number,
	col: number
): [number, number][] {
	return [
		...rookPieceMove(board, row, col),
		...bishopPieceMove(board, row, col),
	];
}

function knightPieceMove(
	board: number[][],
	row: number,
	col: number
): [number, number][] {
	const moves: [number, number][] = [
		[2, 1],
		[2, -1],
		[-2, 1],
		[-2, -1],
		[1, 2],
		[1, -2],
		[-1, 2],
		[-1, -2],
	];
	const possible_moves: [number, number][] = [];
	const pieceId = board[row][col];
	const isWhitePiece = isWhiteFromId(pieceId);
	moves.forEach((move_pos: [number, number]) => {
		const to_move_pos = add_rowCols([row, col], move_pos);
		const [to_move_row, to_move_col] = to_move_pos;
		if (!pos_exists_in_board(to_move_row, to_move_col)) {
			return;
		}
		const pieceInTheWayOutput = pieceInTheWay(
			board,
			to_move_row,
			to_move_col,
			isWhitePiece
		);
		if (pieceInTheWayOutput === 2) {
			return;
		}
		possible_moves.push(to_move_pos);
	});
	return possible_moves;
}

function pawnPieceMove(
	board: number[][],
	row: number,
	col: number
): [number, number][] {
	const possible_moves = [];
	let moves: [number, number][] = [
		[1, 0],
		[1, 1],
		[1, -1],
		[2, 0],
	];
	const isWhitesPlay = isWhiteFromId(board[row][col]);
	if (isWhitesPlay) {
		moves = moves.map((row_col: [number, number]): [number, number] => {
			return [-row_col[0], -row_col[1]];
		});
	}
	const move_forward_pos = add_rowCols(moves[0], [row, col]);
	const [move_forward_pos_row, move_forward_pos_col] = move_forward_pos;
	if (
		pos_exists_in_board(move_forward_pos_row, move_forward_pos_col) &&
		board[move_forward_pos_row][move_forward_pos_col] === 0
	) {
		//pawn can move forward but not obstructed
		possible_moves.push(move_forward_pos);
	}
	const double_move_forward_pos = add_rowCols(moves[3], [row, col]);
	if (
		(isWhitesPlay ? row === 6 : row === 1) &&
		board[move_forward_pos_row][move_forward_pos_col] === 0 &&
		board[double_move_forward_pos[0]][double_move_forward_pos[1]] === 0
	) {
		// has not moved yet, allows for double move on first move and no piece infront and no piece in the way
		possible_moves.push(double_move_forward_pos);
	}

	function add_if_can_eat_forward(
		board: number[][],
		rowCol: [number, number],
		move: [number, number]
	) {
		const new_pos = add_rowCols(rowCol, move);
		if (!pos_exists_in_board(new_pos[0], new_pos[1])) {
			return;
		}
		const pieceInTheWayOutput = pieceInTheWay(
			board,
			new_pos[0],
			new_pos[1],
			isWhitesPlay
		);
		if (pieceInTheWayOutput === 1) {
			possible_moves.push(new_pos);
		}
	}
	// const eat_forward_pos_1 = add_rowCols(moves[1], [row, col])
	// const eat_forward_pos_2 = add_rowCols(moves[2], [row, col])
	add_if_can_eat_forward(board, [row, col], moves[1]);
	add_if_can_eat_forward(board, [row, col], moves[2]);

	return possible_moves;
}

// function queenPieceMove(board:number[][], row:number, col:number)

// function canEatPiece(id: number, isWhiteMove:boolean): boolean {
//     return (id * getColorMultiplier(isWhiteMove) )>=0
// }

function possiblePieceMoves(
	board: number[][],
	row: number,
	col: number
): [number, number][] {
	const id: number = board[row][col];
	const abs_id: number = Math.abs(id);
	const possible_moves: [number, number][] = [];
	const isWhitesPlay = isWhiteFromId(id);

	if (pieceInfo["king"].id === abs_id) {
		for (let i: number = -1; i < 2; i++) {
			for (let j: number = -1; j < 2; j++) {
				const king_to_move_pos: [number, number] = add_rowCols(
					[i, j],
					[row, col]
				);
				const [king_to_move_pos_row, king_to_move_pos_col] = king_to_move_pos;
				if (
					(i === 0 && j === 0) ||
					!pos_exists_in_board(king_to_move_pos_row, king_to_move_pos_col) ||
					pieceInTheWay(
						board,
						king_to_move_pos_row,
						king_to_move_pos_col,
						isWhitesPlay
					) === 2
				) {
					continue;
				}
				possible_moves.push(king_to_move_pos);
			}
		}
	}
	if (pieceInfo["queen"].id === abs_id) {
		possible_moves.push(...queenPieceMove(board, row, col));
	}
	if (pieceInfo["bishop"].id === abs_id) {
		possible_moves.push(...bishopPieceMove(board, row, col));
	}
	if (pieceInfo["rook"].id === abs_id) {
		possible_moves.push(...rookPieceMove(board, row, col));
	}
	if (pieceInfo["knight"].id === abs_id) {
		possible_moves.push(...knightPieceMove(board, row, col));
	}
	if (pieceInfo["pawn"].id === abs_id) {
		possible_moves.push(...pawnPieceMove(board, row, col));
	}

	return possible_moves.filter((rowCol: [number, number]) => {
		const boardd = JSON.parse(JSON.stringify(board));
		let new_board = movePiece(boardd, [row, col], rowCol);
		return !check_check(new_board, isWhitesPlay);
	});
}

export function allPieceMoves(board: number[][], color: boolean) {
	function isColor(id: number) {
		return id * getColorMultiplier(color) > 0;
	}
	const possible_moves: [[number, number], [number, number][]][] = [];
	board.forEach((rows: number[], i: number) => {
		rows.forEach((col: number, j: number) => {
			const pieceId = col;
			if (!isColor(pieceId)) {
				return;
			}
			const piecePossibleMoves = possiblePieceMoves(board, i, j); //[from, to]
			if (piecePossibleMoves.length === 0) {
				return;
			}
			const piecePossibleMovesWithOrigin: [
				[number, number],
				[number, number][]
			] = [[i, j], piecePossibleMoves]; //[from, to]
			possible_moves.push(piecePossibleMovesWithOrigin);
		});
	});

	return possible_moves;
}

function getKingPos(board: number[][], color_multiplier: number): number[] {
	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 8; j++) {
			if (pieceInfo["king"].id * color_multiplier === board[i][j]) {
				return [i, j];
			}
		}
	}
	return [0, 0]; //never should happen
}

export function movePiece(
	board: number[][],
	rowColFrom: number[],
	rowColTo: number[]
) {
	const [rowFrom, colFrom] = rowColFrom;
	const [rowTo, colTo] = rowColTo;
	board[rowTo][colTo] = board[rowFrom][colFrom];
	board[rowFrom][colFrom] = 0;
	return board;
}

function check_check(board: number[][], checkForWhiteKing: boolean): boolean {
	//we act like the king is a knight and see if theirs a knight it can "eat", same goes to any piece like pawn(however direction reversed), bishop, queen and rook
	let isChecked = false;

	const color_multiplier = getColorMultiplier(checkForWhiteKing);
	const enemy_color_multiplier = -color_multiplier;
	const king_pos = getKingPos(board, color_multiplier);

	const check_each_piece: [
		string[],
		(board: number[][], row: number, col: number) => [number, number][]
	][] = [
		[["knight"], knightPieceMove],
		[["bishop", "queen"], bishopPieceMove],
		[["rook", "queen"], rookPieceMove],
		[["pawn"], pawnPieceMove],
	];

	for (const [key, value] of check_each_piece) {
		isChecked = value(board, king_pos[0], king_pos[1]).some(
			(rowCol: [number, number]) => {
				return key.some((pieceType: string) => {
					if (
						pieceInfo[pieceType].id * enemy_color_multiplier ===
						board[rowCol[0]][rowCol[1]]
					) {
						return true;
					}
					return false;
				});
			}
		);
		if (isChecked) {
			return isChecked;
		}
	}

	return isChecked;
}

export default possiblePieceMoves;
