import './NavBar.css'

function NavBar() {
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
                        <li>
                            <a href="/form">Form</a>
                        </li>
                    </ul>
                </div>
                {/* navbar right */}
                <div className="navbar-right">
                    <a href="/addEmployee" className="contact">Add Employee</a>
                    <a href="/addUser" className="contact">Add Manager</a>
                </div>
            </nav>
        </>
    );
}

export default NavBar;