import { Routes, Route, useLocation } from 'react-router-dom' // Fixed imports
import './App.css'

// Page Imports
import Home from './pages/Home'
import MainForm from './pages/MainForm'
import About from './pages/About'
import SignUp from './pages/SignIn'

// NavBar
import NavBar from './components/NavBar'

// Code
function App () {
  const location = useLocation();

  // Hides the navbar for signin and 404 pages
  const hideNavbar = ["/signin", "/404"];
  const shouldHideNavbar = hideNavbar.includes(location.pathname)

  return (
    <>
      {!shouldHideNavbar && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<MainForm />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<SignUp />} />
      </Routes>
    </>
  );
}

export default App;