"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyboardType = exports.changeSensitivity = void 0;
exports.initRobot = initRobot;
exports.updateScreenSize = updateScreenSize;
exports.moveCursor = moveCursor;
exports.centerCursor = centerCursor;
exports.rightClick = rightClick;
exports.leftClick = leftClick;
exports.performShortcut = performShortcut;
var robotjs_1 = require("@jitsi/robotjs");
var screenSize = (0, robotjs_1.getScreenSize)();
var mousePos = (0, robotjs_1.getMousePos)();
var defaultSensitivity;
function initRobot(config) {
    (0, robotjs_1.setMouseDelay)(1);
    defaultSensitivity = config.defaultSensitivity;
    updateScreenSize();
}
function updateScreenSize() {
    screenSize = (0, robotjs_1.getScreenSize)();
}
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
    var _a = checkScreenBoundaries(x, y), newX = _a.x, newY = _a.y;
    mousePos = (0, robotjs_1.getMousePos)();
    console.log("Mouse Motion (".concat(newX, ",").concat(newY, ")"));
    (0, robotjs_1.moveMouse)(mousePos.x + newX, mousePos.y + newY);
    console.log('Cursor moved to: ' + mousePos.x + ', ' + mousePos.y);
}
function centerCursor() {
    (0, robotjs_1.moveMouse)(screenSize.width / 2, screenSize.height / 2);
}
function rightClick() {
    (0, robotjs_1.mouseClick)('right');
}
function leftClick() {
    (0, robotjs_1.mouseClick)('left');
}
function performShortcut(shortcut) {
    switch (shortcut) {
        case 'next_slide':
            (0, robotjs_1.keyTap)('right');
            break;
        case 'previous_slide':
            (0, robotjs_1.keyTap)('left');
            break;
        case 'start_presentation':
            (0, robotjs_1.keyTap)('f5');
            break;
        case 'end_presentation':
            (0, robotjs_1.keyTap)('esc');
            break;
        default:
            console.log('Unknown shortcut:', shortcut);
    }
}
function checkScreenBoundaries(x, y) {
    var currentPos = (0, robotjs_1.getMousePos)();
    var newX = Math.max(0, Math.min(screenSize.width, currentPos.x + x));
    var newY = Math.max(0, Math.min(screenSize.height, currentPos.y + y));
    return { x: newX - currentPos.x, y: newY - currentPos.y };
}
//# sourceMappingURL=robot.js.map