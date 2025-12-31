// src/main/capture.js
import { clipboard, app, BrowserWindow } from 'electron'
import chokidar from 'chokidar'
import path from 'path'
import fs from 'fs'
import { dbHelpers } from './db.js'
import crypto from 'crypto'

const ASSETS_PATH = path.join(app.getPath('userData'), 'assets')
if (!fs.existsSync(ASSETS_PATH)) {
  fs.mkdirSync(ASSETS_PATH, { recursive: true })
}

let lastText = ''
let lastImageHash = ''

// Helper to classify clipboard text
function classifyText(text) {
  // Check if it's a URL
  if (text.match(/^https?:\/\//)) {
    return 'url'
  }

  // Check if it looks like code (multiple lines with indentation or common code patterns)
  if (
    text.includes('\n') &&
    (text.includes('  ') || text.includes('\t') || text.match(/[{};()]/g)?.length > 3)
  ) {
    return 'code'
  }

  return 'text'
}

// Notify renderer of new entry
function notifyNewEntry(entry) {
  const windows = BrowserWindow.getAllWindows()
  if (windows.length > 0) {
    windows[0].webContents.send('new-entry', entry)
  }
}

export function initCapture() {
  console.log('Starting capture system...')

  // --- CLIPBOARD MONITOR ---
  setInterval(async () => {
    try {
      // Check for text
      const text = clipboard.readText()
      if (text && text !== lastText && text.length > 0) {
        lastText = text

        const contentType = classifyText(text)
        const entry = await dbHelpers.addEntry({
          type: 'clipboard',
          contentType,
          content: text,
          timestamp: Date.now()
        })

        notifyNewEntry(entry)
        console.log(`Captured clipboard ${contentType}:`, text.substring(0, 50) + '...')
      }

      // Check for images
      const image = clipboard.readImage()
      if (!image.isEmpty()) {
        const buffer = image.toBitmap()
        const hash = crypto.createHash('md5').update(buffer).digest('hex')

        if (hash !== lastImageHash) {
          lastImageHash = hash
          const fileName = `clip_${Date.now()}.png`
          const filePath = path.join(ASSETS_PATH, fileName)

          fs.writeFileSync(filePath, image.toPNG())

          const entry = await dbHelpers.addEntry({
            type: 'image',
            source: 'clipboard',
            filePath: filePath,
            fileName: fileName,
            timestamp: Date.now()
          })

          notifyNewEntry(entry)
          console.log('Captured clipboard image:', fileName)
        }
      }
    } catch (error) {
      console.error('Error monitoring clipboard:', error)
    }
  }, 1000)

  // --- SCREENSHOT WATCHER ---
  const screenshotPaths = [
    path.join(app.getPath('desktop')),
    path.join(app.getPath('pictures'), 'Screenshots')
  ]

  screenshotPaths.forEach((watchPath) => {
    if (fs.existsSync(watchPath)) {
      console.log('Watching for screenshots in:', watchPath)

      chokidar
        .watch(watchPath, {
          ignoreInitial: true,
          awaitWriteFinish: {
            stabilityThreshold: 2000,
            pollInterval: 100
          }
        })
        .on('add', async (filePath) => {
          try {
            const ext = path.extname(filePath).toLowerCase()
            if (['.png', '.jpg', '.jpeg'].includes(ext)) {
              const fileName = path.basename(filePath)

              // Copy to assets folder
              const newPath = path.join(ASSETS_PATH, `screenshot_${Date.now()}_${fileName}`)
              fs.copyFileSync(filePath, newPath)

              const entry = await dbHelpers.addEntry({
                type: 'image',
                source: 'screenshot',
                filePath: newPath,
                fileName: fileName,
                originalPath: filePath,
                timestamp: Date.now()
              })

              notifyNewEntry(entry)
              console.log('Captured screenshot:', fileName)
            }
          } catch (error) {
            console.error('Error processing screenshot:', error)
          }
        })
    }
  })

  console.log('Capture system initialized')
}
