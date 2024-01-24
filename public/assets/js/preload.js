
const { contextBridge, ipcRenderer, ipcMain } = require('electron')

let apiBridge = {
    hello: async (value) => {
        var res = await ipcRenderer.invoke('hello', value)

    },

}

ipcRenderer.on('sendResponse', (event, res) => {
    var datares = document.getElementById('dataResult')
    datares.innerText = res
})

contextBridge.exposeInMainWorld('apiBridge', apiBridge)