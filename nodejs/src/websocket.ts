import { changeSensitivity, keyboardType, moveCursor, centerCursor, rightClick, leftClick } from './robot';
import {WebSocket, WebSocketServer} from 'ws';
// const WebSocket = require('ws');


export const connectServer = function () {

    // const socket = new WebSocketServer({ port: 8080 });
    const server = new WebSocketServer({ port: 8080 });

    console.log('Servidor WebSocket rodando na porta 8080');


    server.on('connection', ws => {
        console.log('Novo cliente conectado');

        ws.on('message', message => {

            let obj = JSON.parse(message.toString());

            if (obj.changeSensitivityEvent) {
                changeSensitivity(obj.changeSensitivityEvent);
            }

            if (obj.keyboardTypeEvent) {
                keyboardType(obj.message);
            }

            if (obj.rightClickEvent) {
                rightClick();
            }
            if (obj.leftClickEvent) {
                leftClick();
            }
            if (obj.event == "MouseMotionStart") {
                centerCursor()
            }
            if (obj.event == "MouseMotionMove") {
                moveCursor(obj.axis.x, obj.axis.y);
            }

        });

        ws.on('close', () => {
            console.log('Cliente desconectado');
        });
    });


}