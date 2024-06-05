const gateway = `ws://${window.location.hostname}:8765`;
let websocket;

// Init web socket when the page loads
window.addEventListener('load', onload);

function onload(event) {
  initWebSocket();
}

function initWebSocket() {
  console.log('Trying to open a WebSocket connection…');
  websocket = new WebSocket(gateway);

  websocket.onopen = onOpen;
  websocket.onclose = onClose;
  websocket.onmessage = onMessage;
}

// When websocket is established, call the getReadings() function
function onOpen(event) {
  console.log('Connection opened');
  getReadings();
}

function getReadings(){
  websocket.send(" - Start readings...");
}

function onClose(event) {
  console.log('Connection closed');
  setTimeout(initWebSocket, 2000);
}

// Function that receives the message from the ESP32 with the readings
function onMessage(event) {
  console.log(event.data);
  websocket.send("")
  /*
  const myObj = JSON.parse(event.data);
  const keys = Object.keys(myObj);

  for (let i = 0; i < keys.length; i++){
    const key = keys[i];
    document.getElementById(key).innerHTML = myObj[key];
  }
  */
}
