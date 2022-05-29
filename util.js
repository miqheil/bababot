// @author @Bababoy#1524
// Licensed in GPLv3
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
window["uBababot"] = uBababot;

Function.prototype.clone = function() {
    var that = this;
    var temp = function temporary() { return that.apply(this, arguments); };
    for(var key in this) {
        if (this.hasOwnProperty(key)) {
            temp[key] = this[key];
        }
    }
    return temp;
};

var _i18n = {
  "welcome":{
    "tr": "Bababot'a hoşgeldin. Bababot GPLv3 ile lisanslıdır. Bababoy tarafından yapıldı",
    "en": "Welcome to Bababot. Bababot is licensed under GPLv3. Made by Bababoy"
  },
  "ui_places_as_ui":{
    "tr": "UI normal çizer",
    "en": "UI places as UI"
  },
  "ui_places_as_tasker":{
    "tr": "UI Tasker olarak çizer",
    "en": "UI places as Tasker"
  },
  "inform":{
    "tr": "Bababot.js yüklendi. Bababoy tarafından yapıldı. %100 türk malıdır.",
    "en": "Bababot.js loaded. Made by Bababoy"
  },
  "no_ws_found":{
    "tr": "Bababot websocket bulamadı. F5 atılıyor.",
    "en": "Bababot could not find Websocket. Refreshing."
  },
  "image_botting":{
    "tr":"Resim botlaması",
    "en":"Image botting"
  },
  "image_file":{
    "tr": "Resim dosyası",
    "en": "Image file"
  },
  "width":{
    "tr": "Genişlik",
    "en": "Width"
  },
  "start":{
    "tr": "Botu başlat",
    "en": "Start botting"
  },
  "stop":{
    "tr": "Botu durdur",
    "en": "Stop botting"
  },
  "other":{
    "tr": "Diğer ayarlar",
    "en": "Other settings"
  },
  "exts":{
    "tr": "Eklentiler",
    "en": "Extensions"
  },
  "select":{
    "tr": "Eklenti seç",
    "en": "Select extension"
  },
  "run":{
    "tr": "Eklentiyi çalıştır",
    "en": "Run extension"
  },
  "dither_modes":{
    "tr": "Resim uyarlama modları",
    "en": "Dithering modes"
  },
  "select_dither":{
    "tr": "Resim uyarlama modu seç",
    "en": "Select dithering mode"
  },
  "run_dither":{
    "tr": "Uyarlama modunu uygula",
    "en": "Run dithering mode"
  },
  "no_image":{
    "tr": "Resim ayarlanmamış.",
    "en": "Image not loaded"
  },
  "no_coords":{
    "tr": "Koordinatlar yanlış veya eksik girilmiş.",
    "en": "Coordinates not specified or specified wrong"
  },
  "dither_set_to":{
    "tr": "Piksel yerleştirme yüzdesi:",
    "en": "Dither set to:"
  },
  "shuffle":{
    "tr": "Pikseller karıştırılıyor:",
    "en": "Should shuffle"
  },
  "brush":{
    "tr": "Fırça boyutu:",
    "en": "Brush size:"
  },

}

// determine if user is turkish or not 
function isTurkish() {
  return window.navigator.language.includes("tr");
}
var mode = isTurkish() ? "tr" : "en";
window.i18n = {
  get: function(key) {
    return _i18n[key][mode];
  }
};