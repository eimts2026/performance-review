import { Routes, Route, useLocation } from 'react-router-dom' // Fixed imports
import './App.css'

// Page Imports
import Home from './pages/Home'
import MainForm from './pages/MainForm'
import About from './pages/About'
import SignUp from './pages/SignIn'
import AddEmployee from './pages/AddEmployee'
import Login from './pages/Login'
import ProbationForm from './pages/ProbationForm'
import ManagerDashboard from './pages/ManagerDashboard'

// NavBar
import NavBar from './components/NavBar'

// Code
function App () {
  const location = useLocation();

  // Hides the navbar for signin and 404 pages
  const hideNavbar = ["/signin", "/404", "/login"];
  const shouldHideNavbar = hideNavbar.includes(location.pathname)

  return (
    <>
      {!shouldHideNavbar && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<MainForm />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<SignUp />} />
        <Route path="/addEmployee" element={<AddEmployee />} />
        <Route path="/login" element={<Login />} />
        <Route path="/probation" element={<ProbationForm />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
      </Routes>
    </>
  );
}

export default App;