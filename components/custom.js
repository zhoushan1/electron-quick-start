const { app, BrowserWindow, screen, ipcMain } = require('electron')

let mainWindow

ipcMain.on('save', (event, arg) => {
  console.log('保存')
})

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 550,
    height: 540,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  })

  // 在主窗口中加载HTML文件
  mainWindow.loadFile('custom.html')

  // 当窗口关闭时触发，将mainWindow设置为null
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  mainWindow.on('blur', () => {
    mainWindow.hide()
  })
}

function customShowPopover() {
  const mousePosition = screen.getCursorScreenPoint()
  const { width, height } = mainWindow.getBounds()

  mainWindow.setPosition(mousePosition.x, mousePosition.y - height)
  mainWindow.show()
}

function customHidePopover() {
  mainWindow.hide()
}

// 当应用准备好时触发

app.whenReady().then(() => {
  createWindow()
})
// macOS通常在所有窗口都关闭后退出，但实际上即使在macOS上点击Dock图标后也会创建新的窗口
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// 当所有窗口都关闭时触发
app.on('window-all-closed', () => {
  // 如果不是在macOS上，退出应用
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 在主进程中提供获取和设置TextArea值的API
const getTitle = () => {
  return mainWindow.webContents.executeJavaScript('window.getTitle()')
}

const getPrompt = () => {
  return mainWindow.webContents.executeJavaScript('window.getPrompt()')
}

// const setText = (text) => {
//   mainWindow.webContents.executeJavaScript(`window.setText('${text}')`)
// }

// // 在主进程中提供获取和设置TextArea值的API
// const getToText = () => {
//   return mainWindow.webContents.executeJavaScript('window.getToText()')
// }

// const setToText = (text) => {
//   mainWindow.webContents.executeJavaScript(`window.setToText('${text}')`)
// }

module.exports = {
  customShowPopover,
  customHidePopover,
  getTitle,
  getPrompt,
}
