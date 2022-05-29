/** @format */

// ==UserScript==
// @name         Bababot.js
// @namespace    https://github.com/bababoyisntapopularname
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
// @require      https://raw.githubusercontent.com/bababoyisntapopularname/bababot/main/bababot_ws.js
// @require      https://raw.githubusercontent.com/bababoyisntapopularname/bababot/main/util.js
// @require      https://raw.githubusercontent.com/turuslan/HackTimer/master/HackTimer.min.js
// @run-at       document-start
// @grant        none
// ==/UserScript==

/* globals toastr, interact, chroma, $, BababotWS, extensions, uBababot, Terminal */

if (localStorage.firstTime == undefined) {
  localStorage.firstTime = true;
  toastr.warning(
    "Welcome to Bababot. Bababot is licensed under GPLv3. Made by Bababoy#1524",
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
  "https://raw.githubusercontent.com/bababoyisntapopularname/bababot/main/menu.css"
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
window.Tasker = Tasker;
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
      BababotWS.BBY_get_pixel(task.x, task.y) == task.color
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
      BababotWS.BBY_put_pixel(task.x, task.y, task.color);
      counter++;
    } else {
      BababotWS.BBY_emit("p", [
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
window.restartTasker = restartTasker;

function killTasker() {
  clearInterval(intervalCode);
  intervalCode = undefined;
}
window.killTasker = killTasker;
restartTasker();
/*
Take the possibility as:
a
- == a/b
b
*/
window.multiBotDitherMode = true;
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
    toastr.info("UI places as UI");
    restartTasker();
    BababotWS.BBY_on_message_send = function () {
      return true;
    };
  } else if (paintmode == 1) {
    toastr.info("UI places as Tasker");
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
  BababotWS.BBY_on_message_send = function (msg) {
    if (msg == BababotWS.trusted_code) return true;
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
window.UiPlacesAsTasker = UiPlacesAsTasker;

function UiPlacesTaskerTasks() {
  killTasker();
  BababotWS.BBY_on_message_send = function (msg) {
    if (msg == BababotWS.trusted_code) return true;
    if (msg.indexOf("42") == -1) return true;
    let [key, val] = JSON.parse(msg.replace("42", ""));
    if (key == "p") {
      for (let i = 0; i < brush; i++) {
        for (let j = 0; j < brush; j++) {
          let task = Tasker._tasks.find(
            (a) => a.x == val[0] + i && a.y == val[1] + j
          );
          if (task) {
            BababotWS.BBY_put_pixel(task.x, task.y, task.color);
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
window.UiPlacesTaskerTasks = UiPlacesTaskerTasks;
window.TaskerFilterPixelsByCoordinate = TaskerFilterPixelsByCoordinate;
console.log("%cBababot.js loaded. Made by Bababoy", "font-family: system-ui");
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
  if (window.BababotWS == undefined) {
    toastr.warning("Bababot could not find Websocket process.Restarting");
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
var html = $(`<div id="menu" style="display: none;">
<div class="menuinside">
  <div class="gradient_slider"></div>

  <fieldset>
    <legend>Image botting</legend>
    <canvas id="m_canvas" width="100" height="100"></canvas>
    <div>
      <input id="m_width" type="number" class="numinput along" placeholder="Width" /><input id="m_height"
        type="number"
        placeholder="Height"
        class="numinput along"
      />
    </div>
    <label for="m_file" class="numinput along text"
      >Image file</label
    ><input type="file" id="m_file" style="display: none" />
    <div class="smalltext" id="m_original"></div>
    <div>
      <input id="m_x" type="number" class="numinput along" placeholder="X" /><br /><input
                                                                                          id="m_y"
        type="number"
        class="numinput along"
        placeholder="Y"
      />
    </div>

    <label class="control control-checkbox">
      Filter grey
      <input type="checkbox" id="m_filter"/>
      <div class="control_indicator"></div>
    </label>
    <button class="numinput butbigger along text" id="m_start">Ѕtart Botting</button><br /><button
                                                                                                 id="m_stop"
      class="numinput butbigger along text"
    >
      Stop Botting
    </button>
  </fieldset>

  <fieldset>
    <legend>Other botting tools</legend>
    <div class="smalltext">Extensions</div>

    <div class="smalltext">Select an extension</div>
    <div class="select">
      <select id="m_select">
      </select>
      <div class="select_arrow"></div>
    </div>
    <div class="numinput along text" id="m_run">Run extension</div>

    <div class="smalltext">Dithering modes</div>

    <div class="smalltext">Select a dithering mode</div>
    <div class="select">
    <select id="m_dither">
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
    <div class="numinput along text" id="m_dither_run">Change dithering mode</div>
  </fieldset>
</div>
</div>`);
$(document.body).append(html);
const Menu = {
  canvas: document.createElement("canvas"),
  canvas_display: document.getElementById("m_canvas"),
  x: $("#m_x"),
  y: $("#m_y"),
  width: $("#m_width"),
  height: $("#m_height"),
  file: $("#m_file"),
  filter: $("#m_filter"),
  start: $("#m_start"),
  stop: $("#m_stop"),
  extensions_list: $("#m_select"),
  extension_run: $("#m_run"),
  dither_list: $("#m_dither"),
  dither_run: $("#m_dither_run"),
  original: $("#m_original"),
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
    toastr.error("Image not loaded.");
    return;
  }
  Menu.state = false;
  if ([!Menu.y.val(), !Menu.x.val()].indexOf(true) != -1) {
    toastr.error("Coordinates not specified or specified wrong.");
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

function generatePixif(img) {
  let output = "";
  for (let i = 0; i < img.data.length; i += 4) {
    if ((i / 4) % img.width === 0 && i != 0) {
      output += "\n";
    }
    /**
     * @type {RGB}
     */
    const colorInfo = {
      r: img.data[i],
      g: img.data[i + 1],
      b: img.data[i + 2],
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
      if (pixelColor.hex.toLowerCase() == colorHex.toLowerCase()) {
        color = pixelColor.code;
      }
    }
    if (color == undefined) {
      color = 64;
    }
    output += pixelPlaceToPixif(color);
  }
  return output.split("\n");
}
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
  '<a target="_blank" href="https://github.com/bababoyisntapopularname/bababot">Bababot</a>'
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
Menu.filter.on("change", function () {
  localStorage.usetransparent = Menu.filter.prop("checked");
});
Menu.filter.prop("checked", localStorage.usetransparent);
function extension_load() {
  if ($("#m_select option").length != 0) return;
  $("#m_select option").remove();
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
      window.graph();
      break;
    case "%":
      toastr.info(`Dither set to: ${dither()}%`);
      break;
    case "+":
      shouldShuffle = !shouldShuffle;
      if (shouldShuffle) {
        Tasker.onImageTaskReorganize = shuffle;
      } else {
        Tasker.onImageTaskReorganize = undefined;
      }
      toastr.info("Should shuffle: " + shouldShuffle);
      break;
    case "-":
      increaseBrush();
      toastr.info(`Brush size: ${brush}`);
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
    "https://raw.githubusercontent.com/bababoyisntapopularname/bababot/main/dither.js"
  )
).text();

var worker_iprocess = createWorker(
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
onmessage = function(i) {
	var palette = Array.from(pixelplace)
	if (i.data.usetransparent) {
		palette.push([186,186,176])
	}
	var q = new RgbQuant({
    	colors: 40,
    	palette: palette,
    	reIndex: !0,
    	dithKern: i.data.kernel,
    	dithDelta: .05,
    	useCache: !1
	});


    console.log(i)
    console.time("Image load")
    q.sample(i.data.img.data);
    console.timeLog("Image load")
    var r = q.reduce(i.data.img.data)
    console.timeLog("Image load")
    var pixif = generatePixif(r,i.data.img.width)
    console.timeEnd("Image load")
    postMessage([r,pixif])
}`
);

function process() {
  var i = Menu.canvas;
  var c = i.getContext("2d");
  var data = c.getImageData(0, 0, Menu.original_width, Menu.original_height);
  worker_iprocess.postMessage({
    img: data,
    usetransparent: localStorage.usetransparent,
    kernel: localStorage.kernel,
  });
}
worker_iprocess.onmessage = (pkg) => {
  var data = pkg.data;
  var i = Menu.canvas;
  var c = i.getContext("2d");
  putPixels(data[0]);
  Menu.pixif = data[1];
};

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
    (x) => x.color != BababotWS.BBY_get_pixel(x.x, x.y) && x.color != -1
  );
}

extensions.push([
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

extensions.push([
  () =>
    (Tasker.onTaskAction = function (task) {
      if (task == undefined) return;
      task.color = parseInt(["35", "26", "0", "26", "35"][task.y % 5]);
      return true;
    }),
  "trans",
]);

extensions.push([
  () =>
    (Tasker.onTaskAction = function (task) {
      if (task == undefined) return;
      task.color = parseInt(["20", "14", "12", "8", "33", "29"][task.y % 6]);
      return true;
    }),
  "lgbt",
]);

extensions.push([
  () =>
    (Tasker.onTaskAction = function (task) {
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
    Tasker.onTaskAction = ontask;
    Tasker.onImageTaskReorganize = function (tasks) {
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
extensions.push([
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

extensions.push([
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

extensions.push([
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

extensions.push([
  function () {
    Tasker.onTaskAction = () => true;
    Tasker.onImageTaskReorganize = undefined;
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
            const canvas_color = BababotWS.BBY_get_pixel(mvpModeX, y);
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
