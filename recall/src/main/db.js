import PouchDB from 'pouchdb'
import path from 'path'
import { app } from 'electron'

// Save the DB in the OS-specific "AppData" folder
const dbPath = path.join(app.getPath('userData'), 'recall_db')
const db = new PouchDB(dbPath)

export default db
