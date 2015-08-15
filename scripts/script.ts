// script.ts by Takumi Fujimoto

/// <reference path="../typings/jquery/jquery.d.ts"/>
/// <reference path="SandwichChessConstants.ts" />
/// <reference path="Game.ts" />

// globals
var MENU_PAGE_ID = "menu";
var GAME_PAGE_ID = "game";
var INFO_PAGE_ID = "info";
var PAGE_CLASS = "page";

$(function() {
    init();
});

function init(): void {
    preloadImages();
    initMenuButtons();
    initGamePage();
    switchToPage(MENU_PAGE_ID);
}

function initGame(): void {
    var game = Game.getInstance();
    game.init();
}

function initMenuButtons(): void {
    $("#vsPlayerButton").click(function() {
        switchToPage(GAME_PAGE_ID);
        initGame();
    });
    
    $("#vsComputerButton").click(function() {
        
    });
	
    $("#infoButton").click(function() {
        
    });
}

function initGamePage() {
    initDomBoard();
    initGamePageNavigation();
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
        $("#board").append("<div class='piece blackPiece' id='black" + i + "'></div>");
        $("#board").append("<div class='piece whitePiece' id='white" + i + "'></div>");
    }
    
    $(window).resize(() => {
        Game.getInstance().refreshPiecePositions();
    });
}

function initGamePageNavigation() {
    $("#gameBackButton").click(() => {
        $("#gameConfirmationScreen").show();
    });
    
    $("#gameConfirmationSmokeScreen, #gameNoButton").click(() => {
        $("#gameConfirmationScreen").hide();
    });
    
    $("#gameYesButton").click(() => {
        $("#gameConfirmationScreen").hide();
        switchToPage(MENU_PAGE_ID);
    });
    
    $("#gameOverYesButton").click(() => {
        Game.getInstance().init();
        $("#gameOverScreen").hide();
    });
    
    $("#gameOverNoButton").click(() => {
        $("#gameOverScreen").hide();
        switchToPage(MENU_PAGE_ID);
    });
}

function switchToPage(pageId: string): void {
    $("." + PAGE_CLASS).hide();
    $("#" + pageId).show();
}

function preloadImages(): void {
    var imageUrls = [
        "images/menu.png",
        "images/vsPlayerButton.png",
        "images/vsPlayerButton_highlight.png",
        "images/vsComputerButton.png",
        "images/vsComputerButton_highlight.png",
        "images/settingsButton.png",
        "images/settingsButton_highlight.png",
        "images/rook_white.png",
        "images/rook_black.png",
        "images/back_button.png",
        "images/back_button_highlight.png",
        "images/yes_button.png",
        "images/yes_button_highlight.png",
        "images/no_button.png",
        "images/no_button_highlight.png",
    ];
    
    imageUrls.forEach((imageUrl) => {
        loadImage(imageUrl);
    })
}

function loadImage(imageUrl: string): void {
    var image = new Image();
    image.src = imageUrl;
}