import '@radix-ui/themes/styles.css'
import './assets/main.css'

import { Theme } from '@radix-ui/themes'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Theme appearance="dark" accentColor="iris" panelBackground="translucent" radius="large">
      <App />
    </Theme>
  </StrictMode>
)
