import { clipboard, app } from 'electron'
import { BrowserWindow } from 'electron'
import chokidar from 'chokidar'
import path from 'path'
import fs from 'fs'
import db from './db.js'
import crypto from 'crypto'

const ASSETS_PATH = path.join(app.getPath('userData'), 'assets')
if (!fs.existsSync(ASSETS_PATH)) fs.mkdirSync(ASSETS_PATH, { recursive: true })

let lastText = ''
let lastImageHash = ''

export function initCapture() {
  // --- CLIPBOARD MONITOR ---
  setInterval(async () => {
    const text = clipboard.readText()
    if (text && text !== lastText) {
      lastText = text
      await db.post({
        type: 'clipboard',
        content: text,
        timestamp: Date.now()
      })
    }

    const image = clipboard.readImage()
    if (!image.isEmpty()) {
      const hash = crypto.createHash('md5').update(image.toBitmap()).digest('hex')
      if (hash !== lastImageHash) {
        lastImageHash = hash
        const fileName = `clip_${Date.now()}.png`
        const filePath = path.join(ASSETS_PATH, fileName)
        fs.writeFileSync(filePath, image.toPNG())

        await db.post({
          type: 'image',
          filePath: filePath,
          timestamp: Date.now()
        })
      }
    }
  }, 1000)

  // --- SCREENSHOT WATCHER ---
  // Watch common Windows/Mac screenshot folders
  const watchPath = path.join(app.getPath('pictures'), 'Screenshots')
  chokidar.watch(watchPath, { ignoreInitial: true }).on('add', async (file) => {
    await db.post({
      type: 'image',
      filePath: file,
      timestamp: Date.now(),
      source: 'system'
    })
  })
}
