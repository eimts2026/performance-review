import './ProbationForm.css'
import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import OptionRender from '../components/OptionRender'
import emailjs from '@emailjs/browser'

const probation_metrics = [
    { label: "Functional / Technical Skills", field: "functional_technical_skills" },
    { label: "Result Orientation", field: "result_orientation" },
    { label: "Creativity / Innovation", field: "creativity_innovation" },
    { label: "Communication", field: "communication" },
    { label: "Teamwork", field: "teamwork" },
    { label: "Adaptability", field: "adaptability" },
    { label: "Supervisory / Managerial", field: "supervisory_managerial" }
]

const quickRender = (name, value, onChange) => {
    const ratings = ["4", "3", "2", "1"]
    const list = []

    for (let i = 0; i < 4; i++) {
        list.push(
            <td key={i}>
                <OptionRender name={name} value={ratings[i]} selectedValue={value} onChange={onChange} />
            </td>
        )
    }

    return list;
}

function ProbationForm() {
    const navigate = useNavigate()

    const [user, setUser] = useState(null)
    const [employees, setEmployees] = useState([])
    const [managers, setManagers] = useState([])
    const [loadingEmployees, setLoadingEmployees] = useState(true)
    
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const [probation, setProbation] = useState({
        employee_id: "",
        name: "",
        department: "",
        role: "",
        date_of_joining: "",
        date_of_review: new Date().toISOString().slice(0, 10),
        department_head: "",
        functional_technical_skills: "",
        result_orientation: "",
        creativity_innovation: "",
        communication: "",
        teamwork: "",
        adaptability: "",
        supervisory_managerial: "",
        appraisers_comments: ""
    })

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if(!storedUser) {
            navigate('/signin')
            return
        }
        
        const userData = JSON.parse(storedUser)
        setUser(userData)
        
        fetchEmployees();
        fetchManagers();
    }, [])

    async function fetchEmployees() {
        try {
            const response = await fetch("http://localhost:8800/users");
            const data = await response.json();
            setEmployees(data);
            setLoadingEmployees(false);
        } catch (error) {
            console.log("Error fetching employees:", error);
            setLoadingEmployees(false);
        }
    }

    async function fetchManagers() {
        try {
            const response = await fetch("http://localhost:8800/managers");
            const data = await response.json();
            setManagers(data);
        } catch (error) {
            console.log("Error fetching managers:", error);
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProbation(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleEmployeeChange = (e) => {
        const employeeId = e.target.value;
        const selectedEmployee = employees.find(emp => emp.employee_id == employeeId);
        
        if(selectedEmployee) {
            setProbation(prev => ({
                ...prev,
                employee_id: selectedEmployee.employee_id,
                name: selectedEmployee.first_name + " " + selectedEmployee.last_name,
                department: selectedEmployee.department || "",
                role: selectedEmployee.position || "",
                date_of_joining: selectedEmployee.date_joined ? selectedEmployee.date_joined.slice(0, 10) : ""
            }))
        } else {
            setProbation(prev => ({
                ...prev,
                employee_id: "",
                name: "",
                department: "",
                role: "",
                date_of_joining: ""
            }))
        }
    }

    const handleRatingChange = (e, ratingField) => {
        const value = e.target.value;
        setProbation(prev => ({
            ...prev,
            [ratingField]: value
        }))
    }

    const sendEmail = () => {
        const selectedManager = managers.find(mgr => mgr.employee_id == probation.department_head);
        const templateParams = {
            employee_name: probation.name,
            employee_id: probation.employee_id,
            department: probation.department,
            role: probation.role,
            date_of_review: probation.date_of_review,
            manager: selectedManager ? selectedManager.first_name + ' ' + selectedManager.last_name : '',
            manager_email: selectedManager ? selectedManager.email : '',
            appraisers_comments: probation.appraisers_comments
        };

        emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICEKEY,
            import.meta.env.VITE_EMAILJS_TEMPLATEID,
            templateParams,
            import.meta.env.VITE_EMAILJS_PUBLICKEY
        )
        .then((result) => {
            console.log('Email successfully sent!', result.text)
        }, (error) => {
            console.log('Failed to send email', error.text)
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage("")
        setErrorMessage("")

        // Submit to database
        try {
            const response = await fetch("http://localhost:8800/probation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(probation)
            })
            const data = await response.json();
            
            if(response.ok) {
                sendEmail();
                setSuccessMessage("Probation form submitted successfully!");
                setProbation({
                    employee_id: "",
                    name: "",
                    department: "",
                    role: "",
                    date_of_joining: "",
                    date_of_review: new Date().toISOString().slice(0, 10),
                    department_head: "",
                    functional_technical_skills: "",
                    result_orientation: "",
                    creativity_innovation: "",
                    communication: "",
                    teamwork: "",
                    adaptability: "",
                    supervisory_managerial: "",
                    appraisers_comments: ""
                })
                setTimeout(() => setSuccessMessage(""), 5000)
            } else {
                setErrorMessage(data?.sqlMessage || "Failed to submit probation form.");
            }
        } catch (error) {
            console.log("Error submitting form:", error);
            setErrorMessage("Error connecting to server.");
        }
    }

    return (
        <div style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden', boxSizing: 'border-box' }}>
            <section className='form-section'> 
                <div className='info'>
                    <h1>Probation Review Form</h1>
                    <p>Evaluate employee performance during their probation period</p>
                </div>
                
                <form className='form' onSubmit={handleSubmit}>
                    {successMessage && <div className='success-message' style={{ color: 'green', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>{successMessage}</div>}
                    {errorMessage && <div className='error-message' style={{ color: 'red', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>{errorMessage}</div>}

                    {/* METADATA GRID */}
                    <div className='form-grid'>
                        {/* Employee Dropdown */}
                        <label htmlFor="employee-select">Select Employee:</label>
                        <select id="employee-select" value={probation.employee_id} onChange={handleEmployeeChange} required>
                            <option value="">-- Select an Employee --</option>
                            {employees.map((emp) => (
                                <option key={emp.employee_id} value={emp.employee_id}>
                                    {emp.first_name} {emp.last_name} - {emp.position}
                                </option>
                            ))}
                        </select>

                        {/* Department Head Dropdown */}
                        <label htmlFor="department_head">Department Head:</label>
                        <select 
                            id="department_head" 
                            name="department_head" 
                            value={probation.department_head} 
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">-- Select Department Head --</option>
                            {managers.map((mgr) => (
                                <option key={mgr.employee_id} value={mgr.employee_id}>
                                    {mgr.first_name} {mgr.last_name}
                                </option>
                            ))}
                        </select>

                        {/* Date of Review */}
                        <label htmlFor="date_of_review">Date of Review:</label>
                        <input 
                            type="date" 
                            id="date_of_review" 
                            name="date_of_review" 
                            value={probation.date_of_review} 
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Display Selected Employee Info */}
                    {probation.employee_id && (
                        <div className='employee-info'>
                            <h3>Employee Details</h3>
                            <div className='info-grid'>
                                <div className='info-item'>
                                    <label>Employee ID:</label>
                                    <span>{probation.employee_id}</span>
                                </div>
                                <div className='info-item'>
                                    <label>Name:</label>
                                    <span>{probation.name}</span>
                                </div>
                                <div className='info-item'>
                                    <label>Department:</label>
                                    <span>{probation.department || 'N/A'}</span>
                                </div>
                                <div className='info-item'>
                                    <label>Role/Position:</label>
                                    <span>{probation.role || 'N/A'}</span>
                                </div>
                                <div className='info-item'>
                                    <label>Date of Joining:</label>
                                    <span>{probation.date_of_joining}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* INDEX */}
                    <div className='index'>
                        <h3>Rating Scale</h3>
                        <ul id='list'>
                            <li>4 = Excellent</li>
                            <li>3 = Good</li>
                            <li>2 = Satisfactory</li>
                            <li>1 = Poor</li>
                        </ul>
                    </div>

                    {/* EVALUATION GRID TABLE */}
                    <table className='hr-table'>
                        <thead>
                            <tr id='line-1'>
                                <th id='monitored'>Performance Metric</th>
                                <th>4</th>
                                <th>3</th>
                                <th>2</th>
                                <th>1</th>
                            </tr>
                        </thead>
                        <tbody>
                            {probation_metrics.map((metric) => (
                                <tr key={metric.field} id='line'>
                                    <td>{metric.label}</td>
                                    {quickRender(metric.field, probation[metric.field], (e) => handleRatingChange(e, metric.field))}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* APPRAISERS COMMENTS */}
                    <div className='comment-section'>
                        <label htmlFor='appraisers_comments'>Appraiser's Comments:</label>
                        <textarea 
                            id='appraisers_comments' 
                            name='appraisers_comments' 
                            rows='5' 
                            value={probation.appraisers_comments} 
                            onChange={handleInputChange}
                            placeholder="Add your comments here..."
                            required
                        ></textarea>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <input type="submit" className="review-button" value="Submit Probation Form" />
                </form>
            </section>
        </div>
    );
}

export default ProbationForm;
