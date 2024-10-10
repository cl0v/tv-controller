"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var websocket_1 = require("./src/websocket");
var electron_1 = require("electron");
(0, websocket_1.connectServer)();
console.log('working');
var createWindow = function () {
    var win = new electron_1.BrowserWindow({
        width: 800,
        height: 600
    });
    win.loadFile('index.html');
};
electron_1.app.whenReady().then(function () {
    createWindow();
    electron_1.app.on('activate', function () {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
function getIp() {
    var networkInterfaces = require('os').networkInterfaces;
    var nets = networkInterfaces();
    var results = Object.create(null);
    for (var _i = 0, _a = Object.keys(nets); _i < _a.length; _i++) {
        var name_1 = _a[_i];
        for (var _b = 0, _c = nets[name_1]; _b < _c.length; _b++) {
            var net = _c[_b];
            var familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
            if (net.family === familyV4Value && !net.internal) {
                if (!results[name_1]) {
                    results[name_1] = [];
                }
                results[name_1].push(net.address);
            }
        }
    }
    console.log(results.en0[0]);
}
getIp();
//# sourceMappingURL=main.js.map