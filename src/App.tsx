import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


function isLightSquare(row: number, col: number) {
  return row%2 === col%2
}


function GetSquare({row, col, value}: {row:number, col:number, value:number }) {
  return (
    <div className={`square_size ${(isLightSquare(row,col) ? "light_square" : "dark_square")}`}>
    </div>
  )
}

function GetBoard({ board }: { board: number[][]}) {
  return (
    <div id='board'>
      {
        board.map((row: number[], i: number) => {
          return (
            <div className="row" key={i}>
              {row.map((col: number, j: number) => {
                return <GetSquare row={i} col={j} value={col} key={i*8 + j} />
              })}
            </div>
          )
        })
      }
    </div>
  )
}


function App() {
  const [board, setBoard] = useState([
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
  ])

  console.log(board)
  return (
    <>
      <GetBoard board={board} />
    </>
  )
}

export default App
