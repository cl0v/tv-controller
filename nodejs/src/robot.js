"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyboardType = exports.changeSensitivity = void 0;
exports.moveCursor = moveCursor;
exports.centerCursor = centerCursor;
exports.rightClick = rightClick;
exports.leftClick = leftClick;
var robotjs_1 = require("@jitsi/robotjs");
var screenSize = (0, robotjs_1.getScreenSize)();
var mousePos = (0, robotjs_1.getMousePos)();
(0, robotjs_1.setMouseDelay)(1);
var defaultSensitivity = 10;
var posx = 0;
var posy = 0;
var changeSensitivity = function (value) {
    (0, robotjs_1.setMouseDelay)(value);
    defaultSensitivity *= value;
    console.log('Mouse delay set to: ' + value);
};
exports.changeSensitivity = changeSensitivity;
var keyboardType = function (value) {
    (0, robotjs_1.typeString)(value);
    console.log('Keyboard Typing: ' + value);
};
exports.keyboardType = keyboardType;
function moveCursor(x, y) {
    mousePos = (0, robotjs_1.getMousePos)();
    console.log("Mouse Motion (".concat(x, ",").concat(y, ")"));
    posx += (screenSize.width / 32) * x;
    posy += (screenSize.height / 18) * y;
    (0, robotjs_1.moveMouse)(posx, posy);
    console.log('Cursor moved to: ' + mousePos.x + ', ' + mousePos.y);
}
;
function centerCursor() {
    posx = screenSize.width / 2;
    posy = screenSize.height / 2;
}
function rightClick() {
    (0, robotjs_1.mouseClick)('right');
}
function leftClick() {
    (0, robotjs_1.mouseClick)('left');
}
//# sourceMappingURL=robot.js.map