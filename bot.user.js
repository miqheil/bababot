/** @format */

// ==UserScript==
// @name         Bababot.js
// @namespace    https://github.com/bababoyy
// @version      v3.3fix
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
// @require      https://cdnjs.cloudflare.com/ajax/libs/chroma-js/2.1.2/chroma.min.js
// @require      https://pixelplace.io/js/jquery-ui.min.js?v2=1
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require      https://raw.githubusercontent.com/turuslan/HackTimer/master/HackTimer.min.js
// @run-at       document-start
// @grant        none
// ==/UserScript==

var origOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(_,url) {
    arguments[1] = arguments[1].replace(/https:\/\/web.archive.org\/web\/\d+\//,'')
    origOpen.apply(this, arguments);
};
function addCss(cssCode) {
  var styleElement = document.createElement("style");
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = cssCode;
  } else {
    styleElement.appendChild(document.createTextNode(cssCode));
  }
  document.getElementsByTagName("head")[0].appendChild(styleElement);
}
/**
 * @param {string} url
 */
async function $import(url) {
  let css = await fetch(url).then((x) => x.text());
  addCss(css);
}

/**
 * @param {string} url
 */
async function $require(url) {
  let js = await fetch(url).then((x) => x.text());
  Function(js)();
}

let uBababot = {
  cImport: $import,
  jRequire: $require,
};

$('#loader-canvas, .pixel-lottery-btn').remove()
const Event = class {
  constructor(script, target) {
    this.script = script;
    this.target = target;

    this._cancel = false;
    this._replace = null;
    this._stop = false;
  }

  preventDefault() {
    this._cancel = true;
  }
  stopPropagation() {
    this._stop = true;
  }
  replacePayload(payload) {
    this._replace = payload;
  }
};

let callbacks = [];
window.addBeforeScriptExecuteListener = (f) => {
  if (typeof f !== "function") {
    throw new Error("Event handler must be a function.");
  }
  callbacks.push(f);
};
window.removeBeforeScriptExecuteListener = (f) => {
  let i = callbacks.length;
  while (i--) {
    if (callbacks[i] === f) {
      callbacks.splice(i, 1);
    }
  }
};

const dispatch = (script, target) => {
  if (script.tagName !== "SCRIPT") {
    return;
  }

  const e = new Event(script, target);

  if (typeof window.onbeforescriptexecute === "function") {
    try {
      window.onbeforescriptexecute(e);
    } catch (err) {
      console.error(err);
    }
  }

  for (const func of callbacks) {
    if (e._stop) {
      break;
    }
    try {
      func(e);
    } catch (err) {
      console.error(err);
    }
  }

  if (e._cancel) {
    script.textContent = "";
    script.remove();
  } else if (typeof e._replace === "string") {
    script.textContent = e._replace;
  }
};
const observer = new MutationObserver((mutations) => {
  for (const m of mutations) {
    for (const n of m.addedNodes) {
      dispatch(n, m.target);
    }
  }
});
observer.observe(document, {
  childList: true,
  subtree: true,
});
// This function uses allorigins.win which is a CORS proxy.
// It allows javascript to fetch through all URLs.
async function loadOldPixelplace() {
    var url = encodeURIComponent('https://web.archive.org/web/20220220044849if_/https://pixelplace.io/js/script.min.js?v3=7025')
    var code = await (await fetch(
        `https://api.allorigins.win/get?url=${url}`
                                 )).json()

    eval(code.contents)
}
window.onbeforescriptexecute = (e) => {
  console.log(e);
  // Prevent execution of a script
  if (e.script.innerText != '' && e.script.getAttribute('apology') != 'I as Owmince apologise to Bababoy for blocking his code') {
      e.preventDefault()
      e.script.remove()
  }
  if (
    e.script.outerHTML.indexOf("script.min.js") != -1 &&
    e.script.outerHTML.indexOf("web.archive.org") == -1
  ) {
    e.preventDefault();
    e.script.remove();
    loadOldPixelplace()
  }
};
var BotScopeUUID = crypto.randomUUID();
console.log("Bababot uuid:", BotScopeUUID);

    window.VALIDATE_CAPTCHA = null;
    window.onloadCallback = function () {
        setTimeout(function () {
            //Timeout because it mess with alert boxes on load..
            grecaptcha.render('recaptcha', {
                'sitekey': '6LcZpc8UAAAAAHHJCAYkiNoWaVCgafT_Juzbcsnr'
            });
        }, 1000);

    };
Function.prototype.clone = function () {
  var that = this;
  var temp = function temporary() {
    return that.apply(this, arguments);
  };
  for (var key in this) {
    if (this.hasOwnProperty(key)) {
      temp[key] = this[key];
    }
  }
  return temp;
};

var _i18n = {
  welcome: {
    tr: "Bababot'a hoşgeldin. Bababot GPLv3 ile lisanslıdır. Bababoy tarafından yapıldı",
    en: "Welcome to Bababot. Bababot is licensed under GPLv3. Made by Bababoy",
  },
  ui_places_as_ui: {
    tr: "UI normal çizer",
    en: "UI places as UI",
  },
  ui_places_as_tasker: {
    tr: "UI Tasker olarak çizer",
    en: "UI places as Tasker",
  },
  inform: {
    tr: "Bababot.js yüklendi. Bababoy tarafından yapıldı. %100 türk malıdır.",
    en: "Bababot.js loaded. Made by Bababoy",
  },
  no_ws_found: {
    tr: "Bababot websocket bulamadı. F5 atılıyor.",
    en: "Bababot could not find Websocket. Refreshing.",
  },
  image_botting: {
    tr: "Resim botlaması",
    en: "Image botting",
  },
  image_file: {
    tr: "Resim dosyası",
    en: "Image file",
  },
  width: {
    tr: "Genişlik",
    en: "Width",
  },
  start: {
    tr: "Botu başlat",
    en: "Ѕtart botting",
  },
  stop: {
    tr: "Botu durdur",
    en: "Stop botting",
  },
  other: {
    tr: "Diğer ayarlar",
    en: "Other settings",
  },
  exts: {
    tr: "Eklentiler",
    en: "Extensions",
  },
  select: {
    tr: "Eklenti seç",
    en: "Select extension",
  },
  run: {
    tr: "Eklentiyi çalıştır",
    en: "Run extension",
  },
  dither_modes: {
    tr: "Resim uyarlama modları",
    en: "Dithering modes",
  },
  select_dither: {
    tr: "Resim uyarlama modu seç",
    en: "Select dithering mode",
  },
  run_dither: {
    tr: "Uyarlama modunu uygula",
    en: "Run dithering mode",
  },
  no_image: {
    tr: "Resim ayarlanmamış.",
    en: "Image not loaded",
  },
  no_coords: {
    tr: "Koordinatlar yanlış veya eksik girilmiş.",
    en: "Coordinates not specified or specified wrong",
  },
  dither_set_to: {
    tr: "Piksel yerleştirme yüzdesi:",
    en: "Dither set to:",
  },
  shuffle: {
    tr: "Pikseller karıştırılıyor:",
    en: "Should shuffle",
  },
  brush: {
    tr: "Fırça boyutu:",
    en: "Brush size:",
  },
};

// determine if user is turkish or not
function isTurkish() {
  return window.navigator.language.includes("tr");
}
var mode = isTurkish() ? "tr" : "en";
var i18n = {
  get: function (key) {
    return _i18n[key][mode];
  },
};
var BababotScope = {};
const palette = {
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

/**
 * @param {number} x
 * @param {number} y
 * @param {number} sizeX
 * @param {number} sizeY
 * @returns {Uint8ClampedArray}
 */
function getPixelArray(x, y, sizeX, sizeY) {
  /**
   * @type {CanvasRenderingContext2D}
   */
  let ctx = canvas.getContext("2d");
  return ctx.getImageData(x, y, sizeX, sizeY).data;
}

/**
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {number}
 */
function resolveRGB(r, g, b) {
  let hexStr =
    "#" +
    ("000000" + ((r << 16) | (g << 8) | b).toString(16))
      .slice(-6)
      .toUpperCase(); /*thx stackoverflow*/
  return palette.colors.findIndex(function (elem) {
    return elem.toUpperCase() === hexStr;
  });
}

/**
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */
function getPixel(x, y) {
  const imgData = getPixelArray(x, y, 1, 1);
  const r = imgData[0];
  const g = imgData[1];
  const b = imgData[2];
  return resolveRGB(r, g, b);
}
Object.defineProperty(window, "WebSocket", {
  value: class extends WebSocket {
    $callbacks = {};
    trusted_code = undefined;
    constructor(url, header) {
      super(url, header);
      this.BBY_on_message_send = function () {
        return true;
      };
      let original = this.send;
      this.send = (...args) => {
        if (!this.BBY_on_message_send(...args)) {
          return;
        }
        return original.apply(this, args);
      };
      this.addEventListener("message", (message) => {
        if (message.data.indexOf("42") == -1) {
          return;
        }
        let json = JSON.parse(message.data.replace("42", ""));
        let code = json[0];
        let content = json[1];
        if (this.$callbacks[code]) {
          for (const callback of this.$callbacks[code]) {
            callback(content);
          }
        }
      });
      Object.defineProperty(BababotScope, "BababotWS", {
        value: this,
      });
    }
    BBY_on(code, callback) {
      this.$callbacks[code] = this.$callbacks[code] || [];
      this.$callbacks[code].push(callback);
    }
    BBY_emit(msg, props) {
      if (this.readyState != this.OPEN) {
        return;
      }
      this.trusted_code = `42${JSON.stringify([msg, props])}`;
      this.send(this.trusted_code);
    }
    BBY_put_pixel(x, y, color) {
      this.BBY_emit("p", [x, y, color, 1]);
    }
    BBY_get_pixel(x, y) {
      return getPixel(x, y);
    }
    BBY_send_chat(msg, full) {
      let packet = {
        text: msg,
        mention: "",
        type: "global",
        target: "",
        color: 11,
      };

      packet = { ...packet, ...full };

      this.BBY_emit("chat.message", packet);
    }
  },

  writable: false,
});
if (localStorage.firstTime == undefined) {
  localStorage.firstTime = true;
  toastr.warning(
    // "Welcome to Bababot. Bababot is licensed under GPLv3. Made by Bababoy#1524"
    i18n.get("welcome"),
    { timeOut: 9500 }
  );
}
localStorage.timeout = localStorage.timeout || 40;
BababotScope.extensions = BababotScope.extensions || [];

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

class TaskerFactory {
  static EMPTY_FUNCTION = () => true;
  static PREVENT_DEFAULT = false;
  constructor() {
    this._tasks = [];
    this.onImageTaskReorganize = undefined;
    this._i = 0x0;
    this.onTaskAction = TaskerFactory.EMPTY_FUNCTION;
    this.onShuffleGranted = TaskerFactory.EMPTY_FUNCTION;
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
let Tasker = new TaskerFactory();
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
BababotScope.intervalCode = intervalCode;
function restartTasker() {
  clearInterval(intervalCode);
  intervalCode = setInterval(function () {
    let task = Tasker.getTask();
    if (task == undefined) {
      Tasker.onTaskAction(undefined);
      if (Tasker._i != 0) {
        Tasker.destroy();
      }
      return;
    }
    while (
      Tasker.onTaskAction(task) == TaskerFactory.PREVENT_DEFAULT ||
      BababotScope.BababotWS.BBY_get_pixel(task.x, task.y) == task.color
    ) {
      task = Tasker.getTask();
      Tasker.on_task && Tasker.on_task(task);
      if (task == undefined) {
        if (Tasker._i != 0) {
          Tasker.destroy();
        }
        return;
      }
    }
    if (task.mode == undefined) {
      BababotScope.BababotWS.BBY_put_pixel(task.x, task.y, task.color);
      counter++;
    } else {
      BababotScope.BababotWS.BBY_emit("p", [
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
BababotScope.restartTasker = restartTasker;

function killTasker() {
  clearInterval(intervalCode);
  intervalCode = undefined;
}
BababotScope.killTasker = killTasker;
restartTasker();
/*
Take the possibility as:
a
- == a/b
b
*/
BababotScope.multiBotDitherMode = true;
function TaskerFilterPixelsByCoordinate(a, b) {
  Tasker.onTaskAction = function (task) {
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
    toastr.info(i18n.get("ui_places_as_ui"));
    restartTasker();
    BababotScope.BababotWS.BBY_on_message_send = function () {
      return true;
    };
  } else if (paintmode == 1) {
    // "UI places as Tasker"
    toastr.info(i18n.get("ui_places_as_tasker"));
    UiPlacesAsTasker();
  } else if (paintmode == 2) {
    toastr.info("UI places Tasker's tasks");
    UiPlacesTaskerTasks();
  }
  paintmode++;
  if (paintmode > 2) {
    paintmode = 0;
  }
}
function UiPlacesAsTasker() {
  restartTasker();
  BababotScope.BababotWS.BBY_on_message_send = function (msg) {
    if (msg == BababotScope.BababotWS.trusted_code) return true;
    if (msg.indexOf("42") == -1) return true;
    let [key, val] = JSON.parse(msg.replace("42", ""));
    if (key == "p") {
      for (let i = 0; i < brush; i++) {
        for (let j = 0; j < brush; j++) {
          Tasker.addTask({ x: val[0] + i, y: val[1] + j, color: val[2] });
        }
      }
      return false;
    }
    return true;
  };
}
BababotScope.UiPlacesAsTasker = UiPlacesAsTasker;

function UiPlacesTaskerTasks() {
  killTasker();
  BababotScope.BababotWS.BBY_on_message_send = function (msg) {
    if (msg == BababotScope.BababotWS.trusted_code) return true;
    if (msg.indexOf("42") == -1) return true;
    let [key, val] = JSON.parse(msg.replace("42", ""));
    if (key == "p") {
      for (let i = 0; i < brush; i++) {
        for (let j = 0; j < brush; j++) {
          let task = Tasker._tasks.find(
            (a) => a.x == val[0] + i && a.y == val[1] + j
          );
          if (task) {
            BababotScope.BababotWS.BBY_put_pixel(task.x, task.y, task.color);
            counter++;
            let index = Tasker._tasks.indexOf(task);
            Tasker._tasks.splice(index, 1);
          }
          return false;
        }
      }
    }
    return true;
  };
}
BababotScope.UiPlacesTaskerTasks = UiPlacesTaskerTasks;
BababotScope.TaskerFilterPixelsByCoordinate = TaskerFilterPixelsByCoordinate;
// "Bababot.js loaded. Made by Bababoy"
console.log("%c", i18n.get("inform"), "font-family: system-ui");
var call = function (info) {
  var bio = document.querySelector(
    "#profile > div > div > div:nth-child(2) > div.text-center.bio > span"
  ).innerText;
  console.debug(bio);
  const regex = /img:(\d+$)/;
  var match = bio.match(regex);
  if (match) {
    var canvId = match[1];
    document.querySelector(
      "#profile > div > div > div:nth-child(2) > div.user-avatar > img"
    ).src = `https://pixelplace.io/canvas/${canvId}.png`;
  }
};
var a = new MutationObserver(call);
setTimeout(function () {
  a.observe(
    document.querySelector(
      "#profile > div > div > div:nth-child(2) > div.profile-name"
    ),
    { attributes: true }
  );
}, 2000);
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
var html = $(`<div id="menu" style="display: none;">
<div class="people-using-this-bot-hate-your-ban-owmince">
<div class="gradient_slider"></div>

<fieldset>
<legend>${i18n.get("image_botting")}</legend>
<canvas id="${BotScopeUUID}_canvas" width="100" height="100"></canvas>
<div>
<input id="${BotScopeUUID}_width" type="number" class="numinput along" placeholder="${i18n.get(
  "width"
)}" /><input id="${BotScopeUUID}_height"
type="number"
placeholder="Height"
class="numinput along"
/>
</div>
<label for="${BotScopeUUID}_file" class="numinput along text"
>${i18n.get("image_file")}</label
><input type="file" id="${BotScopeUUID}_file" style="display: none" />
<div class="smalltext" id="${BotScopeUUID}_original"></div>
<div>
<input id="${BotScopeUUID}_x" type="number" class="numinput along" placeholder="X" /><br /><input
                                                                          id="${BotScopeUUID}_y"
type="number"
class="numinput along"
placeholder="Y"
/>
</div>
<button class="numinput butbigger along text" id="${BotScopeUUID}_start">${i18n.get(
  "start"
)}</button><br /><button
                                                                                 id="${BotScopeUUID}_stop"
class="numinput butbigger along text"
>
${i18n.get("stop")}
</button>
</fieldset>

<fieldset>
<legend>${i18n.get("other")}</legend>
<div class="smalltext">${i18n.get("exts")}</div>

<div class="smalltext">${i18n.get("select")}</div>
<div class="select">
<select id="${BotScopeUUID}_select">
</select>
<div class="select_arrow"></div>
</div>
<div class="numinput along text" id="${BotScopeUUID}_run">${i18n.get(
  "run"
)}</div>

<div class="smalltext">${i18n.get("dither_modes")}</div>

<div class="smalltext">${i18n.get("select_dither")}</div>
<div class="select">
<select id="${BotScopeUUID}_dither">
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
<div class="numinput along text" id="${BotScopeUUID}_dither_run">${i18n.get(
  "run_dither"
)}</div>
</fieldset>
</div>
</div>`);
$(document.body).append(html);
const Menu = {
  canvas: document.createElement("canvas"),
  canvas_display: document.getElementById(`${BotScopeUUID}_canvas`),
  x: $(`#${BotScopeUUID}_x`),
  y: $(`#${BotScopeUUID}_y`),
  width: $(`#${BotScopeUUID}_width`),
  height: $(`#${BotScopeUUID}_height`),
  file: $(`#${BotScopeUUID}_file`),
  start: $(`#${BotScopeUUID}_start`),
  stop: $(`#${BotScopeUUID}_stop`),
  extensions_list: $(`#${BotScopeUUID}_select`),
  extension_run: $(`#${BotScopeUUID}_run`),
  dither_list: $(`#${BotScopeUUID}_dither`),
  dither_run: $(`#${BotScopeUUID}_dither_run`),
  original: $(`#${BotScopeUUID}_original`),
  img: new Image(),
  pixif: undefined,
  state: false,
  rds: undefined,
  intervalCode: undefined,
};
BababotScope.Menu = Menu;
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
    ${localStorage.usetransparent == "true" ? "continue" : "color = 1"};
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
    tasks.forEach((task) => Tasker.addTask(task));
    if (Tasker.onImageTaskReorganize) {
      Tasker._tasks = Tasker.onImageTaskReorganize(Tasker._tasks, [
        image[0].length,
        image.length,
      ]);
    }
    Tasker.onTaskAction = function (task) {
      if (task == undefined) {
        tasks.forEach((task) => Tasker.addTask(task));
      }
    };
    delete worker_tasks;
  };
  if (Tasker._i != 0) {
    return;
  }
  worker_tasks.postMessage({ coords: coords, image: image });
}
Menu.start.on("click", function () {
  if (Menu.pixif == undefined) {
    // Image not loaded
    toastr.error(i18n.get("no_image"));
    return;
  }
  Menu.state = false;
  if ([!Menu.y.val(), !Menu.x.val()].indexOf(true) != -1) {
    // Coordinates not specified or specified wrong
    toastr.error(i18n.get("no_coords"));
    return;
  }
  Menu.coords = [Menu.x.val(), Menu.y.val()].map(Number);
  drawImage(Menu.coords, Menu.pixif);
  if (intervalCode == undefined) {
    var context = canvas.getContext("2d");
    var children = $("#palette-buttons").children();
    for (let task of Tasker._tasks) {
      var color = chroma(children[task.color].title + "7F").css();
      context.fillStyle = color;
      context.fillRect(task.x, task.y, 1, 1);
    }
  }
});
Menu.stop.on("click", function () {
  Tasker.onTaskAction = () => true;
  Tasker.destroy();
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
  if ($(`#${BotScopeUUID}_select option`).length != 0) return;
  $(`#${BotScopeUUID}_select option`).remove();
  for (let extension of BababotScope.extensions) {
    var option = $("<option>").html(extension[1]);
    Menu.extensions_list.append(option);
  }
}
setInterval(extension_load, 30_000);
setTimeout(extension_load, 5_000);
Menu.extension_run.on("click", function () {
  BababotScope.extensions.find((a) => a[1] == Menu.extensions_list.val())[0]();
});
Menu.dither_run.on("click", function () {
  localStorage.kernel = Menu.dither_list.val();
  size_callback();
});
Menu.dither_list.val(localStorage.kernel);
function createGraphWindow() {
  var ctx = BababotScope.open("", "", "width=550,height=450");
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

BababotScope.graph = createGraphWindow;
function getSelectedColor() {
  return (
    $(
      Array.from($("#palette-buttons").children()).find(
        (x) => $(x).hasClass("selected") == true
      )
    ).attr("data-id") - 0
  );
}
BababotScope.getSelectedColor = getSelectedColor;
var dither = (function () {
  var i = 10;
  return function decrease() {
    i -= 1;
    if (i <= 0) {
      i = 10;
    }
    TaskerFilterPixelsByCoordinate(i, 10);
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
      BababotScope.graph();
      break;
    case "%":
      // Dither set to:
      toastr.info(`${i18n.get("dither_set_to")}: ${dither()}%`);
      break;
    case "+":
      shouldShuffle = !shouldShuffle;
      if (shouldShuffle) {
        Tasker.onImageTaskReorganize = shuffle;
      } else {
        Tasker.onImageTaskReorganize = undefined;
      }
      // Should shuffle:
      toastr.info(`${i18n.get("shuffle")}: ${shouldShuffle}`);
      break;
    case "-":
      increaseBrush();
      // Brush size:
      toastr.info(`${i18n.get("brush")}: ${brush}`);
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
      var pixelplace = [
        [255, 255, 255],
        [196, 196, 196],
        [136, 136, 136],
        [85, 85, 85],
        [34, 34, 34],
        [0, 0, 0],
        [0, 102, 0],
        [34, 177, 76],
        [2, 190, 1],
        [148, 224, 68],
        [251, 255, 91],
        [229, 217, 0],
        [230, 190, 12],
        [229, 149, 0],
        [160, 106, 66],
        [153, 83, 13],
        [99, 60, 31],
        [107, 0, 0],
        [159, 0, 0],
        [229, 0, 0],
        [187, 79, 0],
        [255, 117, 95],
        [255, 196, 159],
        [255, 223, 204],
        [255, 167, 209],
        [207, 110, 228],
        [236, 8, 236],
        [130, 0, 128],
        [2, 7, 99],
        [0, 0, 234],
        [4, 75, 255],
        [101, 131, 207],
        [54, 186, 255],
        [0, 131, 199],
        [0, 211, 221],
      ];
      const Colors = [
        { code: "0", rgb: [255, 255, 255] },
        { code: "1", rgb: [196, 196, 196] },
        { code: "2", rgb: [136, 136, 136] },
        { code: "3", rgb: [85, 85, 85] },
        { code: "4", rgb: [34, 34, 34] },
        { code: "5", rgb: [0, 0, 0] },
        { code: "6", rgb: [0, 102, 0] },
        { code: "7", rgb: [34, 177, 76] },
        { code: "8", rgb: [2, 190, 1] },
        { code: "10", rgb: [148, 224, 68] },
        { code: "11", rgb: [251, 255, 91] },
        { code: "12", rgb: [229, 217, 0] },
        { code: "13", rgb: [230, 190, 12] },
        { code: "14", rgb: [229, 149, 0] },
        { code: "15", rgb: [160, 106, 66] },
        { code: "16", rgb: [153, 83, 13] },
        { code: "17", rgb: [99, 60, 31] },
        { code: "18", rgb: [107, 0, 0] },
        { code: "19", rgb: [159, 0, 0] },
        { code: "20", rgb: [229, 0, 0] },
        { code: "22", rgb: [187, 79, 0] },
        { code: "23", rgb: [255, 117, 95] },
        { code: "24", rgb: [255, 196, 159] },
        { code: "25", rgb: [255, 223, 204] },
        { code: "26", rgb: [255, 167, 209] },
        { code: "27", rgb: [207, 110, 228] },
        { code: "28", rgb: [236, 8, 236] },
        { code: "29", rgb: [130, 0, 128] },
        { code: "31", rgb: [2, 7, 99] },
        { code: "32", rgb: [0, 0, 234] },
        { code: "33", rgb: [4, 75, 255] },
        { code: "34", rgb: [101, 131, 207] },
        { code: "35", rgb: [54, 186, 255] },
        { code: "36", rgb: [0, 131, 199] },
        { code: "37", rgb: [0, 211, 221] },
      ];
      function generatePixif(img, width) {
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
            color = 64;
          }
          for (let pixelColor of Colors) {
            if (
              pixelColor.rgb.join("") ==
              [colorInfo.r, colorInfo.g, colorInfo.b].join("")
            ) {
              color = pixelColor.code;
            }
          }
          if (color == undefined) {
            color = 64;
          }
          output += String.fromCharCode("0".charCodeAt(0) + parseInt(color));
        }
        return output.split("\\n");
      }
      function lookThroughTransparentPixel(pixels) {
        var transparent_index = [];
        for (let i = 0; i < pixels.length; i += 4) {
          if (pixels[i] == 186 && pixels[i + 1] == 186 && pixels[i + 2] == 176) {
            transparent_index.push(i);
          }
        }
        return transparent_index;
      }
      onmessage = function (i) {
        var palette = Array.from(pixelplace);
        var q = new RgbQuant({
          colors: 40,
          palette: palette,
          reIndex: !0,
          dithKern: i.data.kernel,
          dithDelta: 0.05,
          useCache: !1,
        });

        console.log(i);
        var transparent_index = lookThroughTransparentPixel(i.data.img.data);
        console.time("Image load");
        q.sample(i.data.img.data);
        console.timeLog("Image load");
        var r = q.reduce(i.data.img.data);
        console.timeLog("Image load");
        for (let index of transparent_index) {
          r[index] = 186;
          r[index + 1] = 186;
          r[index + 2] = 176;
        }
        var pixif = generatePixif(r, i.data.img.width);
        console.timeEnd("Image load");
        postMessage([r, pixif]);
      };`
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
BababotScope.extensions = BababotScope.extensions || [];
var amogus = `______
__..._
_..**_
_...._
__..._
__._._
______`.split("\n");

function filter(tasks) {
  return tasks.filter(
    (x) =>
      x.color != BababotScope.BababotWS.BBY_get_pixel(x.x, x.y) && x.color != -1
  );
}

BababotScope.extensions.push([
  () =>
    (Tasker.onTaskAction = function (task) {
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

BababotScope.extensions.push([
  () =>
    (Tasker.onTaskAction = function (task) {
      if (task == undefined) return;
      task.color = parseInt(["35", "26", "0", "26", "35"][task.y % 5]);
      return true;
    }),
  "trans",
]);

BababotScope.extensions.push([
  () =>
    (Tasker.onTaskAction = function (task) {
      if (task == undefined) return;
      task.color = parseInt(["20", "14", "12", "8", "33", "29"][task.y % 6]);
      return true;
    }),
  "lgbt",
]);

BababotScope.extensions.push([
  () =>
    (Tasker.onTaskAction = function (task) {
      if (task == undefined) return;
      task.color = parseInt(["27", "26", "0", "37", "0", "26"][task.y % 6]);
      return true;
    }),
  "femboy",
]);

BababotScope.extensions.push([
  function () {
    var rectsize = 2;
    BababotScope.rectsize = rectsize;
    function ontask(task) {
      return (
        task != undefined &&
        (task.y % (rectsize + 1) == 0 || task.x % (rectsize + 1) >= rectsize)
      );
    }
    Tasker.onTaskAction = ontask;
    Tasker.onImageTaskReorganize = function (tasks) {
      return tasks.filter(ontask);
    };
  },
  "┼ styled pixelating",
]);
BababotScope.extensions.push([
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
    Tasker.onImageTaskReorganize = function (tasks) {
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
BababotScope.extensions.push([
  function () {
    function coordinate(x, y, ox, oy) {
      return [Math.abs(x - ox), Math.abs(y - oy)];
    }
    Tasker.onImageTaskReorganize = function (tasks, width, height, cx, cy) {
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

BababotScope.extensions.push([
  function () {
    var colors = Array.from(document.querySelector("#palette-buttons").children)
      .filter((x) => x.className != "disabled")
      .map((x) => parseInt(x.getAttribute("data-id")));
    function ontask(task) {
      return task;
    }
    Tasker.onTaskAction = function (task) {
      if (task == undefined) return;
      task.color = colors[Math.floor(Math.random() * colors.length)];
      return true;
    };
    Tasker.onImageTaskReorganize = function (tasks) {
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
BababotScope.extensions.push([
  function () {
    var colors = Array.from(document.querySelector("#palette-buttons").children)
      .filter((x) => x.className != "disabled")
      .map((x) => parseInt(x.getAttribute("data-id")));
    function ontask(task) {
      return task;
    }
    Tasker.onTaskAction = function (task) {
      if (task == undefined) return;
      task.color = colors[Math.floor(Math.random() * colors.length)];
      return true;
    };
    Tasker.onImageTaskReorganize = function (tasks) {
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

BababotScope.extensions.push([
  function () {
    Tasker.onTaskAction = () => true;
    Tasker.onImageTaskReorganize = undefined;
  },
  "Normalize Tasker events",
]);

BababotScope.extensions.push([
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
            const canvas_color = BababotScope.BababotWS.BBY_get_pixel(
              mvpModeX,
              y
            );
            if (canvas_color == color || canvas_color == -1) {
              continue;
            }
            Tasker.addTask({
              // @TODO Tasker
              x: mvpModeX,
              y: y,
              color: color,
            });
          }
        }
        if (Tasker.onImageTaskReorganize) {
          Tasker._tasks = Tasker.onImageTaskReorganize(
            Tasker._tasks,
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

BababotScope.extensions.push([
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

BababotScope.extensions.push([
  function () {
    var name = prompt("Go to user:");
    $($('.messages div a[class="user open-profile"]')[0])
      .attr("data-profile", name)
      .attr("data-id", name)
      .click();
  },
  "Go to user profile",
]);
