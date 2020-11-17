import { useColorMode, Switch, Flex } from '@chakra-ui/core'
import React from 'react'

export const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  return (
    <Switch
      pt={0.5}
      position="fixed"
      top="1rem"
      right="1rem"
      color="green"
      isChecked={isDark}
      onChange={toggleColorMode}
    />
  )
}
