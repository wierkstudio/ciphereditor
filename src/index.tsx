
import React from 'react'
import ReactDOM from 'react-dom'
import 'styles/index.scss'
import AppView from 'views/app/app'
import { store } from './store'
import { Provider } from 'react-redux'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <AppView />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
