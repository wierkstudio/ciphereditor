
import './styles/index.scss'
import AppView from './views/app/app'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { store } from './store'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <AppView />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
