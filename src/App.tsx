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

import { flipBoard, mirroedInt, isWhiteFromId, getColorMultiplier, arraysAreEqual } from "./logic/utils"

import possiblePieceMoves, { movePiece, allPieceMoves as getAllPieceMoves } from "./logic/standard piece logic"

import robot_move_board from "./logic/robot"
interface pieceInterface {
  id: number;
  value: number;
  image: string[];

}

type pieceType = {
  [key: string]: pieceInterface;
};

export const pieceInfo: pieceType = {
  "empty": {id: 0, value: 0, image: ["", ""]},
  "king": {id: 1, value: 1000, image: [blackKing, whiteKing]},
  "queen": {id: 2, value: 9, image: [blackQueen, whiteQueen]},
  "rook": {id: 3, value: 5, image: [blackRook, whiteRook]},
  "knight": {id: 4, value: 3, image: [blackKnight, whiteKnight]},
  "bishop": {id: 5, value: 3, image: [blackBishop, whiteBishop]},
  "pawn": {id: 6, value: 1, image: [blackPawn, whitePawn]},
}
export function getNameFromId(id: number): string {
  id = Math.abs(id)
  for (const key in pieceInfo) {
    if (pieceInfo[key].id === id) {
      return key;
    }
  }
  return "";
}
export function getInfoFromId(id: number) {
  return pieceInfo[getNameFromId(id)]
}


function initialBoardPiece(row: number, col:number) {
  let isWhite: boolean = row > 3;
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
function getRealRowCol(rowCol: [number, number]):[number, number] {
  return  [7-rowCol[0], 7-rowCol[1]]
}


function GetSquare({stateBoard, row, col, id, setAllPossibleMoves, stateSelectedPiece, possibleMoves, isWhitePlayer, isWhitesPlay, setIsWhitesPlay}: {stateBoard:[number[][], any], row:number, col:number, id:number, setAllPossibleMoves:any, stateSelectedPiece: [number[], any], possibleMoves: number[][], isWhitePlayer:boolean, isWhitesPlay:boolean, setIsWhitesPlay:any }) {
  if (!isWhitesPlay) {
    [row, col] = getRealRowCol([row,col])
  }


  const [board, setBoard] = stateBoard
  const [selectedPiece, setSelectedPiece] = stateSelectedPiece
  const rowCol = [row,col]

  const pieceName = getNameFromId(id)
  const isWhitePiece = isWhiteFromId(id)
  const isLightSquare = checkLightSquare(row,col)

  const is_empty_square = id===0
  const is_selected_square = selectedPiece && arraysAreEqual([row,col], selectedPiece);
  let is_possible_square = possibleMoves.some(subArray => {
    return arraysAreEqual(subArray, rowCol);
  });


  

  let class_name = "";
  class_name += "square_size relative "
  class_name += isLightSquare ? "light_square " : "dark_square "; 
  return (
    <div onClick={() => {
      if (is_possible_square) {
          const person_board_move = movePiece(board, selectedPiece, [row,col])
          setBoard(person_board_move)
          setIsWhitesPlay(!isWhitesPlay)

          const robot_board_move = robot_move_board(person_board_move, !isWhitesPlay)
          setBoard(robot_board_move)
          setIsWhitesPlay(isWhitesPlay)

          const allPossibleMoves = getAllPieceMoves(robot_board_move, isWhitesPlay)
          console.log(allPossibleMoves)
          setAllPossibleMoves(allPossibleMoves)
      }
      if (isWhitePlayer === isWhitesPlay === isWhitePiece) {
        return setSelectedPiece([row,col])
      }

      return setSelectedPiece([])
    }
      } className={class_name}>
      {!is_empty_square && <div className="square_size abs-tl piece_image_padding"><img src={pieceInfo[pieceName].image[+ isWhitePiece]} alt={pieceName} className='parent-full-size piece_image' /></div>}
      {is_selected_square && <div className='selected-square-shade square_size abs-tl' ></div>}
      {is_possible_square && (is_empty_square ?
      <div className='square_size possible_square_padding abs-tl'> 
        <div className='possible_square parent-full-size' ></div>
      </div> : <div className='square_size possible_square_eat_padding abs-tl'> 
        <div className='possible_square_eat parent-full-size' ></div>
      </div>) || null
      }
    </div>
  )
}


function GetBoard({ stateBoard, stateSelectedPiece, setAllPossibleMoves, possibleMoves, isWhitePlayer, isWhitesPlay, setIsWhitesPlay }: { stateBoard: [number[][], any], setAllPossibleMoves:any, stateSelectedPiece: [number[], any], possibleMoves: number[][], isWhitePlayer: boolean, setIsWhitesPlay:any, isWhitesPlay:boolean }) {
  const [board, setBoard] = stateBoard
  let new_board = board.slice()
  if (!isWhitePlayer) {
    new_board = flipBoard(new_board)
  }


  return (
    <div id='board'>
      {
        new_board.map((row: number[], i: number) => {
          return (
            <div className={`row`} key={i}>
              {row.map((col: number, j: number) => {
                return <GetSquare setAllPossibleMoves={setAllPossibleMoves} isWhitePlayer={isWhitePlayer} isWhitesPlay={isWhitesPlay} setIsWhitesPlay={setIsWhitesPlay} stateBoard={stateBoard} row={i} col={j} id={col} key={j} stateSelectedPiece = {stateSelectedPiece} possibleMoves = {possibleMoves} />
              })}
            </div>
          )
        })
      }
    </div>
  )
}

function findPossibleMoveIndex(allPossibleMoves: [[number, number], [number, number][]][], selectedPiece: [number, number]) {
  for (let i = 0; i < allPossibleMoves.length; i++) {
    if (arraysAreEqual(allPossibleMoves[i][0], selectedPiece)) {
      return i
    }
  }
  return -1
}

function App() {
  const stateBoard: [number[][], any] = useState(createMatrix(initialBoardPiece))
  const [board,setBoard]: [number[][], any] = stateBoard
  const [isWhitePlayer, setIsWhitePlayer] = useState(true)
  const stateSelectedPiece = useState([])
  const [selectedPiece, setSelectedPiece]: [any, any] = stateSelectedPiece
  const [possibleMoves, setPossibleMoves]: [[number,number][] | [], any] = useState([])
  const [allPossibleMoves, setAllPossibleMoves]: [[[number,number], [number,number][]][], any] = useState(getAllPieceMoves(board, isWhitePlayer))
  const [isWhitesPlay, setIsWhitesPlay]: [boolean, any] = useState(true)
  useEffect(() => {
    if (selectedPiece.length === 0) {
      setPossibleMoves([])
      return
    }
    const index = findPossibleMoveIndex(allPossibleMoves, selectedPiece)
    if (index===-1) {
      setPossibleMoves([])
      return;
    }
    setPossibleMoves(allPossibleMoves[index][1])
  }, [selectedPiece])
  return (
    <>
      <GetBoard stateBoard={stateBoard} setAllPossibleMoves={setAllPossibleMoves} isWhitesPlay={isWhitesPlay} setIsWhitesPlay={setIsWhitesPlay} isWhitePlayer={isWhitePlayer} stateSelectedPiece={stateSelectedPiece} possibleMoves={possibleMoves} />
    </>
  )
}

export default App
