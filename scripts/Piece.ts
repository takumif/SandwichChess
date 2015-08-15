// Piece.ts by Takumi Fujimoto

/// <reference path="Game.ts" />

class Piece {
    domElement: JQuery;
    col: number;
    row: number;
    color: string;
    id: number;

    constructor(id: number, color: string) {
        this.id = id;
        this.color = color;
        this.row = Piece.getRow(id, color);
        this.col = Piece.getCol(id);
        this.domElement = $(".piece#" + color + id);
        this.initDomElement();
        Game.getInstance().placePiece(this, this.row, this.col);
    }

    static getCol(id: number): number {
        return id;
    }

    static getRow(id: number, color: string): number {
        if (color == WHITE) {
            return 7;
        } else {
            return 0;
        }
    }
    
    initDomElement(): void {
        // remove changes from previous game
        this.domElement.off("click");
        this.domElement.show();
        
        this.domElement.click(() => {
            Game.getInstance().cellClicked(this.row, this.col);
        });
        
        this.moveDomElementWithoutAnimationTo(this.row, this.col);
    }
    
    moveTo(row: number, col: number): void {
        Game.getInstance().board.removePieceFromCell(this.row, this.col);
        
        this.row = row;
        this.col = col;

        this.moveDomElementTo(this.row, this.col);
        Game.getInstance().placePiece(this, this.row, this.col);
    }
    
    moveDomElementWithoutAnimationTo(row: number, col: number): void {
        var cell = Game.getInstance().board.cells[row][col];
        this.domElement.css(cell.domElement.position());
    }

    moveDomElementTo(row: number, col: number): void {
        var cell = Game.getInstance().board.cells[row][col];
        this.domElement.animate(cell.domElement.position(), 500);
    }
    
    fadeDomElement(): void {
        this.domElement.fadeOut();
    }

    select(): void {
        this.domElement.addClass(SELECTED);
    }
    
    unselect(): void {
        this.domElement.removeClass(SELECTED);
    }
}