/** @format */

// ==UserScript==
// @name         Bababot.js (BETA)
// @namespace    https://github.com/bababoyy
// @version      4.0-beta
// @license      GPLv3
// @description  Bababot
// @author       Bababoy
// @match        https://pixelplace.io/*
// @icon         https://i.imgur.com/yBHKs2a.png
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.js
// @require      https://raw.githubusercontent.com/bababoyy/bababot/main/jquery_ui.min.js
// @require      https://raw.githubusercontent.com/turuslan/HackTimer/master/HackTimer.min.js
// @require      https://cdn.jsdelivr.net/gh/bababoyy/bababot@latest/extensions.js
// @run-at       document-start
// @grant        none
// ==/UserScript==

/* globals $, toastr */

Object.defineProperty(window.console, "log", {
  value: console.log,
  writable: false,
});
var j = $;
function drag(selector) {
  j(selector).draggable();
}
Object.defineProperty(window, "WebSocket", {
  value: class extends WebSocket {
    constructor(url, header) {
      super(url, header);
      toastr.success('loaded ws')
      BababotWS.loadWS(this)
    }
  },
  writable: false,
});
const BababotWS = {
  canvas_context: undefined,
  trusted_code: undefined,
  $callbacks: [],
  BBY_on_message_send: () => true,
  original_send: undefined,
  loadWS: function(ws) {
    this.ws = ws
    this.original_send = this.ws.send
    this.ws.send = (...args) => {
      if (!this.BBY_on_message_send(...args)) {
        return
      }
      return this.original_send.apply(this.ws,args)
    }
    this.ws.addEventListener("message", (message) => {
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
  },
  hashes: [
    16777215, 12895428, 8947848, 5592405, 2236962, 0, 26112, 2273612, 179713,
    5366041, 9756740, 16514907, 15063296, 15121932, 15045888, 10512962,
    10048269, 6503455, 7012352, 10420224, 15007744, 16726276, 12275456,
    16741727, 16762015, 16768972, 16754641, 13594340, 15468780, 8519808,
    5308671, 132963, 234, 281599, 6652879, 3586815, 33735, 54237, 4587464,
  ],
  BBY_get_pixel: function (x, y) {
    if (this.canvas_context == undefined) {
      this.canvas_context = document.getElementById("canvas").getContext("2d");
    }
    const [r, g, b, a] = this.canvas_context.getImageData(x, y, 1, 1).data;
    const hash = (r << 16) + (g << 8) + b;
    return this.hashes.findIndex((color) => hash == color);
  },
  ws: undefined,
  BBY_emit(msg, props) {
    if (!this.ws || this.ws.readyState != this.ws.OPEN) {
      return;
    }
    this.trusted_code = "42" + JSON.stringify([msg, props]);
    this.ws.send(this.trusted_code);
  },

  BBY_put_pixel: function (x, y, color) {
    this.BBY_emit("p", [x, y, color, 1]);
  },
  BBY_send_chat: function (msg, full) {
    let packet = {
      text: msg,
      mention: "",
      type: "global",
      target: "",
      color: 11,
    };

    packet = { ...packet, ...full };

    this.BBY_emit("chat.message", packet);
  },
};
window.BababotWS = BababotWS

const IMAGE_CONVERTER_URL =
  "https://cdn.jsdelivr.net/gh/bababoyy/bababot@cd9235f/workers/image_converter.js";
const TASK_PROCESSOR_URL =
  "https://cdn.jsdelivr.net/gh/bababoyy/bababot@latest/workers/task_processor.js";
const BABABOT_CSS_URL =
  "https://cdn.jsdelivr.net/gh/bababoyy/bababot/bababot.css";
const DAILY_LOOT_URL = "https://pixelplace.io/api/post-dailyloot.php";

function createWorker(code) {
  return new Worker(
    URL.createObjectURL(new Blob([code], { type: "text/javascript" }))
  );
}

async function $import(url) {
  let css = await fetch(url).then((x) => x.text());
  $("<style>").html(css).appendTo("head");
}
$import(BABABOT_CSS_URL);
fetch(DAILY_LOOT_URL, {
  body: "spin=true",
  method: "POST",
  mode: "cors",
  credentials: "include",
})
  .then((x) => x.json())
  .then((data) => toastr.info(data.label))
  .catch(() => void 0);
window.state = JSON.stringify(document.readyState)
if (localStorage.firstTime == undefined) {
  localStorage.firstTime = true;
  toastr.warning(
    "Welcome to Bababot. Bababot is licensed under GPLv3. Made by Bababoy#1524",
    { timeOut: 9500 }
  );
}
class BababotFactory {
  constructor() {
    localStorage.timeout = localStorage.timeout || 40;
    this.extensions = [];
    this.Tasker = this.newTasker();
    this.reader = new FileReader();
    this.reader.onloadend = this.EVENT_reader_loadend.bind(this);
    this.worker_iprocess = undefined;
    this.intervalCode = undefined;
    this.counter = 0;
    this.Menu = {};
    this.restartTasker();
    this.handleUI().then(() => {
      window.onBababotLoaded.forEach(a => a())
      this.loadExtensions();
      this.EVENT_on_size_change();
    });
    setTimeout(this.wsGrantedCheck,5000)
  }
  pixelColorCheck({ x, y, color }) {
    const coord_pixel_color = window.BababotWS.BBY_get_pixel(x, y);
    return coord_pixel_color != -1 && coord_pixel_color != color;
  }
  GUIPostPixelSend() {
    /** @TODO */
  }
  prepareTasks(tasks) {
    return tasks.filter(this.Tasker.onTaskAction).filter(this.pixelColorCheck);
  }
  newTasker() {
    return {
      _tasks: [],
      onImageTaskReorganize: (a) => a,
      onTaskAction: (a) => true,
    };
  }
  restartTasker() {
    clearInterval(this.intervalCode);
    let context = this;
    this.intervalCode = setInterval((function () {
      if (this.Tasker._tasks.length == 0) {
        this.Tasker.onTaskAction()
        return;
      }
      let task = this.Tasker._tasks.shift();
      BababotWS.BBY_put_pixel(task.x, task.y, task.color);
      this.GUIPostPixelSend(task);
      this.counter += 1;
    }).bind(this), localStorage.timeout);
  }
  killTasker() {
    clearInterval(this.intervalCode);
    this.intervalCode = undefined;
  }
  async createMenuHTML() {
    var url = "https://cdn.jsdelivr.net/gh/bababoyy/bababot/html/";
    if (window.navigator.language.includes("tr")) {
      url += "turkish.html";
    } else {
      url += "english.html";
    }
    var html_text = await (await fetch(url)).text();
    document.body.insertAdjacentHTML("beforeend", html_text);
  }
  createBababotText() {
    document
      .getElementById("container")
      .insertAdjacentHTML(
        "beforeend",
        '<a target="_blank" href="https://github.com/bababoyy/bababot" style="display: block; position: absolute; width: auto; bottom: 11px; right: 250px; color: rgb(255, 255, 255); text-shadow: rgb(0, 0, 0) 1px 1px 1px; font-size: 0.9em;">Bababot</a>'
      );
  }
  createBotIcon() {
    let elem = $(
      '<a href="#" title="Bot Menu" class="grey margin-top-button"><img src="https://i.imgur.com/S5CHJJK.png" alt="icon"></a>'
    );
    elem.on("click", function () {
      $("#menu").fadeToggle("fast");
    });
    elem.appendTo("#menu-buttons");
  }
  async handleUI() {
    await this.createMenuHTML();
    this.Menu = {
      canvas: document.createElement("canvas"),
      canvas_display: document.getElementById("Bababot_canvas"),
      x: $("#Bababot_x"),
      y: $("#Bababot_y"),
      width: $("#Bababot_width"),
      height: $("#Bababot_height"),
      file: $("#Bababot_file"),
      start: $("#Bababot_start"),
      stop: $("#Bababot_stop"),
      extensions_list: $("#Bababot_select"),
      extension_run: $("#Bababot_run"),
      dither_list: $("#Bababot_dither"),
      dither_run: $("#Bababot_dither_run"),
      original: $("#Bababot_original"),
      img: new Image(),
      pixif: undefined,
    };
    this.handleEventListeners();
    this.Menu.width.val(100);
    this.Menu.height.val(100);
    this.createBababotText();
    this.createBotIcon();
    drag("#menu");
    this.onKeyPress();
  }
  async drawImage(coords, image) {
    if (this.Tasker._tasks.length != 0) {
      return;
    }
    var tasks = [];
    let context = this
    /** @TODO add TASK_PROCESSOR_URL into Bababot class */
    var worker_tasks = createWorker(`importScripts("${TASK_PROCESSOR_URL}")`);
    console.log(worker_tasks)
    worker_tasks.onmessage = (tasks_raw) => {
      console.log(tasks_raw)
      var tasks = tasks_raw.data;
      context.Tasker._tasks = context.prepareTasks(tasks);
      if (context.Tasker.onImageTaskReorganize) {
        context.Tasker._tasks = context.Tasker.onImageTaskReorganize(
          context.Tasker._tasks,
          image[0].length,
          image.length,
          ...coords
        );
      }
      const orig = context.Tasker.onTaskAction;
      context.Tasker.onTaskAction = function (task) {
        if (task == undefined) {
          context.Tasker._tasks = context.prepareTasks(tasks);
          return false
        }
        return orig(task)
      };
      worker_tasks.terminate();
    };
    worker_tasks.postMessage({ coords: coords, image: image });
  }
  drawTasksIntoCanvas() {
    const context = document.getElementById("canvas").getContext("2d");
    const children = $("#palette-buttons").children();
    for (let task of this.Tasker._tasks) {
      var color = children[task.color].title + "7F";
      context.fillStyle = color;
      context.fillRect(task.x, task.y, 1, 1);
    }
  }
  putPixels(subpxArr) {
    var can = this.Menu.canvas;
    var ctx = can.getContext("2d"),
      imgd = ctx.createImageData(can.width, can.height);
    imgd.data.set(subpxArr);
    ctx.putImageData(imgd, 0, 0);
    this.Menu.canvas_display
      .getContext("2d")
      .drawImage(
        this.Menu.canvas,
        0,
        0,
        this.Menu.canvas.width,
        this.Menu.canvas.height,
        0,
        0,
        this.Menu.canvas_display.width,
        this.Menu.canvas_display.height
      );
  }
  generateImageWorker() {
    this.worker_iprocess = createWorker(
      `importScripts("${IMAGE_CONVERTER_URL}")`
    );
    this.worker_iprocess.onmessage = (pkg) => {
      var data = pkg.data;
      var i = this.Menu.canvas;
      var c = i.getContext("2d");
      this.putPixels(data[0]);
      this.Menu.pixif = data[1];
    };
  }
  process() {
    console.log(this);
    var i = this.Menu.canvas;
    var c = i.getContext("2d");
    var data = c.getImageData(
      0,
      0,
      this.Menu.original_width,
      this.Menu.original_height
    );
    this.generateImageWorker();
    this.worker_iprocess.postMessage({
      img: data,
      usetransparent: localStorage.usetransparent,
      kernel: localStorage.kernel,
    });
  }
  async EVENT_start_click() {
    if (this.Menu.pixif == undefined) {
      toastr.info('NO_IMAGE')
      return
    }
    const coords = [this.Menu.x.val(), this.Menu.y.val()].map(Number)
    if (coords.map(isNaN).includes(true)) {
      toastr.error('NO_COORDS')
      return
    }
    this.Menu.coords = coords
    await this.drawImage(coords, this.Menu.pixif)
    if (this.intervalCode == undefined) {
      this.drawTasksIntoCanvas()
    }
  }

  EVENT_stop_click() {
    this.Tasker.onTaskAction = () => true
    this.Tasker._tasks = []
  }
  EVENT_img_load() {
    const ctx = this.Menu.canvas.getContext('2d')
    const { width, height } = this.Menu.img
    const { original_width, original_height } = this.Menu
    this.Menu.original.text(`Original size: ${original_width}px to ${original_height}px`)
    ctx.fillStyle = '#BABAB0'
    ctx.fillRect(0, 0, original_width, original_height)
    ctx.drawImage(this.Menu.img, 0, 0, original_width, original_height)
    this.process()
  }
  EVENT_reader_loadend() {
    this.Menu.img.src = this.reader.result.toString()
    this.Menu.img.onload = this.EVENT_img_load.bind(this)
  }
  EVENT_file_change() {
    let file = this.Menu.file[0].files[0]
    if (!file) {
      return
    }
    this.reader.readAsDataURL(file)
  }
  EVENT_on_paste(event) {
    if ($('#menu').css('display') == 'none') {
      return
    }
    var item = (event.clipboardData || event.originalEvent.clipboardData)
      .items[0];
    if (item.kind != "file") {
      return
    }
    const blob = item.getAsFile()
    this.reader.readAsDataURL(blob)
  }
  EVENT_on_size_change() {
    const [width, height] = [this.Menu.width.val(), this.Menu.height.val()].map(
      Number
    );
    const context = this.Menu.canvas.getContext("2d");
    if (!width || !height) {
      toastr.error("WIDTH OR HEIGHT ERROR");
      return -1;
    }
    const [rWidth, rHeight] = this.ratioImageSize(width, height);
    this.Menu.canvas.width = width;
    this.Menu.canvas.height = height;
    this.Menu.canvas_display.width = rWidth;
    this.Menu.canvas_display.height = rHeight;
    this.Menu.original_width = width;
    this.Menu.original_height = height;
    context.fillStyle = "#BABAB0";
    context.fillRect(0, 0, width, height);
    context.drawImage(this.Menu.img, 0, 0, width, height);
    this.process();
  }
  EVENT_on_keypress(event) {
    console.log(this)
    if (document.activeElement == document.querySelector('#chat > form > input[type=text')) {
      return
    }
    switch(event.key) {
      case "p":
        var [cx, cy] = this.getCoordinates()
        this.Menu.x.val(cx)
        this.Menu.y.val(cy)
        break
    }
  }
  EVENT_dither_run_click() {
    localStorage.kernel = this.Menu.dither_list.val()
    this.EVENT_on_size_change()
  }
  handleEventListeners() {
    let context = this;
    this.Menu.start.on("click", this.EVENT_start_click.bind(this));
    this.Menu.stop.on("click", this.EVENT_stop_click.bind(this));
    this.Menu.file.on("change", this.EVENT_file_change.bind(this));
    this.Menu.width.on("change", this.EVENT_on_size_change.bind(this));
    this.Menu.height.on("change", this.EVENT_on_size_change.bind(this));
    document.onpaste = this.EVENT_on_paste.bind(this)
    this.Menu.dither_run.on("click", this.EVENT_dither_run_click.bind(this));
    this.Menu.dither_list.val(localStorage.kernel);
  }

  ratioImageSize(width, height) {
    const fit_in = 100;
    const biggest = Math.max(width, height);
    const smallest = Math.min(width, height);
    if (fit_in >= width && fit_in >= height) {
      return [width, height];
    }
    if (biggest == width) {
      return [fit_in, (height / width) * fit_in];
    } else {
      return [(width / height) * fit_in, fit_in];
    }
  }

  loadExtensions() {
    for (let extension of this.extensions) {
      const option = $("<option>").html(extension[1]);
      this.Menu.extensions_list.append(option);
    }
    this.Menu.extension_run.on("click", () => {
      const extension = this.extensions.find(
        (a) => a[1] == this.Menu.extensions_list.val()
      );
      extension[0]();
    });
  }
  getColors() {
    return Array.from($("#palette-buttons").children());
  }
  getSelectedColor() {
    const colors = this.getColors();
    const selected_color = colors.find((x) => x.classList.contains("selected"));
    return parseInt(selected_color.getAttribute("data-id"));
  }
  getCoordinates() {
    return $("#coordinates").text().split(",").map(Number);
  }
  wsGrantedCheck() {
    if (BababotWS.ws == undefined) {
      toastr.error('WS not hooked')
    } else {
      toastr.success('WS hooked')
    }
  }
  onKeyPress() {
    document.body.addEventListener('keypress',this.EVENT_on_keypress.bind(this))
  }
}
function main() {
  const Bababot = new BababotFactory();
  window.Bababot = Bababot;
}
if (document.readyState == "complete" || document.readyState == 'interactive') {
  main();
} else {
  window.addEventListener('DOMContentLoaded',main,false)
}
