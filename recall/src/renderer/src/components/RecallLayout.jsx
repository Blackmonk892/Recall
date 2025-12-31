// RecallLayout.jsx
import React from 'react'
import { Flex } from '@radix-ui/themes'
import Header from './Header'
import FiltersBar from './FiltersBar'
import Timeline from './Timeline'

export default function RecallLayout() {
  return (
    <Flex direction="column" style={{ minHeight: '100vh' }}>
      {/* Header at the top */}
      <Header />

      {/* Filters row */}
      <FiltersBar />

      {/* Main content area */}
      <Flex direction="column" style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
        <Timeline />
      </Flex>
    </Flex>
  )
}
