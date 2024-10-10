"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectServer = void 0;
var robot_1 = require("./robot");
var ws_1 = require("ws");
var connectServer = function () {
    var server = new ws_1.WebSocketServer({ port: 8080 });
    console.log('Servidor WebSocket rodando na porta 8080');
    server.on('connection', function (ws) {
        console.log('Novo cliente conectado');
        ws.on('message', function (message) {
            var obj = JSON.parse(message.toString());
            if (obj.changeSensitivityEvent) {
                (0, robot_1.changeSensitivity)(obj.changeSensitivityEvent);
            }
            if (obj.keyboardTypeEvent) {
                (0, robot_1.keyboardType)(obj.message);
            }
            if (obj.rightClickEvent) {
                (0, robot_1.rightClick)();
            }
            if (obj.leftClickEvent) {
                (0, robot_1.leftClick)();
            }
            if (obj.event == "MouseMotionStart") {
                (0, robot_1.centerCursor)();
            }
            if (obj.event == "MouseMotionMove") {
                (0, robot_1.moveCursor)(obj.axis.x, obj.axis.y);
            }
        });
        ws.on('close', function () {
            console.log('Cliente desconectado');
        });
    });
};
exports.connectServer = connectServer;
//# sourceMappingURL=websocket.js.map