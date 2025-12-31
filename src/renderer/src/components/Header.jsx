// Header.jsx
import React, { useState } from 'react'
import { Flex, Box, Heading, TextField, IconButton } from '@radix-ui/themes'
import { MagnifyingGlassIcon, GearIcon, Cross2Icon } from '@radix-ui/react-icons'

export default function Header({ onSearch, searchQuery }) {
  const [query, setQuery] = useState(searchQuery || '')

  const handleSearch = (value) => {
    setQuery(value)
    onSearch(value)
  }

  const clearSearch = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <Flex
      align="center"
      justify="between"
      style={{
        padding: '0.75rem 1rem',
        borderBottom: '1px solid var(--gray-6)',
        backgroundColor: 'var(--gray-2)',
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}
    >
      {/* Left: App name/logo */}
      <Heading size="4" weight="bold">
        Recall
      </Heading>

      {/* Center: Searchbar */}
      <Flex justify="center" style={{ flex: 1, margin: '0 1rem' }}>
        <Box style={{ width: 'clamp(250px, 60%, 700px)' }}>
          <TextField.Root
            placeholder="Search clipboard content..."
            size="3"
            style={{ width: '100%' }}
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          >
            <TextField.Slot>
              <MagnifyingGlassIcon />
            </TextField.Slot>
            {query && (
              <TextField.Slot>
                <IconButton
                  size="1"
                  variant="ghost"
                  onClick={clearSearch}
                  style={{ cursor: 'pointer' }}
                >
                  <Cross2Icon />
                </IconButton>
              </TextField.Slot>
            )}
          </TextField.Root>
        </Box>
      </Flex>

      {/* Right: Settings */}
      <IconButton variant="ghost" color="iris" size="3" aria-label="Settings">
        <GearIcon />
      </IconButton>
    </Flex>
  )
}
