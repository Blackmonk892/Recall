// preload/index.js
import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  // Get all entries
  getEntries: () => ipcRenderer.invoke('get-entries'),

  // Get entries with filters
  getEntriesFiltered: (filters) => ipcRenderer.invoke('get-entries-filtered', filters),

  // Search entries
  searchEntries: (query) => ipcRenderer.invoke('search-entries', query),

  // Get image as base64
  getImage: (filePath) => ipcRenderer.invoke('get-image', filePath),

  // Delete entry
  deleteEntry: (id) => ipcRenderer.invoke('delete-entry', id),

  // Listen for new entries
  onNewEntry: (callback) => {
    ipcRenderer.on('new-entry', (event, entry) => callback(entry))
  },

  // Remove listener
  removeNewEntryListener: () => {
    ipcRenderer.removeAllListeners('new-entry')
  }
})
