import { useState } from 'react'
import './App.css'
import LinkPage from './pages/linkPage'
import LoginPage from './pages/logipage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import RegisterPage from './pages/registerPage'
import ForgetPasswordPage from './pages/forgetpaswordPage'
import AdminPage from './pages/adminpage'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'

function App() {
  return (
    <GoogleOAuthProvider clientId="318874002718-a8fr6npu5thott8pus0svt19ii9pqc84.apps.googleusercontent.com">
      <BrowserRouter>
        <Toaster />
        <div className='w-full h-screen bg-[#F3F4F6] text-[#1F1F1F]'>
          <Routes>
            <Route path="/*" element={<LinkPage />} />
            <Route path="/admin/*" element={<AdminPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/froget-password" element={<ForgetPasswordPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </GoogleOAuthProvider>
  )
}

export default App
