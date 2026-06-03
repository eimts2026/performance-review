import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import './Home.css'

const uses = [
    {id: 1, name: 'Apply Appraisal', link: '/form'},
    {id: 2, name: 'Apply Probation', link: '/probation'},
]

function Home() {
    
    const [users, setUsers] = useState([])
    const [appraisals, setAppraisals] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            // If user is a manager, redirect to manager dashboard
            if (userData.role === 'manager') {
                navigate('/manager-dashboard');
                return;
            }
        }

        fetchAllUsers();
        fetchRecentAppraisals();
    }, [navigate])

    async function fetchAllUsers() {
        try {
            const res = await axios.get("http://localhost:8800/users")
            setUsers(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    async function fetchRecentAppraisals() {
        try {
            const res = await axios.get("http://localhost:8800/appraisals")
            setAppraisals(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    const completedAppraisals = appraisals.filter(
        appraisal => appraisal.job_knowledge_rating && appraisal.job_knowledge_rating.trim() !== ""
    );
    const pendingAppraisals = appraisals.filter(
        appraisal => !appraisal.job_knowledge_rating || appraisal.job_knowledge_rating.trim() === ""
    );

    return (
        <>
            <section className="home-section">
                <div className="info">
                    <h1>Home</h1>
                    <p>Check latest performance reviews and appraisal forms ongoing</p>
                </div>
            
                <div className="container">
                    {uses.map((use) => (
                        <a key={use.id} href={use.link}><div id={use.id}>{use.name}</div></a>
                    ))}
                </div>

                {/* Pending Appraisals Section */}
                <div className="recent-appraisals pending-section">
                    <h2>Pending Appraisals (Awaiting Manager Review)</h2>
                    {pendingAppraisals.length > 0 ? (
                        <div className="appraisals-list">
                            {pendingAppraisals.map((appraisal, index) => (
                                <div key={index} className="appraisal-card pending-card">
                                    <div className="appraisal-header">
                                        <h3>{appraisal.employee_name}</h3>
                                        <span className="employee-id pending-id">ID: {appraisal.employee_id}</span>
                                    </div>
                                    <div className="appraisal-details">
                                        <p><strong>Position:</strong> {appraisal.position}</p>
                                        <p><strong>Manager:</strong> {appraisal.manager}</p>
                                        <p><strong>Sent for Review:</strong> {new Date(appraisal.reviewed_date).toLocaleDateString()}</p>
                                        <p><strong>Appraiser:</strong> {appraisal.appraiser_name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-appraisals">No pending appraisals at this time</p>
                    )}
                </div>

                {/* Recent Appraisals Section */}
                <div className="recent-appraisals">
                    <h2>Recent Appraisals Completed</h2>
                    {completedAppraisals.length > 0 ? (
                        <div className="appraisals-list">
                            {completedAppraisals.slice(0, 5).map((appraisal, index) => (
                                <div key={index} className="appraisal-card">
                                    <div className="appraisal-header">
                                        <h3>{appraisal.employee_name}</h3>
                                        <span className="employee-id">ID: {appraisal.employee_id}</span>
                                    </div>
                                    <div className="appraisal-details">
                                        <p><strong>Position:</strong> {appraisal.position}</p>
                                        <p><strong>Manager:</strong> {appraisal.manager}</p>
                                        <p><strong>Review Date:</strong> {new Date(appraisal.reviewed_date).toLocaleDateString()}</p>
                                        <p><strong>Appraiser:</strong> {appraisal.appraiser_name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-appraisals">No appraisals completed yet</p>
                    )}
                </div>
            </section>
        </>
    );
}

export default Home;