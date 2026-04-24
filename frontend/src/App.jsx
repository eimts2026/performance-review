import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import ReactDOM from 'react-dom/client'
import { BrowserReact } from 'react-router-dom'
import heroImg from './assets/hero.png'
import './App.css'

// Page Imports
import Home from './pages/Home'
import MainForm from './pages/MainForm'
import About from './pages/About'

// NavBar
import NavBar from './components/NavBar'

// Code
function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/form" element={<MainForm />} />
      </Routes>
    </>
  );
}

export default App;
