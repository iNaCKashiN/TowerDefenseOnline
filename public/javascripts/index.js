/**
 * Created by KashiN (Allena Johann),Dravet jean-Baptiste,
 * for TowerDefenseOnline,
 * on 11/03/2016.
 */

/*********************************************************************
 * Var *
 *********************************************************************/

var socket = io.connect();

var gamesViewTable;
var nbPage = -1;
var indexPage = 0;

var mute = false;
var sound;

/*********************************************************************
 * Function *
 *********************************************************************/

/**
 * This function populate the first figure with a game view
 */
function populateGameOne(gameView) {
    var lock;
    if (gameView.lock) {
        lock = "lock"
    } else {
        lock = "open"
    }
    switch (gameView.playerNameTable.length) {
        case 0 :
            $("#game-block-1").append("<figcaption>" +
                "<h3>" + gameView.nameGame + " - " + lock + "" +
                "</h3>" +
                "<h3> Round N°" + gameView.round + "</h3>" +
                "</figcaption>");
            break;
        case 1 :
            $("#game-block-1").append("<figcaption>" +
                "<h3>" + gameView.nameGame + " - " + lock + "" +
                "<span>" + gameView.playerNameTable[0] + "</span>" +
                "</h3>" +
                "<h3> Round N°" + gameView.round + "</h3>" +
                "</figcaption>");
            break;
        case 2 :
            $("#game-block-1").append("<figcaption>" +
                "<h3>" + gameView.nameGame + " - " + lock + "" +
                "<span>" + gameView.playerNameTable[0] + "</span>" +
                "<span>" + gameView.playerNameTable[1] + "</span>" +
                "</h3>" +
                "<h3> Round N°" + gameView.round + "</h3>" +
                "</figcaption>");
            break;
        case 3 :
            $("#game-block-1").append("<figcaption>" +
                "<h3>" + gameView.nameGame + " - " + lock + "" +
                "<span>" + gameView.playerNameTable[0] + "</span>" +
                "<span>" + gameView.playerNameTable[1] + "</span>" +
                "<span>" + gameView.playerNameTable[2] + "</span>" +
                "</h3>" +
                "<h3> Round N°" + gameView.round + "</h3>" +
                "</figcaption>");
            break;
        default :
            $("#game-block-1").append("<figcaption>" +
                "<h3>" + gameView.nameGame + " - " + lock + "" +
                "<span>" + gameView.playerNameTable[0] + "</span>" +
                "<span>" + gameView.playerNameTable[1] + "</span>" +
                "<span>" + gameView.playerNameTable[2] + "</span>" +
                "<span>" + gameView.playerNameTable[3] + "</span>" +
                "</h3>" +
                "<h3> Round N°" + gameView.round + "</h3>" +
                "</figcaption>");
            break;
    }
}

/**
 * This function populate the second figure with a game view
 */
function populateGameTwo(gameView) {
    var lock;
    if (gameView.lock) {
        lock = "lock"
    } else {
        lock = "open"
    }
    switch (gameView.playerNameTable.length) {
        case 0 :
            $("#game-block-2").append("<figcaption>" +
                "<h3>" + gameView.nameGame + " - " + lock + "" +
                "</h3>" +
                "<h3> Round N°" + gameView.round + "</h3>" +
                "</figcaption>");
            break;
        case 1 :
            $("#game-block-2").append("<figcaption>" +
                "<h3>" + gameView.nameGame + " - " + lock + "" +
                "<span>" + gameView.playerNameTable[0] + "</span>" +
                "</h3>" +
                "<h3> Round N°" + gameView.round + "</h3>" +
                "</figcaption>");
            break;
        case 2 :
            $("#game-block-2").append("<figcaption>" +
                "<h3>" + gameView.nameGame + " - " + lock + "" +
                "<span>" + gameView.playerNameTable[0] + "</span>" +
                "<span>" + gameView.playerNameTable[1] + "</span>" +
                "</h3>" +
                "<h3> Round N°" + gameView.round + "</h3>" +
                "</figcaption>");
            break;
        case 3 :
            $("#game-block-2").append("<figcaption>" +
                "<h3>" + gameView.nameGame + " - " + lock + "" +
                "<span>" + gameView.playerNameTable[0] + "</span>" +
                "<span>" + gameView.playerNameTable[1] + "</span>" +
                "<span>" + gameView.playerNameTable[2] + "</span>" +
                "</h3>" +
                "<h3> Round N°" + gameView.round + "</h3>" +
                "</figcaption>");
            break;
        default :
            $("#game-block-2").append("<figcaption>" +
                "<h3>" + gameView.nameGame + " - " + lock + "" +
                "<span>" + gameView.playerNameTable[0] + "</span>" +
                "<span>" + gameView.playerNameTable[1] + "</span>" +
                "<span>" + gameView.playerNameTable[2] + "</span>" +
                "<span>" + gameView.playerNameTable[3] + "</span>" +
                "</h3>" +
                "<h3> Round N°" + gameView.round + "</h3>" +
                "</figcaption>");
            break;
    }
}

/**
 * This function populate all figure
 */
function populateGame() {
    if (gamesViewTable.length != 0) {
        $("#game-block-1").show();
        if ((gamesViewTable.length % 2) === 0) {
            $("#game-block-2").show();
            populateGameOne(gamesViewTable[indexPage * 2]);
            populateGameTwo(gamesViewTable[indexPage * 2 + 1]);
        } else {
            if (gamesViewTable.length == (indexPage * 2 + 1)) {
                $("#game-block-2").hide();
                populateGameOne(gamesViewTable[indexPage * 2]);
            } else {
                $("#game-block-2").show();
                populateGameOne(gamesViewTable[indexPage * 2]);
                populateGameTwo(gamesViewTable[indexPage * 2 + 1]);
            }
        }
    } else {
        $("#game-block-2").hide();
        $("#game-block-1").hide();
    }
}

/*********************************************************************
 * Script *
 *********************************************************************/

// Get all games view.
socket.emit('getGamesView');
sound = new Howl({
    urls: ['sound/gameWait.mp3'],
    volume: 0.5,
    loop: true
});
sound.play();
if (mute) {
    sound.mute();
}

/*********************************************************************
 * Socket io *
 *********************************************************************/

// The server give us the game view.
socket.on('gamesView', function (_gamesViewTable) {
    gamesViewTable = _gamesViewTable;
    nbPage = Math.ceil(gamesViewTable.length / 2);
    if (nbPage > 1) {
        $("#next-game").show();
    }
    // Populate game
    populateGame();
});

// The server say us the game is created.
socket.on('gameCreatedOK', function () {
    $(location).attr('href', '/game');
});

// The server say us the game is not created.
socket.on('errorCreateGame', function () {
    $("#alertDynamic").append("<div role=\"alert\" class=\"alert alert-danger alert-dismissible\">" +
        "<button type=\"button\" data-dismiss=\"alert\" aria-label=\"Close\" class=\"close\">" +
        "<span aria-hidden=\"true\">×</span>" +
        "</button>" +
        "<strong>Danger! - " + " Error game created " + "</strong></div>");
});

// The server say us the game is not created.
socket.on('joinGood', function (message) {
    $(location).attr('href', '/game');
});

// The server say us the game is not created.
socket.on('joinError', function (message) {
    $("#alertDynamic").append("<div role=\"alert\" class=\"alert alert-danger alert-dismissible\">" +
        "<button type=\"button\" data-dismiss=\"alert\" aria-label=\"Close\" class=\"close\">" +
        "<span aria-hidden=\"true\">×</span>" +
        "</button>" +
        "<strong>Danger! - " +  message + "</strong></div>");
});

/*********************************************************************
 * Event *
 *********************************************************************/

/**
 * Event when the user click on previous Game
 */
$("#previous-game").click(function () {
    $("figcaption:last-child", $("#game-block-1")).remove();
    $("figcaption:last-child", $("#game-block-2")).remove();
    indexPage--;
    populateGame();
    if (indexPage === 0) {
        $("#previous-game").hide();
    }
    $("#next-game").show();
});

/**
 * Event when the user click on next Game
 */
$("#next-game").click(function () {
    $("figcaption:last-child", $("#game-block-1")).remove();
    $("figcaption:last-child", $("#game-block-2")).remove();
    indexPage++;
    populateGame();
    if (gamesViewTable.length == (indexPage * 2 + 1)) {
        $("#next-game").hide();
    }
    $("#previous-game").show();
});

/**
 * Event when the user click on Game-1
 */
$("#game-1").click(function () {
    socket.emit('join',gamesViewTable[indexPage * 2].idGame, user.pseudo);
});

/**
 * Event when the user click on Game-2
 */
$("#game-2").click(function () {
    socket.emit('join',gamesViewTable[indexPage * 2 + 1].idGame, user.pseudo);
});

/**
 * Event when the user click on Game-3
 */
$("#game-3").click(function () {
    socket.emit('newGame', user.pseudo);
});

/**
 * Event when the user click on chat
 */
$("#chat").click(function () {

});

/**
 * Event when the user click on mute
 */
$("#mute-sound").click(function () {
    if (!mute) {
        $(".icon-sound").addClass("entypo-sound");
        $(".icon-sound").removeClass("entypo-mute");
        mute = true;
        sound.mute();
    } else {
        $(".icon-sound").removeClass("entypo-sound");
        $(".icon-sound").addClass("entypo-mute");
        mute = false;
        sound.unmute();
    }
});

/**
 * Event when the user click on chat
 */
$("#chat").click(function () {

});