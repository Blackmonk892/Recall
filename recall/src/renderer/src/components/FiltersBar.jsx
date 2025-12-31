// FiltersBar.jsx
import React from 'react'
import { Flex, Button, Popover } from '@radix-ui/themes'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

export default function FiltersBar() {
  return (
    <Flex
      align="center"
      justify="start"
      gap="3"
      style={{
        padding: '1rem'
        // ❌ Removed borderBottom and backgroundColor
        // ❌ Removed sticky positioning so it doesn’t look like a bar
      }}
    >
      {/* Type filters */}
      <Flex gap="2">
        <Button variant="soft" size="2">
          📸 Screenshots
        </Button>
        <Button variant="soft" size="2">
          📋 Clipboard
        </Button>
      </Flex>

      {/* Calendar filter */}
      <Popover.Root>
        <Popover.Trigger>
          <Button variant="outline" size="2">
            📅 Date
          </Button>
        </Popover.Trigger>
        <Popover.Content>
          <DayPicker mode="single" />
        </Popover.Content>
      </Popover.Root>
    </Flex>
  )
}
