import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'
import { CouponProvider } from './context/CouponContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CouponProvider>
      <App />
      <ToastContainer position="top-right" autoClose={3000} />
    </CouponProvider>
  </React.StrictMode>,
)
