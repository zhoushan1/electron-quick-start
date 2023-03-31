// 通过ipcRenderer将getText方法和setText方法暴露给渲染进程
const { ipcRenderer } = require('electron')

window.onload = () => {
  window.getText = () => document.getElementById('myTextArea').value
  window.setText = (text) => {
    document.getElementById('myTextArea').innerHTML = text
  }

  window.getToText = () => document.getElementById('toTextArea').value
  window.setToText = (text) => {
    document.getElementById('toTextArea').innerHTML = text
  }
}
