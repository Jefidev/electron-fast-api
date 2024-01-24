const { app, BrowserWindow, ipcMain } = require('electron')

const path = require('path')
const INDEX_PATH = path.join(__dirname, '../../src/index.html')
const API_SRC_DEV = path.join(__dirname, '../../../api/app.py')
const { net } = require('electron')
const execFile = require('child_process').execFile

if (process.platform === 'win32') {
    const API_PROD_LINUX = path.join(process.resourcesPath, '../lib/app/app.exe')
}
else if (process.platform === 'linux' || process.platform === 'darwin') {
    const API_PROD_LINUX = path.join(process.resourcesPath, '../lib/app/app')
}

const fs = require("fs");

var win

if (!fs.existsSync(API_PROD_LINUX)) {
    try {
        require('electron-reloader')(module)
    } catch (_) { }

    const {
        PythonShell
    } = require('python-shell')

    PythonShell.run(API_SRC_DEV, function (err, results) {
        if (err) console.log(err)
    })
}
else {
    execFile(API_PROD_LINUX, { windowsHide: true }, (error, stdout, stderr) => {
        if (error) {
            throw error;
        }
        console.log(stdout);
    });
}



const createWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        }
    })

    win.loadFile(INDEX_PATH)
    if (!fs.existsSync(API_PROD_LINUX)) {
        win.webContents.openDevTools()
    }
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// kill all child process before-quit
app.on("before-quit", function () {
    if (!fs.existsSync(API_PROD_LINUX)) {
        console.log("kill")
        PythonShell.kill(API_SRC_DEV)
    }
    else {
        execFile().kill("SIGINT")
    }
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

ipcMain.handle('hello', (event, value) => {
    const req = net.request('http://127.0.0.1:7777/hello/' + value);

    req.on('response', (res) => {
        const data = [];
        res.on('data', (chunk) => {
            data.push(chunk)
        })
        res.on('end', () => {
            const result = Buffer.concat(data).toString();
            console.log(result);
            win.webContents.send('sendResponse', result);
        })

    });

    req.end()
})