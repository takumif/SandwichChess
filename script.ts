/// <reference path="typings/jquery/jquery.d.ts"/>

// globals
var MENU_PAGE_ID = "menu";
var GAME_PAGE_ID = "game";
var INFO_PAGE_ID = "info";
var PAGE_CLASS = "page";

$(function() {
    init();
});

function init(): void {
    initMenuButtons();
    initDomBoard();
    switchToPage(MENU_PAGE_ID);
}

function initGame(): void {
    var game = Game.getInstance();
    game.init();
}

function initMenuButtons(): void {
    $("#vsAiButton").click(function() {
        
    });
	
    $("#vsPlayerButton").click(function() {
        switchToPage(GAME_PAGE_ID);
        initGame();
    });
    
    $("#infoButton").click(function() {
        
    });
}

function initDomBoard(): void {
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

function switchToPage(pageId: string): void {
    $("." + PAGE_CLASS).hide();
    $("#" + pageId).show();
}