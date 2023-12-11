import { allPieceMoves, movePiece } from "./standard piece logic"


function choice(arr: any[]): any[] {
    return arr[Math.floor(arr.length * Math.random())]
}


export default function robot_move_board(board:number[][], color:boolean) {
    const possible_moves = allPieceMoves(board, color)
    const piece = choice(possible_moves)
    const piecePos = piece[0]
    const pieceMoves = piece[1]

    const move = choice(pieceMoves)

    return movePiece(board, piecePos, move)


}

function list_string(list: any[]): string {
    let output:string = ""
    list.forEach((obj, index) => {
        if (obj instanceof Array ) {
            output += list_string(obj) 
        } else {
            output += obj + ", "
        }
    })
    return "[" + output + "]"
}