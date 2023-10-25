var qrcode = new QRCode("qrcode");
var msgbox = document.getElementById("text");

function encodeUrl (message) {
  if (!message) return '';
  return '#' + encodeURIComponent(message);
}

function decodeUrl (hash) {
  return decodeURIComponent(hash);  
}

function makeCode () {
  // const msg = msgbox.value;
  let msg = msgbox.innerText;
  if (msg === '\n') msg = '';
  if (!msg) {
    qrcode.clear();
  } else {
    qrcode.makeCode(msg);  
  }
  window.history.pushState("state", "title", encodeUrl(msg));
}

function ohchange (area, listener) { 
  if (area.addEventListener) {
    area.addEventListener('input', listener, false);
  } else if (area.attachEvent) {
    area.attachEvent('onpropertychange', listener);
  }
}

var hash = window.location.hash.substring(1);
if (hash) {
  msgbox.innerText = decodeUrl(hash);
  makeCode();
}

function debounce(callee, timeoutMs) {
  return function perform(...args) {
    let previousCall = this.lastCall

    this.lastCall = Date.now()

    if (previousCall && this.lastCall - previousCall <= timeoutMs) {
      clearTimeout(this.lastCallTimer)
    }

    this.lastCallTimer = setTimeout(() => callee(...args), timeoutMs)
  }
}

ohchange(msgbox, debounce(makeCode, 250));
