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
import { getScreenSize, getMousePos, setMouseDelay, typeString, moveMouse, mouseClick } from '@jitsi/robotjs'


let screenSize = getScreenSize();

let mousePos = getMousePos();
setMouseDelay(1);
let defaultSensitivity = 10;

let posx = 0
let posy = 0


export const changeSensitivity = (value: number) => {
    setMouseDelay(value);
    defaultSensitivity *= value;
    console.log('Mouse delay set to: ' + value);
};

export const keyboardType = (value: string) => {
    typeString(value);
    console.log('Keyboard Typing: ' + value);
};

export function moveCursor(x: number, y: number) {
    mousePos = getMousePos();

    console.log(`Mouse Motion (${x},${y})`)

    posx += (screenSize.width / 32) * x
    posy += (screenSize.height / 18) * y

    moveMouse(posx, posy);

    console.log('Cursor moved to: ' + mousePos.x + ', ' + mousePos.y);
};

export function centerCursor() {
    posx = screenSize.width / 2
    posy = screenSize.height / 2
}

export function rightClick() {
    mouseClick('right');
}

export function leftClick() {
    mouseClick('left');
}
