import { pieceInfo, getInfoFromId } from "../App";
import { allPieceMoves, movePiece } from "./standard piece logic";
import {
	add_boards_if,
	// getColorMultiplier,
	isWhiteFromId,
	to_value_board,
} from "./utils";

function choice(arr: any[]): any[] {
	return arr[Math.floor(arr.length * Math.random())];
}

// interface type_eval_info {
// 	pieceOrigin: [number, number];
// 	pieceMove: [number, number];
// 	eval: number;
// }

// function getMinOrMaxFromDictList(list: type_eval_info[], isWhite: boolean) {
// 	return list.reduce((min_or_max: type_eval_info, current: type_eval_info) => {
// 		if (
// 			isWhite ? current.eval > min_or_max.eval : current.eval < min_or_max.eval
// 		) {
// 			return current;
// 		}
// 		return min_or_max;
// 	});
// }

export default function robot_move_board(
	board: number[][],
	isWhiteTurn: boolean
) {
	const possible_moves = allPieceMoves(board, isWhiteTurn);
	// const scores: type_eval_info[] = [];

	// possible_moves.forEach((pieceInfo) => {
	//     const pieceOrigin = pieceInfo[0]
	//     const pieceMoves = pieceInfo[1]
	//     pieceMoves.forEach((rowCol:[number,number]) => {
	//         const move_board = movePiece(JSON.parse(JSON.stringify(board)), pieceOrigin, rowCol)
	//         scores.push({
	//             pieceOrigin: pieceOrigin,
	//             pieceMove: rowCol,
	//             eval: minmax(move_board, !isWhiteTurn, 3)
	//         })
	//     })
	// })
	// const best_move = getMinOrMaxFromDictList(scores, isWhiteTurn)

	const random_piece_and_piece_move = choice(possible_moves);
	const random_piece = random_piece_and_piece_move[0];
	const random_piece_move = choice(random_piece_and_piece_move[1]);
	return movePiece(
		JSON.parse(JSON.stringify(board)),
		random_piece,
		random_piece_move
	);
}

export function evaulation(board: number[][]) {
	const valueBoard = to_value_board(board, getInfoFromId);

	const knight_position_bonus = [
		[2, 3, 4, 4, 4, 4, 3, 2],
		[3, 4, 6, 6, 6, 6, 4, 3],
		[4, 6, 8, 8, 8, 8, 6, 4],
		[4, 6, 8, 9, 9, 8, 6, 4],
		[4, 6, 8, 9, 9, 8, 6, 4],
		[4, 6, 8, 8, 8, 8, 6, 4],
		[3, 4, 6, 6, 6, 6, 4, 3],
		[2, 3, 4, 4, 4, 4, 3, 2],
	];
	knight_position_bonus.map((row: number[]) => {
		return row.map((num: number) => (num - 2) / 5);
	});
	function knight_position_bonus_condition(piece1: number) {
		if (Math.abs(piece1) === pieceInfo["knight"].id) {
			return true;
		}
		return false;
	}

	add_boards_if(
		valueBoard,
		knight_position_bonus,
		knight_position_bonus_condition
	);

	const laser_piece_position_bonus = [
		[1, 1, 1, 1, 1, 1, 1, 1],
		[1, 2, 2, 2, 2, 2, 2, 1],
		[1, 2, 3, 3, 3, 3, 2, 1],
		[1, 2, 3, 4, 4, 3, 2, 1],
		[1, 2, 3, 4, 4, 3, 2, 1],
		[1, 2, 3, 3, 3, 3, 2, 1],
		[1, 2, 2, 2, 2, 2, 2, 1],
		[1, 1, 1, 1, 1, 1, 1, 1],
	];
	laser_piece_position_bonus.map((row: number[]) => {
		return row.map((num: number) => (num - 1) / 2);
	});
	function laser_piece_position_bonus_condition(piece1: number) {
		if (
			Math.abs(piece1) === pieceInfo["queen"].id ||
			Math.abs(piece1) === pieceInfo["bishop"].id ||
			Math.abs(piece1) === pieceInfo["rook"].id
		) {
			return true;
		}
		return false;
	}

	add_boards_if(
		valueBoard,
		laser_piece_position_bonus,
		laser_piece_position_bonus_condition
	);

	const king_position_bonus = [
		[0, 1, 1, 2, 2, 1, 1, 0],
		[1, 2, 2, 3, 3, 2, 2, 1],
		[2, 3, 3, 4, 4, 3, 3, 2],
		[2, 3, 3, 4, 4, 3, 3, 2],
		[3, 4, 4, 4, 4, 4, 4, 3],
		[3, 4, 4, 5, 5, 4, 4, 3],
		[3, 4, 4, 5, 5, 4, 4, 3],
		[3, 4, 4, 5, 5, 4, 4, 3],
	];
	king_position_bonus.map((row: number[]) => {
		return row.map((num: number) => num / 2);
	});
	function king_position_bonus_condition(piece1: number) {
		if (Math.abs(piece1) === pieceInfo["king"].id) {
			return true;
		}
		return false;
	}
	function basic_mirrior_y_if(piece1: number) {
		if (isWhiteFromId(piece1)) {
			return false;
		}
		return true;
	}

	add_boards_if(
		valueBoard,
		king_position_bonus,
		king_position_bonus_condition,
		basic_mirrior_y_if
	);

	const pawn_position_bonus = [
		[0, 0, 0, 0, 0, 0, 0, 0],
		[5, 6, 8, 9, 9, 8, 6, 5],
		[4, 5, 7, 8, 8, 7, 5, 4],
		[3, 4, 6, 7, 7, 6, 4, 3],
		[2, 3, 5, 6, 6, 5, 3, 2],
		[1, 2, 4, 5, 5, 4, 2, 1],
		[1, 2, 2, 3, 3, 2, 2, 1],
		[0, 0, 0, 0, 0, 0, 0, 0],
	];
	pawn_position_bonus.map((row: number[]) => {
		return row.map((num: number) => num / 7);
	});
	function pawn_position_bonus_condition(piece1: number) {
		if (Math.abs(piece1) === pieceInfo["pawn"].id) {
			return true;
		}
		return false;
	}

	add_boards_if(
		valueBoard,
		pawn_position_bonus,
		pawn_position_bonus_condition,
		basic_mirrior_y_if
	);

	let sum = 0;

	valueBoard.forEach((row: number[]) => {
		return row.forEach((num: number) => {
			sum += num;
		});
	});
	return sum;
}

// function recursion(board: number[][], isWhitesMove: boolean, depth: number = 2): number[][]  {
//     const possible_moves = allPieceMoves(board, isWhitesMove)
//     const moves_eval: type_eval_info[] = []
//     possible_moves.forEach((pieceMoveInfo) => {
//         const pieceOrigin = pieceMoveInfo[0]
//         const pieceMoves = pieceMoveInfo[1]

//         pieceMoves.forEach((rowCol) => {
//             const move_board = movePiece(JSON.parse(JSON.stringify(board)), pieceOrigin, rowCol)
//             recursion(move_board, !isWhitesMove, depth-1)
//             moves_eval.push({
//                 pieceOrigin: pieceOrigin,
//                 pieceMove: rowCol,
//                 eval: evaulation(move_board),
//             })
//         })
//     })
//     const best_move = minmax(moves_eval, isWhitesMove)
//     const best_move_board = movePiece(JSON.parse(JSON.stringify(board)), best_move.pieceOrigin, best_move.pieceMove)

//     return best_move_board
// }

// function minmax(board: number[][], isWhitesTurn: boolean, depth: number = 5) {
// 	if (depth === 0) {
// 		return evaulation(board);
// 	}
// 	const possible_moves = allPieceMoves(board, isWhitesTurn);
// 	let best = isWhitesTurn ? -10000 : 10000;
// 	possible_moves.forEach((pieceInfo) => {
// 		const pieceOrigin = pieceInfo[0];
// 		const pieceMoves = pieceInfo[1];
// 		pieceMoves.forEach((rowCol: [number, number]) => {
// 			const move_board = movePiece(
// 				JSON.parse(JSON.stringify(board)),
// 				pieceOrigin,
// 				rowCol
// 			);
// 			const val = minmax(move_board, !isWhitesTurn, depth - 1);

// 			if (val > best) {
// 				best = val;
// 			}
// 		});
// 	});
// 	return best;
// }
