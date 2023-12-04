import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

//images
import blackBishop from "./assets/images/pieces/black bishop.png";
import blackRook from "./assets/images/pieces/black rook.png";
import blackKnight from "./assets/images/pieces/black knight.png";
import blackQueen from "./assets/images/pieces/black queen.png";
import blackKing from "./assets/images/pieces/black king.png";
import blackPawn from "./assets/images/pieces/black pawn.png";

import whiteBishop from "./assets/images/pieces/white bishop.png";
import whiteRook from "./assets/images/pieces/white rook.png";
import whiteKnight from "./assets/images/pieces/white knight.png";
import whiteQueen from "./assets/images/pieces/white queen.png";
import whiteKing from "./assets/images/pieces/white king.png";
import whitePawn from "./assets/images/pieces/white pawn.png";



interface pieceInterface {
  id: number;
  value: number;
  image: string[];

}

type pieceType = {
  [key: string]: pieceInterface;
};

const pieceInfo: pieceType = {
  "empty": {id: 0, value: 0, image: ["", ""]},
  "king": {id: 1, value: Infinity, image: [blackKing, whiteKing]},
  "queen": {id: 2, value: 9, image: [blackQueen, whiteQueen]},
  "rook": {id: 3, value: 5, image: [blackRook, whiteRook]},
  "knight": {id: 4, value: 3, image: [blackKnight, whiteKnight]},
  "bishop": {id: 5, value: 3, image: [blackBishop, whiteBishop]},
  "pawn": {id: 6, value: 1, image: [blackPawn, whitePawn]},
}
function getNameFromId(id: number): string {
  id = Math.abs(id)
  for (const key in pieceInfo) {
    if (pieceInfo[key].id === id) {
      return key;
    }
  }
  return "";
}
function getInfoFromId(id: number) {
  return pieceInfo[getNameFromId(id)]
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


// function intToPieceName(val: number): [string, boolean] {
//   const isWhite = val>0;
//   val = Math.abs(val);
//   let output = "empty";
//   pieceNameAndInt.forEach((piece) => {
//     if (piece[1] === val) {
//       output = piece[0];
//     }
//   })
//   return [output, isWhite];
// }
// function pieceNameToInt(name: string, isWhite: boolean) {
//   let output = 0;
//   pieceNameAndInt.forEach((piece) => {
//     if (piece[0] === name) {
//       output = piece[1]
//     }
//   })
//   return output * getColorMultiplier(isWhite)
// }

function isWhiteFromId(value: number) {
  return value>0 
}

function getColorMultiplier(isWhite: boolean) {
  return isWhite && 1 || -1
}

function mirroedInt(num: number, max: number) {
  if (num < max/2) {
    return num
  }
  return max-num
}

function isWhiteFromRow(row: number) {
  return row > 3
}

function initialBoardPiece(row: number, col:number) {
  let isWhite: boolean = isWhiteFromRow(row)
  const colorMultiplier = getColorMultiplier(isWhite)

  let pieceName: string = "empty";
  const mirrored_row = mirroedInt(row, 7);
  const mirrored_col = mirroedInt(col, 7);


  if (mirrored_row===1) {
    pieceName = "pawn";
  } else if (mirrored_row===0) {
    if (mirrored_col===0) {
      pieceName = "rook";
    } else if (mirrored_col===1) {
      pieceName = "knight";
    } else if (mirrored_col===2) {
      pieceName = "bishop"
    } else if (col === 3) {
      pieceName = "king"
    } else if (col === 4) {
      pieceName = "queen"
    }
  }

  return pieceInfo[pieceName].id * colorMultiplier;
}



function createMatrix(initialValueFunction: any): number[][] {
  const rows = 8;
  const cols = 8;

  let matrix: number[][] = [];
  for (let i: number = 0; i<rows; i++) {
    matrix[i] = [];
    for (let j: number = 0; j<cols; j++) {
      matrix[i][j] = initialValueFunction(i, j);
    }
  }
  return matrix;
}

function checkLightSquare(row: number, col: number) {
  return row%2 === col%2
}



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

function pos_exists_in_board(row:number, col:number) {
  if (8>row && row>0 && 8>col && col>0 ) {
    return true
  }
  return false
}

function pieceInTheWay(board:number[][], row:number, col:number, isWhitesMove: boolean) {
  const pieceId = board[row][col];
  const piece_info = getInfoFromId(pieceId)
  const pieceColorIsWhite = isWhiteFromId(pieceId)
  if (pieceId === 0){
    return 0
  }
  if (pieceColorIsWhite && isWhitesMove) {
    return 2
  }
  return 1

}

function add_arrays(...arrays: number[][]) {
  const arrays_len = arrays[0].length
  const output = Array(arrays_len).fill(0)
  arrays.forEach((number_arr:number[]) => {
    number_arr.forEach((number:number, index: number) => {
      output[index] += number 
    })
  })
  return output
}

function possiblePieceMoves(board: number[][], row:number, col:number): number[][] {
  const id:number = board[row][col]
  let possible_moves: number[][] = [];
  const isWhitesPlay = board[row][col]>0
  switch(id) {      
    case(pieceInfo["king"].id):
      for (let i=-1; i<2; i++) {
        for (let j=-1; j<2; j++) {
          if ((i===0 && j===0) || pos_exists_in_board(i, j)) {
            continue
          }
          possible_moves.push(add_arrays([row, col], [i, j]))
        }
      }
    case(pieceInfo["queen"].id):
      for (let d=0; d<4; d++) {
        const direction_multiplier = (d>2 && -1 || 1)
        const move = [(d+1)%2 * direction_multiplier, Math.floor(d/2) * direction_multiplier]
        for (let i=0; i<8; i++) {
          if (!pos_exists_in_board(row, col)) {
            break
          }
          const new_pos = add_arrays([row,col], move)
          const pieceInTheWayOutput = pieceInTheWay(board, new_pos[0], new_pos[1], isWhitesPlay)
          if (pieceInTheWayOutput===0 || pieceInTheWayOutput===1) {
            possible_moves.push(new_pos)
          }
          if (pieceInTheWayOutput===1 || pieceInTheWayOutput===2) {
            break
          }
        }
      }
      for (let d=0; d<4; d++) {
        const move = [d>2 && -1 || 1, d%2==0 && -1 || 1]
        for (let i=0; i<8; i++) {
          if (!pos_exists_in_board(row, col)) {
            break
          }
          const new_pos = add_arrays([row,col], move)
          const pieceInTheWayOutput = pieceInTheWay(board, new_pos[0], new_pos[1], isWhitesPlay)
          if (pieceInTheWayOutput===0 || pieceInTheWayOutput===1) {
            possible_moves.push(new_pos)
          }
          if (pieceInTheWayOutput===1 || pieceInTheWayOutput===2) {
            break
          }
        }
      }

    case(pieceInfo["bishop"].id):
    //bishop
    for (let d=0; d<4; d++) {
      const move = [d>2 && -1 || 1, d%2==0 && -1 || 1]
      for (let i=0; i<8; i++) {
        if (!pos_exists_in_board(row, col)) {
          break
        }
        const new_pos = add_arrays([row,col], move)
        const pieceInTheWayOutput = pieceInTheWay(board, new_pos[0], new_pos[1], isWhitesPlay)
        if (pieceInTheWayOutput===0 || pieceInTheWayOutput===1) {
          possible_moves.push(new_pos)
        }
        if (pieceInTheWayOutput===1 || pieceInTheWayOutput===2) {
          break
        }
      }
    }
    case(pieceInfo["rook"].id):
      for (let d=0; d<4; d++) {
        const direction_multiplier = (d>2 && -1 || 1)
        const move = [(d+1)%2 * direction_multiplier, Math.floor(d/2) * direction_multiplier]
        for (let i=0; i<8; i++) {
          if (!pos_exists_in_board(row, col)) {
            break
          }
          const new_pos = add_arrays([row,col], move)
          const pieceInTheWayOutput = pieceInTheWay(board, new_pos[0], new_pos[1], isWhitesPlay)
          if (pieceInTheWayOutput===0 || pieceInTheWayOutput===1) {
            possible_moves.push(new_pos)
          }
          if (pieceInTheWayOutput===1 || pieceInTheWayOutput===2) {
            break
          }
        }
      }
    case(pieceInfo["knight"].id):
      const moves = [[2, 1], [2,-1], [-2, 1], [-2, -1], [1, 2], [1,-2], [-1, 2], [-1, -2]]
      moves.forEach((move_pos, index: number) => {
        const to_move_pos = add_arrays([row,col], move_pos)
        const [to_move_row, to_move_col] = to_move_pos

        const pieceInTheWayOutput = pieceInTheWay(board, to_move_row, to_move_col, isWhitesPlay)
        if (pieceInTheWayOutput === 2) {
          return
        }
        possible_moves.push(to_move_pos)
      })
    
    case(pieceInfo["pawn"].id):
      let moves = [[1, 0], [-1, 1], [-1, -1], [row-2, col]]
      if (isWhitesPlay) {
        moves = moves.map((row_col: number[]) => {
          return row_col.map((num: number) => {
            return num * -1
          })
        })
      }
        if (row===8-1-1) { // has not moved yet
          possible_moves.push(moves[3])
        }
  } 
  return possible_moves
}

function GetSquare({row, col, value, stateSelectedPiece, possibleMoves}: {row:number, col:number, value:number, stateSelectedPiece: [number[], any], possibleMoves: number[][] }) {
  const [selectedPiece, setSelectedPiece] = stateSelectedPiece

  
  
    const isWhite = isWhiteFromId(value)
    const pieceName = getNameFromId(value)
    const isLightSquare = checkLightSquare(row,col)

  const is_selected_square = selectedPiece && arraysAreEqual([row,col], selectedPiece);
  const is_possible_square = possibleMoves && possibleMoves.includes([row,col]);

  let class_name = "";
  class_name += "square_size "
  if (is_selected_square) {
    class_name += isLightSquare ? "light_selected_square " : "dark_selected_square ";
  } else if (is_possible_square) {
    class_name += "possible_square ";
  } else {
    class_name += isLightSquare ? "light_square " : "dark_square "; 
  }
  return (
    <div onClick={() => {
      if (selectedPiece.length>0) {

      }
      return setSelectedPiece([row,col])}
      } className={class_name}>
      {value !==0 && <img src={pieceInfo[pieceName].image[+ isWhite]} alt={pieceName} className='square_size piece_image' />}
    </div>
  )
}


function GetBoard({ board, stateSelectedPiece, possibleMoves, isWhitePlayer }: { board: number[][], stateSelectedPiece: [number[], any], possibleMoves: number[][], isWhitePlayer: boolean }) {
  if (!isWhitePlayer) {
    board = flipBoard(board)
  }


  return (
    <div id='board'>
      {
        board.map((row: number[], i: number) => {
          return (
            <div className={`row`} key={i}>
              {row.map((col: number, j: number) => {
                return <GetSquare row={i} col={j} value={col} key={j} stateSelectedPiece = {stateSelectedPiece} possibleMoves = {possibleMoves} />
              })}
            </div>
          )
        })
      }
    </div>
  )
}


function App() {
  const [board, setBoard] = useState(createMatrix(initialBoardPiece))
  const [isWhitePlayer, setIsWhitePlayer] = useState(true)
  const stateSelectedPiece = useState([])
  const [selectedPiece, setSelectedPiece] = stateSelectedPiece
  const [possibleMoves, setPossibleMoves]: [number[][], any] = useState([])

  useEffect(() => {
    if (selectedPiece.length === 0) {return}
    setPossibleMoves(possiblePieceMoves(board, selectedPiece[0], selectedPiece[1]))
  }, [selectedPiece])

  return (
    <>
      <GetBoard board={board} isWhitePlayer={isWhitePlayer} stateSelectedPiece={stateSelectedPiece} possibleMoves={possibleMoves} />
    </>
  )
}

export default App
