"use strict";

const Gameboard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];

    const winning_indexes = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [6, 4, 2]];
    const marker = {
        "X" : 1,
        "O" : 2,
        "" : "",
    };
    // Place "X" or "O" on the board
    const placeMarker = (id, marker) => {
        board[id] = marker;
        DisplayController.renderBoard();
    };
    // Check whether the current player just won 
    const checkWin = () => {
        // Loop through each group of winning indexes
        for (let i = 0; i < winning_indexes.length; i++) {
            let sum = 0;
            let qualify = true;
            // Loop through each index of the group
            for (let j = 0; j < winning_indexes[i].length; j++) {
                // If a blank value is found, skip that winning condition
                if (board[winning_indexes[i][j]] == "") {
                    qualify = false;
                    continue;
                }
                sum += board[winning_indexes[i][j]];
            };
            if (sum > 0 && sum % 3 == 0 && qualify) {
                DisplayController.announceWinner();
            };
        };
    };
    const checkTie = () => {
        if (!board.includes("")) {
            DisplayController.announceTie();
        };
    };
    return {
        marker,
        board,
        placeMarker,
        checkWin,
        checkTie,
    };
})();

const DisplayController = (() => {
    const player_turn = document.getElementById("player-turn");
    const winner_element = document.getElementById("winner");
    const displayPlayer = (num) => {
        if (DisplayController.winner_element.innerHTML == "") {
            player_turn.innerHTML = `Player ${num}'s (${getObjectKey(Gameboard.marker, num)}) turn`;
        } else {
            player_turn.innerHTML = "";
        };
    };
    const renderBoard = () => {
        for(let i = 0; i < Gameboard.board.length; i++) {
            tiles[i].innerHTML = getObjectKey(Gameboard.marker, Gameboard.board[i]);
        }
    };
    const restartGame = () => {
        // Clear tile contents
        for(let i = 0; i < Gameboard.board.length; i++) {
            Gameboard.board[i] = "";
            tiles[i].innerHTML = "";
        };
        DisplayController.winner_element.innerHTML = "";
        current_player = player_one;
        DisplayController.displayPlayer(current_player.mark_id);
    };
    const announceWinner = () => {
        winner_element.innerHTML = `Player ${current_player.mark_id} wins!`;
        player_turn.innerHTML = "";
    }
    const announceTie = () => {
        winner_element.innerHTML = "It's a tie!"
        player_turn.innerHTML = "";
    }
    return {
        winner_element,
        displayPlayer,
        renderBoard,
        restartGame,
        announceWinner,
        announceTie,
    };
})();

const Player = (num) => {
    const player_mark = getObjectKey(Gameboard.marker, num);
    const mark_id = Gameboard.marker[player_mark];
    return {player_mark, mark_id}; 
}

// Create two players
let player_one = Player(1);
let player_two = Player(2);

// Start game with Player 1 starting first
let current_player = player_one;
DisplayController.displayPlayer(1);

// Tile click event listener
const tiles = document.getElementsByClassName("board-tile");
for (let i = 0; i < tiles.length; i++) {
    tiles[i].addEventListener('click', function(e) {
        let tile_id = e.target.id;
        // Only place marker if the tile is empty and game is not finished
        if (Gameboard.board[tile_id] === "" && DisplayController.winner_element.innerHTML == "") {
            Gameboard.placeMarker(tile_id, current_player.mark_id);
            Gameboard.checkWin();
            Gameboard.checkTie();
            // Switch player
            if (current_player.mark_id == 1) {
                current_player = player_two;
            } else {
                current_player = player_one;
            };
            DisplayController.displayPlayer(current_player.mark_id);
        };
    });
};

// Restart button event listener
const restart = document.getElementById("restart");
restart.addEventListener('click', DisplayController.restartGame());

// Retrieve key by key value
function getObjectKey(obj, value) {
    return Object.keys(obj).find((key) => obj[key] === value);
};