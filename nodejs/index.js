const WebSocket = require('ws');
const robot = require('robotjs');

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

function moveCursor(x, y) {
  console.log(x)
  console.log(y)
  mousePos.x += x * (defaultSensitivity * 30/2);
  mousePos.y += y * (defaultSensitivity * 30/2);

  robot.moveMouse(mousePos.x, mousePos.y);

  console.log('Cursor moved to: ' + mousePos.x + ', ' + mousePos.y);
};

server.on('connection', ws => {
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
      console.log('Mouse Motion')
      mousePos = robot.getMousePos();
      moveCursor(obj.axis.x, obj.axis.y);
    }

  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

console.log('Servidor WebSocket rodando na porta 8080');


