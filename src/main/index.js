// src/main/index.js
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png'
import { initCapture } from './capture.js'
import { dbHelpers } from './db.js'
import fs from 'fs'
import path from 'path'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    title: 'Recall',
    autoHideMenuBar: true,
    icon: icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Setup IPC handlers
function setupIpcHandlers() {
  // Get all entries
  ipcMain.handle('get-entries', async () => {
    try {
      return await dbHelpers.getAllEntries()
    } catch (error) {
      console.error('Error getting entries:', error)
      return []
    }
  })

  // Get filtered entries
  ipcMain.handle('get-entries-filtered', async (event, filters) => {
    try {
      return await dbHelpers.getFilteredEntries(filters)
    } catch (error) {
      console.error('Error filtering entries:', error)
      return []
    }
  })

  // Search entries
  ipcMain.handle('search-entries', async (event, query) => {
    try {
      return await dbHelpers.searchEntries(query)
    } catch (error) {
      console.error('Error searching entries:', error)
      return []
    }
  })

  // Get image as base64
  ipcMain.handle('get-image', async (event, filePath) => {
    try {
      if (fs.existsSync(filePath)) {
        const buffer = fs.readFileSync(filePath)
        const base64 = buffer.toString('base64')
        const ext = path.extname(filePath).toLowerCase()
        const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg'
        return `data:${mimeType};base64,${base64}`
      }
      return null
    } catch (error) {
      console.error('Error reading image:', error)
      return null
    }
  })

  // Delete entry
  ipcMain.handle('delete-entry', async (event, id) => {
    try {
      return await dbHelpers.deleteEntry(id)
    } catch (error) {
      console.error('Error deleting entry:', error)
      return false
    }
  })
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.recall')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  setupIpcHandlers()
  initCapture()
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
