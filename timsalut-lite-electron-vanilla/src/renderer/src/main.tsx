import './assets/global.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { ElectronAPI } from '@electron-toolkit/preload';
import { router } from '@/routes'
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider
      defaultTheme="system"
      storageKey="vite-ui-theme"
    >
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
)
