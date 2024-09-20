const WebSocket = require('ws');
const robot = require('robotjs');

const server = new WebSocket.Server({ port: 8080 });


let mousePos = robot.getMousePos();
robot.setMouseDelay(0.5);
let defaultSensitivity = 10;


let changeSensitivity = (value) => {
  robot.setMouseDelay(value);
  console.log('Mouse delay set to: ' + value);
};

let keyboardType = (value) => {
  robot.typeString(value);
  console.log('Keyboard Typing: ' + value);
};

let moveCursor = (x, y) => {
  mousePos.x += x * -1 * defaultSensitivity
  mousePos.y += y * -1 * defaultSensitivity

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
    if (obj.startCursorEvent) {
      mousePos = robot.getMousePos();
    }
    if (obj.moveCursorEvent) {
      moveCursor(obj.moveCursorEvent.x, obj.moveCursorEvent.y);
    }

  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

console.log('Servidor WebSocket rodando na porta 8080');


