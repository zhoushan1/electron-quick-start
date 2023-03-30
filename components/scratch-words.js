const { app, globalShortcut, clipboard } = require('electron')
const popoverObj = require('./popover')

// 保存上一次读取的剪贴板文本内容
let lastText = clipboard.readText()

// 定时器，每秒钟检查一次剪贴板数据是否发生变化
const timer = setInterval(() => {
  // 读取当前的剪贴板文本内容
  const text = clipboard.readText()
  if (text !== lastText) {
    lastText = text
    popoverObj.showPopover(lastText)
  }
}, 1000)

app.whenReady().then(() => {
  // globalShortcut.register('CmdOrCtrl+X+C', () => {
  //   // const text = clipboard.readText()
  //   // // popoverObj.showPopover(text)
  //   // console.log('输出', text)
  // })
})

app.on('will-quit', () => {
  clearInterval(timer)
  // 注销全局快捷键
  globalShortcut.unregisterAll()
})
