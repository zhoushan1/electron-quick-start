const {
  app,
  BrowserWindow,
  globalShortcut,
  clipboard,
  screen,
  ipcMain,
} = require('electron')
const path = require('path')
const request = require('request')
const util = require('util')
const {
  GPT_KEY,
  PROXY_IP,
  PROXY_PORT,
  CHAT_URl,
} = require('../secret/constant.js')
const translateComponent = require('./translate.js')
const { showSummaryPopover, setSummaryTextArea } = require('./summary.js')

// process.on('uncaughtException', function (error) {
//   console.error('catch uncaughtException', error)
// })

let popoverWindow
let copyText = ''

ipcMain.on('summary', (event, arg) => {
  console.log('总结', copyText)
  fetchData({
    prompt: `Reply in Chinese. Summarize the following as concisely as possible, output as ordered list:\n ${copyText}`,
    handler: setSummaryTextArea,
  })
  showSummaryPopover(copyText)
})

ipcMain.on('translate', (event, arg) => {
  console.log('翻译', copyText)
  fetchData({
    prompt: `Translate the following into Chinese and only show me the translated content.If it is already in Chinese,translate it into English and only show me the translated content:\n ${copyText}`,
    handler: translateComponent.setToText,
  })
  translateComponent.showTransPopover(copyText)
})

ipcMain.on('codeExplain', (event, arg) => {
  console.log('代码解析', copyText)
  fetchData({
    prompt: `Reply in Chinese.Explain the following code:\n ${copyText}`,
    handler: setSummaryTextArea,
  })
  showSummaryPopover(copyText)
})

function fetchData({ prompt, handler }) {
  let proxy = util.format('http://%s:%d', PROXY_IP, PROXY_PORT)

  const data = {
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-3.5-turbo',
  }

  const options = {
    url: CHAT_URl,
    proxy: proxy,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GPT_KEY}`,
    },
    body: JSON.stringify(data),
  }
  try {
    console.log('请求开始')
    request.post(options, (error, response, body) => {
      console.log('请求结束end', body)
      if (error) {
        console.error(error)
        return
      }
      const content = JSON.parse(body)['choices'][0]['message']['content']
      const newContent = content.replace(/\n/g, '<br>')
      handler(newContent)
    })
  } catch (error) {
    handler(JSON.stringify(error.message))
  }
}

function createPopover() {
  console.log('Creating Popover666')
  popoverWindow = new BrowserWindow({
    width: 200,
    height: 50,
    // transparent: true,
    frame: false,
    // alwaysOnTop: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
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
  copyText = text
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
