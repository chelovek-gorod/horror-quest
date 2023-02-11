///////////////////////////////////////////
//                                       //
//               room 1                  //
//                                       //
///////////////////////////////////////////

var audio = new Audio();
audio.src = '../src/music/bg-room-1.mp3';
var roomBg = 'room-1'; // img/bg-[name].jpg

var bgMusic = true; // фоновая музыка вкл
var aSounds = true; // звуковые эффекты вкл
var openRooms = 0;  // пройдено комнат
var lastRoom = 0;  // проследняя комната

var roomNumber = 1;
var roomClean = false;

// парсим массив содержимого сумки из памяти
var inBag =[]; // [name][img]

var emptyBagItem = {name:'Ничего не собрано',img:'bag/bag-item-empty'};
/*
var name1BagItem
var name2BagItem
*/    
    inBag.push(emptyBagItem);
var selectedItem = false; // else selectedItem = inBag[n][name]  

var darkTimeDelay = 500;

// получаем текущую дату
var todayDate = new Date();
var ddDate = String(todayDate.getDate()).padStart(2, '0'); // string 'xx'

var pageBodyId = document.getElementById("pageBodyId");
var mainDivId = document.getElementById("mainDiv");
var darkDivId = document.getElementById('darkDiv');

// стены 
var walls=[]; //[открыта][пройдена]

// для поворотов
var wallReserv;

//цвета двери и таблички
var doorTabImg = 'hall/dt-exit.png';
var doorExtImg = 'hall/door-open.png';

// предметы maxW = 320px; maxH = 480px.
var items = [[
    {id: 'windowId', width: '240', height: '400', top: '0', left: '40', img: 'room-1/window-moon.png'},
    {id: 'skeletonId', width: '320', height: '160', top: '320', left: '0', img: 'room-1/skeleton.png'}
],[
    {id: 'cupboardId', width: '320', height: '480', top: '0', left: '0', img: 'room-1/cupboard.png'}
],[
    {id: 'safeId', width: '320', height: '280', top: '200', left: '0', img: 'room-1/safe.png'}
],[
    {id: 'itemId_07', width: '320', height: '400', top: '0', left: '40', img: 'window-goust.gif'},
  /*{id: 'itemId_08', width: '320', height: '400', top: '0', left: '40', img: 'window-goust.gif'}*/
],[
/**/{id: 'doorTab', width: '320', height: '60', top: '0', left: '0', img: doorTabImg},
/**/{id: 'doorExt', width: '320', height: '420', top: '60', left: '0', img: doorExtImg}
],[
    {id: 'itemId_09', width: '320', height: '400', top: '0', left: '40', img: 'window-moon.gif'},
  /*{id: 'itemId_10', width: '320', height: '400', top: '0', left: '40', img: 'window-moon.gif'}*/
],[
    {id: 'itemId_11', width: '320', height: '400', top: '0', left: '40', img: 'window-storm.gif'}
]];

// для стартового блока и всплывающего окна
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
    if("storageInBag" in localStorage) {inBag = JSON.parse(localStorage.storageInBag);}
    // localStorage.storageInBag = JSON.stringify(inBag); /*запись в память массив в виде строки*/
    
    //проверка пройденности для присвоения img двери и табличке
    if (openRooms > roomNumber) {
        doorTabImg = 'hall/dt-exit-clean.png';
        doorExtImg = 'hall/door-open-clean.png';
    }
    
    //создание стен
    for (var nn=0; nn<items.length; nn++) {
        var wallDiv = '';
        for (var ni=0; ni<items[nn].length; ni++) {
            wallDiv += innerItem (nn, ni);
        }
        walls.push(wallDiv);
    }
    
    // генератор предметов
    function innerItem (nn,ni) {
        var div = '<div id="'+items[nn][ni].id+'"'
                + 'style=" position: absolute; width: '+items[nn][ni].width+'px; height: '+items[nn][ni].height+'px;'
                + 'top: '+ items[nn][ni].top +'px; left: '+ items[nn][ni].left +'px;'
                + 'background-image: url(../src/img/'+items[nn][ni].img+'); background-position: center center; background-repeat: no-repeat;" '
                + 'onclick="clickOnItem('+items[nn][ni].id+');"></div>';
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
    pageBodyId.style.backgroundImage = "url('../src/img/bg-"+roomBg+".jpg')";
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
                        + '<div id="toBag" class="button" onclick="toBag();"></div>';
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
//function lockedDoor() {if (aSounds) {playSound('door-locked');}}

//Проигрыватель звуковых эффектов
function playSound(sound) {
    if (aSounds === true) {
        var se = new Audio();
        se.src = '../src/music/se-'+ sound +'.mp3';
        se.play();
    }
}

///////////////////////////////////////////////////
// КЛИКИ ПО ПРЕДМЕТАМ
function clickOnItem(item) {
    
    switch (item) {
        // дверь
        case doorExt : if (aSounds) {playSound('door-open');}
                            darknesIn(goToHall);
            break;
    }
}

///////////////////////////////////////////////////
// В РЮКЗАК

function toBag () {
    darknesIn (bagInner);
}


// рюкзак
function bagInner () {   
    var inBagItemNumbers = inBag.length -1;
    var centerBagItem = inBag[inBagItemNumbers];
    var wordItemIs, itemImg, itemName;
    if (inBagItemNumbers == 0 || inBagItemNumbers > 4 ) {wordItemIs = 'предметов';}
    else if (inBagItemNumbers == 1) {wordItemIs = 'предмет';}
    else {wordItemIs = 'предмета';}
    
    newDivId.remove();
    pageBodyId.style.backgroundImage = "url('../src/img/bg-bag.jpg')";
    mainDivId.innerHTML = '<div style="position: relative; top: 0; width: 320px; height: 480px; margin: -240px auto;">'
                            + '<div style="position: absolute; top: 0; left: 0; width: 320px; height: 170px; text-align: center; font-size:30px;">'
                            + 'В рюкзаке сейчас<br><span id="inBagSpanId" style="font-size: 40px;">'+inBagItemNumbers+'</span><br>'+wordItemIs+'</div>'
                            + '<div style="position: absolute; top: 170; left: 0; width: 320px; height: 160px; text-align: justify; verticoa-align: middle;">'
                                + '<img src="../src/img/menu/bag-to-left.png" style="cursor: pointer;" onClick="bagLeftClick();">'
                                + '<img src="../src/img/'+centerBagItem.img+'.png" style="cursor: pointer; margin: 0 70px;" onClick="centerItemClick();">'
                                + '<img src="../src/img/menu/bag-to-right.png" style="cursor: pointer;" onClick="bagRightClick();">'
                            + '</div>'
                            + '<div style="position: absolute; top: 330; left: 0; width: 320px; height: 90px; text-align: center; font-size:30px;">"'+centerBagItem.name+'"</div>'
                            + '<div style="position: absolute; top: 420; left: 0; width: 320px; height: 60px; text-align: center;">"'
                            + '<img src="../src/img/menu/to-room.png" style="cursor: pointer;" onClick="darknesIn (goToGame);">'
                            + '</div>'
                        + '</div>';
    
    setTimeout(preBagDelay, darkTimeDelay);
    
}

function preBagDelay () {
    setTimeout(bagReady, darkTimeDelay);
}

function bagReady () {
    darknesOut (subMenuWait);
}

function bagWait () {
    /* emty */
}

// кликт по элементам
function centerItemClick() {
    if (inBag.length >1) {selectedItem = inBag[centerBagItem];}
    darknesIn (goToGame);
}

function bagLeftClick() {
    if (inBag.length >1) {
        if (centerBagItem == 1) {centerBagItem = inBag.length - 1;} else {centerBagItem -= 1;}
    }
}

function bagRightClick() {
    if (inBag.length >1) {
        if (centerBagItem == inBag.length - 1) {centerBagItem = 1;} else {centerBagItem += 1;}
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

function goToHall () {
    document.location.href = "./hall.html";
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