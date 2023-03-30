const { app, BrowserWindow, screen } = require('electron')
let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 450,
    height: 560,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  })

  mainWindow.loadFile('summary.html')

  // 当窗口关闭时触发，将mainWindow设置为null
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  mainWindow.on('blur', () => {
    mainWindow.hide()
  })
}

function showSummaryPopover() {
  const mousePosition = screen.getCursorScreenPoint()
  if (mainWindow) {
    const { width, height } = mainWindow.getBounds()

    mainWindow.setPosition(mousePosition.x, mousePosition.y - height)
    mainWindow.show()
    setSummaryTextArea('')
    setSummaryTextArea('loading...')
  }
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

const setSummaryTextArea = (text) => {
  mainWindow.webContents.executeJavaScript(
    `window.setSummaryTextArea('${text}')`
  )
}

const setSummaryTitle = (text) => {
  mainWindow.webContents.executeJavaScript(`window.setTitle('${text}')`)
}

module.exports = {
  setSummaryTextArea,
  showSummaryPopover,
  setSummaryTitle,
}
