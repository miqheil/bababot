/** @format */

// ==UserScript==
// @name         Bababot.js
// @namespace    https://github.com/bababoyy
// @version      v3.52
// @license      GPLv3
// @description  Bababot
// @author       Bababoy
// @match        https://pixelplace.io/*
// @icon         https://i.imgur.com/PCn4MjQ.png
// @require      https://pixelplace.io/js/jquery.min.js?v2=1
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require      https://raw.githubusercontent.com/turuslan/HackTimer/master/HackTimer.min.js
// @run-at       document-start
// @grant        none
// ==/UserScript==
Object.defineProperty(window.console,'log',{value:console.log,writable:false})
function getCoordinate() {
  let raw = $("#coordinates").text();
  let arr = raw.split(",").map((x) => parseInt(x.replace(",", "")));
  return arr;
}
var j = $
function drag(selector) {
  j(selector).draggable()
}
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
  color_hashes: [16777215,12895428,8947848,5592405,2236962,0,26112,2273612,179713,5366041,9756740,16514907,15063296,15121932,15045888,10512962,10048269,6503455,7012352,10420224,15007744,16726276,12275456,16741727,16762015,16768972,16754641,13594340,15468780,8519808,5308671,132963,234,281599,6652879,3586815,33735,54237,4587464]
};
var ctx = undefined
/**
 * @param {number} x
 * @param {number} y
 * @param {number} sizeX
 * @param {number} sizeY
 * @returns {Uint8ClampedArray}
 */
function getPixelArray(x, y, sizeX, sizeY) {
  if (ctx == undefined) ctx = document.getElementById('canvas').getContext("2d")
  /**
   * @type {CanvasRenderingContext2D}
   */
  return ctx.getImageData(x, y, sizeX, sizeY).data;
}

/**
 * @param {number} r
 * @returns {number}
 */
function findColor([r,g,b,a]) {
  var hash = (r<<16)+(g<<8)+(b)
  return palette.color_hashes.findIndex(color => {
    return hash == color;
  })
}

/**
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */
function getPixel(x, y) {
  const imgData = getPixelArray(x, y, 1, 1);
  return findColor(imgData);
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
      window.BababotWS = this
    }
    BBY_on(code, callback) {
      this.$callbacks[code] = this.$callbacks[code] || [];
      this.$callbacks[code].push(callback);
    }
    BBY_emit(msg, props) {
      if (this.readyState != this.OPEN) {
        return;
      }
      this.trusted_code = '42' + JSON.stringify([msg, props]);
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

const IMAGE_CONVERTER_URL = 'https://cdn.jsdelivr.net/gh/bababoyy/bababot@cd9235f/workers/image_converter.js'
const TASK_PROCESSOR_URL = 'https://cdn.jsdelivr.net/gh/bababoyy/bababot@latest/workers/task_processor.js'
const BABABOT_CSS_URL = 'https://cdn.jsdelivr.net/gh/bababoyy/bababot/bababot.css'
const DAILY_LOOT_URL = 'https://pixelplace.io/api/post-dailyloot.php'

function createWorker(code) {
  return new Worker(
    URL.createObjectURL(new Blob([code], { type: "text/javascript" }))
  );
}

async function $import(url) {
  let css = await fetch(url).then((x) => x.text());
  $('<style>').html(css).appendTo('head');
}
$import(BABABOT_CSS_URL);
fetch(DAILY_LOOT_URL, { "body": "spin=true", "method": "POST", "mode": "cors", "credentials": "include" }).then(x => x.json())
  .then(data => toastr.info(data.label)).catch(e => console.error(e))
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

var mode = window.navigator.language.includes("tr") ? "tr" : "en";
var i18n = {
  get: function (key) {
    return _i18n[key][mode];
  },
};
var BababotScope = {};
BababotScope.palette = palette;
BababotScope.getCoordinate = getCoordinate;
window.Bababot = BababotScope

if (localStorage.firstTime == undefined) {
  localStorage.firstTime = true;
  toastr.warning(
    // "Welcome to Bababot. Bababot is licensed under GPLv3. Made by Bababoy#1524"
    i18n.get("welcome"),
    { timeOut: 9500 }
  );
}
async function main() {
  localStorage.timeout = localStorage.timeout || 40;
  BababotScope.extensions = BababotScope.extensions || [];

  function BababotPixelColorCheck({ x, y, color }) {
    const coord_pixel_color = window.BababotWS.BBY_get_pixel(x, y)
    return coord_pixel_color != -1 && coord_pixel_color != color
  }
  function PrepareTasks(tasks) {
    return tasks.filter(BababotPixelColorCheck)
  }
  BababotScope.BababotPixelColorCheck = BababotPixelColorCheck
  class TaskerFactory {
    static EMPTY_FUNCTION = () => true;
    static PREVENT_DEFAULT = false;
    constructor() {
      this._tasks = [];
      this.onImageTaskReorganize = undefined;
      this.onTaskAction = TaskerFactory.EMPTY_FUNCTION;
      this.onShuffleGranted = TaskerFactory.EMPTY_FUNCTION;
    }
    addTask(callback) {
      this._tasks.push(callback);
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
      Tasker._tasks = Tasker._tasks.filter(Tasker.onTaskAction)
      if (Tasker._tasks.length != 0) Tasker._tasks = PrepareTasks(Tasker._tasks)
      let task = Tasker._tasks.shift();
      if (task == undefined || Tasker.onTaskAction(task) == TaskerFactory.PREVENT_DEFAULT) {
        Tasker.onTaskAction(undefined);
        return;
      }
      if (task.mode == undefined) {
        window.BababotWS.BBY_put_pixel(task.x, task.y, task.color);
        GUIPostPixelSend(task)
        counter++;
      } else {
        window.BababotWS.BBY_emit("p", [
          task.x,
          task.y,
          task.color,
          task.pixelsize,
          task.mode,
        ]);
        GUIPostPixelSend(task)
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
      return (task.x + task.y) % b < a
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
      window.BababotWS.BBY_on_message_send = function () {
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
    window.BababotWS.BBY_on_message_send = function (msg) {
      if (msg == window.BababotWS.trusted_code) return true;
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
    window.BababotWS.BBY_on_message_send = function (msg) {
      if (msg == window.BababotWS.trusted_code) return true;
      if (msg.indexOf("42") == -1) return true;
      let [key, val] = JSON.parse(msg.replace("42", ""));
      if (key == "p") {
        for (let i = 0; i < brush; i++) {
          for (let j = 0; j < brush; j++) {
            let task = Tasker._tasks.find(
              (a) => a.x == val[0] + i && a.y == val[1] + j
            );
            if (task) {
              window.BababotWS.BBY_put_pixel(task.x, task.y, task.color);
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

  /**
   * @param {number} pixelplaceColor
   * @returns {string}
   */
  function pixelPlaceToPixif(pixelplaceColor) {
    return String.fromCharCode("0".charCodeAt(0) + parseInt(pixelplaceColor));
  }
  var html = $(`<div id="menu" style="display: none;">
<div class="lovely-division">
<div class="gradient_slider"></div>

<fieldset>
<legend>${i18n.get("image_botting")}</legend>
<canvas id="Bababot_canvas" width="100" height="100"></canvas>
<div>
<input id="Bababot_width" type="number" class="numinput along" placeholder="${i18n.get(
    "width"
  )}" /><input id="Bababot_height"
type="number"
placeholder="Height"
class="numinput along"
/>
</div>
<label for="Bababot_file" class="numinput along text"
>${i18n.get("image_file")}</label
><input type="file" id="Bababot_file" style="display: none" />
<div class="smalltext" id="Bababot_original"></div>
<div>
<input id="Bababot_x" type="number" class="numinput along" placeholder="X" /><br /><input
                                                                          id="Bababot_y"
type="number"
class="numinput along"
placeholder="Y"
/>
</div>
<button class="numinput butbigger along text" id="Bababot_start">${i18n.get(
    "start"
  )}</button><br /><button
                                                                                 id="Bababot_stop"
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
<select id="Bababot_select">
</select>
<div class="select_arrow"></div>
</div>
<div class="numinput along text" id="Bababot_run">${i18n.get(
    "run"
  )}</div>

<div class="smalltext">${i18n.get("dither_modes")}</div>

<div class="smalltext">${i18n.get("select_dither")}</div>
<div class="select">
<select id="Bababot_dither">
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
<div class="numinput along text" id="Bababot_dither_run">${i18n.get(
    "run_dither"
  )}</div>
</fieldset>
</div>
</div>`);
  html.appendTo('body');
  const Menu = {
    canvas: document.createElement("canvas"),
    canvas_display: document.getElementById(`Bababot_canvas`),
    x: $(`#Bababot_x`),
    y: $(`#Bababot_y`),
    width: $(`#Bababot_width`),
    height: $(`#Bababot_height`),
    file: $(`#Bababot_file`),
    start: $(`#Bababot_start`),
    stop: $(`#Bababot_stop`),
    extensions_list: $(`#Bababot_select`),
    extension_run: $(`#Bababot_run`),
    dither_list: $(`#Bababot_dither`),
    dither_run: $(`#Bababot_dither_run`),
    original: $(`#Bababot_original`),
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
    var worker_tasks = createWorker(`importScripts("${TASK_PROCESSOR_URL}")`);
    worker_tasks.onmessage = function (tasks_raw) {
      var tasks = tasks_raw.data;
      tasks.forEach((task) => Tasker.addTask(task));
      if (Tasker.onImageTaskReorganize) {
        Tasker._tasks = Tasker.onImageTaskReorganize(Tasker._tasks,
          image[0].length,
          image.length,
          coords[0],
          coords[1]
        );
      }
      Tasker.onTaskAction = function (task) {
        if (task == undefined) {
          Tasker._tasks = tasks
        }
      };
      worker_tasks.terminate()
    };
    if (Tasker._tasks.length != 0) {
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
      var context = document.getElementById('canvas').getContext("2d");
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
    Tasker._tasks = []
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
  drag('#menu')
  bababot.appendTo('#container')
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
    if ($(`#Bababot_select option`).length != 0) return;
    $(`#Bababot_select option`).remove();
    for (let extension of BababotScope.extensions) {
      var option = $("<option>").html(extension[1]);
      Menu.extensions_list.append(option);
    }
  }
  Menu.extension_run.on("click", function () {
    BababotScope.extensions.find((a) => a[1] == Menu.extensions_list.val())[0]();
  });
  Menu.dither_run.on("click", function () {
    localStorage.kernel = Menu.dither_list.val();
    size_callback();
  });
  Menu.dither_list.val(localStorage.kernel);

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
  var worker_iprocess;
  function generateImageWorker() {
    worker_iprocess = createWorker(`importScripts("${IMAGE_CONVERTER_URL}")`)
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

  function filter(tasks) {
    return tasks.filter(
      (x) =>
        x.color != window.BababotWS.BBY_get_pixel(x.x, x.y) && x.color != -1
    );
  }

  function PatternExtensionGenerate(pattern) {
    return function () {
      Tasker.onTaskAction = function (task) {
        if (task == undefined) return;
        let chunkCoord = [
          Math.floor(task.x / pattern[0].length) * pattern[0].length,
          Math.floor(task.y / pattern.length) * pattern.length,
        ];
        let patternCoord = [task.x - chunkCoord[0], task.y - chunkCoord[1]];
        let ascii = pattern[patternCoord[1]][patternCoord[0]];
        if (ascii == "p") {
          return false;
        } else if (ascii == "X") {
          task.color = getSelectedColor();
        } else {
          task.color = ascii.charCodeAt(0) - "0".charCodeAt(0)
        }
        return true;
      }
    }
  }
  var amogus = [
    "ppppp",
    "p555p",
    "5500p",
    "5555p",
    "p555p",
    "p5p5p",
    "ppppp"
  ]
  BababotScope.extensions.push([
    PatternExtensionGenerate(amogus),
    "amogus"
  ])
  BababotScope.extensions.push([
    PatternExtensionGenerate(["L5", "5L"]),
    "gmod missing texture"
  ]);

  BababotScope.extensions.push([
    PatternExtensionGenerate(["S", "J", "0", "J", "S"]),
    "trans",
  ]);
  BababotScope.extensions.push([
    PatternExtensionGenerate(['D', '>', '<', '8', 'Q', 'M']),
    "lgbt"
  ]);
  BababotScope.extensions.push([
    PatternExtensionGenerate(['K', 'J', '0', 'U', '0', 'J']),
    "femboy"
  ]);

  BababotScope.extensions.push([
    function () {
      PatternExtensionGenerate(BababotScope.Menu.pixif)()
    }, "Generate pattern by image"
  ])

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
  var fill_callback;
  var fill_ran = false
  BababotScope.extensions.push([
    function () {
      if (fill_ran == false) {
        fill_ran = true
        interact("#canvas").on("click", function () {
          if (fill_callback != undefined) {
            fill_callback()
          }
        });
      }
      let start_coordinate, end_coordinate;
      if (fill_callback) {
        fill_callback = undefined
        toastr.info('closed fill')
        return
      }
      toastr.info('opened fill')
      fill_callback = function () {
        if (start_coordinate) {
          end_coordinate = getCoordinate();
          let color = getSelectedColor();
          if (!color && color != 0) {
            return -1;
          }
          for (let y = start_coordinate[1]; y <= end_coordinate[1]; y++) {
            for (let x = start_coordinate[0]; x <= end_coordinate[0]; x++) {
              var mvpModeX;
              if ((y - start_coordinate[1]) % 2 == 0) {
                mvpModeX = x;
              } else {
                mvpModeX = end_coordinate[0] - x + start_coordinate[0];
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
      }
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
      if (isNaN(parseInt(timeout))) {
        return;
      }
      localStorage.timeout = parseInt(timeout);
    },
    "Set timeout",
  ]);
  BababotScope.Tasker = Tasker
  BababotScope.extensions.push([
    function () {
      var name = prompt("Go to user:");
      $($('.messages div a[class="user open-profile"]').get(0))
        .attr("data-profile", name)
        .attr("data-id", name)
        .click();
    },
    "Go to user profile",
  ]);
  BababotScope.extensions.push([
    function () {
      alert(Object.keys(BababotScope))
    },
    "eval",
  ]);
  extension_load()
  var polycanvas = document.createElement('canvas')
  polycanvas.style.position = 'absolute'
  polycanvas.style.pointerEvents = 'none'
  document.getElementById('container').prepend(polycanvas)
  var context = polycanvas.getContext('2d')
  function doResize() {
    polycanvas.width = innerWidth
    polycanvas.height = innerHeight
  }
  window.addEventListener('resize', doResize, false)
  doResize()
  var i = 0
  var pps = Number(counter);
  var math_pps, pps_ = [0, 0];
  var latest_task = 'X: N/A Y: N/A Color: N/A'
  function draw() {
    context.clearRect(0, 0, polycanvas.width, polycanvas.height)
    context.fillText(`Pixel per second:${math_pps}`, 50, 100)
    context.fillText(`Latest task: ${latest_task}`, 50, 150)
    requestAnimationFrame(draw)
  }
  context.font = '24px Arial'
  function calcuatePPS() {
    pps_ = Number(counter);
    math_pps = Number(pps_ - pps);
    pps = pps_;
    if (math_pps < 0) {
      math_pps = 0;
    }
  }
  function GUIPostPixelSend({ x, y, color }) {
    latest_task = `X: ${x} Y: ${y} Color: ${color}`
  }
  draw()
  setInterval(calcuatePPS, 1000)
}
if (document.readyState == 'complete') {
  main()
} else {
  document.addEventListener('DOMContentLoaded', main)
}
