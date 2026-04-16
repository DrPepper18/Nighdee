import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx';
import { ModalProvider } from './components/Dialog/ModalContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ModalProvider>
    <App />
  </ModalProvider>
)