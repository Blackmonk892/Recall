// src/main/db.js
import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'
import path from 'path'
import { app } from 'electron'

PouchDB.plugin(PouchDBFind)

// Save the DB in the OS-specific "AppData" folder
const dbPath = path.join(app.getPath('userData'), 'recall_db')
const db = new PouchDB(dbPath)

// Create indexes for better query performance
async function initIndexes() {
  try {
    await db.createIndex({
      index: { fields: ['timestamp'] }
    })
    await db.createIndex({
      index: { fields: ['type'] }
    })
    await db.createIndex({
      index: { fields: ['type', 'timestamp'] }
    })
    console.log('Database indexes created')
  } catch (error) {
    console.error('Error creating indexes:', error)
  }
}

initIndexes()

// Helper functions
export const dbHelpers = {
  // Add new entry
  async addEntry(entry) {
    try {
      const doc = {
        ...entry,
        _id: `${entry.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString()
      }
      const result = await db.put(doc)
      return { ...doc, _id: result.id, _rev: result.rev }
    } catch (error) {
      console.error('Error adding entry:', error)
      throw error
    }
  },

  // Get all entries sorted by timestamp
  async getAllEntries(limit = 100) {
    try {
      const result = await db.find({
        selector: { timestamp: { $gte: 0 } },
        sort: [{ timestamp: 'desc' }],
        limit
      })
      return result.docs
    } catch (error) {
      console.error('Error getting entries:', error)
      return []
    }
  },

  // Get entries with filters
  async getFilteredEntries(filters) {
    try {
      const selector = { timestamp: { $gte: 0 } }

      if (filters.type && filters.type !== 'all') {
        selector.type = filters.type
      }

      if (filters.startDate) {
        selector.timestamp = { $gte: filters.startDate }
      }

      if (filters.endDate) {
        selector.timestamp = {
          ...selector.timestamp,
          $lte: filters.endDate
        }
      }

      const result = await db.find({
        selector,
        sort: [{ timestamp: 'desc' }],
        limit: filters.limit || 100
      })

      return result.docs
    } catch (error) {
      console.error('Error filtering entries:', error)
      return []
    }
  },

  // Search entries by content
  async searchEntries(query) {
    try {
      const allDocs = await db.allDocs({ include_docs: true })
      const searchLower = query.toLowerCase()

      return allDocs.rows
        .map((row) => row.doc)
        .filter((doc) => {
          if (doc.content && typeof doc.content === 'string') {
            return doc.content.toLowerCase().includes(searchLower)
          }
          return false
        })
        .sort((a, b) => b.timestamp - a.timestamp)
    } catch (error) {
      console.error('Error searching entries:', error)
      return []
    }
  },

  // Delete entry
  async deleteEntry(id) {
    try {
      const doc = await db.get(id)
      await db.remove(doc)
      return true
    } catch (error) {
      console.error('Error deleting entry:', error)
      return false
    }
  }
}

export default db
