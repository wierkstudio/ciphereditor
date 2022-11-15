
import './styles/index.scss'
import * as Sentry from '@sentry/react'
import AppView from './views/app/app'
import React from 'react'
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'
import { store } from './store'

// Configure Sentry error reporting
if (process.env.APP_SENTRY_DSN !== undefined) {
  Sentry.init({
    dsn: process.env.APP_SENTRY_DSN,
    environment: process.env.APP_ENV,
    release: process.env.APP_RELEASE,
    maxBreadcrumbs: 0,
    autoSessionTracking: false
  })
}

// Configure React
const rootContainer = document.getElementById('root') as HTMLElement
const root = createRoot(rootContainer)
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AppView />
    </Provider>
  </React.StrictMode>
)
