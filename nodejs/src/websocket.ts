// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import { changeSensitivity, keyboardType, moveCursor, centerCursor, rightClick, leftClick } from './robot';
import { WebSocketServer } from 'ws';

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
