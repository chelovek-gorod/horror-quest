///////////////////////////////////////////
//                                       //
//               HALL                    //
//                                       //
///////////////////////////////////////////

var audio = new Audio();
audio.src = '../src/music/bg-hall.mp3';

var bgMusic = true; // фоновая музыка вкл
var aSounds = true; // звуковые эффекты вкл
var openRooms = 0;  // пройдено комнат
var lastRoom = 0;  // проследняя комната
var goToRoomNumber;// № комноты в которую идет игрок

var darkTimeDelay = 500;

// получаем текущую дату
var todayDate = new Date();
var ddDate = String(todayDate.getDate()).padStart(2, '0'); // string 'xx'

var pageBodyId = document.getElementById("pageBodyId");
var mainDivId = document.getElementById("mainDiv");
var darkDivId = document.getElementById('darkDiv');

var doors = 12;

//стены 
var walls=[]; //[открыта][пройдена]

// для поворотов
var wallReserv;

var newDivId;

// страница отрисована
function pageReady() {
    
    if("storagelastDate" in localStorage && localStorage.storagelastDate != ddDate) 
    {document.location.href = "../index.html";}
    
    // демонстрация стартовой кнопки
    mainDivId.innerHTML = '<div id="newDivStartId" style="position: fixed; top: 0; left: 0; width:100%; height:100%; background-image: url(../src/img/menu/menu-to-start.png);'
                        + 'background-position: center center; background-repeat: no-repeat;" onclick="startClick();"></div>';
    newDivId = document.getElementById("newDivStartId");
    
    // проверяем сохранения
    
    if("storageBgMusic" in localStorage && localStorage.storageBgMusic == "false") {bgMusic = false;} else {bgMusic = true;}
    if("storageASounds" in localStorage && localStorage.storageASounds == "false") {aSounds = false;} else {aSounds = true;}
    
    if("storageOpenRooms" in localStorage) {
        if (localStorage.storageOpenRooms != '0') openRooms = +localStorage.storageOpenRooms;
    } else {
        openRooms = 0;   
    }
    if("storageLastRoom" in localStorage) {
        if (localStorage.storageLastRoom != '0') lastRoom = +localStorage.storageLastRoom;
    } else {
        lastRoom = 0;   
    }
    
    //создание дверей
    for (var nn=0; nn<doors; nn++) {
        var n1, n2, wallDiv;
        if (nn <= openRooms) {n1 = true;} else {n1 = false;}
        if (nn < openRooms) {n2 = true;} else {n2 = false;}
        wallDiv = innerDoor (nn, n1, n2);
        walls.push(wallDiv);
    }
    
    // генератор блока с дверью
    function innerDoor (nn) {
        var tImg, dImg, onCl;
        var tNum = nn+1;
        if(n2) {tImg = 'background-image: url(../src/img/hall/dt-'+tNum+'-clean.png);';}
            else {tImg = 'background-image: url(../src/img/hall/dt-'+tNum+'.png);';}
        if(n2&&n1) {dImg = 'background-image: url(../src/img/hall/door-open-clean.png);';}
            else if (n1) {dImg = 'background-image: url(../src/img/hall/door-open.png);';}
            else {dImg = 'background-image: url(../src/img/hall/door-locked.png);';}
        if (n1) {onCl = 'openDoor('+tNum+')';} else {onCl = 'lockedDoor()';}
    
        var div = '<div style="position: absolute; width: 320px; height: 60px; top: 0px; left: 0px;'
                + tImg +' background-position: center center; background-repeat: no-repeat;"></div>'
                + '<div id="idDoor'+tNum+'" style=" position: absolute; width: 320px; height: 420px; top: 60px; left: 0px;'
                + dImg +' background-position: center center; background-repeat: no-repeat; cursor: pointer;"'
                + 'onclick="'+onCl+';"></div>';
        return(div);
    }
}

//отслеживаем клик по экрану
function startClick() {
    if (bgMusic === true) {
        audio.play();
    }
    darknesIn (prepareWalls);
    newDivId.remove();
    
    localStorage.storagelastDate = ddDate;
}

//отслеживаем окончания фоновой музыки
audio.addEventListener('ended',replayMusic);
function replayMusic() {
    if (bgMusic === true) {
        audio.play();
    }
}

function prepareWalls () {
    pageBodyId.style.backgroundImage = "url('../src/img/bg-hall.jpg')";
    wallsInner();
}

// создание интерьера
function wallsInner() {
    
    var mainDivId = document.getElementById("mainDiv");
    mainDivId.innerHTML = '<div id="left2Div" class="wall-container">' +walls[walls.length-2]+ '</div>'
                        + '<div id="left1Div" class="wall-container">' +walls[walls.length-1]+ '</div>'
                        + '<div id="centerDiv" class="wall-container">' +walls[0]+ '</div>'
                        + '<div id="right1Div" class="wall-container">' +walls[1]+ '</div>'
                        + '<div id="right2Div" class="wall-container">' +walls[2]+ '</div>'
                        + '<div id="toLeft" class="button" onclick="turnToLeft();"></div>'
                        + '<div id="toRight" class="button" onclick="turnToRight();"></div>'
                        + '<div id="toMenu" class="button" onclick="toMenu();"></div>'
                        /*+ '<div id="toBag" class="button" onclick="toBag();"></div>'*/;
    darknesOut (darkEnd);
}

//повороты
function turnToLeft () {
    wallReserv = walls.pop();
    walls.unshift(wallReserv);
    turnTo ();
}
function turnToRight () {
    wallReserv = walls.shift();
    walls.push(wallReserv);
    turnTo ();
}
function turnTo () {
    if (aSounds) {playSound('step');}
    darknesIn (walkTo);
}
function walkTo () {
    setTimeout(wallsInner, darkTimeDelay);
}
function darkEnd () {
    /* emty */
}

//закрытая дверь
function lockedDoor() {if (aSounds) {playSound('door-locked');}}

//открытая дверь
function openDoor (nam) {
    if (aSounds) {playSound('door-open');}
    goToRoomNumber = nam;
    darknesIn(goToRoom);
}
function goToRoom () {
    setTimeout(goGoGo, darkTimeDelay*3);
}
function goGoGo () {
    document.location.href = "./room-"+goToRoomNumber+".html";
}

//Проигрыватель звуковых эффектов
function playSound(sound) {
    if (aSounds === true) {
        var se = new Audio();
        se.src = '../src/music/se-'+ sound +'.mp3';
        se.play();
    }
}

///////////////////////////////////////////////////
// В МЕНЮ

function toMenu () {
    darknesIn (subMenuInner);
}


// меню
function subMenuInner () {
    var musicOnOff, soundOnOff;
    if (bgMusic) {musicOnOff='on';} else{musicOnOff='off';}
    if (aSounds) {soundOnOff='on';} else{soundOnOff='off';}
    newDivId.remove();
    pageBodyId.style.backgroundImage = "url('../src/img/bg-subm.jpg')";
    mainDivId.innerHTML = '<div style="position: relative; top: 0; width: 320px; height: 480px; margin: -240px auto; text-align: center;/* z-index: 1;*/">'
                            + '<img src="../src/img/menu/menu-game-title.png">'
                            + '<img id="returnGameBtnId" src="../src/img/menu/menu-to-return.png" style="cursor: pointer;">'
                            + '<img id="toMainMenuBtnId" src="../src/img/menu/menu-to-menu.png" style="cursor: pointer;">'
                            + '<img id="musicBtnId" src="../src/img/menu/menu-music-'+ musicOnOff +'.png" style="cursor: pointer;">'
                            + '<img id="soundBtnId" src="../src/img/menu/menu-sound-'+ soundOnOff +'.png" style="cursor: pointer;">'
                        + '</div>';
    
    setTimeout(preSubMenuDelay, darkTimeDelay);
    
    var returnGameBtnId = document.getElementById("returnGameBtnId");
    var toMainMenuBtnId = document.getElementById("toMainMenuBtnId");
    var musicBtnId = document.getElementById("musicBtnId");
    var soundBtnId = document.getElementById("soundBtnId");
    
    returnGameBtnId.onmouseenter = function() {returnGameBtnId.src="../src/img/menu/menu-to-return-hover.png";}
    returnGameBtnId.onmouseleave = function() {returnGameBtnId.src="../src/img/menu/menu-to-return.png";}
    returnGameBtnId.onclick = function() {darknesIn (goToGame);}
    
    toMainMenuBtnId.onmouseenter = function() {toMainMenuBtnId.src="../src/img/menu/menu-to-menu-hover.png";}
    toMainMenuBtnId.onmouseleave = function() {toMainMenuBtnId.src="../src/img/menu/menu-to-menu.png";}
    toMainMenuBtnId.onclick = function() {darknesIn (goToMenu);}
    
    musicBtnId.onmouseenter = function() {if (bgMusic) {musicBtnId.src="../src/img/menu/menu-music-on-hover.png";} else {musicBtnId.src="../src/img/menu/menu-music-off-hover.png";}}
    musicBtnId.onmouseleave = function() {if (bgMusic) {musicBtnId.src="../src/img/menu/menu-music-on.png";} else {musicBtnId.src="../src/img/menu/menu-music-off.png";}}
    musicBtnId.onclick = function() {
        if (bgMusic) {
            bgMusic=false;
            localStorage.storageBgMusic = false;
            musicBtnId.src="../src/img/menu/menu-music-off-hover.png";
            audio.pause();
        } else {
            bgMusic=true;
            localStorage.storageBgMusic = true;
            musicBtnId.src="../src/img/menu/menu-music-on-hover.png";
            audio.play();
        }
    }
    
    soundBtnId.onmouseenter = function() {if (bgMusic) {soundBtnId.src="../src/img/menu/menu-sound-on-hover.png";} else {soundBtnId.src="../src/img/menu/menu-sound-off-hover.png";}}
    soundBtnId.onmouseleave = function() {if (bgMusic) {soundBtnId.src="../src/img/menu/menu-sound-on.png";} else {soundBtnId.src="../src/img/menu/menu-sound-off.png";}}
    soundBtnId.onclick = function() {
        if (aSounds) {
            aSounds=false;
            localStorage.storageASounds = false;
            soundBtnId.src="../src/img/menu/menu-sound-off-hover.png";
        } else {
            aSounds=true;
            localStorage.storageASounds = true;
            soundBtnId.src="../src/img/menu/menu-sound-on-hover.png";
        }
    }
}

function preSubMenuDelay () {
    setTimeout(subMenuReady, darkTimeDelay);
}

function subMenuReady () {
    darknesOut (subMenuWait);
}

function subMenuWait () {
    /* emty */
}

function goToGame () {
    setTimeout(prepareWalls, darkTimeDelay); 
}

function goToMenu () {
    document.location.href = "../index.html";
}


///////////////////////////////////////////////////
// ЗАТЕМНЕНИЕ и ЗАСВЕТЛЕНИЕ

var darkOpacity = 0;
var darkOpacityStap = 0.01;
var darkTimeStap = 10;

//затемнение
function darknesIn (nextFunc) {
    darkDivId.style.zIndex = "10";
    setTimeout(darkOpacityToUp, darkTimeStap);
    
    function darkOpacityToUp () {
        darkOpacity += darkOpacityStap;
        if (darkOpacity >1) {
            darkOpacity = 1;
            darkDivId.style.opacity = "1";
            setTimeout(nextFunc, darkTimeStap);
        } else {
            darkOpacity = darkOpacity +'';
            darkDivId.style.opacity = darkOpacity;
            darkOpacity = +darkOpacity;
            setTimeout(darkOpacityToUp, darkTimeStap);
        }
    }
}

//осветление
function darknesOut (nextFunc) {
    setTimeout(darkOpacityToDown, darkTimeStap);
    
    function darkOpacityToDown () {
        darkOpacity -= darkOpacityStap;
        if (darkOpacity < 0) {
            darkOpacity = 0;
            darkDivId.style.zIndex = "0";
            darkDivId.style.opacity = "0"
            setTimeout(nextFunc, darkTimeStap);
        } else {
            darkOpacity = darkOpacity +'';
            darkDivId.style.opacity = darkOpacity;
            darkOpacity = +darkOpacity;
            setTimeout(darkOpacityToDown, darkTimeStap);
        }
    }
}