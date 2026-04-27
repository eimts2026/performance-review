import { Routes, Route } from 'react-router-dom' // Fixed imports
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