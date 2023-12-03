import { useState } from 'react'
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
  "king": {id: 1, value: 0, image: [blackKing, whiteKing]},
  "queen": {id: 2, value: 0, image: [blackQueen, whiteQueen]},
  "rook": {id: 3, value: 0, image: [blackRook, whiteRook]},
  "knight": {id: 4, value: 0, image: [blackKnight, whiteKnight]},
  "bishop": {id: 5, value: 0, image: [blackBishop, whiteBishop]},
  "pawn": {id: 6, value: 0, image: [blackPawn, whitePawn]},
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

function isWhiteFromValue(value: number) {
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

function isLightSquare(row: number, col: number) {
  return row%2 === col%2
}


function GetSquare({row, col, value}: {row:number, col:number, value:number }) {
  const isWhite = isWhiteFromValue(value)
  const pieceName = getNameFromId(value)
  const lightSquare = isLightSquare(row,col)
  return (
    <div className={`square_size ${(lightSquare ? "light_square" : "dark_square")}`}>
      {value !==0 && <img src={pieceInfo[pieceName].image[+ isWhite]} alt={pieceName} className='square_size piece_image' />}
    </div>
  )
}


// function possiblePieceMoves(id:number, row:number, col:number) {

// }


function GetBoard({ board, isWhitePlayer }: { board: number[][], isWhitePlayer: boolean }) {
  return (
    <div id='board'>
      {
        board.map((row: number[], i: number) => {
          return (
            <div className={`row`} key={i}>
              {row.map((col: number, j: number) => {
                return <GetSquare row={i} col={j} value={col} key={j} />
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
  return (
    <>
      <GetBoard board={board} isWhitePlayer={isWhitePlayer} />
    </>
  )
}

export default App
