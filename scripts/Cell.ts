// Cell.ts by Takumi Fujimoto

/// <reference path="Piece.ts" />
/// <reference path="Game.ts" />

class Cell {
    row: number;
    col: number;
    piece: Piece;
    domElement: JQuery;
    
    constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
        this.piece = null;
        this.domElement = $(".cell#r" + row + "c" + col);
        this.initDomElement();
    }
    
    initDomElement(): void {
        // remove pre-existing bindings
        this.domElement.off("click");
    
        this.domElement.click(() => {
            Game.getInstance().cellClicked(this.row, this.col);
        });
    }
}