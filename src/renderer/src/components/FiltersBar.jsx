// FiltersBar.jsx
import React, { useState } from 'react'
import { Flex, Button, Popover, Box } from '@radix-ui/themes'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

export default function FiltersBar({ onFilterChange, activeFilters }) {
  const [selectedDate, setSelectedDate] = useState(null)

  const handleTypeFilter = (type) => {
    onFilterChange({ ...activeFilters, type })
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    if (date) {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      onFilterChange({
        ...activeFilters,
        startDate: startOfDay.getTime(),
        endDate: endOfDay.getTime()
      })
    } else {
      onFilterChange({
        ...activeFilters,
        startDate: null,
        endDate: null
      })
    }
  }

  const clearDateFilter = () => {
    setSelectedDate(null)
    onFilterChange({
      ...activeFilters,
      startDate: null,
      endDate: null
    })
  }

  const clearAllFilters = () => {
    setSelectedDate(null)
    onFilterChange({ type: 'all' })
  }

  return (
    <Flex
      align="center"
      justify="start"
      gap="3"
      style={{
        padding: '1rem',
        borderBottom: '1px solid var(--gray-6)',
        backgroundColor: 'var(--gray-2)'
      }}
    >
      {/* Type filters */}
      <Flex gap="2">
        <Button
          variant={activeFilters.type === 'all' ? 'solid' : 'soft'}
          size="2"
          onClick={() => handleTypeFilter('all')}
        >
          📦 All
        </Button>
        <Button
          variant={activeFilters.type === 'image' ? 'solid' : 'soft'}
          size="2"
          onClick={() => handleTypeFilter('image')}
        >
          📸 Screenshots
        </Button>
        <Button
          variant={activeFilters.type === 'clipboard' ? 'solid' : 'soft'}
          size="2"
          onClick={() => handleTypeFilter('clipboard')}
        >
          📋 Clipboard
        </Button>
      </Flex>

      {/* Calendar filter */}
      <Popover.Root>
        <Popover.Trigger>
          <Button variant={selectedDate ? 'solid' : 'outline'} size="2">
            📅 {selectedDate ? selectedDate.toLocaleDateString() : 'Date'}
          </Button>
        </Popover.Trigger>
        <Popover.Content>
          <Box style={{ padding: '0.5rem' }}>
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              defaultMonth={new Date()}
            />
            {selectedDate && (
              <Button
                size="2"
                variant="soft"
                style={{ width: '100%', marginTop: '0.5rem' }}
                onClick={clearDateFilter}
              >
                Clear Date
              </Button>
            )}
          </Box>
        </Popover.Content>
      </Popover.Root>

      {/* Clear all filters */}
      {(activeFilters.type !== 'all' || selectedDate) && (
        <Button size="2" variant="ghost" color="gray" onClick={clearAllFilters}>
          Clear All
        </Button>
      )}
    </Flex>
  )
}
