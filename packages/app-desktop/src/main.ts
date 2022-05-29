
import * as path from 'path'
import { app, shell, BrowserWindow } from 'electron'

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    titleBarStyle: 'hidden',
    trafficLightPosition: {
      x: 16,
      y: 20
    },
    width: 1024,
    height: 800,
    webPreferences: {
      preload: path.resolve(__dirname, 'preload.js')
    }
  })

  // Open links in an external browser
  mainWindow.webContents.setWindowOpenHandler(details => {
    void shell.openExternal(details.url)
    return { action: 'deny' }
  })

  void mainWindow.loadFile(path.resolve(__dirname, 'web/index.html'))
}

void app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
