// Timeline.jsx
import React, { useState, useEffect } from 'react'
import { Flex, Text, Card, Box, IconButton, Badge } from '@radix-ui/themes'
import { TrashIcon, CopyIcon, ExternalLinkIcon } from '@radix-ui/react-icons'

export default function Timeline({ entries, onDelete, onRefresh }) {
  const [images, setImages] = useState({})

  // Load images
  useEffect(() => {
    entries.forEach((entry) => {
      if (entry.type === 'image' && !images[entry._id]) {
        loadImage(entry._id, entry.filePath)
      }
    })
  }, [entries])

  const loadImage = async (id, filePath) => {
    try {
      const base64 = await window.api.getImage(filePath)
      if (base64) {
        setImages((prev) => ({ ...prev, [id]: base64 }))
      }
    } catch (error) {
      console.error('Error loading image:', error)
    }
  }

  // Group entries by date
  const groupedEntries = entries.reduce((groups, entry) => {
    const date = new Date(entry.timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    let dateKey
    if (date.toDateString() === today.toDateString()) {
      dateKey = 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateKey = 'Yesterday'
    } else {
      dateKey = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(entry)
    return groups
  }, {})

  const handleCopy = (entry) => {
    if (entry.content) {
      navigator.clipboard.writeText(entry.content)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this entry?')) {
      await onDelete(id)
      onRefresh()
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getIcon = (entry) => {
    if (entry.type === 'image') {
      return entry.source === 'screenshot' ? '📸' : '🖼️'
    }
    if (entry.contentType === 'code') return '💻'
    if (entry.contentType === 'url') return '🔗'
    return '📋'
  }

  const getLabel = (entry) => {
    if (entry.type === 'image') {
      return entry.source === 'screenshot' ? 'Screenshot' : 'Image'
    }
    if (entry.contentType === 'code') return 'Code'
    if (entry.contentType === 'url') return 'URL'
    return 'Text'
  }

  if (entries.length === 0) {
    return (
      <Flex align="center" justify="center" style={{ height: '400px' }}>
        <Box style={{ textAlign: 'center' }}>
          <Text size="6" weight="bold" color="gray">
            📋
          </Text>
          <Text size="4" color="gray" style={{ display: 'block', marginTop: '1rem' }}>
            No entries yet
          </Text>
          <Text size="2" color="gray" style={{ display: 'block', marginTop: '0.5rem' }}>
            Copy text or take a screenshot to get started
          </Text>
        </Box>
      </Flex>
    )
  }

  return (
    <Flex
      direction="column"
      gap="5"
      style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}
    >
      {Object.entries(groupedEntries).map(([dateKey, dateEntries]) => (
        <Box key={dateKey}>
          <Text
            size="5"
            weight="bold"
            color="gray"
            style={{ marginBottom: '1rem', display: 'block' }}
          >
            {dateKey}
          </Text>

          <Flex
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {dateEntries.map((entry) => (
              <Card
                key={entry._id}
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer',
                  position: 'relative'
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
                <Flex justify="between" align="center" style={{ marginBottom: '0.5rem' }}>
                  <Flex gap="2" align="center">
                    <Text size="3" weight="medium">
                      {getIcon(entry)} {getLabel(entry)}
                    </Text>
                  </Flex>
                  <Flex gap="1">
                    {entry.content && (
                      <IconButton
                        size="1"
                        variant="ghost"
                        onClick={() => handleCopy(entry)}
                        title="Copy"
                      >
                        <CopyIcon />
                      </IconButton>
                    )}
                    <IconButton
                      size="1"
                      variant="ghost"
                      color="red"
                      onClick={() => handleDelete(entry._id)}
                      title="Delete"
                    >
                      <TrashIcon />
                    </IconButton>
                  </Flex>
                </Flex>

                {entry.type === 'image' ? (
                  <Box
                    style={{
                      marginTop: '0.5rem',
                      backgroundColor: 'var(--gray-3)',
                      minHeight: '180px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {images[entry._id] ? (
                      <img
                        src={images[entry._id]}
                        alt="Captured"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <Text size="2" color="gray">
                        Loading...
                      </Text>
                    )}
                  </Box>
                ) : (
                  <Box
                    style={{
                      marginTop: '0.5rem',
                      backgroundColor: 'var(--gray-3)',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      fontFamily: entry.contentType === 'code' ? 'monospace' : 'inherit',
                      fontSize: entry.contentType === 'code' ? '0.85rem' : 'inherit',
                      maxHeight: '150px',
                      overflow: 'auto',
                      wordBreak: 'break-word'
                    }}
                  >
                    {entry.contentType === 'url' ? (
                      <a
                        href={entry.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--accent-9)', textDecoration: 'none' }}
                      >
                        {entry.content}
                      </a>
                    ) : (
                      <Text size="2">{entry.content}</Text>
                    )}
                  </Box>
                )}

                <Text size="1" color="gray" style={{ marginTop: '0.5rem', display: 'block' }}>
                  {formatTime(entry.timestamp)}
                </Text>
              </Card>
            ))}
          </Flex>
        </Box>
      ))}
    </Flex>
  )
}
