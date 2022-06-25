
import './styles/index.scss'
import AppView from './views/app/app'
import React from 'react'
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'
import { store } from './store'

const rootContainer = document.getElementById('root') as HTMLElement
const root = createRoot(rootContainer)
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AppView />
    </Provider>
  </React.StrictMode>
)
