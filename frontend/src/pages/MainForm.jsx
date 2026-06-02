import './MainForm.css'
import { useRef, useState, useEffect } from "react"
import { initializeApp } from "firebase/app";
import OptionRender from '../components/OptionRender';
import emailjs from '@emailjs/browser'

const form_top = [
    {id: "ap-name", Text: "Appraiser Name:", type: "text", name: "appraiser_name"},
    {id: "rev-per", Text: "Review Period:", type: "date", name: "review_period"},
    {id: "rev-dt", Text: "Reviewed Date:", type: "date", name: "reviewed_date"},
]

const managers = ["Manager 1", "Manager 2", "Manager 3", "Manager 4", "Manager 5"]

const quickRender = (name, value, onChange) => {
    const ratings = ["A", "B", "C", "D", "E"]
    const list = []

    for (let i = 0; i < 5; i++) {
        list.push(<td key={i}><OptionRender name={name} value={ratings[i]} selectedValue={value} onChange={onChange} /></td>)
    }

    return list;
}

function MainForm() {

    // Initialising the email connection
    const form = useRef();

    // State for employees list
    const [employees, setEmployees] = useState([])
    const [loadingEmployees, setLoadingEmployees] = useState(true)

    // JS to add to DB
    const [user, setUser] = useState({
        employee_id: "",
        appraiser_name: "",
        employee_name: "",
        position: "",
        review_period: "",
        date_joined: "",
        reviewed_date: "",
        manager: "",
        attendance_rating: "",
        punctuality_rating: "",
        compliance_rating: "",
        engagement_rating: "",
        qualification_rating: "",
        comments: "",
    })

    // Fetch employees on component mount
    useEffect(() => {
        fetchEmployees();
    }, [])

    const fetchEmployees = async () => {
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

    // Handle input changes for form fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Handle employee selection
    const handleEmployeeChange = (e) => {
        const employeeId = e.target.value;
        const selectedEmployee = employees.find(emp => emp.employee_id == employeeId);
        
        if(selectedEmployee) {
            setUser(prev => ({
                ...prev,
                employee_id: selectedEmployee.employee_id,
                employee_name: selectedEmployee.first_name + " " + selectedEmployee.last_name,
                position: selectedEmployee.position || "",
                date_joined: selectedEmployee.date_joined || ""
            }))
        }
    }

    // Handle rating changes
    const handleRatingChange = (e, ratingField) => {
        const value = e.target.value;
        setUser(prev => ({
            ...prev,
            [ratingField]: value
        }))
    }

    // Save to database
    const saveToDatabase = async () => {
        try {
            const response = await fetch("http://localhost:8800/appraisals", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user)
            })
            const data = await response.json();
            console.log("Data saved to database:", data);
            return true;
        } catch (error) {
            console.log("Error saving to database:", error);
            return false;
        }
    }

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs.sendForm(
            process.env.VITE_EMAILJS_SERVICEID,
            process.env.VITE_EMAILJS_TEMPLATEID,
            form.current,
            process.env.VITE_EMAILJS_PUBLICKEY
        )
        .then((result) => {
            console.log('Email successfully sent!', result.text)
        }, (error) => {
            console.log('Failed to send email', error.text)
        })
    }

    // Handle form submission - save to DB and send email
    const handleSubmit = async (e) => {
        e.preventDefault();
        const dbSaved = await saveToDatabase();
        if(dbSaved) {
            sendEmail(e);
        }
    }

    return (
        <div style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden', boxSizing: 'border-box' }}>
            <section className='form-section'> 
                <div className='info'>
                    <h1>Appraisal Form</h1>
                    <p>This is the form needed to fill employees appraisal</p>
                </div>
                
                <form className='form' ref={form} onSubmit={handleSubmit}>
                    {/* FORM GRID */}
                    <div className='form-grid'>
                        {form_top.map((forms) => (
                            <div key={forms.id} style={{ display: 'contents' }}>
                                <label htmlFor={forms.id}>{forms.Text}</label>
                                <input type={forms.type} id={forms.id} name={forms.name} value={user[forms.name]} onChange={handleInputChange} />
                            </div>
                        ))}
                        
                        {/* Employee Dropdown */}
                        <label htmlFor="employee-select">Select Employee:</label>
                        <select id="employee-select" value={user.employee_id} onChange={handleEmployeeChange}>
                            <option value="">-- Select an Employee --</option>
                            {employees.map((emp) => (
                                <option key={emp.employee_id} value={emp.employee_id}>
                                    {emp.first_name} {emp.last_name} - {emp.position}
                                </option>
                            ))}
                        </select>

                        {/* Manager Dropdown */}
                        <label htmlFor="mgr">Manager:</label>
                        <select id="mgr" name="manager" value={user.manager} onChange={handleInputChange}>
                            <option value="">Select a Manager</option>
                            {managers.map((mgr, index) => (
                                <option key={index} value={mgr}>{mgr}</option>
                            ))}
                        </select>
                    </div>

                    {/* Display Selected Employee Info */}
                    {user.employee_id && (
                        <div className='employee-info'>
                            <h3>Selected Employee Information</h3>
                            <div className='info-grid'>
                                <div className='info-item'>
                                    <label>Employee ID:</label>
                                    <span>{user.employee_id}</span>
                                </div>
                                <div className='info-item'>
                                    <label>Name:</label>
                                    <span>{user.employee_name}</span>
                                </div>
                                <div className='info-item'>
                                    <label>Position:</label>
                                    <span>{user.position}</span>
                                </div>
                                <div className='info-item'>
                                    <label>Date Joined:</label>
                                    <span>{user.date_joined}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* INDEX */}
                    <div className='index'>
                        <h3>Index</h3>
                        <ul id='list'>
                            <li>A = Excellent</li>
                            <li>B = Good</li>
                            <li>C = Satisfactory</li>
                            <li>D = Fair</li>
                            <li>E = Poor</li>
                        </ul>
                    </div>

                    {/* HR MONITORING GRID */}
                    <table className='hr-table'>
                        <thead>
                            <tr id='line-1'>
                                <th id='monitored'>Monitored by HR Department</th>
                                <th>A</th>
                                <th>B</th>
                                <th>C</th>
                                <th>D</th>
                                <th>E</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr id='line'>
                                <td>Attendance</td>
                                {quickRender("attendance_rating", user.attendance_rating, (e) => handleRatingChange(e, "attendance_rating"))}
                            </tr>
                            <tr id='line'>
                                <td>Punctuality</td>
                                {quickRender("punctuality_rating", user.punctuality_rating, (e) => handleRatingChange(e, "punctuality_rating"))}
                            </tr>
                            <tr id='line'>
                                <td>Adhere Management decisions, Company Rules & Regulation</td>
                                {quickRender("compliance_rating", user.compliance_rating, (e) => handleRatingChange(e, "compliance_rating"))}
                            </tr>
                            <tr id='line'>
                                <td>Employee Engagement</td>
                                {quickRender("engagement_rating", user.engagement_rating, (e) => handleRatingChange(e, "engagement_rating"))}
                            </tr>
                            <tr id='line'>
                                <td>Professional Qualification</td>
                                {quickRender("qualification_rating", user.qualification_rating, (e) => handleRatingChange(e, "qualification_rating"))}
                            </tr>
                        </tbody>
                    </table>

                    {/* COMMENT SECTION */}
                    <div className='comment-section'>
                        <label id='comment'>Comments:</label>
                        <textarea id='comment-box' name='comments' rows='4' value={user.comments} onChange={handleInputChange}></textarea>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <input type="submit" className="review-button" value="Submit Appraisal" />
                </form>
            </section>
        </div>
    );
}

export default MainForm;