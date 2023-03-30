/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

const { ipcRenderer } = require('electron')
const Store = require('electron-store')
const store = new Store()

window.onload = () => {
  const summaryButton = document.getElementById('summary')
  const translateButton = document.getElementById('translate')
  const codeExplainButton = document.getElementById('codeExplain')
  const addButton = document.getElementById('add')
  const delButton = document.getElementById('del')
  const listButton = document.getElementById('custom-btn-list')

  const localList = store.get('localCustomList')
    ? JSON.parse(store.get('localCustomList'))
    : []
  summaryButton.addEventListener('click', () => {
    ipcRenderer.send('summary')
  })
  translateButton.addEventListener('click', () => {
    ipcRenderer.send('translate')
  })
  codeExplainButton.addEventListener('click', () => {
    ipcRenderer.send('codeExplain')
  })
  addButton.addEventListener('click', () => {
    ipcRenderer.send('add')
  })
  delButton.addEventListener('click', () => {
    if (localList.length > 0) {
      const childElements = document.querySelectorAll('.custom-btn')
      const lastElement = childElements[childElements.length - 1]
      listButton.removeChild(lastElement)
      const newList = localList.slice(0, -1)
      store.set('localCustomList', JSON.stringify(newList))
    }
  })

  if (localList.length > 0) {
    for (let i = 0; i < localList.length; i++) {
      const cur = localList[i]
      const btnItem = `<button class='btn custom-btn' id='${i}'>${cur.name}</button>`
      listButton.innerHTML += btnItem
    }
  }
  listButton.addEventListener('click', (event) => {
    if (event.target.attributes.id) {
      // 做相关的处理，例如：
      console.log(
        '点击了 ',
        event.target.attributes.id.nodeValue,
        event.target.attributes
      )
      ipcRenderer.send('customBtnClick', event.target.attributes.id.nodeValue)
    }
  })
}
