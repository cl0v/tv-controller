const WebSocket = require('ws');
const robot = require('robotjs');

// ipconfig getifaddr en0

const server = new WebSocket.Server({ port: 8080 });

let screenSize = robot.getScreenSize();



let mousePos = robot.getMousePos();
robot.setMouseDelay(1);
let defaultSensitivity = 10;


let changeSensitivity = (value) => {
  robot.setMouseDelay(value);
  defaultSensitivity *= value;
  console.log('Mouse delay set to: ' + value);
};

let keyboardType = (value) => {
  robot.typeString(value);
  console.log('Keyboard Typing: ' + value);
};
let posx = 0
let posy = 0

function moveCursor(x, y) {
  console.log(x)
  console.log(y)
  posx +=  (screenSize.width / 32) * x
  posy +=  (screenSize.height / 18) * y

  robot.moveMouse(posx, posy);

  console.log('Cursor moved to: ' + mousePos.x + ', ' + mousePos.y);
};

server.on('connection', ws => {

  // server.send(JSON.stringify({
  //   width: screenSize.width,
  //   height: screenSize.height
  // }))

  console.log('Novo cliente conectado');

  ws.on('message', message => {
    // console.log('Recebido:', message);
    // console.log(message.toString('utf8'));
    // console.log(JSON.parse(message));
    // JSON.parse(message);

    let obj = JSON.parse(message);

    if (obj.changeSensitivityEvent) {
      changeSensitivity(obj.changeSensitivityEvent);
    }

    if (obj.keyboardTypeEvent) {
      keyboardType(obj.message);
    }

    if (obj.rightClickEvent) {
      robot.mouseClick('right');
    }
    if (obj.leftClickEvent) {
      robot.mouseClick('left');
    }
    if (obj.event == "MouseMotionStart") {
      posx = screenSize.width / 2
      posy = screenSize.height / 2
    }
    if (obj.event == "MouseMotionMove") {
      console.log('Mouse Motion')
      console.log(obj)
      mousePos = robot.getMousePos();
      moveCursor(obj.axis.x, obj.axis.y);
    }

  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

console.log('Servidor WebSocket rodando na porta 8080');

