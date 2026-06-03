import './MainForm.css'
import { useRef, useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { initializeApp } from "firebase/app";
import OptionRender from '../components/OptionRender';
import emailjs from '@emailjs/browser'

const form_top = [
    {id: "ap-name", Text: "Appraiser Name:", type: "text", name: "appraiser_name"},
    {id: "rev-per", Text: "Review Period:", type: "date", name: "review_period"},
    {id: "rev-dt", Text: "Reviewed Date:", type: "date", name: "reviewed_date"},
]

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
    const navigate = useNavigate()

    // Check if user is logged in and is HR
    const [user, setUser] = useState(null)
    const [isHR, setIsHR] = useState(false)
    const [isManager, setIsManager] = useState(false)
    const [sentForReview, setSentForReview] = useState(false)

    // State for employees list
    const [employees, setEmployees] = useState([])
    const [managers, setManagers] = useState([])
    const [loadingEmployees, setLoadingEmployees] = useState(true)

    // JS to add to DB
    const [appraisal, setAppraisal] = useState({
        employee_id: "",
        appraiser_name: "",
        employee_name: "",
        position: "",
        review_period: "",
        date_joined: "",
        reviewed_date: "",
        manager: "",
        manager_id: "",
        manager_email: "",
        attendance_rating: "",
        punctuality_rating: "",
        compliance_rating: "",
        engagement_rating: "",
        qualification_rating: "",
        comments: "",
        // HR only fields
        job_knowledge_rating: "",
        achieved_kpis_rating: "",
        work_quality_rating: "",
        initiative_rating: "",
        time_management_rating: "",
        accurate_records_rating: "",
        team_work_rating: "",
        organizing_planning_rating: "",
        work_attitude_rating: "",
        kpis_for_this_year: "",
        employee_comments_problems: "",
    })

    // Parse reviewId from URL
    const searchParams = new URLSearchParams(window.location.search);
    const reviewId = searchParams.get('review_id');

    const fetchAppraisal = async (id) => {
        try {
            const response = await fetch(`http://localhost:8800/appraisals/${id}`);
            if(!response.ok) {
                console.error("Failed to fetch appraisal:", response.status);
                alert("Error loading appraisal details.");
                return;
            }
            const data = await response.json();
            
            // Format date fields for input element parsing
            const formatReviewDate = data.reviewed_date ? data.reviewed_date.slice(0, 10) : "";
            const formatDateJoined = data.date_joined ? data.date_joined.slice(0, 10) : "";

            setAppraisal({
                employee_id: data.employee_id || "",
                appraiser_name: data.appraiser_name || "",
                employee_name: data.employee_name || "",
                position: data.position || "",
                review_period: data.review_period || "",
                date_joined: formatDateJoined,
                reviewed_date: formatReviewDate,
                manager: data.manager || "",
                manager_id: data.manager_id || "",
                manager_email: data.manager_email || "",
                attendance_rating: data.attendance_rating || "",
                punctuality_rating: data.punctuality_rating || "",
                compliance_rating: data.compliance_rating || "",
                engagement_rating: data.engagement_rating || "",
                qualification_rating: data.qualification_rating || "",
                comments: data.comments || "",
                job_knowledge_rating: data.job_knowledge_rating || "",
                achieved_kpis_rating: data.achieved_kpis_rating || "",
                work_quality_rating: data.work_quality_rating || "",
                initiative_rating: data.initiative_rating || "",
                time_management_rating: data.time_management_rating || "",
                accurate_records_rating: data.accurate_records_rating || "",
                team_work_rating: data.team_work_rating || "",
                organizing_planning_rating: data.organizing_planning_rating || "",
                work_attitude_rating: data.work_attitude_rating || "",
                kpis_for_this_year: data.kpis_for_this_year || "",
                employee_comments_problems: data.employee_comments_problems || "",
            });
            
            setSentForReview(true);
        } catch (error) {
            console.error("Error fetching appraisal:", error);
        }
    };

    useEffect(() => {
        if(reviewId) {
            fetchAppraisal(reviewId);
        }
    }, [reviewId])

    // Fetch employees and managers on component mount
    useEffect(() => {
        // Check if user is logged in
        const storedUser = localStorage.getItem('user')
        if(!storedUser) {
            navigate('/login')
            return
        }
        
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setIsHR(userData.role === 'HR')
        setIsManager(userData.role === 'manager')
        
        fetchEmployees();
        fetchManagers();
    }, [])

    async function fetchEmployees() {
        try {
            const response = await fetch("http://localhost:8800/users");
            if(!response.ok) {
                console.error("Failed to fetch employees:", response.status);
                setEmployees([]);
                setLoadingEmployees(false);
                return;
            }
            const data = await response.json();
            setEmployees(data || []);
            setLoadingEmployees(false);
        } catch (error) {
            console.log("Error fetching employees:", error);
            setEmployees([]);
            setLoadingEmployees(false);
        }
    }

    async function fetchManagers() {
        try {
            const response = await fetch("http://localhost:8800/managers");
            if(!response.ok) {
                console.error("Failed to fetch managers:", response.status);
                setManagers([]);
                return;
            }
            const data = await response.json();
            setManagers(data || []);
        } catch (error) {
            console.log("Error fetching managers:", error);
            setManagers([]);
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAppraisal(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Handle employee selection
    const handleEmployeeChange = (e) => {
        const employeeId = e.target.value;
        const selectedEmployee = employees.find(emp => emp.employee_id == employeeId);
        
        if(selectedEmployee) {
            setAppraisal(prev => ({
                ...prev,
                employee_id: selectedEmployee.employee_id,
                employee_name: selectedEmployee.first_name + " " + selectedEmployee.last_name,
                position: selectedEmployee.position || "",
                date_joined: selectedEmployee.date_joined || ""
            }))
        }
    }

    // Handle manager selection
    const handleManagerChange = (e) => {
        const managerId = e.target.value;
        const selectedManager = managers.find(mgr => mgr.employee_id == managerId);
        
        if(selectedManager) {
            setAppraisal(prev => ({
                ...prev,
                manager_id: managerId,
                manager: selectedManager.first_name + " " + selectedManager.last_name,
                manager_email: selectedManager.email
            }))
        }
    }

    // Handle rating changes
    const handleRatingChange = (e, ratingField) => {
        const value = e.target.value;
        setAppraisal(prev => ({
            ...prev,
            [ratingField]: value
        }))
    }

    // Save to database
    const saveToDatabase = async () => {
        try {
            const url = reviewId ? `http://localhost:8800/appraisals/${reviewId}` : "http://localhost:8800/appraisals";
            const method = reviewId ? "PUT" : "POST";
            
            // Clean rating fields to null if they are empty strings to prevent CHECK constraint failures
            const cleanedAppraisal = { ...appraisal };
            const ratingFields = [
                "attendance_rating", "punctuality_rating", "compliance_rating", "engagement_rating", "qualification_rating",
                "job_knowledge_rating", "achieved_kpis_rating", "work_quality_rating", "initiative_rating",
                "time_management_rating", "accurate_records_rating", "team_work_rating", "organizing_planning_rating",
                "work_attitude_rating"
            ];
            ratingFields.forEach(field => {
                if (cleanedAppraisal[field] === "") {
                    cleanedAppraisal[field] = null;
                }
            });

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(cleanedAppraisal)
            })
            
            if(!response.ok) {
                console.error("Server error response status:", response.status);
                try {
                    const errData = await response.json();
                    console.error("Server error details:", errData);
                } catch (_) {}
                return false;
            }

            const data = await response.json();
            console.log("Data saved to database:", data);
            return true;
        } catch (error) {
            console.log("Error saving to database:", error);
            return false;
        }
    }

    // Send for Review (HR only - saves HR section)
    const handleSendForReview = async (e) => {
        e.preventDefault();
        const dbSaved = await saveToDatabase();
        if(dbSaved) {
            setSentForReview(true);
            sendEmail();
            alert("Appraisal sent for review to manager!");
        } else {
            alert("Error saving appraisal. Please try again.");
        }
    }

    const sendEmail = () => {
        const templateParams = {
            name: appraisal.manager,
            title: `Performance Appraisal for ${appraisal.employee_name} (${appraisal.position})`,
            to_email: appraisal.manager_email,
            manager_email: appraisal.manager_email,
            appraiser_name: appraisal.appraiser_name,
            employee_name: appraisal.employee_name,
            employee_id: appraisal.employee_id,
            manager: appraisal.manager,
            reviewed_date: appraisal.reviewed_date,
            comments: appraisal.comments
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

    // Handle form submission - save to DB and send email
    const handleSubmit = async (e) => {
        e.preventDefault();
        const dbSaved = await saveToDatabase();
        if(dbSaved) {
            alert("Appraisal completed successfully!");
            navigate('/');
        } else {
            alert("Error saving appraisal. Please try again.");
        }
    }

    // Show loading state while data is being fetched
    if (loadingEmployees) {
        return (
            <div style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden', boxSizing: 'border-box' }}>
                <section className='form-section'>
                    <div className='info'>
                        <h1>Appraisal Form</h1>
                        <p>Loading employees and managers...</p>
                    </div>
                </section>
            </div>
        );
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
                                <input type={forms.type} id={forms.id} name={forms.name} value={appraisal[forms.name]} onChange={handleInputChange} />
                            </div>
                        ))}
                        
                        {/* Employee Dropdown */}
                        <label htmlFor="employee-select">Select Employee:</label>
                        <select id="employee-select" value={appraisal.employee_id} onChange={handleEmployeeChange} disabled={!!reviewId}>
                            <option value="">-- Select an Employee --</option>
                            {employees.map((emp) => (
                                <option key={emp.employee_id} value={emp.employee_id}>
                                    {emp.first_name} {emp.last_name} - {emp.position}
                                </option>
                            ))}
                        </select>
 
                        {/* Manager Dropdown */}
                        <label htmlFor="mgr">Manager:</label>
                        <select id="mgr" value={appraisal.manager_id} onChange={handleManagerChange} disabled={!!reviewId}>
                            <option value="">Select a Manager</option>
                            {managers.map((mgr) => (
                                <option key={mgr.employee_id} value={mgr.employee_id}>
                                    {mgr.first_name} {mgr.last_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Display Selected Employee Info */}
                    {appraisal.employee_id && (
                        <div className='employee-info'>
                            <h3>Selected Employee Information</h3>
                            <div className='info-grid'>
                                <div className='info-item'>
                                    <label>Employee ID:</label>
                                    <span>{appraisal.employee_id}</span>
                                </div>
                                <div className='info-item'>
                                    <label>Name:</label>
                                    <span>{appraisal.employee_name}</span>
                                </div>
                                <div className='info-item'>
                                    <label>Position:</label>
                                    <span>{appraisal.position}</span>
                                </div>
                                <div className='info-item'>
                                    <label>Date Joined:</label>
                                    <span>{appraisal.date_joined}</span>
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
                                {quickRender("attendance_rating", appraisal.attendance_rating, (e) => handleRatingChange(e, "attendance_rating"))}
                            </tr>
                            <tr id='line'>
                                <td>Punctuality</td>
                                {quickRender("punctuality_rating", appraisal.punctuality_rating, (e) => handleRatingChange(e, "punctuality_rating"))}
                            </tr>
                            <tr id='line'>
                                <td>Adhere Management decisions, Company Rules & Regulation</td>
                                {quickRender("compliance_rating", appraisal.compliance_rating, (e) => handleRatingChange(e, "compliance_rating"))}
                            </tr>
                            <tr id='line'>
                                <td>Employee Engagement</td>
                                {quickRender("engagement_rating", appraisal.engagement_rating, (e) => handleRatingChange(e, "engagement_rating"))}
                            </tr>
                            <tr id='line'>
                                <td>Professional Qualification</td>
                                {quickRender("qualification_rating", appraisal.qualification_rating, (e) => handleRatingChange(e, "qualification_rating"))}
                            </tr>
                        </tbody>
                    </table>

                    {/* HR Only Performance Metrics Section */}
                    {isHR && (
                        <>
                            <table className='hr-table'>
                                <thead>
                                    <tr id='line-1'>
                                        <th id='monitored'>Performance Metrics - Managers Only</th>
                                        <th>A</th>
                                        <th>B</th>
                                        <th>C</th>
                                        <th>D</th>
                                        <th>E</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr id='line'>
                                        <td>Job Knowledge</td>
                                        {quickRender("job_knowledge_rating", appraisal.job_knowledge_rating, (e) => handleRatingChange(e, "job_knowledge_rating"))}
                                    </tr>
                                    <tr id='line'>
                                        <td>Achieved KPIs</td>
                                        {quickRender("achieved_kpis_rating", appraisal.achieved_kpis_rating, (e) => handleRatingChange(e, "achieved_kpis_rating"))}
                                    </tr>
                                    <tr id='line'>
                                        <td>Work Quality</td>
                                        {quickRender("work_quality_rating", appraisal.work_quality_rating, (e) => handleRatingChange(e, "work_quality_rating"))}
                                    </tr>
                                    <tr id='line'>
                                        <td>Initiative</td>
                                        {quickRender("initiative_rating", appraisal.initiative_rating, (e) => handleRatingChange(e, "initiative_rating"))}
                                    </tr>
                                    <tr id='line'>
                                        <td>Time Management</td>
                                        {quickRender("time_management_rating", appraisal.time_management_rating, (e) => handleRatingChange(e, "time_management_rating"))}
                                    </tr>
                                    <tr id='line'>
                                        <td>Maintain Accurate & Accountable Records</td>
                                        {quickRender("accurate_records_rating", appraisal.accurate_records_rating, (e) => handleRatingChange(e, "accurate_records_rating"))}
                                    </tr>
                                    <tr id='line'>
                                        <td>Team Work</td>
                                        {quickRender("team_work_rating", appraisal.team_work_rating, (e) => handleRatingChange(e, "team_work_rating"))}
                                    </tr>
                                    <tr id='line'>
                                        <td>Organizing & Planning</td>
                                        {quickRender("organizing_planning_rating", appraisal.organizing_planning_rating, (e) => handleRatingChange(e, "organizing_planning_rating"))}
                                    </tr>
                                    <tr id='line'>
                                        <td>Attitude Towards Work</td>
                                        {quickRender("work_attitude_rating", appraisal.work_attitude_rating, (e) => handleRatingChange(e, "work_attitude_rating"))}
                                    </tr>
                                </tbody>
                            </table>

                            <div className='hr-textarea-section'>
                                <div className='textarea-group'>
                                    <label htmlFor="kpis">KPIs for This Year:</label>
                                    <textarea 
                                        id="kpis" 
                                        name="kpis_for_this_year" 
                                        rows='4'
                                        value={appraisal.kpis_for_this_year}
                                        onChange={handleInputChange}
                                    ></textarea>
                                </div>

                                <div className='textarea-group'>
                                    <label htmlFor="employee_comments">Employee Comments/Problems:</label>
                                    <textarea 
                                        id="employee_comments" 
                                        name="employee_comments_problems" 
                                        rows='4'
                                        value={appraisal.employee_comments_problems}
                                        onChange={handleInputChange}
                                    ></textarea>
                                </div>
                            </div>
                            
                        </>
                    )}

                    {/* COMMENT SECTION */}
                    <div className='comment-section'>
                        <label id='comment'>Comments:</label>
                        <textarea id='comment-box' name='comments' rows='4' value={appraisal.comments} onChange={handleInputChange}></textarea>
                    </div>

                    {/* SEND FOR REVIEW BUTTON - For HR Only */}
                    {isHR && !sentForReview && (
                        <div className='button-group'>
                            <button type="button" className="review-button send-for-review-btn" onClick={handleSendForReview}>
                                Send for Review
                            </button>
                        </div>
                    )}

                    {/* MANAGER SECTION - Appears after HR sends for review or for managers viewing */}
                    {(sentForReview || isManager) && (
                        <>
                            <div className='manager-section'>
                                <h3>Performance Metrics - Managers Only</h3>
                                
                                <table className='hr-table'>
                                    <thead>
                                        <tr id='line-1'>
                                            <th id='monitored'>Monitored by Manager</th>
                                            <th>A</th>
                                            <th>B</th>
                                            <th>C</th>
                                            <th>D</th>
                                            <th>E</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr id='line'>
                                            <td>Job Knowledge</td>
                                            {quickRender("job_knowledge_rating", appraisal.job_knowledge_rating, (e) => handleRatingChange(e, "job_knowledge_rating"))}
                                        </tr>
                                        <tr id='line'>
                                            <td>Achieved KPIs</td>
                                            {quickRender("achieved_kpis_rating", appraisal.achieved_kpis_rating, (e) => handleRatingChange(e, "achieved_kpis_rating"))}
                                        </tr>
                                        <tr id='line'>
                                            <td>Work Quality</td>
                                            {quickRender("work_quality_rating", appraisal.work_quality_rating, (e) => handleRatingChange(e, "work_quality_rating"))}
                                        </tr>
                                        <tr id='line'>
                                            <td>Initiative</td>
                                            {quickRender("initiative_rating", appraisal.initiative_rating, (e) => handleRatingChange(e, "initiative_rating"))}
                                        </tr>
                                        <tr id='line'>
                                            <td>Time Management</td>
                                            {quickRender("time_management_rating", appraisal.time_management_rating, (e) => handleRatingChange(e, "time_management_rating"))}
                                        </tr>
                                        <tr id='line'>
                                            <td>Accurate Records</td>
                                            {quickRender("accurate_records_rating", appraisal.accurate_records_rating, (e) => handleRatingChange(e, "accurate_records_rating"))}
                                        </tr>
                                        <tr id='line'>
                                            <td>Team Work</td>
                                            {quickRender("team_work_rating", appraisal.team_work_rating, (e) => handleRatingChange(e, "team_work_rating"))}
                                        </tr>
                                        <tr id='line'>
                                            <td>Organizing & Planning</td>
                                            {quickRender("organizing_planning_rating", appraisal.organizing_planning_rating, (e) => handleRatingChange(e, "organizing_planning_rating"))}
                                        </tr>
                                        <tr id='line'>
                                            <td>Work Attitude</td>
                                            {quickRender("work_attitude_rating", appraisal.work_attitude_rating, (e) => handleRatingChange(e, "work_attitude_rating"))}
                                        </tr>
                                    </tbody>
                                </table>

                                <div className='manager-textarea-section'>
                                    <div className='textarea-group'>
                                        <label htmlFor="manager_kpis">KPIs for This Year:</label>
                                        <textarea 
                                            id="manager_kpis" 
                                            name="kpis_for_this_year" 
                                            rows='4'
                                            value={appraisal.kpis_for_this_year}
                                            onChange={handleInputChange}
                                        ></textarea>
                                    </div>

                                    <div className='textarea-group'>
                                        <label htmlFor="manager_comments">Employee Comments/Problems:</label>
                                        <textarea 
                                            id="manager_comments" 
                                            name="employee_comments_problems" 
                                            rows='4'
                                            value={appraisal.employee_comments_problems}
                                            onChange={handleInputChange}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* COMPLETE APPRAISAL BUTTON */}
                            <div className='button-group'>
                                <button type="button" className="review-button complete-appraisal-btn" onClick={handleSubmit}>
                                    Complete Appraisal
                                </button>
                            </div>
                        </>
                    )}

                    {/* SUBMIT BUTTON - Only for non-HR forms */}
                    {!isHR && !isManager && (
                        <input type="submit" className="review-button" value="Submit Appraisal" />
                    )}
                </form>
            </section>
        </div>
    );
}

export default MainForm;