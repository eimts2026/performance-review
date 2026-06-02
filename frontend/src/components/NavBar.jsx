import './NavBar.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function NavBar() {
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if(storedUser) {
            setUser(JSON.parse(storedUser))
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('user')
        setUser(null)
        navigate('/signin')
    }

    return (
        <>
            <nav className="navbar">
                {/* navbar left */}
                <div className="navbar-left">
                    <a href="/" className="logo">
                        Emerald Isle
                    </a>
                </div>
                {/* navbar center */}
                <div className="navbar-center">
                    <ul className="nav-links">
                        <li>
                            <a href="/about">About</a>
                        </li>
                        <li>
                            <a href="/">Home</a>
                        </li>
                        {user && user.role === 'HR' && (
                            <li>
                                <a href="/form">Appraisal Form</a>
                            </li>
                        )}
                    </ul>
                </div>
                {/* navbar right */}
                <div className="navbar-right">
                    {user ? (
                        <>
                            {user.role === 'HR' && (
                                <a href="/addEmployee" className="contact">Add Employee</a>
                            )}
                            <div className='user-info'>
                                <span className='username'>{user.first_name}</span>
                                <span className='user-role'>({user.role})</span>
                            </div>
                            <button onClick={handleLogout} className="logout-button">Logout</button>
                        </>
                    ) : (
                        <a href="/signin" className="contact">Sign In</a>
                    )}
                </div>
            </nav>
        </>
    );
}

export default NavBar;