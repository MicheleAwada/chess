import { pieceInfo } from "../App";

import { flipBoard } from "./utils"; 

class Board {
    constructor() {
        this.renderBoard = this.defaultBoard();
    }
    defaultBoard(): number[][] {
        const knight_id = pieceInfo["knight"].id;
        const king_id = pieceInfo["king"].id;
        const queen_id = pieceInfo["queen"].id;
        const bishop_id = pieceInfo["bishop"].id;
        const pawn_id = pieceInfo["pawn"].id;
        const rook_id = pieceInfo["rook"].id;
        const empty_id = pieceInfo["empty"].id;
        
        const initialChessBoard = [
            [-rook_id, -knight_id, -bishop_id, -queen_id, -king_id, -bishop_id, -knight_id, -rook_id],
            [-pawn_id, -pawn_id, -pawn_id, -pawn_id, -pawn_id, -pawn_id, -pawn_id, -pawn_id],
            [empty_id, empty_id, empty_id, empty_id, empty_id, empty_id, empty_id, empty_id],
            [empty_id, empty_id, empty_id, empty_id, empty_id, empty_id, empty_id, empty_id],
            [empty_id, empty_id, empty_id, empty_id, empty_id, empty_id, empty_id, empty_id],
            [empty_id, empty_id, empty_id, empty_id, empty_id, empty_id, empty_id, empty_id],
            [pawn_id, pawn_id, pawn_id, pawn_id, pawn_id, pawn_id, pawn_id, pawn_id],
            [rook_id, knight_id, bishop_id, queen_id, king_id, bishop_id, knight_id, rook_id],
          ];
        return initialChessBoard
    }
    getRenderedBoard(isWhitePlayer:boolean) {
        if (!isWhitePlayer) {
            return flipBoard(this.renderBoard)
        }
        return this.renderBoard
    }
    renderBoard: number[][] = [];
}