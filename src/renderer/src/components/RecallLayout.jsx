// RecallLayout.jsx
import React, { useState, useEffect } from 'react'
import { Flex, Text } from '@radix-ui/themes'
import Header from './Header'
import FiltersBar from './FiltersBar'
import Timeline from './Timeline'

export default function RecallLayout() {
  const [entries, setEntries] = useState([])
  const [filters, setFilters] = useState({ type: 'all' })
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Load entries on mount
  useEffect(() => {
    // 1. Check if API is available immediately on mount
    if (!window.api) {
      console.error('❌ window.api is not defined. Preload script might have failed.')
      setLoading(false) // Stop loading so UI shows empty state instead of spinner
      return
    }

    loadEntries()

    // Listen for new entries from the main process
    const removeListener = window.api.onNewEntry((newEntry) => {
      console.log('✨ New entry received:', newEntry)
      setEntries((prev) => [newEntry, ...prev])
    })

    return () => {
      // Check existence before cleanup
      if (window.api) {
        window.api.removeNewEntryListener()
      }
    }
  }, [])

  // Reload when filters change
  useEffect(() => {
    if (!searchQuery) {
      loadEntries()
    }
  }, [filters])

  // Search when query changes
  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery)
    } else {
      loadEntries()
    }
  }, [searchQuery])

  const loadEntries = async () => {
    // SAFETY CHECK
    if (!window.api) {
      console.error('❌ loadEntries: window.api missing')
      setLoading(false)
      return
    }

    setLoading(true)
    console.log('🟡 loadEntries: Starting request...') // DEBUG LOG 1

    try {
      let data
      if (filters.type === 'all' && !filters.startDate && !filters.endDate) {
        console.log('🟡 loadEntries: Calling getEntries()...') // DEBUG LOG 2
        data = await window.api.getEntries()
      } else {
        console.log('🟡 loadEntries: Calling getEntriesFiltered()...') // DEBUG LOG 2
        data = await window.api.getEntriesFiltered(filters)
      }

      console.log('✅ loadEntries: Data received:', data) // DEBUG LOG 3
      setEntries(data || [])
    } catch (error) {
      console.error('❌ Error loading entries:', error)
      setEntries([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query) => {
    if (!query || query.trim() === '') {
      loadEntries()
      return
    }

    // SAFETY CHECK
    if (!window.api) return

    setLoading(true)
    try {
      console.log('🔍 Searching for:', query)
      const results = await window.api.searchEntries(query)
      setEntries(results || [])
    } catch (error) {
      console.error('❌ Error searching:', error)
      setEntries([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleDelete = async (id) => {
    if (!window.api) return
    try {
      await window.api.deleteEntry(id)
      setEntries((prev) => prev.filter((entry) => entry._id !== id))
    } catch (error) {
      console.error('Error deleting entry:', error)
    }
  }

  return (
    <Flex direction="column" style={{ minHeight: '100vh' }}>
      {/* Header at the top */}
      <Header onSearch={setSearchQuery} searchQuery={searchQuery} />

      {/* Filters row */}
      <FiltersBar onFilterChange={handleFilterChange} activeFilters={filters} />

      {/* Main content area */}
      <Flex
        direction="column"
        style={{
          flex: 1,
          padding: '1.5rem',
          overflowY: 'auto',
          backgroundColor: 'var(--gray-1)'
        }}
      >
        {loading ? (
          <Flex align="center" justify="center" style={{ height: '400px' }}>
            <Text size="4" color="gray">
              Loading...
            </Text>
          </Flex>
        ) : (
          <Timeline entries={entries} onDelete={handleDelete} onRefresh={loadEntries} />
        )}
      </Flex>
    </Flex>
  )
}
