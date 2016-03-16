/**
 * Created by KashiN (Allena Johann), Dravet jean-Baptiste,
 * for TowerDefenseOnline,
 * on 11/03/2016.
 */

/*********************************************************************
 * *********************************************************************************************************
 * Fields *
 * *********************************************************************************************************
 *********************************************************************/

var socket = io.connect();
var canvas;
var canvasOffset;
var canvas2d;

var canvasHeight;
var canvasWidth;

var currentChoice;

var towerGame;

var mute = false;
var sound;
var littleSound;

var timeSoundDate = new Date();

var frameCount = 0;
var lastTimeCount;
var fps;

var frameCountSocket = 0;
var lastTimeCountSocket;
var fpsSocket;

var lastTimeSprite = new Date();
var idSpriteMonster = 0;

var chatHide = false;
var nbMessageNotRead = 0;

/*********************************************************************
 * *********************************************************************************************************
 * Enum *
 * *********************************************************************************************************
 *********************************************************************/

/**
 * Enum Type.
 */
var CHOICE = {
    TOWER: {value: 0, name: "Tower"},
    RECYCLE: {value: 1, name: "Recycle"},
    FIRE: {value: 2, name: "Fire"},
    ICE: {value: 3, name: "Ice"},
    POISON: {value: 4, name: "Poison"}
};

/**
 * Enum Type.
 */
var TYPE = {
    NORMAL: {value: 'Gray', name: "Normal"},
    FIRE: {value: 'Red', name: "Fire"},
    POISON: {value: 'Purple', name: "Poison"},
    ICE: {value: '#33ccff', name: "Ice"}
};

/**
 * Enum GroundType
 */
var GROUNDTYPE = {
    ROAD: {value: 'Grey', name: "Road"},
    HOOD: {value: 'Brown', name: "Hood"},
    TEMPLE: {value: 'Black', name: "Temple"},
    SPAWN: {value: 'Red', name: "Spawn"},
    TOWERZONE: {value: '#666633', name: "TowerZone"}
};

/**
 * Enum direction
 */
var DIRECTION = {
    DOWN: {value: 0, name: "Down"},
    LEFT: {value: 1, name: "Left"},
    RIGHT: {value: 2, name: "Right"}
};

/*********************************************************************
 * *********************************************************************************************************
 * Class *
 * *********************************************************************************************************
 *********************************************************************/

/**
 * Class Player.
 */
function Player(playerServer) {
    this.pseudo = playerServer.pseudo;
    this.gold = playerServer.gold;
    this.nbKill = playerServer.nbKill;
    this.nbtower = playerServer.nbtower;
}

/**
 * Class Monster.
 */
function Monster(monsterServer) {
    this.box = new Box(monsterServer.box);
    this.speed = monsterServer.speed;
    this.positionX = monsterServer.positionX;
    this.positionY = monsterServer.positionY;
    this.size = monsterServer.size;
    this.targetPositionX = 0;
    this.targetPositionY = 0;

    switch (monsterServer.direction.value) {
        case 0:
            this.direction = DIRECTION.DOWN;
            break;
        case 1:
            this.direction = DIRECTION.LEFT;
            break;
        case 2:
            this.direction = DIRECTION.RIGHT;
            break;
        default:
            this.direction = DIRECTION.DOWN;
            break;
    }

    switch (monsterServer.type.value) {
        case 0:
            this.type = TYPE.NORMAL;
            break;
        case 1:
            this.type = TYPE.FIRE;
            break;
        case 2:
            this.type = TYPE.POISON;
            break;
        case 3:
            this.type = TYPE.ICE;
            break;
        default:
            this.type = TYPE.NORMAL;
            break;
    }

    this.updateSpriteDown = function (img) {
        if (idSpriteMonster % 3 == 0) {
            canvas2d.drawImage(img, 10, 12, 33, 40, this.positionX - this.box.widthBox / 2, this.positionY - this.box.heightBox / 2, this.box.widthBox, this.box.heightBox);
        } else if (idSpriteMonster % 3 == 1) {
            canvas2d.drawImage(img, 10, 69, 33, 40, this.positionX - this.box.widthBox / 2, this.positionY - this.box.heightBox / 2, this.box.widthBox, this.box.heightBox);
        } else {
            canvas2d.drawImage(img, 10, 126, 33, 40, this.positionX - this.box.widthBox / 2, this.positionY - this.box.heightBox / 2, this.box.widthBox, this.box.heightBox);
        }
    };

    this.updateSpriteRigth = function (img) {
        if (idSpriteMonster % 3 == 0) {
            canvas2d.drawImage(img, 174, 12, 40, 40, this.positionX - this.box.widthBox / 2, this.positionY - this.box.heightBox / 2, this.box.widthBox, this.box.heightBox);
        } else if (idSpriteMonster % 3 == 1) {
            canvas2d.drawImage(img, 174, 69, 40, 40, this.positionX - this.box.widthBox / 2, this.positionY - this.box.heightBox / 2, this.box.widthBox, this.box.heightBox);
        } else {
            canvas2d.drawImage(img, 174, 126, 40, 40, this.positionX - this.box.widthBox / 2, this.positionY - this.box.heightBox / 2, this.box.widthBox, this.box.heightBox);
        }
    };

    this.updateSpriteLeft = function (img) {
        if (idSpriteMonster % 3 == 0) {
            canvas2d.drawImage(img, 66, 12, 42, 40, this.positionX - this.box.widthBox / 2, this.positionY - this.box.heightBox / 2, this.box.widthBox, this.box.heightBox);
        } else if (idSpriteMonster % 3 == 1) {
            canvas2d.drawImage(img, 66, 69, 42, 40, this.positionX - this.box.widthBox / 2, this.positionY - this.box.heightBox / 2, this.box.widthBox, this.box.heightBox);
        } else {
            canvas2d.drawImage(img, 66, 126, 42, 40, this.positionX - this.box.widthBox / 2, this.positionY - this.box.heightBox / 2, this.box.widthBox, this.box.heightBox);
        }
    };

    this.draw = function () {
        var currentTime = new Date();
        var img = new Image();
        switch (this.type.name) {
            case TYPE.FIRE.name:
                img.src = '../../images/icons/MonsterRed.png';
                break;
            case TYPE.ICE.name:
                img.src = '../../images/icons/MonsterBlue.png';
                break;
            case TYPE.POISON.name:
                img.src = '../../images/icons/MonsterGreen.png';
                break;
            case TYPE.NORMAL.name:
                img.src = '../../images/icons/MonsterGray.png';
                break;
        }
        if ((currentTime.getTime() - lastTimeSprite.getTime()) >= 300) {
            idSpriteMonster += 1;
            switch (this.direction.name) {
                case "Down":
                    this.updateSpriteDown(img);
                    break;
                case "Right":
                    this.updateSpriteRigth(img);
                    break;
                case "Left":
                    this.updateSpriteLeft(img);
                    break;
            }
            lastTimeSprite = new Date();
        } else {
            switch (this.direction.name) {
                case "Down":
                    this.updateSpriteDown(img);
                    break;
                case "Right":
                    this.updateSpriteRigth(img);
                    break;
                case "Left":
                    this.updateSpriteLeft(img);
                    break;
            }
        }
    };

    /*
     this.draw = function () {
     canvas2d.save();
     canvas2d.beginPath();
     canvas2d.fillStyle = "green";
     canvas2d.arc(this.positionX, this.positionY, this.size, 0, 2 * Math.PI);
     canvas2d.fill();
     canvas2d.restore();
     };*/
}

/**
 * Class Missile
 */
function Missile(missileServer) {
    this.id = missileServer.id;
    this.positionX = missileServer.positionX;
    this.positionY = missileServer.positionY;
    this.speed = missileServer.speed;
    this.size = missileServer.size;

    switch (missileServer.type.name) {
        case TYPE.NORMAL.name:
            this.type = TYPE.NORMAL;
            break;
        case TYPE.FIRE.name:
            this.type = TYPE.FIRE;
            break;
        case TYPE.POISON.name:
            this.type = TYPE.POISON;
            break;
        case TYPE.ICE.name:
            this.type = TYPE.ICE;
            break;
        default:
            this.type = TYPE.NORMAL;
            break;
    }

    this.draw = function () {
        canvas2d.save();
        canvas2d.beginPath();
        switch (this.type.name) {
            case TYPE.NORMAL.name:
                canvas2d.fillStyle = TYPE.NORMAL.value;
                canvas2d.arc(this.positionX, this.positionY, this.size, 0, 2 * Math.PI);
                break;
            case TYPE.FIRE.name:
                canvas2d.fillStyle = TYPE.FIRE.value;
                canvas2d.arc(this.positionX, this.positionY, this.size + 1, 0, 2 * Math.PI);
                break;
            case TYPE.ICE.name:
                canvas2d.fillStyle = TYPE.ICE.value;
                canvas2d.arc(this.positionX, this.positionY, this.size + 1, 0, 2 * Math.PI);
                break;
            case TYPE.POISON.name:
                canvas2d.fillStyle = TYPE.POISON.value;
                canvas2d.arc(this.positionX, this.positionY, this.size + 1, 0, 2 * Math.PI);
                break;
        }
        canvas2d.fill();
        canvas2d.restore();
    };
}

/**
 * Class Box.
 */
function Box(boxServer) {
    this.widthBox = boxServer.widthBox;
    this.heightBox = boxServer.heightBox;
    this.nbBox = boxServer.nbBox;
    this.x = boxServer.x;
    this.y = boxServer.y;
    this.positionX = boxServer.positionX;
    this.positionY = boxServer.positionY;

    switch (boxServer.type.value) {
        case 0:
            this.type = GROUNDTYPE.ROAD;
            break;
        case 1:
            this.type = GROUNDTYPE.HOOD;
            break;
        case 2:
            this.type = GROUNDTYPE.TEMPLE;
            break;
        case 3:
            this.type = GROUNDTYPE.SPAWN;
            break;
        case 4:
            this.type = GROUNDTYPE.TOWERZONE;
            break;
        default:
            this.type = GROUNDTYPE.HOOD;
            break;
    }

    this.draw = function () {
        canvas2d.save();
        canvas2d.beginPath();
        canvas2d.strokeStyle = 'white';
        canvas2d.fillStyle = this.type.value;
        canvas2d.strokeRect(this.positionX, this.positionY, this.widthBox, this.heightBox);
        canvas2d.fillRect(this.positionX + 0.02, this.positionY + 0.02, this.widthBox - 0.02, this.heightBox - 0.02);
        canvas2d.fill();
        canvas2d.restore();
    };
}

/**
 * Class Tower.
 */
function Tower(towerServer) {
    this.box = new Box(towerServer.box);
    this.id = towerServer.id;
    this.player = new Player(towerServer.player);

    switch (towerServer.type.name) {
        case "Normal":
            this.type = TYPE.NORMAL;
            break;
        case "Fire":
            this.type = TYPE.FIRE;
            break;
        case "Poison":
            this.type = TYPE.POISON;
            break;
        case "Ice":
            this.type = TYPE.ICE;
            break;
        default:
            this.type = TYPE.NORMAL;
            break;
    }

    this.draw = function () {
        var img = new Image();
        switch (this.type.name) {
            case "Normal":
                if (user.pseudo === this.player.pseudo) {
                    img.src = '../../images/icons/towerGrayPlayer.png';
                } else {
                    img.src = '../../images/icons/towerGray.png';
                }
                canvas2d.drawImage(img, this.box.positionX + this.box.widthBox / 3.5, this.box.positionY, this.box.widthBox / 2, this.box.heightBox);
                break;
            case "Fire":
                if (user.pseudo === this.player.pseudo) {
                    img.src = '../../images/icons/towerRedPlayer.png';
                } else {
                    img.src = '../../images/icons/towerRed.png';
                }
                canvas2d.drawImage(img, this.box.positionX + this.box.widthBox / 3.5, this.box.positionY, this.box.widthBox / 2, this.box.heightBox);
                break;
            case "Ice":
                if (user.pseudo === this.player.pseudo) {
                    img.src = '../../images/icons/towerBluePlayer.png';
                } else {
                    img.src = '../../images/icons/towerBlue.png';
                }
                canvas2d.drawImage(img, this.box.positionX + this.box.widthBox / 3.5, this.box.positionY, this.box.widthBox / 2, this.box.heightBox);
                break;
            case "Poison":
                if (user.pseudo === this.player.pseudo) {
                    img.src = '../../images/icons/towerGreenPlayer.png';
                } else {
                    img.src = '../../images/icons/towerGreen.png';
                }
                canvas2d.drawImage(img, this.box.positionX + this.box.widthBox / 3.5, this.box.positionY, this.box.widthBox / 2, this.box.heightBox);
                break;
        }
    };

    this.drawUgly = function () {
        canvas2d.save();
        canvas2d.beginPath();
        canvas2d.fillStyle = this.type.value;
        canvas2d.moveTo((this.box.positionX + this.box.widthBox / 2), this.box.positionY);
        canvas2d.lineTo((this.box.positionX + this.box.widthBox), (this.box.positionY + this.box.heightBox / 2));
        canvas2d.lineTo((this.box.positionX + this.box.widthBox / 2), (this.box.positionY + this.box.heightBox));
        canvas2d.lineTo(this.box.positionX, (this.box.positionY + this.box.heightBox / 2));
        canvas2d.fill();
        canvas2d.restore();
    };
}
/**
 * Class Map.
 */
function Map(gameServerMap) {
    this.boxes = [];

    for (var i = 0; i < gameServerMap.boxes.length; i++) {
        this.boxes.push(new Box(gameServerMap.boxes[i]));
    }

    this.draw = function () {
        var img = new Image();
        img.src = "../../images/elements/Map.png";
        canvas2d.drawImage(img, 0, 0, 960, 540);
    };
}

/**
 * Class Game.
 */
function Game(gameServer) {
    this.id = gameServer.id;
    this.name = gameServer.name;
    this.round = gameServer.round;
    this.nbPlayer = gameServer.nbPlayer;
    this.playerTable = [];
    this.monsterTable = [];
    this.missilleTable = [];
    this.nbMonster = gameServer.nbMonster;
    this.map = new Map(gameServer.map);
    this.towerTable = [];
    this.life = gameServer.life;

    for (var i = 0; i < gameServer.playerTable.length; i++) {
        this.playerTable.push(new Player(gameServer.playerTable[i]));
    }

    for (var i = 0; i < gameServer.monsterTable.length; i++) {
        this.monsterTable.push(new Monster(gameServer.monsterTable[i]));
    }

    for (var i = 0; i < gameServer.missilleTable.length; i++) {
        this.missilleTable.push(new Missile(gameServer.missilleTable[i]));
    }

    for (var i = 0; i < gameServer.towerTable.length; i++) {
        this.towerTable.push(new Tower(gameServer.towerTable[i]));
    }

    this.refreshTowerTable = function (towerTableServer) {
        this.towerTable = [];
        for (var i = 0; i < towerTableServer.length; i++) {
            this.towerTable.push(new Tower(towerTableServer[i]));
        }
    };

    this.refreshPlayerTable = function (playerTableServer) {
        this.playerTable = [];
        for (var i = 0; i < playerTableServer.length; i++) {
            this.playerTable.push(new Player(playerTableServer[i]));
        }
    };

    this.refreshMonsterTable = function (monsterTableServer) {
        this.monsterTable = [];
        for (var i = 0; i < monsterTableServer.length; i++) {
            this.monsterTable.push(new Monster(monsterTableServer[i]));
        }
    };

    this.addPlayer = function (newPlayerServer) {
        this.playerTable.push(new Player(newPlayerServer));
        this.nbPlayer++;
    };

    this.draw = function () {
        this.map.draw();
        canvas2d.fillText(fps, 25, 25);
        canvas2d.fillText(fpsSocket, 940, 25);
        for (var i = 0; i < this.towerTable.length; i++) {
            this.towerTable[i].draw();
        }
        for (var i = 0; i < this.monsterTable.length; i++) {
            this.monsterTable[i].draw();
        }
        for (var i = 0; i < this.missilleTable.length; i++) {
            this.missilleTable[i].draw();
        }
    };
}

/*********************************************************************
 * *********************************************************************************************************
 * Function *
 * *********************************************************************************************************
 *********************************************************************/

/**
 * Show Informations
 */
function showInformation() {
    showPlayer();
    showGameName();
    showGameRound();
    showGameLife();
    showPlayerInformation();
    refreshMessageNotRead();
}

function refreshMessageNotRead() {
    $("span:last-child", $(".clearfix")).remove();
    if (chatHide) {
        $(".clearfix").append("<span class=\"chat-message-counter\" style=\"display: block;\">" + nbMessageNotRead + "</span>");
    } else {
        $(".clearfix").append("<span class=\"chat-message-counter\" style=\"display: none;\">" + nbMessageNotRead + "</span>");
    }
}

function showGameName() {
    $("span:last-child", $("#game-name")).remove();
    $("#game-name").append("<span>" + towerGame.name + "</span>")
}

function showGameRound() {
    $("span:last-child", $("#game-round")).remove();
    $("#game-round").append("<span> Round " + towerGame.round + "</span>")
}

function showGameLife() {
    $("span:last-child", $("#game-life")).remove();
    $("#game-life").append("<span> Life " + towerGame.life + "</span>")
}

function showPlayerInformation() {
    showPlayerGold();
    showPlayerNbTower();
    showPlayerNbKill();
}

function showPlayerGold() {
    var userTemp = getPlayerByUserPseudo();
    var gold = userTemp.gold;
    $("span:last-child", $("#player-gold")).remove();
    $("#player-gold").append("<span> Gold : " + gold + "</span>")
}

function showPlayerNbTower() {
    var userTemp = getPlayerByUserPseudo();
    var nbTower = userTemp.nbtower;
    $("span:last-child", $("#player-nb-tower")).remove();
    $("#player-nb-tower").append("<span> NbTower : " + nbTower + "</span>")
}

function showPlayerNbKill() {
    var userTemp = getPlayerByUserPseudo();
    var nbKill = userTemp.nbKill;
    $("span:last-child", $("#player-nb-kill")).remove();
    $("#player-nb-kill").append("<span> NbKill : " + nbKill + "</span>")
}

function showPlayer() {
    for (var i = 0; i < 4; i++) {
        $("span:last-child", $("#player-" + i + "-name")).remove();
    }
    for (var i = 0; i < towerGame.nbPlayer; i++) {
        $("#player-" + i + "-name").append("<span>" + towerGame.playerTable[i].pseudo + "</span>")
    }
}

/**
 * function
 */

function UpdateFps() {
    var newTimeTemps = new Date();

    // test for the very first invocation
    if (lastTimeCount === undefined) {
        lastTimeCount = newTimeTemps;
    }

    //calculate the difference between last & current frame
    var diffTime = newTimeTemps.getTime() - lastTimeCount.getTime();

    if (diffTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastTimeCount = newTimeTemps;
    }

    frameCount++;
}

function UpdateFpsSocket() {
    var newTimeTemps = new Date();

    // test for the very first invocation
    if (lastTimeCountSocket === undefined) {
        lastTimeCountSocket = newTimeTemps;
    }

    //calculate the difference between last & current frame
    var diffTime = newTimeTemps.getTime() - lastTimeCountSocket.getTime();

    if (diffTime >= 1000) {
        fpsSocket = frameCountSocket;
        frameCount = 0;
        lastTimeCountSocket = newTimeTemps;
    }

    frameCountSocket++;
}

function isLeader() {
    return towerGame.playerTable[0].pseudo === user.pseudo;
}

function getPlayerByUserPseudo() {
    for (var i = 0; i < towerGame.nbPlayer; i++) {
        if (towerGame.playerTable[i].pseudo === user.pseudo) {
            return towerGame.playerTable[i];
        }
    }
    return null;
}

function getPlayerByPseudo(pseudo) {
    for (var i = 0; i < towerGame.nbPlayer; i++) {
        if (towerGame.playerTable[i].pseudo === pseudo) {
            return towerGame.playerTable[i];
        }
    }
    return null;
}

function relMouseCoords(event) {
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = canvas;

    do {
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while (currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    if (event.offsetX !== undefined && event.offsetY !== undefined) {
        return {x: event.offsetX, y: event.offsetY};
    } else {
        return {x: canvasX, y: canvasY}
    }
}
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

/*********************************************************************
 * *********************************************************************************************************
 * Script *
 * *********************************************************************************************************
 *********************************************************************/

window.onload = function () {
    sound = new Howl({
        urls: ['sound/gameWait.mp3'],
        volume: 0.5,
        loop: true
    });
    sound.play();
    if (mute) {
        sound.mute();
    }

    currentChoice = CHOICE.TOWER;
    socket.emit('getGame', user.pseudo);
    canvas = document.getElementById("game");

    //Event
    canvas.addEventListener('mousedown', function (event) {
        var coords = relMouseCoords(event);
        switch (currentChoice.value) {
            case CHOICE.TOWER.value :
                socket.emit('addTower', coords.x, coords.y);
                break;
            case CHOICE.RECYCLE.value :
                socket.emit('recycleTower', coords.x, coords.y);
                break;
            default :
                socket.emit('updateTower', coords.x, coords.y, currentChoice.name);
                break;
        }
    }, false);
    canvas2d = canvas.getContext('2d');

    canvasHeight = canvas.height;
    canvasWidth = canvas.width;
};


function main() {
    UpdateFps();
    canvas2d.clearRect(0, 0, canvasWidth, canvasHeight);
    towerGame.draw();
    requestAnimationFrame(main);
}

/*********************************************************************
 * *********************************************************************************************************
 * Socket Io *
 * *********************************************************************************************************
 *********************************************************************/

/**
 * The server give us the game.
 */
socket.on('game', function (_gameServer) {
    towerGame = new Game(_gameServer);
    showInformation();
    if (isLeader()) {
        $(".start-game").show();
    }
    requestAnimationFrame(main);
});

/**
 * The server say the game is finish
 */
socket.on('gameFinish', function () {
    $(".leave-game").show();

    // Little sound
    littleSound = new Howl({
        urls: ['sound/lose2.mp3']
    });
    littleSound.play();
    timeSoundDate = new Date();

    //Music
    sound.stop();
    sound = new Howl({
        urls: ['sound/lose.mp3'],
        volume: 0.5,
        loop: true
    });
    sound.play();
    if (mute) {
        sound.mute();
    }
});

/**
 * The server say you lose one life.
 */
socket.on('loseLife', function () {
    var tempTimeSound = new Date();
    if ((tempTimeSound.getTime() - timeSoundDate.getTime()) > 3000) {
        // Little sound
        littleSound = new Howl({
            urls: ['sound/loseLife.mp3']
        });
        littleSound.play();
        timeSoundDate = new Date();
    }
});

/**
 * The server say to reload the Game and do the action for the master game
 */
socket.on('reloadMasterGame', function (_gameServer) {
    towerGame = new Game(_gameServer);
    showInformation();
    if (isLeader()) {
        $(".start-game").show();
    }
});

/**
 * The server say we are a bug with the game
 */
socket.on('errorGame', function () {
    $(location).attr('href', '/');
});

/**
 * The server say the add of the tower is good
 */
socket.on('addTowerOk', function (towerTableServer, playerTableServer) {
    towerGame.refreshTowerTable(towerTableServer);
    towerGame.refreshPlayerTable(playerTableServer);
    showPlayerInformation();
});

/**
 * The server say the add tower is not good.
 */
socket.on('addTowerError', function (message) {
    var tempTimeSound = new Date();
    if ((tempTimeSound.getTime() - timeSoundDate.getTime()) > 3000) {
        // Little sound
        littleSound = new Howl({
            urls: ['sound/CannotHere.mp3']
        });
        littleSound.play();
        timeSoundDate = new Date();
    }

    $("#alertDynamic").append("<div role=\"alert\" class=\"alert alert-danger alert-dismissible\">" +
        "<button type=\"button\" data-dismiss=\"alert\" aria-label=\"Close\" class=\"close\">" +
        "<span aria-hidden=\"true\">×</span>" +
        "</button>" +
        "<strong>Danger! - " + message + "</strong></div>");
});

/**
 * The server say the add tower is not good.
 */
socket.on('goldError', function (message) {
    var tempTimeSound = new Date();
    if ((tempTimeSound.getTime() - timeSoundDate.getTime()) > 3000) {
        // Little sound
        littleSound = new Howl({
            urls: ['sound/needGold.mp3']
        });
        littleSound.play();
        timeSoundDate = new Date();
    }

    $("#alertDynamic").append("<div role=\"alert\" class=\"alert alert-danger alert-dismissible\">" +
        "<button type=\"button\" data-dismiss=\"alert\" aria-label=\"Close\" class=\"close\">" +
        "<span aria-hidden=\"true\">×</span>" +
        "</button>" +
        "<strong>Danger! - " + message + "</strong></div>");
});


/**
 * The server say the recycle tower is good.
 */
socket.on('recycleTowerOk', function (towerTableServer, playerTableServer) {
    towerGame.refreshTowerTable(towerTableServer);
    towerGame.refreshPlayerTable(playerTableServer);
    showPlayerInformation();
});

/**
 * The server say the recycle tower is not good.
 */
socket.on('recycleTowerError', function (message) {
    $("#alertDynamic").append("<div role=\"alert\" class=\"alert alert-danger alert-dismissible\">" +
        "<button type=\"button\" data-dismiss=\"alert\" aria-label=\"Close\" class=\"close\">" +
        "<span aria-hidden=\"true\">×</span>" +
        "</button>" +
        "<strong>Danger! - " + message + "</strong></div>");
});

/**
 * The server say the update tower is good.
 */
socket.on('updateTowerOk', function (towerTableServer, playerTableServer) {
    towerGame.refreshTowerTable(towerTableServer);
    towerGame.refreshPlayerTable(playerTableServer);
    showPlayerInformation();
});

/**
 * The server say the update tower is not good.
 */
socket.on('updateTowerError', function (message) {
    $("#alertDynamic").append("<div role=\"alert\" class=\"alert alert-danger alert-dismissible\">" +
        "<button type=\"button\" data-dismiss=\"alert\" aria-label=\"Close\" class=\"close\">" +
        "<span aria-hidden=\"true\">×</span>" +
        "</button>" +
        "<strong>Danger! - " + message + "</strong></div>");
});

/**
 * The server say the game has update
 */
socket.on('updateGameOk', function (gameServer) {
    towerGame = new Game(gameServer);
    towerGame.draw();
    UpdateFpsSocket();
    showInformation();
});

socket.on('updateChat', function (username, message) {
    if (chatHide) {
        nbMessageNotRead++;
        refreshMessageNotRead();
    }
    var currentTime = new Date();
    $(".chat-history").append("<div class=\"chat-message clearfix\"> " +
        "<div class=\"chat-message-content clearfix\"> " +
        "<span class=\"chat-time\"> " + currentTime.getHours() + " : " + currentTime.getMinutes() + "</span>" +
        " <h5>" + username + "</h5> " +
        "<p>" + message + "</p>" +
        "</div> </div><hr>");
});

/*********************************************************************
 * *********************************************************************************************************
 * Event *
 * *********************************************************************************************************
 *********************************************************************/


/**
 * Event when the user click on start game.
 */
$(".start-game").click(function () {
    socket.emit('start');
    $(".start-game").hide();

    var tempTimeSound = new Date();
    if ((tempTimeSound.getTime() - timeSoundDate.getTime()) > 3000) {
        // Little sound
        littleSound = new Howl({
            urls: ['sound/StartGameMenace.mp3']
        });
        littleSound.play();
        timeSoundDate = new Date();
    }


    sound.stop();
    sound = new Howl({
        urls: ['sound/gameLoop.mp3'],
        volume: 0.5,
        loop: true
    });
    sound.play();
    if (mute) {
        sound.mute();
    }
});

/**
 * Event when the user click on start game.
 */
$(".leave-game").click(function () {
    socket.emit('leave');
    $(location).attr('href', '/');
});


/**
 * Event when the user click on img.
 */
$(".tower-icon").click(function () {
    $(".active").removeClass("active");
    $(this).addClass("active");
});

/**
 * Event when the user click on choice tower
 */
$("#choice-tower").click(function () {
    currentChoice = CHOICE.TOWER;
});

/**
 * Event when the user click on choice tower
 */
$("#choice-recycle").click(function () {
    currentChoice = CHOICE.RECYCLE;
});

/**
 * Event when the user click on choice tower
 */
$("#choice-fire").click(function () {
    currentChoice = CHOICE.FIRE;
});

/**
 * Event when the user click on choice tower
 */
$("#choice-ice").click(function () {
    currentChoice = CHOICE.ICE;
});

/**
 * Event when the user click on choice tower
 */
$("#choice-poison").click(function () {
    currentChoice = CHOICE.POISON;
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
$('#live-chat header').on('click', function () {
    $('.chat').slideToggle(300, 'swing');
    $('.chat-message-counter').fadeToggle(300, 'swing');
    chatHide = !chatHide;
    if (!chatHide) {
        nbMessageNotRead = 0;
        refreshMessageNotRead();
    }
});


/**
 * Event when the user click on chat
 */
$("#chat").click(function () {
    $('.chat').slideToggle(300, 'swing');
    $('.chat-message-counter').fadeToggle(300, 'swing');
    chatHide = !chatHide;
    if (!chatHide) {
        nbMessageNotRead = 0;
        refreshMessageNotRead();
    }
});

/**
 * Event when the user press enter in chat
 */
$('#live-chat').keypress(function (e) {
    if (e.which == 13) {
        var message = $('#message-send-wait').val();
        $('#message-send-wait').val('');
        socket.emit('sendMessage', message);
    }
});