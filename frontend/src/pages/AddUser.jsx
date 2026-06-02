import './AddUser.css'
import { useState } from 'react'

function AddUser() {
    const [employee, setEmployee] = useState({
        first_name: "",
        last_name: "",
        email: "",
        position: "",
        date_joined: ""
    })

    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmployee(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch("http://localhost:8800/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(employee)
            })
            const data = await response.json();
            
            if(response.ok) {
                setSuccessMessage("Employee added successfully!");
                setErrorMessage("");
                setEmployee({
                    first_name: "",
                    last_name: "",
                    email: "",
                    position: "",
                    date_joined: ""
                })
                setTimeout(() => setSuccessMessage(""), 3000);
            } else {
                setErrorMessage("Failed to add employee");
            }
        } catch (error) {
            console.log("Error adding employee:", error);
            setErrorMessage("Error adding employee to database");
        }
    }

    return (
        <div style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden', boxSizing: 'border-box' }}>
            <section className='form-section'>
                <div className='info'>
                    <h1>Add New Employee</h1>
                    <p>Fill in the employee details below to add them to the system</p>
                </div>

                <form className='form' onSubmit={handleSubmit}>
                    {successMessage && <div className='success-message'>{successMessage}</div>}
                    {errorMessage && <div className='error-message'>{errorMessage}</div>}
                    
                    <div className='form-grid'>
                        <label htmlFor="first_name">First Name:</label>
                        <input 
                            type="text" 
                            id="first_name" 
                            name="first_name" 
                            value={employee.first_name} 
                            onChange={handleInputChange}
                            required
                        />
                        
                        <label htmlFor="last_name">Last Name:</label>
                        <input 
                            type="text" 
                            id="last_name" 
                            name="last_name" 
                            value={employee.last_name} 
                            onChange={handleInputChange}
                            required
                        />

                        <label htmlFor="email">Email:</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            value={employee.email} 
                            onChange={handleInputChange}
                            required
                        />

                        <label htmlFor="position">Position:</label>
                        <input 
                            type="text" 
                            id="position" 
                            name="position" 
                            value={employee.position} 
                            onChange={handleInputChange}
                            required
                        />

                        <label htmlFor="date_joined">Date Joined:</label>
                        <input 
                            type="date" 
                            id="date_joined" 
                            name="date_joined" 
                            value={employee.date_joined} 
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className='button-container'>
                        <input type="submit" className="review-button" value="Add Employee" />
                    </div>
                </form>
            </section>
        </div>
    );
}

export default AddUser;