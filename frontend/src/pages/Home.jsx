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
    const [searchQuery, setSearchQuery] = useState("")
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                // If user is a manager, redirect to manager dashboard
                if (userData.role === 'manager') {
                    navigate('/manager-dashboard');
                    return;
                }
                // Only allow HR and CEO to view homepage
                if (userData.role !== 'HR' && userData.role !== 'CEO') {
                    localStorage.removeItem('user');
                    navigate('/login');
                    return;
                }
            } catch (e) {
                console.error("Error parsing user:", e);
                localStorage.removeItem('user');
                navigate('/login');
                return;
            }
        } else {
            navigate('/login');
            return;
        }

        fetchAllUsers();
        fetchRecentAppraisals();
    }, [navigate])

    async function fetchAllUsers() {
        try {
            const res = await axios.get("http://localhost:8800/users")
            if (Array.isArray(res.data)) {
                setUsers(res.data)
            } else {
                setUsers([])
            }
        } catch (err) {
            console.log(err)
            setUsers([])
        }
    }

    async function fetchRecentAppraisals() {
        try {
            const res = await axios.get("http://localhost:8800/appraisals")
            if (Array.isArray(res.data)) {
                setAppraisals(res.data)
            } else {
                console.error("Appraisals response is not an array:", res.data)
                setAppraisals([])
            }
        } catch (err) {
            console.log(err)
            setAppraisals([])
        }
    }

    const completedAppraisals = Array.isArray(appraisals) 
        ? appraisals.filter(
            appraisal => typeof appraisal.job_knowledge_rating === 'string' && appraisal.job_knowledge_rating.trim() !== ""
          )
        : [];
        
    const pendingAppraisals = Array.isArray(appraisals)
        ? appraisals.filter(
            appraisal => !appraisal.job_knowledge_rating || typeof appraisal.job_knowledge_rating !== 'string' || appraisal.job_knowledge_rating.trim() === ""
          )
        : [];

    const filteredPending = pendingAppraisals.filter(appraisal => {
        const query = searchQuery.toLowerCase().trim();
        if (query === "") return true;
        return (
            appraisal.employee_name.toLowerCase().includes(query) ||
            appraisal.employee_id.toLowerCase().includes(query) ||
            (appraisal.position && appraisal.position.toLowerCase().includes(query)) ||
            (appraisal.manager && appraisal.manager.toLowerCase().includes(query))
        );
    });

    const filteredCompleted = completedAppraisals.filter(appraisal => {
        const query = searchQuery.toLowerCase().trim();
        if (query === "") return true;
        return (
            appraisal.employee_name.toLowerCase().includes(query) ||
            appraisal.employee_id.toLowerCase().includes(query) ||
            (appraisal.position && appraisal.position.toLowerCase().includes(query)) ||
            (appraisal.manager && appraisal.manager.toLowerCase().includes(query))
        );
    });

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

                {/* Search Bar */}
                <div className="search-container" style={{ maxWidth: '1200px', margin: '3rem auto 0 auto', padding: '0 2rem' }}>
                    <input 
                        type="text" 
                        placeholder="Search by employee name, ID, position, or manager..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '14px 20px',
                            fontSize: '1rem',
                            border: '2px solid #e2e8f0',
                            borderRadius: '8px',
                            outline: 'none',
                            transition: 'border-color 0.2s',
                            boxSizing: 'border-box',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                        }}
                    />
                </div>

                {/* Pending Appraisals Section */}
                <div className="recent-appraisals pending-section">
                    <h2>Pending Appraisals (Awaiting Manager Review)</h2>
                    {filteredPending.length > 0 ? (
                        <div className="appraisals-list">
                            {filteredPending.map((appraisal, index) => (
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
                        <p className="no-appraisals">No pending appraisals found</p>
                    )}
                </div>

                {/* Recent Appraisals Section */}
                <div className="recent-appraisals">
                    <h2>Recent Appraisals Completed</h2>
                    {filteredCompleted.length > 0 ? (
                        <div className="appraisals-list">
                            {filteredCompleted.slice(0, 5).map((appraisal, index) => (
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