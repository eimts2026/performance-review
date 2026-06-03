import './SignIn.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignIn() {
    const [credentials, setCredentials] = useState({
        first_name: "",
        password: ""
    })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("")
        setLoading(true)
        
        try {
            const response = await fetch("http://localhost:8800/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials)
            })
            
            if(response.ok) {
                const data = await response.json();
                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify(data))
                setLoading(false)
                navigate('/')
            } else {
                let errMsg = "Invalid credentials. Please try again.";
                try {
                    const errData = await response.json();
                    if (typeof errData === 'string') errMsg = errData;
                } catch (_) {}
                setError(errMsg)
                setLoading(false)
            }
        } catch (error) {
            console.log("Error logging in:", error);
            setError("Error logging in. Please try again.")
            setLoading(false)
        }
    }

    return (
        <div className='signin-container'>
            <div className='signin-box'>
                <div className='signin-header'>
                    <h1>Sign In</h1>
                    <p>Welcome to Performance Review System</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div className='error-message'>{error}</div>}
                    
                    <div className='form-group'>
                        <label htmlFor="first_name">Name:</label>
                        <input 
                            type="text" 
                            id="first_name" 
                            name="first_name" 
                            value={credentials.first_name}
                            onChange={handleInputChange}
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor="password">Password:</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            value={credentials.password}
                            onChange={handleInputChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button type="submit" className='signin-button' disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className='signin-footer'>
                    <p>Test User: <strong>Joel</strong> / Password: <strong>1234</strong></p>
                </div>
            </div>
        </div>
    );
}

export default SignIn;