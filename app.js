var qrcode = new QRCode("qrcode");
var msgbox = document.getElementById("text");

function makeCode () {
  qrcode.makeCode(msgbox.value);
  window.history.pushState("state", "title", "#"+msgbox.value)
}

function ohchange (area, listener) { 
  if (area.addEventListener) {
    area.addEventListener('input', listener, false);
  } else if (area.attachEvent) {
    area.attachEvent('onpropertychange', listener);
  }
}

function urldecode(str) {
   return decodeURIComponent((str+'').replace(/\+/g, '%20'));
}

ohchange(msgbox, makeCode);

var hash = urldecode(window.location.hash.substring(1));
if (hash) {
  msgbox.value = hash;
  makeCode();
}
