function mirror_matrix_x(matrix: number[][]) {
	return matrix.map((row: number[]) => {
		return row.slice().reverse();
	});
}

function mirror_matrix_y(matrix: number[][]) {
	return matrix.slice().reverse();
}
function flipBoard(board: number[][]) {
	return mirror_matrix_y(mirror_matrix_x(board));
}

function mirroedInt(num: number, max: number) {
	if (num < max / 2) {
		return num;
	}
	return max - num;
}

function isWhiteFromId(value: number) {
	return value > 0;
}

function getColorMultiplier(isWhite: boolean) {
	return (isWhite && 1) || -1;
}

function arraysAreEqual(arr1: any[], arr2: any[]): boolean {
	if (arr1.length !== arr2.length) {
		return false;
	}

	for (let i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) {
			return false;
		}
	}

	return true;
}

// function add_arrays(...arrays: [number, number][]): [number, number] {
//   const arrays_len = arrays[0].length
//   const output: [number,number] = Array(arrays_len).fill(0)
//   arrays.forEach((number_arr:number[]) => {
//       number_arr.forEach((number:number, index: number) => {
//       output[index] += number
//       })
//   })
//   return output
// }

function add_rowCols(...rowCols: [number, number][]) {
	const output: [number, number] = [0, 0];
	rowCols.forEach((rowCol: [number, number]) => {
		output[0] += rowCol[0];
		output[1] += rowCol[1];
	});
	return output;
}

export function to_value_board(
	board: number[][],
	getInfoFromKey: any
): number[][] {
	let board_value = board.slice().map((row: number[]) => {
		return row.map((id: number) => {
			return (
				getInfoFromKey(Math.abs(id)).value *
				getColorMultiplier(isWhiteFromId(id))
			);
		});
	});
	return board_value;
}

export function add_boards_if(
	board1: number[][],
	board2: number[][],
	condition: (piece1: number, piece2: number) => boolean = () => true,
	mirrior_y_if: (piece1: number, piece2: number) => boolean = () => false
) {
	for (let i: number = 0; i < 8; i++) {
		for (let j: number = 0; j < 8; j++) {
			if (condition(board1[i][j], board2[i][j])) {
				const row = mirrior_y_if(board1[i][j], board2[i][j]) ? 7 - i : i;
				const color_multiplier = getColorMultiplier(
					isWhiteFromId(board1[i][j])
				);
				board1[i][j] += board2[row][j] * color_multiplier;
			}
		}
	}
	return board1;
}

export {
	flipBoard,
	mirroedInt,
	isWhiteFromId,
	getColorMultiplier,
	arraysAreEqual,
	add_rowCols,
};
