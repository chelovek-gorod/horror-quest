///////////////////////////////////////////
//                                       //
//               MENU                    //
//                                       //
///////////////////////////////////////////

var audio = new Audio(); 
audio.src = './src/music/bg-main.mp3'; 

var bgMusic = true; // фоновая музыка вкл 
var aSounds = true; // звуковые эффекты вкл
var openRooms = 0;  // пройдено комнат
var lastRoom = 0;  // проследняя комната
var playToday = false; // игра сегодня запущена впервые

// получаем текущую дату
var todayDate = new Date();
var ddDate = String(todayDate.getDate()).padStart(2, '0'); // string 'xx'

var logoTimeDelay = 4000;
var darkTimeDelay = 2000;

var pageBodyId = document.getElementById("pageBodyId");
var mainDivId = document.getElementById("mainDiv");
var darkDivId = document.getElementById('darkDiv');

var newDivId;

// страница отрисована
function pageReady() {
    // демонстрация стартовой кнопки
    mainDivId.innerHTML = '<div id="newDivStartId" style="position: fixed; top: 0; left: 0; width:100%; height:100%; background-image: url(./src/img/menu/menu-to-start.png);'
                        + 'background-position: center center; background-repeat: no-repeat;" onclick="startClick();"></div>';
    newDivId = document.getElementById("newDivStartId");
   
   // проверяем сохранения
    if("storagelastDate" in localStorage && localStorage.storagelastDate == ddDate) 
    {playToday = true;} else {playToday = false;} 
    
    if("storageBgMusic" in localStorage && localStorage.storageBgMusic == "false") {bgMusic = false;} else {bgMusic = true;}
    if("storageASounds" in localStorage && localStorage.storageASounds == "false") {aSounds = false;} else {aSounds = true;}
    
    if("storageOpenRooms" in localStorage && localStorage.storageOpenRooms !== '0') {
        openRooms = +localStorage.storageOpenRooms;
    } else {
        openRooms = 0;   
    }
    if("storageLastRoom" in localStorage && localStorage.storageLastRoom !== '0') {
        lastRoom = +localStorage.storageLastRoom;
    } else {
        lastRoom = 0;   
    } 
}

//отслеживаем клик по экрану
function startClick() {
    if (bgMusic === true) { 
        audio.play();
    }
    
    if (playToday) {
        darknesIn (mainMenuInner);
    } else {
        darknesIn (logoAngelInner);
    }
}

//отслеживаем окончания фоновой музыки
audio.addEventListener('ended',replayMusic);
function replayMusic() {
    if (bgMusic === true) {
        audio.play();
    }
}

// логотип 1   
function logoAngelInner () {
    darknesIn (preAngelLogoDelay);
    newDivId.remove();
    mainDivId.innerHTML = '<div id="newDivLogoId" style="position: fixed; top: 0; left: 0; width:100%; height:100%;'
                        + 'background-image: url(./src/img/menu/logo-angel-play.png); background-position: center center; background-repeat: no-repeat;"></div>';
    newDivId = document.getElementById("newDivLogoId");
}

function preAngelLogoDelay () {
    setTimeout(angelLogoReady, darkTimeDelay);
}

function angelLogoReady () {
    darknesOut (angelLogoWait);
}

function angelLogoWait () {
    setTimeout(angelLogoOut, logoTimeDelay);
}

function angelLogoOut () {
    darknesIn (logoMarsInner);
}

// логотип 2
function logoMarsInner () {
    darknesIn (preMarsLogoDelay);
    newDivId.style.backgroundImage = "url('./src/img/menu/logo-mars-game.png')";
}

function preMarsLogoDelay () {
    setTimeout(marsLogoReady, darkTimeDelay);
}

function marsLogoReady () {
    darknesOut (marsLogoWait);
}

function marsLogoWait () {
    setTimeout(marsLogoOut, logoTimeDelay);
}

function marsLogoOut () {
    darknesIn (presentationInner);
}

// представляют
function presentationInner () {
    darknesIn (prePresentationDelay);
    newDivId.style.backgroundImage = "url('./src/img/menu/menu-presentation.png')";
}

function prePresentationDelay () {
    setTimeout(presentationReady, 1000);
}

function presentationReady () {
    darknesOut (presentationWait);
}

function presentationWait () {
    setTimeout(presentationOut, logoTimeDelay);
}

function presentationOut () {
    darknesIn (mainMenuInner);
}

// главное меню
function mainMenuInner () {
    var isContinue, musicOnOff, soundOnOff;
    if (lastRoom === 0) {isContinue='no';} else {isContinue='to';}
    if (bgMusic) {musicOnOff='on';} else{musicOnOff='off';}
    if (aSounds) {soundOnOff='on';} else{soundOnOff='off';}
    
    localStorage.storagelastDate = ddDate;
    
    newDivId.remove();
    pageBodyId.style.backgroundImage = "url('./src/img/bg-menu.jpg')";
    mainDivId.innerHTML = '<div style="position: relative; top: 0; width: 320px; height: 480px; margin: -240px auto; text-align: center;/* z-index: 1;*/">'
                            + '<img src="./src/img/menu/menu-game-title.png">'
                            + '<img id="newGameBtnId" src="./src/img/menu/menu-to-new.png" style="cursor: pointer;">'
                            + '<img id="continueBtnId" src="./src/img/menu/menu-'+ isContinue +'-continue.png" style="cursor: pointer;">'
                            + '<img id="musicBtnId" src="./src/img/menu/menu-music-'+ musicOnOff +'.png" style="cursor: pointer;">'
                            + '<img id="soundBtnId" src="./src/img/menu/menu-sound-'+ soundOnOff +'.png" style="cursor: pointer;">'
                        + '</div>';
    
    setTimeout(preMainMenuDelay, darkTimeDelay);
    
    var newGameBtnId = document.getElementById("newGameBtnId");
    var continueBtnId = document.getElementById("continueBtnId");
    var musicBtnId = document.getElementById("musicBtnId");
    var soundBtnId = document.getElementById("soundBtnId");
    
    newGameBtnId.onmouseenter = function() {newGameBtnId.src="./src/img/menu/menu-to-new-hover.png";}
    newGameBtnId.onmouseleave = function() {newGameBtnId.src="./src/img/menu/menu-to-new.png";}
    newGameBtnId.onclick = function() {darknesIn (goToHall);}
    
    continueBtnId.onmouseenter = function() {if (lastRoom != 0) {continueBtnId.src="./src/img/menu/menu-to-continue-hover.png";}}
    continueBtnId.onmouseleave = function() {if (lastRoom!= 0) {continueBtnId.src="./src/img/menu/menu-to-continue.png";}}
    continueBtnId.onclick = function() {if (lastRoom!= 0) {darknesIn (goToRoom);}}
    
    musicBtnId.onmouseenter = function() {if (bgMusic) {musicBtnId.src="./src/img/menu/menu-music-on-hover.png";} else {musicBtnId.src="./src/img/menu/menu-music-off-hover.png";}}
    musicBtnId.onmouseleave = function() {if (bgMusic) {musicBtnId.src="./src/img/menu/menu-music-on.png";} else {musicBtnId.src="./src/img/menu/menu-music-off.png";}}
    musicBtnId.onclick = function() {
        if (bgMusic) {
            bgMusic=false;
            localStorage.storageBgMusic = false;
            musicBtnId.src="./src/img/menu/menu-music-off-hover.png";
            audio.pause();
        } else {
            bgMusic=true;
            localStorage.storageBgMusic = true;
            musicBtnId.src="./src/img/menu/menu-music-on-hover.png";
            audio.play();
        }
    } 
    
    soundBtnId.onmouseenter = function() {if (bgMusic) {soundBtnId.src="./src/img/menu/menu-sound-on-hover.png";} else {soundBtnId.src="./src/img/menu/menu-sound-off-hover.png";}}
    soundBtnId.onmouseleave = function() {if (bgMusic) {soundBtnId.src="./src/img/menu/menu-sound-on.png";} else {soundBtnId.src="./src/img/menu/menu-sound-off.png";}}
    soundBtnId.onclick = function() {
        if (aSounds) {
            aSounds=false;
            localStorage.storageASounds = false;
            soundBtnId.src="./src/img/menu/menu-sound-off-hover.png";
        } else {
            aSounds=true;
            localStorage.storageASounds = true;
            soundBtnId.src="./src/img/menu/menu-sound-on-hover.png";
        }
    }
}

function preMainMenuDelay () {
    setTimeout(mainMenuReady, darkTimeDelay);
}

function mainMenuReady () {
    darknesOut (mainMenuWait);
}

function mainMenuWait () {
    /* emty */
}

function goToHall () {
    document.location.href = "./rooms/hall.html"; 
}

function goToRoom () {
    document.location.href = "./rooms/room-"+lastRoom+".html";
}

///////////////////////////////////////////////////
// ЗАТЕМНЕНИЕ и ЗАСВЕТЛЕНИЕ

var darkOpacity = 0;
var darkOpacityStap = 0.01;
var darkTimeStap = 30;

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