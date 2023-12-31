var qrcode = null;
const msgbox = document.getElementById("text");
const options = {correctLevel: QRCode.CorrectLevel.M};

function encodeUrl (message) {
  if (!message) return window.location.pathname;
  return '#' + encodeURIComponent(message);
}

function decodeUrl (hash) {
  return decodeURIComponent(hash);  
}

function makeCode () {
  // const msg = msgbox.value;
  const msg = msgbox.innerText;
  if (msg) {
    if (!qrcode) qrcode = new QRCode("qrcode", options);
    qrcode.makeCode(msg);
  } else {
    qrcode.clear();
    qrcode = null;
  }
  window.history.replaceState({}, "", encodeUrl(msg));
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
