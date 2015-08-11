/// <reference path="typings/jquery/jquery.d.ts"/>

$(function() {
    init();
});

function init() {
    initMenuButtons();
    initDomBoard();
    
    // TODO: remove after testing
    initGame();
}

function initGame() {
    var game = Game.getInstance();
    game.init();
}

function initMenuButtons() {
    $("#vsAiButton").click(function() {
        
    });
	
    $("#vsPlayerButton").click(function() {
        
    });
    
    $("#infoButton").click(function() {
        
    });
}

function initDomBoard() {
    for (var row = 0; row < ROWS; row++) {
        $("#board").append("<tr class='row' id='row" + row + "'></tr>");
        for (var col = 0; col < COLS; col++) {
            var parity = (row + col) % 2 === 0 ? "even" : "odd";
            $(".row#row" + row).append("<td class='cell " + parity + "Cell' id='r" + row + "c" + col + "'></td>");
        }
    }
    
    for (var i = 0; i < COLS; i++) {
        $("#game").append("<div class='piece blackPiece' id='black" + i + "'></div>");
        $("#game").append("<div class='piece whitePiece' id='white" + i + "'></div>");
    }
}