// Timeline.jsx
import React from 'react'
import { Flex, Text, Card, Box } from '@radix-ui/themes'

export default function Timeline() {
  return (
    <Flex
      direction="column"
      gap="5"
      style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}
    >
      {/* Date divider */}
      <Text size="5" weight="bold" color="gray" style={{ marginBottom: '1rem' }}>
        Today
      </Text>

      {/* Grid of cards */}
      <Flex
        wrap="wrap"
        gap="4"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {/* Example screenshot card */}
        <Card
          style={{
            padding: '1rem',
            borderRadius: '12px',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <Text size="3" weight="medium">
            📸 Screenshot - Error log
          </Text>
          <Box
            style={{
              marginTop: '0.5rem',
              backgroundColor: 'var(--gray-3)',
              height: '150px',
              borderRadius: '8px'
            }}
          >
            {/* Thumbnail placeholder */}
          </Box>
          <Text size="2" color="gray">
            Saved at 10:15 AM
          </Text>
        </Card>

        {/* Example clipboard card */}
        <Card
          style={{
            padding: '1rem',
            borderRadius: '12px',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <Text size="3" weight="medium">
            📋 Clipboard - Code snippet
          </Text>
          <Box
            style={{
              marginTop: '0.5rem',
              backgroundColor: 'var(--gray-3)',
              padding: '0.75rem',
              borderRadius: '8px',
              fontFamily: 'monospace'
            }}
          >
            npm install my-app
          </Box>
          <Text size="2" color="gray">
            Saved at 9:50 AM
          </Text>
        </Card>
      </Flex>
    </Flex>
  )
}
