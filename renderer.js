/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

const { ipcRenderer } = require('electron')

window.onload = () => {
  const summaryButton = document.getElementById('summary')
  const translateButton = document.getElementById('translate')
  const codeExplainButton = document.getElementById('codeExplain')
  summaryButton.addEventListener('click', () => {
    ipcRenderer.send('summary')
  })
  translateButton.addEventListener('click', () => {
    ipcRenderer.send('translate')
  })
  codeExplainButton.addEventListener('click', () => {
    ipcRenderer.send('codeExplain')
  })
}
