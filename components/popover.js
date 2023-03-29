const {
  app,
  BrowserWindow,
  globalShortcut,
  clipboard,
  screen,
} = require('electron')

let popoverWindow

function createPopover() {
  console.log('Creating Popover666')
  popoverWindow = new BrowserWindow({
    width: 200,
    height: 50,
    // transparent: true,
    frame: false,
    alwaysOnTop: true,
    show: false,
  })

  popoverWindow.loadFile('popover.html')

  popoverWindow.on('blur', () => {
    popoverWindow.hide()
  })
}

function showPopover(text) {
  const mousePosition = screen.getCursorScreenPoint()
  const { width, height } = popoverWindow.getBounds()

  popoverWindow.setPosition(mousePosition.x, mousePosition.y - height)
  popoverWindow.show()
  console.log('复制内容:', text)
}

app.whenReady().then(() => {
  createPopover()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
  globalShortcut.unregisterAll()
})

module.exports = {
  createPopover,
  showPopover,
}
