import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './Home.css';
import { exportAppraisalToPDF, exportProbationToPDF } from '../components/ExportPDF';
import emailjs from '@emailjs/browser';

const uses = [
    {id: 1, name: 'Apply Appraisal', link: '/form'},
    {id: 2, name: 'Apply Probation', link: '/probation'},
]

function Home() {
    const [users, setUsers] = useState([])
    const [appraisals, setAppraisals] = useState([])
    const [probations, setProbations] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [activeTab, setActiveTab] = useState("appraisals")
    const navigate = useNavigate();

    async function handleDeleteAppraisal(reviewId, appraisalObj) {
        if (!window.confirm("Are you sure you want to delete this appraisal record from the entire database?")) {
            return;
        }
        try {
            await axios.delete(`http://localhost:8800/appraisals/${reviewId}`);
            alert("Appraisal record deleted successfully.");
            
            if (appraisalObj && appraisalObj.manager_email) {
                const templateParams = {
                    name: appraisalObj.manager,
                    title: `RECORD DELETED: Performance Appraisal for ${appraisalObj.employee_name}`,
                    to_email: appraisalObj.manager_email,
                    manager_email: appraisalObj.manager_email,
                    employee_name: appraisalObj.employee_name,
                    employee_id: appraisalObj.employee_id,
                    manager: appraisalObj.manager,
                    reviewed_date: appraisalObj.reviewed_date,
                    comments: `This performance appraisal review has been cancelled or deleted from the database by human resources.`
                };
                emailjs.send(
                    import.meta.env.VITE_EMAILJS_SERVICEKEY,
                    import.meta.env.VITE_EMAILJS_TEMPLATEID,
                    templateParams,
                    import.meta.env.VITE_EMAILJS_PUBLICKEY
                ).catch(err => console.error("Email send failed:", err));
            }
            
            fetchRecentAppraisals();
        } catch (err) {
            console.error("Error deleting appraisal:", err);
            alert("Failed to delete appraisal record.");
        }
    }

    async function handleDeleteProbation(probationId, probationObj) {
        if (!window.confirm("Are you sure you want to delete this probation record from the entire database?")) {
            return;
        }
        try {
            await axios.delete(`http://localhost:8800/probation/${probationId}`);
            alert("Probation record deleted successfully.");
            
            if (probationObj && probationObj.department_head) {
                const selectedManager = users.find(mgr => String(mgr.employee_id) === String(probationObj.department_head));
                if (selectedManager && selectedManager.email) {
                    const managerName = `${selectedManager.first_name} ${selectedManager.last_name}`;
                    const templateParams = {
                        name: managerName,
                        title: `RECORD DELETED: Probation Review for ${probationObj.name}`,
                        to_email: selectedManager.email,
                        manager_email: selectedManager.email,
                        employee_name: probationObj.name,
                        employee_id: probationObj.employee_id,
                        manager: managerName,
                        reviewed_date: probationObj.date_of_review,
                        comments: `This probation evaluation review has been cancelled or deleted from the database by human resources.`
                    };
                    emailjs.send(
                        import.meta.env.VITE_EMAILJS_SERVICEKEY,
                        import.meta.env.VITE_EMAILJS_TEMPLATEID,
                        templateParams,
                        import.meta.env.VITE_EMAILJS_PUBLICKEY
                    ).catch(err => console.error("Email send failed:", err));
                }
            }
            
            fetchAllProbations();
        } catch (err) {
            console.error("Error deleting probation:", err);
            alert("Failed to delete probation record.");
        }
    }

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
        fetchAllProbations();
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

    async function fetchAllProbations() {
        try {
            const res = await axios.get("http://localhost:8800/probation")
            if (Array.isArray(res.data)) {
                setProbations(res.data)
            } else {
                console.error("Probations response is not an array:", res.data)
                setProbations([])
            }
        } catch (err) {
            console.log(err)
            setProbations([])
        }
    }

    // Appraisals segregation
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

    // Probations segregation
    const pendingProbations = Array.isArray(probations)
        ? probations.filter(p => p.functional_technical_skills === null || p.functional_technical_skills === "")
        : [];

    const completedProbations = Array.isArray(probations)
        ? probations.filter(p => p.functional_technical_skills !== null && p.functional_technical_skills !== "")
        : [];

    const filteredPendingProbations = pendingProbations.filter(probation => {
        const query = searchQuery.toLowerCase().trim();
        if (query === "") return true;
        return (
            probation.name.toLowerCase().includes(query) ||
            probation.employee_id.toLowerCase().includes(query) ||
            (probation.role && probation.role.toLowerCase().includes(query)) ||
            (probation.department && probation.department.toLowerCase().includes(query))
        );
    });

    const filteredCompletedProbations = completedProbations.filter(probation => {
        const query = searchQuery.toLowerCase().trim();
        if (query === "") return true;
        return (
            probation.name.toLowerCase().includes(query) ||
            probation.employee_id.toLowerCase().includes(query) ||
            (probation.role && probation.role.toLowerCase().includes(query)) ||
            (probation.department && probation.department.toLowerCase().includes(query))
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

                {/* Tabs Selection */}
                <div className="tabs">
                    <button 
                        className={`tab-button ${activeTab === 'appraisals' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('appraisals'); setSearchQuery(""); }}
                    >
                        Appraisals ({appraisals.length})
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'probations' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('probations'); setSearchQuery(""); }}
                    >
                        Probations ({probations.length})
                    </button>
                </div>

                {/* Search Bar */}
                <div className="search-container" style={{ maxWidth: '1200px', margin: '1.5rem auto 0 auto', padding: '0 2rem' }}>
                    <input 
                        type="text" 
                        placeholder={`Search by employee name, ID, or ${activeTab === 'appraisals' ? 'position/manager' : 'department/role'}...`}
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

                {activeTab === 'appraisals' ? (
                    <>
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
                                            <div className="action-buttons" style={{ display: 'flex', gap: '8px', marginTop: '1rem', borderTop: '1px solid #e5e7eb', paddingTop: '0.75rem' }}>
                                                <button 
                                                    className="action-btn edit-btn" 
                                                    onClick={() => navigate(`/form?review_id=${appraisal.review_id}`)}
                                                    style={{ flex: 1, padding: '6px 12px', background: '#ec9a29', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                                >
                                                    View/Edit
                                                </button>
                                                <button 
                                                    className="action-btn delete-btn" 
                                                    onClick={() => handleDeleteAppraisal(appraisal.review_id, appraisal)}
                                                    style={{ flex: 1, padding: '6px 12px', background: '#F44336', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                                >
                                                    Delete
                                                </button>
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
                                    {filteredCompleted.map((appraisal, index) => (
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
                                            <div className="action-buttons" style={{ display: 'flex', gap: '8px', marginTop: '1rem', borderTop: '1px solid #e5e7eb', paddingTop: '0.75rem' }}>
                                                <button 
                                                    className="action-btn edit-btn" 
                                                    onClick={() => navigate(`/form?review_id=${appraisal.review_id}`)}
                                                    style={{ flex: 1, padding: '6px 12px', background: '#ec9a29', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                                >
                                                    View/Edit
                                                </button>
                                                <button 
                                                    className="action-btn export-btn" 
                                                    onClick={() => exportAppraisalToPDF(appraisal)}
                                                    style={{ flex: 1, padding: '6px 12px', background: '#2196F3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                                >
                                                    Export
                                                </button>
                                                <button 
                                                    className="action-btn delete-btn" 
                                                    onClick={() => handleDeleteAppraisal(appraisal.review_id, appraisal)}
                                                    style={{ flex: 1, padding: '6px 12px', background: '#F44336', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-appraisals">No appraisals completed yet</p>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Pending Probations Section */}
                        <div className="recent-appraisals pending-section">
                            <h2>Pending Probations (Awaiting Manager Review)</h2>
                            {filteredPendingProbations.length > 0 ? (
                                <div className="appraisals-list">
                                    {filteredPendingProbations.map((probation, index) => (
                                        <div key={index} className="appraisal-card pending-card">
                                            <div className="appraisal-header">
                                                <h3>{probation.name}</h3>
                                                <span className="employee-id pending-id">ID: {probation.employee_id}</span>
                                            </div>
                                            <div className="appraisal-details">
                                                <p><strong>Department:</strong> {probation.department}</p>
                                                <p><strong>Role:</strong> {probation.role}</p>
                                                <p><strong>Review Date:</strong> {new Date(probation.date_of_review).toLocaleDateString()}</p>
                                            </div>
                                            <div className="action-buttons" style={{ display: 'flex', gap: '8px', marginTop: '1rem', borderTop: '1px solid #e5e7eb', paddingTop: '0.75rem' }}>
                                                <button 
                                                    className="action-btn edit-btn" 
                                                    onClick={() => navigate(`/probation?probation_id=${probation.probation_id}`)}
                                                    style={{ flex: 1, padding: '6px 12px', background: '#ec9a29', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                                >
                                                    View/Edit
                                                </button>
                                                <button 
                                                    className="action-btn delete-btn" 
                                                    onClick={() => handleDeleteProbation(probation.probation_id, probation)}
                                                    style={{ flex: 1, padding: '6px 12px', background: '#F44336', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-appraisals">No pending probations found</p>
                            )}
                        </div>

                        {/* Recent Probations Section */}
                        <div className="recent-appraisals">
                            <h2>Recent Probations Completed</h2>
                            {filteredCompletedProbations.length > 0 ? (
                                <div className="appraisals-list">
                                    {filteredCompletedProbations.map((probation, index) => (
                                        <div key={index} className="appraisal-card">
                                            <div className="appraisal-header">
                                                <h3>{probation.name}</h3>
                                                <span className="employee-id">ID: {probation.employee_id}</span>
                                            </div>
                                            <div className="appraisal-details">
                                                <p><strong>Department:</strong> {probation.department}</p>
                                                <p><strong>Role:</strong> {probation.role}</p>
                                                <p><strong>Review Date:</strong> {new Date(probation.date_of_review).toLocaleDateString()}</p>
                                            </div>
                                            <div className="action-buttons" style={{ display: 'flex', gap: '8px', marginTop: '1rem', borderTop: '1px solid #e5e7eb', paddingTop: '0.75rem' }}>
                                                <button 
                                                    className="action-btn edit-btn" 
                                                    onClick={() => navigate(`/probation?probation_id=${probation.probation_id}`)}
                                                    style={{ flex: 1, padding: '6px 12px', background: '#ec9a29', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                                >
                                                    View/Edit
                                                </button>
                                                <button 
                                                    className="action-btn export-btn" 
                                                    onClick={() => exportProbationToPDF(probation)}
                                                    style={{ flex: 1, padding: '6px 12px', background: '#2196F3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                                >
                                                    Export
                                                </button>
                                                <button 
                                                    className="action-btn delete-btn" 
                                                    onClick={() => handleDeleteProbation(probation.probation_id, probation)}
                                                    style={{ flex: 1, padding: '6px 12px', background: '#F44336', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-appraisals">No completed probations found</p>
                            )}
                        </div>
                    </>
                )}
            </section>
        </>
    );
}

export default Home;