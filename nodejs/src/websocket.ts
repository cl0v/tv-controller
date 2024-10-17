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

import { WebSocketServer, WebSocket } from 'ws';
import { changeSensitivity, keyboardType, moveCursor, centerCursor, rightClick, leftClick, performShortcut, initRobot } from './robot';
import { Config } from './config';
import { createLogger } from './logger';

const logger = createLogger('websocket');

interface Client {
    id: string;
    ws: WebSocket
    room: string;
}

const clients: Client[] = [];

export function connectServer(config: Config) {
    const server = new WebSocketServer({ port: config.port });
    logger.info(`WebSocket server running on port ${config.port}`);

    initRobot(config);

    server.on('connection', (ws) => {
        const client: Client = {
            id: generateClientId(),
            ws,
            room: 'default',
        };
        clients.push(client);
        logger.info(`New client connected: ${client.id}`);

        ws.on('message', (message) => handleMessage(client, message));

        ws.on('close', () => {
            const index = clients.findIndex((c) => c.id === client.id);
            if (index !== -1) {
                clients.splice(index, 1);
            }
            logger.info(`Client disconnected: ${client.id}`);
        });
    });
}

function handleMessage(client: Client, message: any) {
    try {
        const obj = JSON.parse(message.toString());
        logger.debug(`Received message from ${client.id}:`, obj);

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
        if (obj.event === "MouseMotionStart") {
            centerCursor();
        }
        if (obj.event === "MouseMotionMove") {
            moveCursor(obj.axis.x, obj.axis.y);
        }
        if (obj.shortcut) {
            performShortcut(obj.shortcut);
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
    } catch (error) {
        logger.error('Error handling message:', error);
    }
}

function generateClientId(): string {
    return Math.random().toString(36).substr(2, 9);
}

function joinRoom(client: Client, room: string) {
    client.room = room;
    logger.info(`Client ${client.id} joined room: ${room}`);
}

function broadcastToRoom(room: string, message: any) {
    clients.forEach((client) => {
        if (client.room === room && client.ws.readyState === WebSocket.OPEN) {
            client.ws.send(JSON.stringify(message));
        }
    });
}