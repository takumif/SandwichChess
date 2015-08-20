// SandwichChessAI.ts by Takumi Fujimoto

/// <reference path="Move.ts" />
/// <reference path="Color.ts" />

class SandwichChessAI {
	private game: Game;
	private color: string;
	private opponentColor: string;
	
	constructor(game: Game, color: string) {
		this.game = game;
		this.color = color;
		this.opponentColor = Game.getOppositeColor(color);
	}
	
    getMove(): Move {
		var move = this.getSandwichingMove();
		
		if (move == null) {
			move = this.getSandwichPreparingMove();
		}
		
		if (move == null) {
			move = this.getEscapingMove();
		}
		
		return move;
	}
	
    /**
     * Gets the sandwiching move that gives the AI the max advantage in terms of
     * Piece numbers after the opponent's next move
     */
	private getSandwichingMove(): Move {
		
	}
	
	private getSandwichPreparingMove(): Move {
		
	}
	
	private getEscapingMove(): Move {
		var dangerousContacts = this.getDangerousContacts();
	}
	
	private getDangerousContacts(): {aiRow: number; aiCol: number; oppRow: number; oppCol: number;}[] {
		var aiPieces = this.game.pieces[this.color];
		var dangerousContacts = [];
		
		aiPieces.forEach((piece) => {
			DIRECTIONS.forEach((dir) => {
				if (Game.isWithinBounds(piece.row + dir.dr, piece.col + dir.dc) &&
					this.isDangerousContact(piece.row, piece.col, dir.dr, dir.dc)) {
						
					dangerousContacts.push({
						aiRow: piece.row,
						aiCol: piece.col,
						oppRow: piece.row + dir.dr,
						oppCol: piece.col + dir.dc
					});
				}
			});
		});
		
		return dangerousContacts;
	}
	
	private isDangerousContact(row: number, col: number, dr: number, dc: number): boolean {
		var adjPiece = this.game.getPieceInCell(row + dr, col + dc);
		
		if (adjPiece == null || adjPiece.color == this.color) {
			return false;
		}
		
        // TODO: deal with multiple consecutive pieces in danger
		if (Game.isWithinBounds(row - dr, col - dc) &&
			this.game.getPieceInCell(row - dr, col - dc) != null &&
			this.pieceCanMoveHere(this.opponentColor, row - dr, col - dc)) {
			return true;
		}
		
		return false;
	}
	
	private pieceCanMoveHere(color: string, row: number, col: number): boolean {
		DIRECTIONS.forEach((dir) => {
			var currRow = row;
			var currCol = col;
			
			while (Game.isWithinBounds(currRow, currCol)) {
				var piece = this.game.getPieceInCell(currRow, currCol);
				
				if (piece != null) {
					if (piece.color == color) {
						return true;
					} else {
						// found a piece of wrong color that's blocking this direction
						break;
					}
				}
				
				currRow += dir.dr;
				currCol += dir.dc;
			}
		});
		
		return false;
	}
    
    private getSandwichingMovesByColor(color: Color, board: Color[][]): Move[] {
        
        return [];
    }
}