"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectServer = connectServer;
var ws_1 = require("ws");
var robot_1 = require("./robot");
var logger_1 = require("./logger");
var logger = (0, logger_1.createLogger)('websocket');
var clients = [];
function connectServer(config) {
    var server = new ws_1.WebSocketServer({ port: config.port });
    logger.info("WebSocket server running on port ".concat(config.port));
    (0, robot_1.initRobot)(config);
    server.on('connection', function (ws) {
        var client = {
            id: generateClientId(),
            ws: ws,
            room: 'default',
        };
        clients.push(client);
        logger.info("New client connected: ".concat(client.id));
        ws.on('message', function (message) { return handleMessage(client, message); });
        ws.on('close', function () {
            var index = clients.findIndex(function (c) { return c.id === client.id; });
            if (index !== -1) {
                clients.splice(index, 1);
            }
            logger.info("Client disconnected: ".concat(client.id));
        });
    });
}
function handleMessage(client, message) {
    try {
        var obj = JSON.parse(message.toString());
        logger.debug("Received message from ".concat(client.id, ":"), obj);
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
        if (obj.event === "MouseMotionStart") {
            (0, robot_1.centerCursor)();
        }
        if (obj.event === "MouseMotionMove") {
            (0, robot_1.moveCursor)(obj.axis.x, obj.axis.y);
        }
        if (obj.shortcut) {
            (0, robot_1.performShortcut)(obj.shortcut);
        }
        if (obj.joinRoom) {
            joinRoom(client, obj.joinRoom);
        }
        if (obj.laserPointer) {
            broadcastToRoom(client.room, {
                type: 'laserPointer',
                position: obj.laserPointer,
                clientId: client.id,
            });
        }
    }
    catch (error) {
        logger.error('Error handling message:', error);
    }
}
function generateClientId() {
    return Math.random().toString(36).substr(2, 9);
}
function joinRoom(client, room) {
    client.room = room;
    logger.info("Client ".concat(client.id, " joined room: ").concat(room));
}
function broadcastToRoom(room, message) {
    clients.forEach(function (client) {
        if (client.room === room && client.ws.readyState === ws_1.WebSocket.OPEN) {
            client.ws.send(JSON.stringify(message));
        }
    });
}
//# sourceMappingURL=websocket.js.map