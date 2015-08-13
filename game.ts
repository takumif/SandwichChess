/// <reference path="typings/jquery/jquery.d.ts"/>

// Globals
var WHITE = "white";
var BLACK = "black";
var COLORS = [WHITE, BLACK];
var ROWS = 8;
var COLS = 8;
var SELECTED = "selected";
var DIRECTIONS = [{dr:  1, dc:  0},
                  {dr:  0, dc:  1},
                  {dr: -1, dc:  0},
                  {dr:  0, dc: -1}];

// Game class
class Game {
    turn: string;
    selectedPiece: Piece;
    pieces: { [keys: string]: Piece[] };
    board: Board;
    static instance: Game;

    static getOppositeColor(color: string): string {
        if (color === WHITE) {
            return BLACK;
        } else {
            return WHITE;
        }
    }

    static getInitialPieces(color: string): Piece[] {
        var pieces = [];

        for (var i = 0; i < COLS; i++) {
            pieces.push(new Piece(i, color));
        }

        return pieces;
    }

    static getInstance(): Game {
        if (Game.instance === undefined) {
            Game.instance = new Game();
        }
    
        return Game.instance;
    }
    
    static withinBounds(row: number, col: number): boolean {
        return (0 <= row && row < ROWS) && (0 <= col && col < COLS);
    }
    
    static getAdjsWithinBounds(row: number, col: number): {row: number; col: number;}[] {
        var allAdjs = DIRECTIONS.map((deltas) => {
            return {row: row + deltas.dr, col: col + deltas.dc};
        });
        
        var adjsWithinBounds = allAdjs.filter((coords) => {
            return Game.withinBounds(coords.row, coords.col);
        }); 
        
        return adjsWithinBounds;
    }

    init(): void {
        this.board = new Board();

        this.pieces = {};
        this.pieces[WHITE] = Game.getInitialPieces(WHITE);
        this.pieces[BLACK] = Game.getInitialPieces(BLACK);
        
        this.updateScores();

        this.selectedPiece = null;
        this.turn = WHITE;
        this.indicateTurn(WHITE);
    }

    removeSandwichedPieces(row: number, col: number): void {
        DIRECTIONS.forEach((deltas) => {
            var r = row + deltas.dr;
            var c = col + deltas.dc;
        
            while (Game.withinBounds(r, c)) {
                var piece = this.getPieceInCell(r, c);
                if (piece == null) {
                    break;
                }
            
                if (piece.color == this.turn) {
                    this.removePiecesBetween(r, c, row, col);
                    break;
                }
            
                r += deltas.dr;
                c += deltas.dc;
            }
        });
    }

    // remove pieces exclusively (pieces at the argument coordinates won't be removed)
    removePiecesBetween(row1: number, col1: number, row2: number, col2: number): void {
        if (row1 === row2) {
            var minCol = Math.min(col1, col2) + 1;
            var maxCol = Math.max(col1, col2);
        
            for (var i = minCol; i < maxCol; i++) {
                this.removePiece(this.getPieceInCell(row1, i));
            }
        }
    
        if (col1 === col2) {
            var minRow = Math.min(row1, row2) + 1;
            var maxRow = Math.max(row1, row2);
        
            for (var i = minRow; i < maxRow; i++) {
                this.removePiece(this.getPieceInCell(i, col1));
            }
        }
    }

    makeMove(row: number, col: number): void {
        this.selectedPiece.moveTo(row, col);
        this.unselectPiece();
        
        window.setTimeout(() => {
            this.removeSandwichedPieces(row, col);
            this.removeUnmovablePieces(row, col);
            this.updateScores();
            if (this.isGameOver()) {
                window.setTimeout(() => {
                    this.gameOver();
                }, 500);
            } else {
                this.changeTurns();
            }
        }, 300);
    }

    hasNoPiecesInColBetweenRows(col: number, row1: number, row2: number): boolean {
        var minRow = Math.min(row1, row2);
        var maxRow = Math.max(row1, row2);
    
        for (var i = minRow + 1; i < maxRow; i++) {
            console.log("Checking if the cell is empty at " + i + ", " + col);
            if (this.getPieceInCell(i, col) != null) {
                return false;
            }
        }
        
        return true;
    }

    hasNoPiecesInRowBetweenCols(row: number, col1: number, col2: number): boolean {
        var minCol = Math.min(col1, col2);
        var maxCol = Math.max(col1, col2);
    
        for (var i = minCol + 1; i < maxCol; i++) {
            console.log("Checking if the cell is empty at " + row + ", " + i);
            if (this.getPieceInCell(row, i) != null) {
                return false;
            }
        }
        
        return true;
    }

    isLegitimateMove(row: number, col: number): boolean {
        if (this.selectedPiece === null || this.getPieceInCell(row, col) !== null) {
            return false;
        }
    
        if (row === this.selectedPiece.row) {
            return this.hasNoPiecesInRowBetweenCols(row, col, this.selectedPiece.col);
        }
    
        if (col === this.selectedPiece.col) {
            return this.hasNoPiecesInColBetweenRows(col, row, this.selectedPiece.row);
        }
    
        return false;
    }

    unselectPiece(): void {
        console.log("piece unselected");
        this.selectedPiece.unselect();
        this.selectedPiece = null;
    }

    selectPiece(piece: Piece): void {
        console.log("piece selected");
        this.selectedPiece = piece;
        piece.select();
    }

    getPieceInCell(row: number, col: number): Piece {
        return this.board.getPieceInCell(row, col);
    }

    removePiece(piece: Piece): void {
        var color = Game.getOppositeColor(this.turn);
        this.pieces[color].splice(this.pieces[color].indexOf(piece), 1);
        
        this.board.removePieceFromCell(piece.row, piece.col);
        piece.fadeDomElement();
    }

    placePiece(piece: Piece, row: number, col: number): void {
        this.board.cells[row][col].piece = piece;
    }

    makeMoveIfLegitimate(row: number, col: number): void {
        if (this.isLegitimateMove(row, col)) {
            this.makeMove(row, col);
        } else {
            var pieceInCell = this.getPieceInCell(row, col);
        
            if (this.selectedPiece === pieceInCell) {
                this.unselectPiece();
            } else {
                this.unselectPiece();
            
                if (pieceInCell != null && pieceInCell.color === this.turn) {
                    this.selectPiece(pieceInCell);
                }
            }
        }
    }

    cellClicked(row: number, col: number): void {
        console.log("Cell clicked: (" + row + ", " + col + ")");
    
        if (this.selectedPiece == null) {
            var pieceInCell = this.getPieceInCell(row, col);
            console.log("PieceInCell:" + pieceInCell);
        
            if (pieceInCell != null && pieceInCell.color == this.turn) {
                this.selectPiece(pieceInCell);
            }
        } else {
            this.makeMoveIfLegitimate(row, col);
        }
    }
    
    refreshPiecePositions(): void {
        COLORS.forEach((color) => {
            this.pieces[color].forEach((piece) => {
                piece.moveDomElementWithoutAnimationTo(piece.row, piece.col);
            });
        });
    }
    
    private isGameOver(): boolean {
        return (this.countPieces(this.turn) >= 
                this.countPieces(Game.getOppositeColor(this.turn)) + 3) ||
               ((this.countPieces(this.turn) > 
                 this.countPieces(Game.getOppositeColor(this.turn))) &&
                (this.countPieces(Game.getOppositeColor(this.turn)) <= 3));
    }
    
    private countPieces(color: string): number {
        return this.pieces[color].length;
    }
    
    private gameOver(): void {
        $("#winnerName").text(this.turn.toUpperCase());
        $("#gameOverScreen").show();
    }
    
    private indicateTurn(color: string): void {
        var position = color == WHITE ? 0 : $('.scorePanel').width();
        $("#turnIndicator").animate({"margin-left": position}, 500);
    }
    
    private updateScores(): void {
        $("#whiteScoreText").text(this.pieces[WHITE].length);
        $("#blackScoreText").text(this.pieces[BLACK].length);
    }

    private changeTurns(): void {
        this.turn = Game.getOppositeColor(this.turn);
        this.indicateTurn(this.turn);
    }
    
    private removeUnmovablePieces(row: number, col: number): void {
        Game.getAdjsWithinBounds(row, col).forEach((adj) => {
            var piece = this.getPieceInCell(adj.row, adj.col);
            if (piece != null && piece.color == Game.getOppositeColor(this.turn)) {
                var empty2d = Array.apply(null, Array(8)).map(() => { return new Array(8) }); // emtpy 8x8 array
                var unmovable = this.getUnmovableAdjPieces(adj.row, adj.col, empty2d);
                this.removePieces(unmovable);
            }
        });
    }
    
    private getUnmovableAdjPieces(row: number, col: number,
        visited: boolean[][]): Piece[] {
        console.log("getUnmovableAdjPieces(" + row + ", " + col + ")")
        if (this.getPieceInCell(row, col) === null) {
            return [];
        }
        
        visited[row][col] = true;
        var unmovable: Piece[] = [this.getPieceInCell(row, col)];
        
        Game.getAdjsWithinBounds(row, col).some((adj) => {
            if (!visited[adj.row][adj.col] &&
                (this.getPieceInCell(adj.row, adj.col) === null ||
                    this.getPieceInCell(adj.row, adj.col).color === Game.getOppositeColor(this.turn))) {
                var unmovableForAdj = this.getUnmovableAdjPieces(adj.row, adj.col, visited);
                Array.prototype.push.apply(unmovable, unmovableForAdj);
                
                // if unmovableForAdj is empty then either this piece or the adj piece is movable, so short circuit
                if (unmovableForAdj.length === 0) {
                    unmovable = [];
                    return true;
                }
            }
            
            return false;
        });
        
        return unmovable;
    }
    
    private removePieces(pieces: Piece[]): void {
        pieces.forEach((piece) => {
            this.removePiece(piece);
        });
    }
}


// Board class
class Board {
    cells: Cell[][];

    constructor() {
        this.cells = Board.getCells();
    }
    
    getPieceInCell(row: number, col: number): Piece {
        return this.cells[row][col].piece;
    }
    
    removePieceFromCell(row: number, col: number): void {
        this.cells[row][col].piece = null;
    }
    
    static getCells(): Cell[][] {
        var cells: Cell[][] = [];
        
        for (var row = 0; row < ROWS; row++) {
            cells.push([]);
            
            for (var col = 0; col < COLS; col++) {
                cells[row].push(new Cell(row, col));
            }
        }
        
        return cells;
    }
}


// Piece class
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
    
    hideDomElement(): void {
        this.domElement.hide();
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
}


// Cell class
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