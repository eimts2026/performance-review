import './AddUser.css'
import { useState } from 'react'
import { API_BASE_URL } from '../apiConfig'

function AddUser() {
    const [manager, setManager] = useState({
        employee_id: "",
        first_name: "",
        last_name: "",
        email: "",
        position: ""
    })

    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setManager(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`${API_BASE_URL}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...manager,
                    role: "manager"
                })
            })
            const data = await response.json();
            
            if(response.ok) {
                setSuccessMessage("Manager added successfully!");
                setErrorMessage("");
                setManager({
                    employee_id: "",
                    first_name: "",
                    last_name: "",
                    email: "",
                    position: ""
                })
                setTimeout(() => setSuccessMessage(""), 3000);
            } else {
                setErrorMessage("Failed to add manager");
            }
        } catch (error) {
            console.log("Error adding manager:", error);
            setErrorMessage("Error adding manager to database");
        }
    }

    return (
        <div style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden', boxSizing: 'border-box' }}>
            <section className='form-section'>
                <div className='info'>
                    <h1>Add New Manager</h1>
                    <p>Fill in the manager details below to add them to the system</p>
                </div>

                <form className='form' onSubmit={handleSubmit}>
                    {successMessage && <div className='success-message'>{successMessage}</div>}
                    {errorMessage && <div className='error-message'>{errorMessage}</div>}
                    
                    <div className='form-grid'>
                        <label htmlFor="employee_id">Employee ID:</label>
                        <input 
                            type="text" 
                            id="employee_id" 
                            name="employee_id" 
                            value={manager.employee_id} 
                            onChange={handleInputChange}
                            required
                        />

                        <label htmlFor="first_name">First Name:</label>
                        <input 
                            type="text" 
                            id="first_name" 
                            name="first_name" 
                            value={manager.first_name} 
                            onChange={handleInputChange}
                            required
                        />
                        
                        <label htmlFor="last_name">Last Name:</label>
                        <input 
                            type="text" 
                            id="last_name" 
                            name="last_name" 
                            value={manager.last_name} 
                            onChange={handleInputChange}
                            required
                        />

                        <label htmlFor="email">Email:</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            value={manager.email} 
                            onChange={handleInputChange}
                            required
                        />

                        <label htmlFor="position">Position:</label>
                        <input 
                            type="text" 
                            id="position" 
                            name="position" 
                            value={manager.position} 
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className='button-container'>
                        <input type="submit" className="review-button" value="Add Manager" />
                    </div>
                </form>
            </section>
        </div>
    );
}

export default AddUser;
