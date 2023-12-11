function mirror_matrix_x(matrix: number[][]) {
    return matrix.map((row: number[]) => {
      return row.slice().reverse()
    })
}

function mirror_matrix_y(matrix: number[][]) {
  return matrix.slice().reverse()
}
function flipBoard(board: number[][]) {
  return mirror_matrix_y(mirror_matrix_x(board))
}


function mirroedInt(num: number, max: number) {
  if (num < max/2) {
    return num
  }
  return max-num
}


function isWhiteFromId(value: number) {
  return value>0 
}

function getColorMultiplier(isWhite: boolean) {
  return isWhite && 1 || -1
}


function arraysAreEqual(arr1:any[], arr2:any[]): boolean {
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

function add_rowCols(...rowCols:[number, number][]) {
  const output: [number, number] = [0,0]
  rowCols.forEach((rowCol:[number, number]) => {
    output[0] += rowCol[0]
    output[1] += rowCol[1]
  })
  return output
}

export { flipBoard, mirroedInt, isWhiteFromId, getColorMultiplier, arraysAreEqual, add_rowCols }