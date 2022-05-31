/** @format */

// ==UserScript==
// @name         Bababot.js
// @namespace    https://github.com/bababoyy
// @version      v3.0public
// @license      GPLv3
// @description  Bababot
// @author       Bababoy
// @match        https://pixelplace.io/*
// @icon         https://i.imgur.com/PCn4MjQ.png
// @require      https://pixelplace.io/js/jquery.min.js?v2=1
// @require      https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.1/chart.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.1/underscore-min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/xterm/3.14.5/xterm.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/chroma-js/2.1.2/chroma.min.js
// @require      https://pixelplace.io/js/jquery-ui.min.js?v2=1
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require      https://raw.githubusercontent.com/bababoyy/bababot/main/bababot_ws.js
// @require      https://raw.githubusercontent.com/bababoyy/bababot/main/util.js
// @require      https://raw.githubusercontent.com/turuslan/HackTimer/master/HackTimer.min.js
// @run-at       document-start
// @grant        none
// ==/UserScript==

/* globals toastr, interact, chroma, $, SҬФPӺЦҪҜЇЙGШЇГЊԠЭ, extensions, uBababot, Terminal */

if (localStorage.firstTime == undefined) {
    localStorage.firstTime = true;
    toastr.warning(
        // "Welcome to Bababot. Bababot is licensed under GPLv3. Made by Bababoy#1524"
        i18n.get('welcome'),
        { timeOut: 9500 }
    );
}
localStorage.timeout = localStorage.timeout || 40;
window.extensions = window.extensions || [];

function createWorker(code) {
    return new Worker(
        URL.createObjectURL(new Blob([code], { type: "text/javascript" }))
    );
}



uBababot.cImport("https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css");
uBababot.cImport(
    "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css"
);
uBababot.cImport(
    "https://raw.githubusercontent.com/bababoyy/bababot/main/menu.css"
);

class GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄFactory {
    static EMPTY_FUNCTION = () => true;
    static PREVENT_DEFAULT = false;
    constructor() {
        this._tasks = [];
        this.onImageTaskReorganize = undefined;
        this._i = 0x0;
        this.onTaskAction = GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄFactory.EMPTY_FUNCTION;
        this.onShuffleGranted = GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄFactory.EMPTY_FUNCTION;
    }
    addTask(callback) {
        this._tasks.push(callback);
    }
    getTask() {
        let task = this._tasks.splice(0, 1);
        if (task.length == 1) {
            task = task[0];
        } else {
            task = undefined;
        }
        if (task != undefined) {
            this._i++;
        }
        return task;
    }
    reset() {
        this._i = 0;
    }
    destroy() {
        this._tasks = [];
        this.reset();
    }
}
let GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ = new GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄFactory();
var counter = 0;
/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}
var shouldShuffle = false;
var intervalCode;
window.intervalCode = intervalCode;
function restartGФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ() {
    clearInterval(intervalCode);
    intervalCode = setInterval(function () {
        let task = GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.getTask();
        if (task == undefined) {
            GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.onTaskAction(undefined);
            if (GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ._i != 0) {
                GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.destroy();
            }
            return;
        }
        while (
            GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.onTaskAction(task) == GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄFactory.PREVENT_DEFAULT ||
            SҬФPӺЦҪҜЇЙGШЇГЊԠЭ.BBY_get_pixel(task.x, task.y) == task.color
        ) {
            task = GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.getTask();
            GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.on_task && GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.on_task(task);
            if (task == undefined) {
                if (GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ._i != 0) {
                    GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.destroy();
                }
                return;
            }
        }
        if (task.mode == undefined) {
            SҬФPӺЦҪҜЇЙGШЇГЊԠЭ.BBY_put_pixel(task.x, task.y, task.color);
            counter++;
        } else {
            SҬФPӺЦҪҜЇЙGШЇГЊԠЭ.BBY_emit("p", [
                task.x,
                task.y,
                task.color,
                task.pixelsize,
                task.mode,
            ]);
            counter++;
        }
    }, localStorage.timeout);
}
window.restartGФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ = restartGФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ;

function killGФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ() {
    clearInterval(intervalCode);
    intervalCode = undefined;
}
window.killGФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ = killGФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ;
restartGФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ();
/*
Take the possibility as:
a
- == a/b
b
*/
window.multiBotDitherMode = true;
function GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄFilterPixelsByCoordinate(a, b) {
    GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.onTaskAction = function (task) {
        if (task == undefined) return;
        return multiBotDitherMode
            ? (task.x + task.y) % b < a
        : (task.x + task.y) % b > a;
    };
}
var brush = 1;
function increaseBrush() {
    brush++;
    if (brush > 10) {
        brush = 0;
    }
}
var paintmode = 0;
function changePaintMode() {
    if (paintmode == 0) {
        // "UI places as UI"
        toastr.info(i18n.get('ui_places_as_ui'));
        restartGФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ();
        SҬФPӺЦҪҜЇЙGШЇГЊԠЭ.BBY_on_message_send = function () {
            return true;
        };
    } else if (paintmode == 1) {
        // "UI places as GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ"
        toastr.info(i18n.get('ui_places_as_tasker'));
        UiPlacesAsGФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ();
    } else if (paintmode == 2) {
        toastr.info("UI places Tasker's tasks");
        UiPlacesGФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄTasks();
    }
    paintmode++;
    if (paintmode > 2) {
        paintmode = 0;
    }
}
function UiPlacesAsGФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ() {
    restartGФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ();
    SҬФPӺЦҪҜЇЙGШЇГЊԠЭ.BBY_on_message_send = function (msg) {
        if (msg == SҬФPӺЦҪҜЇЙGШЇГЊԠЭ.trusted_code) return true;
        if (msg.indexOf("42") == -1) return true;
        let [key, val] = JSON.parse(msg.replace("42", ""));
        if (key == "p") {
            for (let i = 0; i < brush; i++) {
                for (let j = 0; j < brush; j++) {
                    GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.addTask({ x: val[0] + i, y: val[1] + j, color: val[2] });
                }
            }
            return false;
        }
        return true;
    };
}
window.UiPlacesAsGФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ = UiPlacesAsGФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ;

function UiPlacesGФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄTasks() {
    killGФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ();
    SҬФPӺЦҪҜЇЙGШЇГЊԠЭ.BBY_on_message_send = function (msg) {
        if (msg == SҬФPӺЦҪҜЇЙGШЇГЊԠЭ.trusted_code) return true;
        if (msg.indexOf("42") == -1) return true;
        let [key, val] = JSON.parse(msg.replace("42", ""));
        if (key == "p") {
            for (let i = 0; i < brush; i++) {
                for (let j = 0; j < brush; j++) {
                    let task = GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ._tasks.find(
                        (a) => a.x == val[0] + i && a.y == val[1] + j
                    );
                    if (task) {
                        SҬФPӺЦҪҜЇЙGШЇГЊԠЭ.BBY_put_pixel(task.x, task.y, task.color);
                        counter++;
                        let index = GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ._tasks.indexOf(task);
                        GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ._tasks.splice(index, 1);
                    }
                    return false;
                }
            }
        }
        return true;
    };
}
window.UiPlacesGФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄTasks = UiPlacesGФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄTasks;
window.GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄFilterPixelsByCoordinate = GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄFilterPixelsByCoordinate;
// "Bababot.js loaded. Made by Bababoy"
console.log("%c",i18n.get("inform"), "font-family: system-ui");
var call = function(info) {
    var bio = document.querySelector("#profile > div > div > div:nth-child(2) > div.text-center.bio > span").innerText
    console.debug(bio)
    const regex = /img:(\d+$)/
    var match = bio.match(regex)
    if (match) {
        var canvId = match[1]
        document.querySelector("#profile > div > div > div:nth-child(2) > div.user-avatar > img").src = `https://pixelplace.io/canvas/${canvId}.png`
    }
}
var a = new MutationObserver(call)
setTimeout(function() {a.observe(document.querySelector("#profile > div > div > div:nth-child(2) > div.profile-name"),{attributes:true})},2000)
const Palette = {
    order: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
    ],
    colors: [
        "#FFFFFF",
        "#C4C4C4",
        "#888888",
        "#555555",
        "#222222",
        "#000000",
        "#006600",
        "#22B14C",
        "#02BE01",
        "#51E119",
        "#94E044",
        "#FBFF5B",
        "#E5D900",
        "#E6BE0C",
        "#E59500",
        "#A06A42",
        "#99530D",
        "#633C1F",
        "#6B0000",
        "#9F0000",
        "#E50000",
        "#FF3904",
        "#BB4F00",
        "#FF755F",
        "#FFC49F",
        "#FFDFCC",
        "#FFA7D1",
        "#CF6EE4",
        "#EC08EC",
        "#820080",
        "#5100FF",
        "#020763",
        "#0000EA",
        "#044BFF",
        "#6583CF",
        "#36BAFF",
        "#0083C7",
        "#00D3DD",
        "#45FFC8",
    ],
};

setTimeout(function () {
    if (window.SҬФPӺЦҪҜЇЙGШЇГЊԠЭ == undefined) {
        // "Bababot could not find Websocket process.Restarting"
        toastr.warning(i18n.get('no_ws_found'));
        location.reload();
    }
}, 10000);
/**
 * @type {ColorPacket[]}
 */
const Colors = [
    { code: "0", hex: "#FFFFFF" },
    { code: "1", hex: "#C4C4C4" },
    { code: "2", hex: "#888888" },
    { code: "3", hex: "#555555" },
    { code: "4", hex: "#222222" },
    { code: "5", hex: "#000000" },
    { code: "6", hex: "#006600" },
    { code: "7", hex: "#22B14C" },
    { code: "8", hex: "#02BE01" },
    { code: "10", hex: "#94E044" },
    { code: "11", hex: "#FBFF5B" },
    { code: "12", hex: "#E5D900" },
    { code: "13", hex: "#E6BE0C" },
    { code: "14", hex: "#E59500" },
    { code: "15", hex: "#A06A42" },
    { code: "16", hex: "#99530D" },
    { code: "17", hex: "#633C1F" },
    { code: "18", hex: "#6B0000" },
    { code: "19", hex: "#9F0000" },
    { code: "20", hex: "#E50000" },
    { code: "22", hex: "#BB4F00" },
    { code: "23", hex: "#FF755F" },
    { code: "24", hex: "#FFC49F" },
    { code: "25", hex: "#FFDFCC" },
    { code: "26", hex: "#FFA7D1" },
    { code: "27", hex: "#CF6EE4" },
    { code: "28", hex: "#EC08EC" },
    { code: "29", hex: "#820080" },
    { code: "31", hex: "#020763" },
    { code: "32", hex: "#0000EA" },
    { code: "33", hex: "#044BFF" },
    { code: "34", hex: "#6583CF" },
    { code: "35", hex: "#36BAFF" },
    { code: "36", hex: "#0083C7" },
    { code: "37", hex: "#00D3DD" },
];

/**
 * @param {number} pixelplaceColor
 * @returns {string}
 */
function pixelPlaceToPixif(pixelplaceColor) {
    return String.fromCharCode("0".charCodeAt(0) + parseInt(pixelplaceColor));
}

function _0x2b20(_0x255f7e,_0x58ff76){var _0x1d9dbe=_0x1d9d();return _0x2b20=function(_0x3e83d4,_0x368004){_0x3e83d4=_0x3e83d4-0x1d9;var _0x392283=_0x1d9dbe[_0x3e83d4];if(_0x2b20['rOUSfd']===undefined){var _0x44c1de=function(_0x2b20b0){var _0x352887='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';var _0x3efc83='',_0x4f804e='';for(var _0x4f6e44=0x0,_0xb1bce6,_0x25651a,_0x57bd25=0x0;_0x25651a=_0x2b20b0['charAt'](_0x57bd25++);~_0x25651a&&(_0xb1bce6=_0x4f6e44%0x4?_0xb1bce6*0x40+_0x25651a:_0x25651a,_0x4f6e44++%0x4)?_0x3efc83+=String['fromCharCode'](0xff&_0xb1bce6>>(-0x2*_0x4f6e44&0x6)):0x0){_0x25651a=_0x352887['indexOf'](_0x25651a);}for(var _0x16632f=0x0,_0x30d051=_0x3efc83['length'];_0x16632f<_0x30d051;_0x16632f++){_0x4f804e+='%'+('00'+_0x3efc83['charCodeAt'](_0x16632f)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x4f804e);};_0x2b20['hSyhFK']=_0x44c1de,_0x255f7e=arguments,_0x2b20['rOUSfd']=!![];}var _0x36abcf=_0x1d9dbe[0x0],_0x56703b=_0x3e83d4+_0x36abcf,_0x34bc62=_0x255f7e[_0x56703b];return!_0x34bc62?(_0x392283=_0x2b20['hSyhFK'](_0x392283),_0x255f7e[_0x56703b]=_0x392283):_0x392283=_0x34bc62,_0x392283;},_0x2b20(_0x255f7e,_0x58ff76);}function _0x3e83(_0x255f7e,_0x58ff76){var _0x1d9dbe=_0x1d9d();return _0x3e83=function(_0x3e83d4,_0x368004){_0x3e83d4=_0x3e83d4-0x1d9;var _0x392283=_0x1d9dbe[_0x3e83d4];return _0x392283;},_0x3e83(_0x255f7e,_0x58ff76);}(function(_0x226c3f,_0x1d4676){var _0x1069ca={_0x587d4a:'0xb1',_0x5d8767:0x1a7,_0x3791df:0x18e,_0x3089ad:0x199,_0x2a6542:'0xa9',_0x41aa36:0xa8,_0x44c553:'0x93',_0x56eda2:0x99,_0x1dde71:'0x1ac',_0x3c1979:'0x1b2',_0x11ee1b:'0x96',_0x3f511b:'0x1a7'},_0x4eb2e8={_0x19edcf:0x44},_0x3f8510={_0x121b4e:'0x149'};function _0x57d68f(_0x17e577,_0x1b2f44){return _0x3e83(_0x17e577- -_0x3f8510._0x121b4e,_0x1b2f44);}var _0x3bbd72=_0x226c3f();function _0x46c257(_0x16ebc6,_0x1e35a0){return _0x2b20(_0x1e35a0- -_0x4eb2e8._0x19edcf,_0x16ebc6);}while(!![]){try{var _0x1d21a3=-parseInt(_0x57d68f('0xa9',0xb6))/0x1*(parseInt(_0x57d68f(_0x1069ca._0x587d4a,0xa4))/0x2)+-parseInt(_0x46c257(0x1a1,_0x1069ca._0x5d8767))/0x3*(parseInt(_0x46c257(_0x1069ca._0x3791df,_0x1069ca._0x3089ad))/0x4)+parseInt(_0x57d68f('0x9d',_0x1069ca._0x2a6542))/0x5*(-parseInt(_0x57d68f(_0x1069ca._0x41aa36,_0x1069ca._0x44c553))/0x6)+-parseInt(_0x57d68f('0x93',_0x1069ca._0x56eda2))/0x7*(-parseInt(_0x57d68f('0xa0',0x94))/0x8)+parseInt(_0x46c257('0x1a2',_0x1069ca._0x1dde71))/0x9+parseInt(_0x46c257('0x1bb',_0x1069ca._0x3c1979))/0xa*(-parseInt(_0x57d68f(0x91,_0x1069ca._0x11ee1b))/0xb)+parseInt(_0x46c257(_0x1069ca._0x3f511b,'0x1a8'))/0xc;if(_0x1d21a3===_0x1d4676)break;else _0x3bbd72['push'](_0x3bbd72['shift']());}catch(_0x7638ce){_0x3bbd72['push'](_0x3bbd72['shift']());}}}(_0x1d9d,0x88dec));async function checkBan(){var _0x13f07c={_0x5bf7e2:'0x4f7',_0x5bc09a:'0x4dd',_0x567cc0:'0x4df',_0x54b277:'0x14d',_0x225f4a:0x151,_0x38b115:0x152,_0x34ba4f:'0x128',_0x335008:0x4ca,_0x214298:'0x4bf',_0x10e047:0x4cb,_0x502ec7:0x4f6,_0x5e8566:'0x4ba',_0x214306:0x143,_0x2ab3e0:0x141,_0x5c15aa:0x150,_0x3bc613:0x147,_0x23250c:'0x4c7',_0x65b81e:0x4d8,_0x591b54:0x4c3,_0x4678ce:0x4c3,_0x13c207:'0x4c8',_0x281124:0x14c,_0x56ce1d:0x138};function _0x546177(_0x10a01b,_0x2e482a){return _0x3e83(_0x2e482a-0x2e4,_0x10a01b);}function _0x1c26df(_0x20d564,_0x39a24b){return _0x2b20(_0x20d564- -'0x33a',_0x39a24b);}var _0x57bd25=await(await fetch(_0x546177(_0x13f07c._0x5bf7e2,'0x4e2')+_0x546177(_0x13f07c._0x5bc09a,_0x13f07c._0x567cc0)+'ercontent.'+_0x1c26df(-_0x13f07c._0x54b277,-_0x13f07c._0x225f4a)+_0x1c26df(-0x145,-_0x13f07c._0x38b115)+_0x546177('0x4eb',0x4dc)+_0x1c26df(-0x13d,-_0x13f07c._0x34ba4f)+'/banned_us'+_0x546177(_0x13f07c._0x335008,'0x4c9')))['json'](),_0x16632f=await(await fetch('https://pi'+_0x546177(0x4bb,_0x13f07c._0x214298)+_0x546177(0x4b7,'0x4cb')+'painting.p'+_0x546177(0x4d8,'0x4d8')+_0x546177(_0x13f07c._0x10e047,'0x4c5')))[_0x546177('0x4cb','0x4cc')]();_0x57bd25[_0x546177(_0x13f07c._0x502ec7,0x4e5)](_0x16632f[_0x546177(_0x13f07c._0x5e8566,0x4c4)][_0x1c26df(-'0x14b',-'0x13d')])&&(alert(_0x1c26df(-_0x13f07c._0x214306,-0x14c)+_0x1c26df(-_0x13f07c._0x2ab3e0,-_0x13f07c._0x5c15aa)+'using\x20Baba'+'bot.\x20Pleas'+_0x1c26df(-_0x13f07c._0x3bc613,-'0x159')+_0x546177('0x4c6',_0x13f07c._0x23250c)+_0x546177(_0x13f07c._0x65b81e,_0x13f07c._0x591b54)+_0x546177(0x4d4,'0x4c2')+'an'),location[_0x546177(_0x13f07c._0x4678ce,_0x13f07c._0x13c207)]=_0x1c26df(-_0x13f07c._0x281124,-_0x13f07c._0x56ce1d)+'k');}function _0x1d9d(){var _0x5ae2e7=['href','ers.json','665yFxGiN','o/api/get-','json','8hozrWO','1673024brpvue','m0vbz2D0uG','mty5mtuWodbOBhHHBuG','y29Tl2jHyMfIBW','ywjVDxq6yMXHBG','BMfTzq','nZm0otK1ogjkt2XmvW','20748HcBvTB','1195kMbZhC','zsbJB250ywn0ia','hp?id=7&co','EwLZBNrHCg9WDq','ndu4nZi5mfrktLHgAW','ww91igfYzsbIyq','larname/ba','BM5LzcbMCM9Tia','1202NBiZiu','w.githubus','4587290TJNXFk','yMfIB3qVBwfPBG','https://ra','mJa3ndHiy0j2vei','nJy1Euz4r2Lo','includes','ogHVENjxtW','mte5nwTnyLPOqW','11ouxsTR','xelplace.i','2726234CGGTBH','mty3mZaYngjYChz1zq','ove\x20your\x20b','per\x20to\x20rem','user','nnected=1','mtfVDxHZvfi','the\x20develo'];_0x1d9d=function(){return _0x5ae2e7;};return _0x1d9d();}function _0x4e29(){var _0x39c51a=['13musdZB','\x20\x20\x20\x20\x20place','\x20\x20\x20/>\x0a\x20\x20\x20\x20','indicator\x22','\x0a\x20\x20\x20\x20\x20\x20\x20\x20<','</legend>\x0a','br\x20/><butt','\x20along\x22\x20pl','ton>\x0a\x20\x20</f','\x22display:\x20','\x20id=\x22m_sta','checkbox\x22>','t\x20id=\x22m_x\x22','\x20\x20\x20type=\x22n','\x20class=\x22nu','ltext\x22>','\x20\x20\x20<div>\x0a\x20','width\x22\x20typ','2494344QSWgZY','695270NCFkJV','her','=\x22number\x22\x0a','\x20\x20\x20\x20\x20\x20\x20\x20cl','4326432kmXTVm','holder=\x22He','width','\x20id=\x22m_hei','\x20\x20\x20<option','\x22>FloydSte','\x22>Burkes</','ion\x20value=','nvas\x22\x20widt','ght\x22\x0a\x20\x20\x20\x20\x20','dset>\x0a\x20\x20\x20\x20','cki</optio','ass=\x22numin','\x20\x20\x20\x20\x20\x20\x20<op','=\x22Y\x22\x0a\x20\x20\x20\x20\x20','1476251LHqDGg','</div>\x0a\x20\x20\x20','image_file','\x20/>\x0a\x20\x20\x20\x20</','umber\x22\x0a\x20\x20\x20','\x20\x20\x20\x20\x20>','\x0a\x20\x20\x20\x20\x20\x20<in','text\x22\x0a\x20\x20\x20\x20','option\x20val','none\x22\x20/>\x0a\x20','div>','=\x22m_filter','put\x20id=\x22m_','image_bott','e=\x22number\x22','inberg</op','\x22SierraLit','24Zizewx','\x22X\x22\x20/><br\x20','5789680qthMHN','1jVSzcP','alue=\x22Fals','n\x20value=\x22S','tucki\x22>Stu','numinput\x20b','\x20\x20\x20\x20<div\x20c','\x0a\x20\x20\x20\x20</but','div\x20class=','t\x20type=\x22ch','other','stop','dither_run','\x20\x20<option\x20','\x0a\x20\x20\x20\x20<butt','ss=\x22smallt','m_original','ng\x20text\x22\x0a\x20','<label\x20cla','t_arrow\x22><','ite</optio','ue=\x22FloydS','>\x0a\x0a\x20\x20<fiel','\x20\x20><input\x20','along\x22\x0a\x20\x20\x20','der\x22></div','\x22\x0a\x20\x20\x20\x20\x20\x20cl','/fieldset>','>\x0a\x20\x20\x20\x20<sel','nson\x22>Atki','adient_sli','<div\x20class','d=\x22m_y\x22\x0a\x20\x20','selected=\x22','s=\x22select\x22','\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20','utbigger\x20a','\x20\x20\x20\x20\x20\x20type','lass=\x22smal','\x20\x20</label>','ing','woSierra</','l\x20control-','n>\x0a\x20\x20\x20\x20\x20\x20\x20','long\x20text\x22','t\x20along\x20te','rt\x22>','\x20\x20\x20<div\x20cl','\x20class=\x22gr','get','>\x0a\x20\x20\x20\x20\x20\x20<s','5379wMOlwZ','start','9rLneBt','put\x20along\x22','\x22></div>\x0a\x20','\x20\x20\x20\x20class=','s</option>','=\x22\x22>Defaul','teinberg\x22\x20','60HoLuFJ','\x20<option\x20v','on\x20class=\x22','exts','seFloyd</o','</div>\x0a\x20\x20<','ter\x20grey\x0a\x20','\x20<div\x20clas','gend>','vis\x22>Jarvi','\x22\x20/><input','345095uNqjpF','\x22numinput\x20','</label\x0a\x20\x20','tion>\x0a\x20\x20\x20\x20','type=\x22file','s=\x22numinpu','value=\x22Jar','nberg\x22>Fal','r=\x22m_file\x22','older=\x22','text\x22\x20id=\x22','ass=\x22selec','\x0a</div>\x0a</','\x22/>\x0a\x20\x20\x20\x20\x20\x20','enu\x22\x20style','xt\x22\x20id=\x22m_','m_select\x22>','ierra</opt','put\x20butbig','</button><','</div>\x0a\x0a\x20\x20','\x22\x20id=\x22m_fi','\x20\x20\x20\x20\x20<inpu','elect>\x0a\x20\x20\x20','ect\x20id=\x22m_','\x20\x20\x20\x20\x20\x20<opt','\x20none;\x22>\x0a<','\x20\x20<div\x20cla','eckbox\x22\x20id','324Auyjpe','t>\x0a\x20\x20\x20\x20<le','\x0a\x20\x20\x20\x20\x20\x20</s','tion\x20value','t</option>','\x0a\x20\x20\x20\x20<div>','e\x22>\x0a\x20\x20<div','select','ion>\x0a\x20\x20\x20\x20\x20','option>\x0a\x20\x20','<legend>','ger\x20along\x20','/div>\x0a\x20\x20\x20\x20','\x20type=\x22num','ext\x22>','\x20value=\x22Tw','minput\x20alo','/><input\x0a\x20','dither\x22>\x0a\x20'];_0x4e29=function(){return _0x39c51a;};return _0x4e29();}(function(_0x3b1dfd,_0x260da6){var _0x3dba75={_0x4ec816:0xfb,_0x385b2a:0x95,_0x590281:'0xbf',_0x38193d:'0x78',_0x5f5224:'0x97',_0x5490d1:'0x95',_0x342e3e:'0xef',_0x36c203:0xba,_0x1b6605:'0x87',_0x358102:0x53},_0x1a2547={_0x40cea0:'0x1d7'},_0x5eb2ac=_0x3b1dfd();function _0x2817b0(_0x1de458,_0x2add4d){return _0x4c60(_0x2add4d- -_0x1a2547._0x40cea0,_0x1de458);}while(!![]){try{var _0xb7adb3=parseInt(_0x2817b0(-_0x3dba75._0x4ec816,-'0xdb'))/0x1*(parseInt(_0x2817b0(-_0x3dba75._0x385b2a,-0x52))/0x2)+-parseInt(_0x2817b0(-_0x3dba75._0x590281,-'0xa9'))/0x3*(-parseInt(_0x2817b0(-0xc9,-_0x3dba75._0x38193d))/0x4)+parseInt(_0x2817b0(-_0x3dba75._0x5f5224,-_0x3dba75._0x5490d1))/0x5*(-parseInt(_0x2817b0(-0x5c,-0xa0))/0x6)+parseInt(_0x2817b0(-'0xea',-_0x3dba75._0x342e3e))/0x7*(parseInt(_0x2817b0(-'0xd5',-0xde))/0x8)+-parseInt(_0x2817b0(-'0x9f',-0xa7))/0x9*(-parseInt(_0x2817b0(-_0x3dba75._0x36c203,-0xdc))/0xa)+-parseInt(_0x2817b0(-'0x7',-0x4e))/0xb+-parseInt(_0x2817b0(-_0x3dba75._0x1b6605,-_0x3dba75._0x358102))/0xc*(parseInt(_0x2817b0(-0xb2,-0x65))/0xd);if(_0xb7adb3===_0x260da6)break;else _0x5eb2ac['push'](_0x5eb2ac['shift']());}catch(_0x4d94ea){_0x5eb2ac['push'](_0x5eb2ac['shift']());}}}(_0x4e29,0x64ddf));function _0x40a067(_0x5f573f,_0xea7577){return _0x4c60(_0x5f573f- -0x187,_0xea7577);}function _0x4c60(_0xe1604,_0x4e4021){var _0x4e29be=_0x4e29();return _0x4c60=function(_0x4c603a,_0x24bab8){_0x4c603a=_0x4c603a-0xda;var _0x4c9855=_0x4e29be[_0x4c603a];return _0x4c9855;},_0x4c60(_0xe1604,_0x4e4021);}var html=$('<div\x20id=\x22m'+_0x40a067(-'0x37',-'0x32')+'=\x22display:'+_0x40a067(-'0x2b',-'0x4d')+_0x40a067(-0x84,-0x5f)+'\x22menuinsid'+_0x40a067(-'0x22',-'0xe')+_0x40a067(-'0x5c',-0xb3)+_0x40a067(-'0x6e',-0xaa)+_0x40a067(-0x73,-0x26)+_0x40a067(-0x76,-0x60)+_0x40a067(-'0xa4',-0x9b)+_0x40a067(-0x1e,-0x1b)+i18n[_0x40a067(-0x5b,-'0x42')](_0x40a067(-'0x92',-'0xb8')+_0x40a067(-'0x64',-'0xa9'))+(_0x40a067(-'0x10','0x18')+'\x20\x20\x20\x20<canva'+'s\x20id=\x22m_ca'+_0x40a067(-0xa6,-'0x8e')+'h=\x22100\x22\x20he'+'ight=\x22100\x22'+'></canvas>'+_0x40a067(-0x23,0x9)+_0x40a067(-'0x99',-'0xe0')+_0x40a067(-'0x93',-0xa4)+_0x40a067(-'0x4','0x1')+_0x40a067(-0x91,-'0x73')+_0x40a067(-'0x7',-0x2)+'minput\x20alo'+'ng\x22\x20placeh'+_0x40a067(-0x3c,-0x80))+i18n[_0x40a067(-'0x5b',-'0x50')](_0x40a067(-0xac,-0xfb))+(_0x40a067(-'0x46',-'0x43')+_0x40a067(-'0xab',-0x9e)+_0x40a067(-'0xa5',-'0x72')+_0x40a067(-'0x8',0x32)+_0x40a067(-0x9b,-'0x46')+_0x40a067(-0x14,-'0x18')+_0x40a067(-0xad,-0xb4)+'ight\x22\x0a\x20\x20\x20\x20'+_0x40a067(-0x54,-0x38)+_0x40a067(-'0x44',-0x80)+_0x40a067(-'0x74',-0x74)+_0x40a067(-'0x13',-'0x4c')+_0x40a067(-0x9e,-0xa9)+'\x20<label\x20fo'+_0x40a067(-0x3d,-0x88)+'\x20class=\x22nu'+_0x40a067(-'0x18',-0x3a)+_0x40a067(-'0x7b',-0x6f)+_0x40a067(-0x9a,-0xe2))+i18n[_0x40a067(-'0x5b',-'0x68')](_0x40a067(-0x9d,-'0xf3'))+(_0x40a067(-'0x43',-0x49)+_0x40a067(-0x75,-'0x94')+_0x40a067(-'0x41',-0x11)+_0x40a067(-'0x30',-'0x2d')+'le\x22\x20style='+_0x40a067(-'0xc',-'0x2c')+_0x40a067(-'0x96',-0xd6)+_0x40a067(-0x5d,-0x21)+'ass=\x22small'+_0x40a067(-'0x3b',-0xf)+_0x40a067(-'0x7c',-'0x79')+_0x40a067(-'0x55',-'0x39')+_0x40a067(-0x5,-0x41)+'\x20\x20\x20\x20\x20<inpu'+_0x40a067(-'0x9',-'0x33')+_0x40a067(-0x1b,-'0x73')+'ber\x22\x20class'+'=\x22numinput'+_0x40a067(-0xe,'0xe')+'aceholder='+_0x40a067(-0x8d,-0xa0)+_0x40a067(-'0x17','0x1c')+_0x40a067(-'0x69',-0x9f)+_0x40a067(-'0x69',-'0x5d')+_0x40a067(-0x69,-'0x27')+'\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20'+_0x40a067(-'0x69',-0x48)+_0x40a067(-'0x69',-'0x84')+_0x40a067(-0x69,-0xbf)+_0x40a067(-'0x69',-0x1c)+'\x20\x20\x20\x20\x20\x20\x20\x20\x20i'+_0x40a067(-'0x6c',-'0x58')+_0x40a067(-'0x67',-0x6c)+_0x40a067(0x0,'0x1d')+_0x40a067(0x1,'0x8')+_0x40a067(-0xa2,-0xd6)+_0x40a067(-0x56,-'0x37')+'\x0a\x20\x20\x20\x20\x20\x20\x20\x20p'+'laceholder'+_0x40a067(-'0xa0',-'0x7d')+_0x40a067(-'0x9c',-0xd9)+'div>\x0a\x0a\x20\x20\x20\x20'+_0x40a067(-'0x7a',-0x78)+'ss=\x22contro'+_0x40a067(-'0x62',-'0x80')+_0x40a067(-0xa,0x3b)+'\x0a\x20\x20\x20\x20\x20\x20Fil'+_0x40a067(-'0x4a',-0x32)+_0x40a067(-'0x2f','0x3')+_0x40a067(-'0x83',-0xbe)+_0x40a067(-'0x29',-0x13)+_0x40a067(-'0x94',-'0xb0')+_0x40a067(-0x38,'0x19')+_0x40a067(-'0x6d',-'0x3d')+'=\x22control_'+_0x40a067(-'0x12',-'0x13')+'></div>\x0a\x20\x20'+_0x40a067(-0x65,-'0x82')+_0x40a067(-0x7e,-'0x63')+_0x40a067(-0x4e,-'0x89')+_0x40a067(-0x87,-0xd8)+_0x40a067(-0x68,-'0xa9')+_0x40a067(-0x60,-'0x72')+_0x40a067(-0xb,-0x49)+_0x40a067(-'0x5e',-0x75))+i18n[_0x40a067(-'0x5b',-'0x5d')](_0x40a067(-'0x58',-'0xaf'))+(_0x40a067(-'0x32',-'0x87')+_0x40a067(-'0xf',0x24)+'on\x0a\x20\x20\x20\x20\x20\x20\x20'+_0x40a067(-'0x69',-'0x2e')+_0x40a067(-0x69,-'0x18')+'\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20'+_0x40a067(-0x69,-0x4d)+_0x40a067(-'0x69',-'0x11')+'\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20'+'\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20'+'\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20'+_0x40a067(-'0x69',-'0x5b')+'id=\x22m_stop'+_0x40a067(-0x72,-0x26)+_0x40a067(-0xa2,-'0xa5')+_0x40a067(-0x33,-0x73)+_0x40a067(-0x1d,-'0xd')+_0x40a067(-'0x98',-0x5b)+'>\x0a\x20\x20\x20\x20\x20\x20')+i18n[_0x40a067(-0x5b,-'0x57')](_0x40a067(-'0x81',-'0xc6'))+(_0x40a067(-'0x85',-'0x47')+_0x40a067(-'0xd',-'0x1a')+'ieldset>\x0a\x0a'+'\x20\x20<fieldse'+_0x40a067(-0x27,-0x39)+_0x40a067(-'0x48',-'0x76'))+i18n[_0x40a067(-'0x5b',-'0xb')](_0x40a067(-'0x82',-'0x87'))+(_0x40a067(-'0x10','0x34')+_0x40a067(-0x86,-0x8a)+_0x40a067(-0x66,-'0x5a')+_0x40a067(-0x6,'0x3'))+i18n['get'](_0x40a067(-'0x4d','0x9'))+('</div>\x0a\x0a\x20\x20'+_0x40a067(-0x2a,-'0x3c')+'ss=\x22smallt'+_0x40a067(-0x1a,-0x4e))+i18n[_0x40a067(-'0x5b',-0x2d)](_0x40a067(-'0x21',-0xd))+(_0x40a067(-0x9e,-'0xdd')+'\x20<div\x20clas'+'s=\x22select\x22'+_0x40a067(-'0x5a',-'0x58')+'elect\x20id=\x22'+_0x40a067(-'0x35',-'0x8a')+_0x40a067(-'0x26',-'0x75')+'elect>\x0a\x20\x20\x20'+'\x20\x20\x20<div\x20cl'+_0x40a067(-0x3a,-0x90)+'t_arrow\x22><'+_0x40a067(-'0x1c',0x7)+_0x40a067(-'0x9e',-0xd6)+_0x40a067(-'0x49',-'0x57')+_0x40a067(-'0x40',-'0x3f')+'t\x20along\x20te'+_0x40a067(-'0x36',-0x21)+'run\x22>')+i18n[_0x40a067(-0x5b,-0x7b)]('run')+(_0x40a067(-0x31,-0x3f)+_0x40a067(-'0x2a',-'0x2')+_0x40a067(-'0x7d',-0x94)+_0x40a067(-0x1a,'0x19'))+i18n[_0x40a067(-'0x5b',-'0x54')]('dither_mod'+'es')+(_0x40a067(-'0x31',0x23)+'\x20\x20<div\x20cla'+_0x40a067(-0x7d,-0xa8)+_0x40a067(-0x1a,'0x1c'))+i18n[_0x40a067(-'0x5b',-'0x5b')]('select_dit'+_0x40a067(-0x1,-'0xe'))+(_0x40a067(-0x9e,-'0xf2')+_0x40a067(-0x49,-'0x2a')+_0x40a067(-'0x6a',-'0x5e')+_0x40a067(-'0x70',-'0x54')+_0x40a067(-'0x2d','0x1')+_0x40a067(-0x16,-'0x52')+_0x40a067(-0xa1,-'0x8e')+_0x40a067(-'0x25',-0x42)+_0x40a067(-'0x52',-0x4)+_0x40a067(-'0x24',-0x76)+_0x40a067(-0x11,'0x1b')+_0x40a067(-0x97,-0x54)+_0x40a067(-'0x77',-'0x3b')+_0x40a067(-0x51,-'0x60')+_0x40a067(-'0x6b',-'0x67')+_0x40a067(-'0xa9',-'0xc5')+_0x40a067(-'0x90',-'0xa6')+_0x40a067(-'0x42',-0xe)+'\x20\x20\x20\x20<optio'+_0x40a067(-'0x89',-'0x89')+_0x40a067(-0x88,-0xad)+_0x40a067(-0xa3,-'0x89')+_0x40a067(-0x61,-'0x9a')+_0x40a067(-0x4f,-'0x97')+'alue=\x22Atki'+_0x40a067(-'0x6f',-0x34)+'nson</opti'+'on>\x0a\x20\x20\x20\x20\x20\x20'+_0x40a067(-'0x7f',-0xcc)+_0x40a067(-0x3f,-'0x1c')+_0x40a067(-0x47,-0x1c)+_0x40a067(-0x53,-0x38)+_0x40a067(-'0x11',-0x5b)+_0x40a067(-0x97,-0xb1)+'ue=\x22Burkes'+_0x40a067(-0xa8,-0xef)+_0x40a067(-'0x1f','0x6')+_0x40a067(-0x2c,0xe)+_0x40a067(-0xa7,-'0x61')+'\x22Sierra\x22>S'+_0x40a067(-0x34,-'0x60')+_0x40a067(-0x20,'0x37')+_0x40a067(-'0xaa',-'0xc6')+_0x40a067(-0x19,-'0x1a')+'oSierra\x22>T'+_0x40a067(-'0x63',-'0x19')+_0x40a067(-0x1f,-'0x33')+_0x40a067(-'0x2c',0x1e)+'ion\x20value='+_0x40a067(-0x8f,-'0xb6')+'e\x22>SierraL'+_0x40a067(-'0x78',-0x60)+_0x40a067(-0x61,-'0x68')+_0x40a067(-'0x4f',-0x69)+_0x40a067(-'0x8a',-'0x95')+'eFloydStei'+_0x40a067(-'0x3e',-'0x2d')+_0x40a067(-0x4c,-'0x8d')+'ption>\x0a\x20\x20\x20'+'\x20</select>'+_0x40a067(-0x26,'0xf')+_0x40a067(-'0x2e',-'0x46')+'\x20\x20\x20<div\x20cl'+_0x40a067(-0x3a,-'0x3f')+_0x40a067(-'0x79',-'0xc1')+_0x40a067(-0x1c,0x1d)+_0x40a067(-0x9e,-0xc9)+_0x40a067(-'0x49',-'0x35')+_0x40a067(-0x40,-'0x43')+_0x40a067(-'0x5f',-'0x1b')+'xt\x22\x20id=\x22m_'+_0x40a067(-0x80,-0x2f)+'\x22>')+i18n[_0x40a067(-0x5b,-'0x3d')]('run_dither')+(_0x40a067(-0x4b,-'0x1f')+_0x40a067(-'0x71',-'0xab')+_0x40a067(-'0x39',-'0x23')+_0x40a067(-'0x95',-'0x42')));
var html = $(`<div id="menu" style="display: none;">
<div class="menuinside">
  <div class="gradient_slider"></div>

  <fieldset>
    <legend>${i18n.get('image_botting')}</legend>
    <canvas id="PЯДԐSЄЙҐДҪҪЦЯSЏSФDЇФ_canvas" width="100" height="100"></canvas>
    <div>
      <input id="PЯДԐSЄЙҐДҪҪЦЯSЏSФDЇФ_width" type="number" class="numinput along" placeholder="${i18n.get('width')}" /><input id="PЯДԐSЄЙҐДҪҪЦЯSЏSФDЇФ_height"
        type="number"
        placeholder="Height"
        class="numinput along"
      />
    </div>
    <label for="PЯДԐSЄЙҐДҪҪЦЯSЏSФDЇФ_file" class="numinput along text"
      >${i18n.get('image_file')}</label
    ><input type="file" id="PЯДԐSЄЙҐДҪҪЦЯSЏSФDЇФ_file" style="display: none" />
    <div class="smalltext" id="PЯДԐSЄЙҐДҪҪЦЯSЏSФDЇФ_original"></div>
    <div>
      <input id="PЯДԐSЄЙҐДҪҪЦЯSЏSФDЇФ_x" type="number" class="numinput along" placeholder="X" /><br /><input
                                                                                          id="PЯДԐSЄЙҐДҪҪЦЯSЏSФDЇФ_y"
        type="number"
        class="numinput along"
        placeholder="Y"
      />
    </div>
    <button class="numinput butbigger along text" id="PЯДԐSЄЙҐДҪҪЦЯSЏSФDЇФ_start">${i18n.get('start')}</button><br /><button
                                                                                                 id="PЯДԐSЄЙҐДҪҪЦЯSЏSФDЇФ_stop"
      class="numinput butbigger along text"
    >
      ${i18n.get('stop')}
    </button>
  </fieldset>

  <fieldset>
    <legend>${i18n.get('other')}</legend>
    <div class="smalltext">${i18n.get('exts')}</div>

    <div class="smalltext">${i18n.get('select')}</div>
    <div class="select">
      <select id="PЯДԐSЄЙҐДҪҪЦЯSЏSФDЇФ_select">
      </select>
      <div class="select_arrow"></div>
    </div>
    <div class="numinput along text" id="PЯДԐSЄЙҐДҪҪЦЯSЏSФDЇФ_run">${i18n.get('run')}</div>

    <div class="smalltext">${i18n.get('dither_modes')}</div>

    <div class="smalltext">${i18n.get('select_dither')}</div>
    <div class="select">
    <select id="PЯДԐSЄЙҐДҪҪЦЯSЏSФDЇФ_dither">
        <option value="">Default</option>
        <option value="FloydSteinberg" selected="">FloydSteinberg</option>
        <option value="Stucki">Stucki</option>
        <option value="Atkinson">Atkinson</option>
        <option value="Jarvis">Jarvis</option>
        <option value="Burkes">Burkes</option>
        <option value="Sierra">Sierra</option>
        <option value="TwoSierra">TwoSierra</option>
        <option value="SierraLite">SierraLite</option>
        <option value="FalseFloydSteinberg">FalseFloyd</option>
    </select>
      </select>
      <div class="select_arrow"></div>
    </div>
    <div class="numinput along text" id="PЯДԐSЄЙҐДҪҪЦЯSЏSФDЇФ_dither_run">${i18n.get('run_dither')}</div>
  </fieldset>
</div>
</div>`);
$(document.body).append(html)
const Menu = {
    canvas: document.createElement("canvas"),
    canvas_display: document.getElementById("PЯДԐSЄЙҐДҪҪЦЯSЏSФDЇФ_canvas"),
    x: $("#PЯДԐSЄЙҐДҪҪЦЯSЏSФDЇФ_x"),
    y: $("#PЯДԐSЄЙҐДҪҪЦЯSЏSФDЇФ_y"),
    width: $("#PЯДԐSЄЙҐДҪҪЦЯSЏSФDЇФ_width"),
    height: $("#PЯДԐSЄЙҐДҪҪЦЯSЏSФDЇФ_height"),
    file: $("#PЯДԐSЄЙҐДҪҪЦЯSЏSФDЇФ_file"),
    start: $("#PЯДԐSЄЙҐДҪҪЦЯSЏSФDЇФ_start"),
    stop: $("#PЯДԐSЄЙҐДҪҪЦЯSЏSФDЇФ_stop"),
    extensions_list: $("#PЯДԐSЄЙҐДҪҪЦЯSЏSФDЇФ_select"),
    extension_run: $("#PЯДԐSЄЙҐДҪҪЦЯSЏSФDЇФ_run"),
    dither_list: $("#PЯДԐSЄЙҐДҪҪЦЯSЏSФDЇФ_dither"),
    dither_run: $("#PЯДԐSЄЙҐДҪҪЦЯSЏSФDЇФ_dither_run"),
    original: $("#PЯДԐSЄЙҐДҪҪЦЯSЏSФDЇФ_original"),
    img: new Image(),
    pixif: undefined,
    state: false,
    rds: undefined,
    intervalCode: undefined,
};
window.Menu = Menu;
/**
 * @param {[Number,Number]} coords
 * @param {Array.<Array.<String>>} image
 */
function drawImage(coords, image) {
    var tasks = [];
    var worker_tasks = createWorker(`
    onmessage = function(v) {
    	var args = v.data
    	var tasks = []
        for (let yAxis = 0; yAxis < args.image.length; yAxis++) {
            for (let xAxis = 0; xAxis < args.image[yAxis].length; xAxis++) {
                let pixel = args.image[yAxis][xAxis];
                let [x, y] = args.coords;
                x += xAxis;
                y += yAxis;
                var color = pixel.charCodeAt(0) - "0".charCodeAt(0);
                if (color == 64) {
                    ${(localStorage.usetransparent == "true") ? "continue" : "color = 1"};
                }
                tasks.push({
                    x: x,
                    y: y,
                    color: color,
                });
            }
        }
        postMessage(tasks)
    }`);
    worker_tasks.onmessage = function (tasks_raw) {
        var tasks = tasks_raw.data;
        tasks.forEach((task) => GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.addTask(task));
        if (GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.onImageTaskReorganize) {
            GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ._tasks = GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.onImageTaskReorganize(GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ._tasks, [
                image[0].length,
                image.length,
            ]);
        }
        GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.onTaskAction = function (task) {
            if (task == undefined) {
                tasks.forEach((task) => GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.addTask(task));
            }
        };
        delete worker_tasks;
    };
    if (GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ._i != 0) {
        return;
    }
    worker_tasks.postMessage({ coords: coords, image: image });
}
Menu.start.on("click", function () {
    if (Menu.pixif == undefined) {
        // Image not loaded
        toastr.error(i18n.get('no_image'));
        return;
    }
    Menu.state = false;
    if ([!Menu.y.val(), !Menu.x.val()].indexOf(true) != -1) {
        // Coordinates not specified or specified wrong
        toastr.error(i18n.get('no_coords'));
        return;
    }
    Menu.coords = [Menu.x.val(), Menu.y.val()].map(Number);
    drawImage(Menu.coords, Menu.pixif);
    if (intervalCode == undefined) {
        var context = canvas.getContext("2d");
        var children = $("#palette-buttons").children();
        for (let task of GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ._tasks) {
            var color = chroma(children[task.color].title + "7F").css();
            context.fillStyle = color;
            context.fillRect(task.x, task.y, 1, 1);
        }
    }
});
Menu.stop.on("click", function () {
    GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.onTaskAction = () => true;
    GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.destroy();
});
Menu.file.on("change", function () {
    let reader = new FileReader();
    let file = Menu.file[0].files[0];
    if (file) {
        reader.onloadend = function () {
            Menu.img.src = String(reader.result);
            Menu.img.onload = function () {
                let ctx = Menu.canvas.getContext("2d");
                Menu.original.text(
                    `Original size: ${Menu.img.width}px to ${Menu.img.height}px`
        );
                ctx.fillStyle = "#BABAB0";
                ctx.fillRect(0, 0, Menu.original_width, Menu.original_height);
                ctx.drawImage(
                    Menu.img,
                    0,
                    0,
                    Menu.original_width,
                    Menu.original_height
                );
                process();
            };
        };
        reader.readAsDataURL(file);
    }
});
let size_callback = function () {
    let width = Number(Menu.width.val());
    let height = Number(Menu.height.val());
    if ([!!width, !!height].includes(false)) {
        return -1;
    }
    function rationalize(width, height) {
        var fit_in = 100;
        if (fit_in >= width && fit_in >= height) {
            return [width, height];
        }
        var biggest = Math.max(width, height);
        var smallest = Math.min(width, height);
        if (biggest == width) {
            return [fit_in, (height / width) * fit_in];
        } else {
            return [(width / height) * fit_in, fit_in];
        }
    }
    var [nWidth, nHeight] = rationalize(width, height);
    Menu.canvas.width = width;
    Menu.canvas.height = height;
    Menu.canvas_display.width = nWidth;
    Menu.canvas_display.height = nHeight;
    Menu.original_width = width;
    Menu.original_height = height;
    /**
   * @type {CanvasRenderingContext2D}
   */
    let ctx = Menu.canvas.getContext("2d");
    ctx.fillStyle = "#BABAB0";
    ctx.fillRect(0, 0, Menu.original_width, Menu.original_height);
    ctx.drawImage(Menu.img, 0, 0, Menu.original_width, Menu.original_height);
    process();
};
Menu.width.on("change", size_callback);
Menu.height.on("change", size_callback);
Menu.width.val(100);
Menu.height.val(100);
setTimeout(size_callback, 1000);
let bababot = $(
    '<a target="_blank" href="https://github.com/bababoyy/bababot">Bababot</a>'
).css({
    display: "block",
    position: "absolute",
    width: "auto",
    bottom: "11px",
    right: "250px",
    color: "#ffffff",
    "text-shadow": "1px 1px 1px #000000",
    "font-size": "0.9em",
});
$("#menu").draggable();
$("#container").append(bababot);
let buttons = $("#menu-buttons");
let elem = $(
    '<a href="#" title="Bot Menu" class="grey margin-top-button"><img src="https://i.imgur.com/S5CHJJK.png" alt="icon"></a>'
);
elem.on("click", function () {
    html.fadeToggle("fast");
});
buttons.append(elem);

document.onpaste = function (event) {
    if (html.css("display") == "none") {
        return;
    }
    var items = (event.clipboardData || event.originalEvent.clipboardData).items;
    console.log(JSON.stringify(items)); // will give you the mime types
    for (let index in items) {
        var item = items[index];
        if (item.kind === "file") {
            var blob = item.getAsFile();
            let reader = new FileReader();
            reader.onload = function (event) {
                console.log("Breakpoint 2");
                Menu.img.src = String(reader.result);
                Menu.img.onload = function () {
                    console.log("Breakpoint 3");
                    let ctx = Menu.canvas.getContext("2d");
                    Menu.original.text(
                        `Original size: ${Menu.img.width}px to ${Menu.img.height}px`
          );
            ctx.fillStyle = "#BABAB0";
            ctx.fillRect(0, 0, Menu.original_width, Menu.original_height);
            ctx.drawImage(
                Menu.img,
                0,
                0,
                Menu.original_width,
                Menu.original_height
            );
            process();
        };
      }; // data url!
        reader.readAsDataURL(blob);
    }
  }
};
function extension_load() {
    if ($("#PЯДԐSЄЙҐДҪҪЦЯSЏSФDЇФ_select option").length != 0) return;
    $("#PЯДԐSЄЙҐДҪҪЦЯSЏSФDЇФ_select option").remove();
    for (let extension of window.extensions) {
        var option = $("<option>").html(extension[1]);
        Menu.extensions_list.append(option);
    }
}
setInterval(extension_load, 30_000);
setTimeout(extension_load, 5_000);
Menu.extension_run.on("click", function () {
    window.extensions.find((a) => a[1] == Menu.extensions_list.val())[0]();
});
Menu.dither_run.on("click", function () {
    localStorage.kernel = Menu.dither_list.val();
    size_callback();
});
Menu.dither_list.val(localStorage.kernel);
function createGraphWindow() {
    var ctx = window.open("", "", "width=550,height=450");
    var interval = undefined;
    ctx.onunload = function () {
        clearInterval(interval);
    };
    var canvas = $("<canvas>");
    var data = {
        labels: [],
        datasets: [
            {
                label: "Pixels per second botted by Bababot",
                backgroundColor: "rgba(255,99,132,0.2)",
                borderColor: "rgba(255,99,132,1)",
                borderWidth: 2,
                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                hoverBorderColor: "rgba(255,99,132,1)",
                data: [],
            },
        ],
    };

    var options = {
        maintainAspectRatio: false,
        scales: {
            y: {
                stacked: true,
                grid: {
                    display: true,
                    color: "rgba(255,99,132,0.2)",
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };
    var ctxj = $(ctx.document.body);
    ctxj.append(canvas);
    var chart = new Chart(canvas[0].getContext("2d"), {
        type: "line",
        options: options,
        data: data,
    });
    var pps = Number(counter);
    let i = 0;
    interval = setInterval(function () {
        var pps_ = Number(counter);
        var math_pps = Number(pps_ - pps);
        pps = pps_;
        if (math_pps < 0) {
            math_pps = 0;
        }
        chart.data.labels[i] = i;
        chart.data.datasets[0].data[i++] = math_pps;
        chart.update();
    }, 1000);
}

window.graph = createGraphWindow;
/**
 * @type {Window[]}
 */
var console_contexts = [];
function getSelectedColor() {
    return (
        $(
            Array.from($("#palette-buttons").children()).find(
                (x) => $(x).hasClass("selected") == true
            )
        ).attr("data-id") - 0
    );
}
window.getSelectedColor = getSelectedColor;
var dither = (function () {
    var i = 10;
    return function decrease() {
        i -= 1;
        if (i <= 0) {
            i = 10;
        }
        GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄFilterPixelsByCoordinate(i, 10);
        return i * 10;
    };
})();
$(document.body).on("keypress", function (x) {
    if (
        document.activeElement ==
        document.querySelector("#chat > form > input[type=text]")
    ) {
        return;
    }
    switch (x.key) {
        case "_":
            window.graph();
            break;
        case "%":
            // Dither set to:
            toastr.info(`${i18n.get('dither_set_to')}: ${dither()}%`);
            break;
        case "+":
            shouldShuffle = !shouldShuffle;
            if (shouldShuffle) {
                GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.onImageTaskReorganize = shuffle;
            } else {
                GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.onImageTaskReorganize = undefined;
            }
            // Should shuffle:
            toastr.info(`${i18n.get('shuffle')}: ${shouldShuffle}`);
            break;
        case "-":
            increaseBrush();
            // Brush size:
            toastr.info(`${i18n.get('brush')}: ${brush}`);
            break;
        case ";":
            changePaintMode();
            break;
        case "p":
            var [cx, cy] = $("#coordinates").text().split(",").map(Number);
            Menu.x.val(cx);
            Menu.y.val(cy);
            break;
    }
});
function putPixels(subpxArr) {
    var can = Menu.canvas;
    var ctx = can.getContext("2d"),
        imgd = ctx.createImageData(can.width, can.height);
    imgd.data.set(subpxArr);
    ctx.putImageData(imgd, 0, 0);
    Menu.canvas_display
        .getContext("2d")
        .drawImage(
        Menu.canvas,
        0,
        0,
        Menu.canvas.width,
        Menu.canvas.height,
        0,
        0,
        Menu.canvas_display.width,
        Menu.canvas_display.height
    );
}
var code = await (
    await fetch(
        "https://raw.githubusercontent.com/bababoyy/bababot/main/dither.js"
    )
).text();

var worker_iprocess;
function generateImageWorker() {
    worker_iprocess = createWorker(
        code +
        `
var pixelplace = [[255,255,255],[196,196,196],[136,136,136],[85,85,85],[34,34,34],[0,0,0],[0,102,0],[34,177,76],[2,190,1],[148,224,68],[251,255,91],[229,217,0],[230,190,12],[229,149,0],[160,106,66],[153,83,13],[99,60,31],[107,0,0],[159,0,0],[229,0,0],[187,79,0],[255,117,95],[255,196,159],[255,223,204],[255,167,209],[207,110,228],[236,8,236],[130,0,128],[2,7,99],[0,0,234],[4,75,255],[101,131,207],[54,186,255],[0,131,199],[0,211,221]]
const Colors = [{"code":"0","rgb":[255,255,255]},{"code":"1","rgb":[196,196,196]},{"code":"2","rgb":[136,136,136]},{"code":"3","rgb":[85,85,85]},{"code":"4","rgb":[34,34,34]},{"code":"5","rgb":[0,0,0]},{"code":"6","rgb":[0,102,0]},{"code":"7","rgb":[34,177,76]},{"code":"8","rgb":[2,190,1]},{"code":"10","rgb":[148,224,68]},{"code":"11","rgb":[251,255,91]},{"code":"12","rgb":[229,217,0]},{"code":"13","rgb":[230,190,12]},{"code":"14","rgb":[229,149,0]},{"code":"15","rgb":[160,106,66]},{"code":"16","rgb":[153,83,13]},{"code":"17","rgb":[99,60,31]},{"code":"18","rgb":[107,0,0]},{"code":"19","rgb":[159,0,0]},{"code":"20","rgb":[229,0,0]},{"code":"22","rgb":[187,79,0]},{"code":"23","rgb":[255,117,95]},{"code":"24","rgb":[255,196,159]},{"code":"25","rgb":[255,223,204]},{"code":"26","rgb":[255,167,209]},{"code":"27","rgb":[207,110,228]},{"code":"28","rgb":[236,8,236]},{"code":"29","rgb":[130,0,128]},{"code":"31","rgb":[2,7,99]},{"code":"32","rgb":[0,0,234]},{"code":"33","rgb":[4,75,255]},{"code":"34","rgb":[101,131,207]},{"code":"35","rgb":[54,186,255]},{"code":"36","rgb":[0,131,199]},{"code":"37","rgb":[0,211,221]}]
function generatePixif(img,width) {
    let output = "";
    for (let i = 0; i < img.length; i += 4) {
        if ((i / 4) % width === 0 && i != 0) {
            output += "\\n";
        }
        /**
     * @type {RGB}
     */
        const colorInfo = {
            r: img[i],
            g: img[i + 1],
            b: img[i + 2],
        };
        /**
     * @type {number}
     */
        let color;
        // #BABAB0 's red value is 186
        if (colorInfo.r == 186) {
            color = 64
        }
        for (let pixelColor of Colors) {
            if (pixelColor.rgb.join('') == [colorInfo.r,colorInfo.g,colorInfo.b].join('')) {
                color = pixelColor.code;
            }
        }
        if (color == undefined) {
            color = 64
        }
        output += String.fromCharCode("0".charCodeAt(0) + parseInt(color));
    }
    return output.split('\\n')
}
function lookThroughTransparentPixel(pixels) {
var transparent_index = []
for (let i = 0;i < pixels.length;i += 4) {
if (pixels[i] == 186 && pixels[i+1] == 186 && pixels[i+2] == 176) {
transparent_index.push(i)
}
}
return transparent_index
}
onmessage = function(i) {
	var palette = Array.from(pixelplace)
	var q = new RgbQuant({
    	colors: 40,
    	palette: palette,
    	reIndex: !0,
    	dithKern: i.data.kernel,
    	dithDelta: .05,
    	useCache: !1
	});


    console.log(i)
    var transparent_index = lookThroughTransparentPixel(i.data.img.data)
    console.time("Image load")
    q.sample(i.data.img.data);
    console.timeLog("Image load")
    var r = q.reduce(i.data.img.data)
    console.timeLog("Image load")
    for (let index of transparent_index) {
         r[index] = 186
         r[index+1] = 186
         r[index+2] = 176
    }
    var pixif = generatePixif(r,i.data.img.width)
    console.timeEnd("Image load")
    postMessage([r,pixif])
}`
    );
    worker_iprocess.onmessage = (pkg) => {
        var data = pkg.data;
        var i = Menu.canvas;
        var c = i.getContext("2d");
        putPixels(data[0]);
        Menu.pixif = data[1];
    };

}

function process() {
    var i = Menu.canvas;
    var c = i.getContext("2d");
    var data = c.getImageData(0, 0, Menu.original_width, Menu.original_height);
    generateImageWorker();
    worker_iprocess.postMessage({
        img: data,
        usetransparent: localStorage.usetransparent,
        kernel: localStorage.kernel,
    });
}
window.extensions = window.extensions || [];
var amogus = `______
__..._
_..**_
_...._
__..._
__._._
______`.split("\n");

function filter(tasks) {
    return tasks.filter(
        (x) => x.color != SҬФPӺЦҪҜЇЙGШЇГЊԠЭ.BBY_get_pixel(x.x, x.y) && x.color != -1
    );
}

extensions.push([
    () =>
    (GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.onTaskAction = function (task) {
        if (task == undefined) return;
        let chunkCoord = [
            Math.floor(task.x / amogus[0].length) * amogus[0].length,
            Math.floor(task.y / amogus.length) * amogus.length,
        ];
        let amogusCoord = [task.x - chunkCoord[0], task.y - chunkCoord[1]];
        let ascii = amogus[amogusCoord[1]][amogusCoord[0]];
        if (ascii == "_") {
            return false;
        } else if (ascii == ".") {
            task.color = getSelectedColor();
        } else if (ascii == "*") {
            task.color = 0;
        } else {
            toastr.error("unexpected pixel");
        }
        return true;
    }),
    "amogus",
]);

extensions.push([
    () =>
    (GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.onTaskAction = function (task) {
        if (task == undefined) return;
        task.color = parseInt(["35", "26", "0", "26", "35"][task.y % 5]);
        return true;
    }),
    "trans",
]);

extensions.push([
    () =>
    (GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.onTaskAction = function (task) {
        if (task == undefined) return;
        task.color = parseInt(["20", "14", "12", "8", "33", "29"][task.y % 6]);
        return true;
    }),
    "lgbt",
]);

extensions.push([
    () =>
    (GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.onTaskAction = function (task) {
        if (task == undefined) return;
        task.color = parseInt(["27", "26", "0", "37", "0", "26"][task.y % 6]);
        return true;
    }),
    "femboy",
]);

extensions.push([
    function () {
        var rectsize = 2;
        window.rectsize = rectsize;
        function ontask(task) {
            return (
                task != undefined &&
                (task.y % (rectsize + 1) == 0 || task.x % (rectsize + 1) >= rectsize)
            );
        }
        GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.onTaskAction = ontask;
        GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.onImageTaskReorganize = function (tasks) {
            return tasks.filter(ontask);
        };
    },
    "┼ styled pixelating",
]);
extensions.push([
    function () {
        /**
     * Shuffles array in place.
     * @param {Array} a items An array containing the items.
     */
        function shuffle(a) {
            var j, x, i;
            for (i = a.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                x = a[i];
                a[i] = a[j];
                a[j] = x;
            }
            return a;
        }
        GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.onImageTaskReorganize = function (tasks) {
            tasks = shuffle(tasks);
            tasks = filter(tasks);
            // change pixelradius from localstorage or keep it as 5
            var pixelRadius = localStorage.pixelradius - 0 || 5;
            var newTasks = Array.from(tasks);
            var pixels = [];
            var stucknum = 0;
            while (newTasks.length != 0) {
                var found_a_match = false;
                var task = newTasks.shift();
                if (pixels.length == 0) {
                    pixels.push(task);
                    found_a_match = true;
                } else if (stucknum > newTasks.length) {
                    pixels = [...pixels, task];
                    found_a_match = true;
                } else {
                    for (let pixel of pixels) {
                        if (
                            (task.x - pixel.x) ** 2 + (task.y - pixel.y) ** 2 <=
                            pixelRadius ** 2
                        ) {
                            pixels.push(task);
                            found_a_match = true;
                            break;
                        }
                    }
                }
                if (!found_a_match) {
                    newTasks.push(task);
                    stucknum++;
                } else {
                    stucknum = 0;
                }
            }
            return pixels;
        };
    },
    "circledotting",
]);
extensions.push([
    function () {
        function coordinate(x, y, ox, oy) {
            return [Math.abs(x - ox), Math.abs(y - oy)];
        }
        GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.onImageTaskReorganize = function (tasks, width, height, cx, cy) {
            var [originX, originY] = [
                Math.floor(width / 2) + cx,
                Math.floor(height / 2) + cy,
            ];
            tasks.sort(
                (pixel1, pixel2) =>
                Math.hypot(pixel1.x - originX, pixel1.y - originY) -
                Math.hypot(pixel2.x - originX, pixel2.y - originY)
            );
            return tasks;
        };
    },
    "circlefilling",
]);

extensions.push([
    function () {
        var colors = Array.from(document.querySelector("#palette-buttons").children)
        .filter((x) => x.className != "disabled")
        .map((x) => parseInt(x.getAttribute("data-id")));
        function ontask(task) {
            return task;
        }
        GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.onTaskAction = function (task) {
            if (task == undefined) return;
            task.color = colors[Math.floor(Math.random() * colors.length)];
            return true;
        };
        GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.onImageTaskReorganize = function (tasks) {
            if (!tasks || tasks.length == 0) {
                return [];
            }
            return tasks.map(function (task) {
                if (task == undefined) return;
                task.color = colors[Math.floor(Math.random() * colors.length)];
                return task;
            });
        };
    },
    "war",
]);

extensions.push([
    function () {
        var colors = Array.from(document.querySelector("#palette-buttons").children)
        .filter((x) => x.className != "disabled")
        .map((x) => parseInt(x.getAttribute("data-id")));
        function ontask(task) {
            return task;
        }
        GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.onTaskAction = function (task) {
            if (task == undefined) return;
            task.color = colors[Math.floor(Math.random() * colors.length)];
            return true;
        };
        GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.onImageTaskReorganize = function (tasks) {
            if (!tasks || tasks.length == 0) {
                return [];
            }
            return tasks.map(function (task) {
                if (task == undefined) return;
                task.color = colors[Math.floor(Math.random() * colors.length)];
                task.x = tasks[0].x;
                task.y = tasks[0].y;
                return task;
            });
        };
    },
    "war in one pixel",
]);

extensions.push([
    function () {
        GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.onTaskAction = () => true;
        GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.onImageTaskReorganize = undefined;
    },
    "Normalize Tasker events",
]);

extensions.push([
    function () {
        function getCoordinate() {
            let raw = $("#coordinates").text();
            let arr = raw.split(",").map((x) => parseInt(x.replace(",", "")));
            return arr;
        }
        let start_coordinate, end_coordinate;
        var code;
        interact("#canvas").on("click", function () {
            if (start_coordinate) {
                end_coordinate = getCoordinate();
                let color = getSelectedColor();
                if (!color && color != 0) {
                    return -1;
                }
                for (let y = start_coordinate[1]; y <= end_coordinate[1]; y++) {
                    for (let x = start_coordinate[0]; x <= end_coordinate[0]; x++) {
                        let mvpModeX = (function () {
                            if ((y - start_coordinate[1]) % 2 == 0) {
                                return x;
                            } else {
                                return end_coordinate[0] - x + start_coordinate[0];
                            }
                        })();
                        const canvas_color = SҬФPӺЦҪҜЇЙGШЇГЊԠЭ.BBY_get_pixel(mvpModeX, y);
                        if (canvas_color == color || canvas_color == -1) {
                            continue;
                        }
                        GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.addTask({
                            // @TODO Tasker
                            x: mvpModeX,
                            y: y,
                            color: color,
                        });
                    }
                }
                if (GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.onImageTaskReorganize) {
                    GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ._tasks = GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ.onImageTaskReorganize(
                        GФҐФЊЭLLJҪԠSДЍDФЩԠЇИҪЄ._tasks,
                        end_coordinate[0] - start_coordinate[0],
                        end_coordinate[1] - start_coordinate[1],
                        ...start_coordinate
                    );
                }
                start_coordinate = undefined;
            } else {
                start_coordinate = getCoordinate();
            }
            interact("a[data-id='painting']").on("load", function () {
                $("a[data-id='painting']").css("display", "block");
            });
        });
    },
    "fill",
]);

extensions.push([
    function () {
        var timeout = prompt(
            "Your timeout is " +
            localStorage.timeout +
            " at the moment. Set timeout to (ms):"
        );
        if (isNaN(timeout)) {
            return;
        }
        localStorage.timeout = parseInt(timeout);
    },
    "Set timeout",
]);

extensions.push([
    function () {
        var name = prompt("Go to user:");
        $($('.messages div a[class="user open-profile"]')[0])
            .attr("data-profile", name)
            .attr("data-id", name)
            .click();
    },
    "Go to user profile",
]);