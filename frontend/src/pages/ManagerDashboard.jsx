import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ManagerDashboard.css';
import { exportAppraisalToPDF, exportProbationToPDF } from '../components/ExportPDF';
import emailjs from '@emailjs/browser';

function ManagerDashboard() {
    const [user, setUser] = useState(null);
    const [appraisals, setAppraisals] = useState([]);
    const [probations, setProbations] = useState([]);
    const [loadingAppraisals, setLoadingAppraisals] = useState(true);
    const [loadingProbations, setLoadingProbations] = useState(true);
    const [activeTab, setActiveTab] = useState('appraisals');
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedCards, setExpandedCards] = useState({});
    const navigate = useNavigate();

    const toggleExpandCard = (cardKey) => {
        setExpandedCards(prev => ({
            ...prev,
            [cardKey]: !prev[cardKey]
        }));
    };

    const handleDeleteAppraisal = async (reviewId, appraisalObj) => {
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
                    comments: `This performance appraisal review has been cancelled or deleted from the database.`
                };
                emailjs.send(
                    import.meta.env.VITE_EMAILJS_SERVICEKEY,
                    import.meta.env.VITE_EMAILJS_TEMPLATEID,
                    templateParams,
                    import.meta.env.VITE_EMAILJS_PUBLICKEY
                ).catch(err => console.error("Email send failed:", err));
            }
            
            fetchManagerAppraisals(user.first_name + " " + user.last_name);
        } catch (err) {
            console.error("Error deleting appraisal:", err);
            alert("Failed to delete appraisal record.");
        }
    };

    const handleDeleteProbation = async (probationId, probationObj) => {
        if (!window.confirm("Are you sure you want to delete this probation record from the entire database?")) {
            return;
        }
        try {
            await axios.delete(`http://localhost:8800/probation/${probationId}`);
            alert("Probation record deleted successfully.");
            
            if (user && user.email && probationObj) {
                const managerName = `${user.first_name} ${user.last_name}`;
                const templateParams = {
                    name: managerName,
                    title: `RECORD DELETED: Probation Review for ${probationObj.name}`,
                    to_email: user.email,
                    manager_email: user.email,
                    employee_name: probationObj.name,
                    employee_id: probationObj.employee_id,
                    manager: managerName,
                    reviewed_date: probationObj.date_of_review,
                    comments: `This probation evaluation review has been cancelled or deleted from the database.`
                };
                emailjs.send(
                    import.meta.env.VITE_EMAILJS_SERVICEKEY,
                    import.meta.env.VITE_EMAILJS_TEMPLATEID,
                    templateParams,
                    import.meta.env.VITE_EMAILJS_PUBLICKEY
                ).catch(err => console.error("Email send failed:", err));
            }
            
            fetchManagerProbations(user.employee_id);
        } catch (err) {
            console.error("Error deleting probation:", err);
            alert("Failed to delete probation record.");
        }
    };

    useEffect(() => {
        // Check if user is logged in
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }

        const userData = JSON.parse(storedUser);
        setUser(userData);

        // Check if user is manager
        if (userData.role !== 'manager') {
            navigate('/');
            return;
        }

        // Fetch manager's appraisals (using full name)
        fetchManagerAppraisals(userData.first_name + " " + userData.last_name);
        
        // Fetch manager's probations (using manager's employee_id)
        fetchManagerProbations(userData.employee_id);
    }, [navigate]);

    const fetchManagerAppraisals = async (managerName) => {
        try {
            const res = await axios.get(`http://localhost:8800/appraisals/manager/${managerName}`);
            if (Array.isArray(res.data)) {
                setAppraisals(res.data);
            } else {
                console.error("Appraisals manager response is not an array:", res.data);
                setAppraisals([]);
            }
        } catch (err) {
            console.log('Error fetching appraisals:', err);
            setAppraisals([]);
        } finally {
            setLoadingAppraisals(false);
        }
    };

    const fetchManagerProbations = async (departmentHead) => {
        try {
            const res = await axios.get(`http://localhost:8800/probation/manager/${departmentHead}`);
            if (Array.isArray(res.data)) {
                setProbations(res.data);
            } else {
                console.error("Probations manager response is not an array:", res.data);
                setProbations([]);
            }
        } catch (err) {
            console.log('Error fetching probations:', err);
            setProbations([]);
        } finally {
            setLoadingProbations(false);
        }
    };

    const RatingBadge = ({ rating }) => {
        const colors = {
            'A': '#4CAF50',
            'B': '#8BC34A',
            'C': '#FFC107',
            'D': '#FF9800',
            'E': '#F44336'
        };
        return (
            <span style={{ 
                backgroundColor: colors[rating] || '#ddd', 
                color: 'white', 
                padding: '4px 8px', 
                borderRadius: '4px',
                fontWeight: 'bold'
            }}>
                {rating}
            </span>
        );
    };

    const filteredAppraisals = appraisals.filter(appraisal => {
        const query = searchQuery.toLowerCase().trim();
        if (query === "") return true;
        return (
            appraisal.employee_name.toLowerCase().includes(query) ||
            appraisal.employee_id.toLowerCase().includes(query) ||
            (appraisal.position && appraisal.position.toLowerCase().includes(query))
        );
    });

    const filteredProbations = probations.filter(probation => {
        const query = searchQuery.toLowerCase().trim();
        if (query === "") return true;
        return (
            probation.name.toLowerCase().includes(query) ||
            probation.employee_id.toLowerCase().includes(query) ||
            (probation.department && probation.department.toLowerCase().includes(query)) ||
            (probation.role && probation.role.toLowerCase().includes(query))
        );
    });

    return (
        <div className="manager-dashboard">
            <div className="dashboard-header">
                <h1>Manager Dashboard</h1>
                <p>Welcome, {user?.first_name}! View assigned appraisals and probations</p>
            </div>

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

            {/* Search Input */}
            <div className="search-container" style={{ marginBottom: '2.5rem' }}>
                <input 
                    type="text" 
                    placeholder={`Search by employee name, ID, or ${activeTab === 'appraisals' ? 'position' : 'department'}...`}
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

            {activeTab === 'appraisals' && (
                <div className="tab-content">
                    {loadingAppraisals ? (
                        <p>Loading appraisals...</p>
                    ) : filteredAppraisals.length === 0 ? (
                        <p className="no-appraisals">No appraisals found.</p>
                    ) : (
                        <div className="appraisals-list">
                            {filteredAppraisals.map((appraisal, idx) => {
                                const isPending = !appraisal.job_knowledge_rating || appraisal.job_knowledge_rating.trim() === "";
                                const isExpanded = !!expandedCards[`appraisal_${appraisal.review_id}`];
                                return (
                                    <div key={idx} className={`appraisal-card ${isPending ? 'pending-card' : ''}`}>
                                        <div className="appraisal-header">
                                            <h3>{appraisal.employee_name}</h3>
                                            <span className={`employee-id ${isPending ? 'pending-id' : ''}`}>
                                                ID: {appraisal.employee_id}
                                            </span>
                                        </div>
                                        
                                        <div className="appraisal-details">
                                            <p><strong>Position:</strong> {appraisal.position}</p>
                                            <p><strong>Manager:</strong> {appraisal.manager}</p>
                                            <p><strong>Review Period:</strong> {appraisal.review_period}</p>
                                            <p><strong>{isPending ? 'Sent for Review:' : 'Review Date:'}</strong> {new Date(appraisal.reviewed_date).toLocaleDateString()}</p>
                                        </div>

                                        {!isPending && (
                                            <>
                                                <button 
                                                    className="action-btn details-toggle-btn"
                                                    onClick={() => toggleExpandCard(`appraisal_${appraisal.review_id}`)}
                                                    style={{
                                                        backgroundColor: 'transparent',
                                                        color: '#2196F3',
                                                        border: '1px solid #2196F3',
                                                        padding: '6px 12px',
                                                        borderRadius: '4px',
                                                        fontSize: '0.85rem',
                                                        fontWeight: 'bold',
                                                        cursor: 'pointer',
                                                        marginBottom: '1rem',
                                                        width: '100%',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    {isExpanded ? 'Hide Assessment Details ▲' : 'View Assessment Details ▼'}
                                                </button>

                                                {isExpanded && (
                                                    <div className="collapsible-content">
                                                        <div className="ratings-section" style={{ marginTop: '0.5rem' }}>
                                                            <h4>Performance Ratings</h4>
                                                            <div className="ratings-grid">
                                                                <div className="rating-item">
                                                                    <span className="rating-label">Job Knowledge</span>
                                                                    <RatingBadge rating={appraisal.job_knowledge_rating} />
                                                                </div>
                                                                <div className="rating-item">
                                                                    <span className="rating-label">Achieved KPIs</span>
                                                                    <RatingBadge rating={appraisal.achieved_kpis_rating} />
                                                                </div>
                                                                <div className="rating-item">
                                                                    <span className="rating-label">Work Quality</span>
                                                                    <RatingBadge rating={appraisal.work_quality_rating} />
                                                                </div>
                                                                <div className="rating-item">
                                                                    <span className="rating-label">Initiative</span>
                                                                    <RatingBadge rating={appraisal.initiative_rating} />
                                                                </div>
                                                                <div className="rating-item">
                                                                    <span className="rating-label">Time Management</span>
                                                                    <RatingBadge rating={appraisal.time_management_rating} />
                                                                </div>
                                                                <div className="rating-item">
                                                                    <span className="rating-label">Accurate Records</span>
                                                                    <RatingBadge rating={appraisal.accurate_records_rating} />
                                                                </div>
                                                                <div className="rating-item">
                                                                    <span className="rating-label">Team Work</span>
                                                                    <RatingBadge rating={appraisal.team_work_rating} />
                                                                </div>
                                                                <div className="rating-item">
                                                                    <span className="rating-label">Organizing/Planning</span>
                                                                    <RatingBadge rating={appraisal.organizing_planning_rating} />
                                                                </div>
                                                                <div className="rating-item">
                                                                    <span className="rating-label">Work Attitude</span>
                                                                    <RatingBadge rating={appraisal.work_attitude_rating} />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="comments-section" style={{ marginBottom: '1rem' }}>
                                                            <div className="comment-block">
                                                                <h5>KPIs for This Year</h5>
                                                                <p>{appraisal.kpis_for_this_year || 'N/A'}</p>
                                                            </div>
                                                            <div className="comment-block">
                                                                <h5>Employee Comments/Problems</h5>
                                                                <p>{appraisal.employee_comments_problems || 'N/A'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="action-buttons">
                                                    <button className="action-btn edit-btn" onClick={() => navigate(`/form?review_id=${appraisal.review_id}`)}>
                                                        Edit
                                                    </button>
                                                    <button className="action-btn export-btn" onClick={() => exportAppraisalToPDF(appraisal)}>
                                                        Export
                                                    </button>
                                                    <button className="action-btn delete-btn" onClick={() => handleDeleteAppraisal(appraisal.review_id, appraisal)} style={{ backgroundColor: '#F44336' }}>
                                                        Delete
                                                    </button>
                                                </div>
                                            </>
                                        )}
 
                                        {isPending && (
                                            <div className="action-buttons">
                                                <button 
                                                    className="action-btn edit-btn"
                                                    onClick={() => navigate(`/form?review_id=${appraisal.review_id}`)}
                                                >
                                                    Complete Review
                                                </button>
                                                <button 
                                                    className="action-btn export-btn"
                                                    onClick={() => exportAppraisalToPDF(appraisal)}
                                                >
                                                    Export
                                                </button>
                                                <button 
                                                    className="action-btn delete-btn"
                                                    onClick={() => handleDeleteAppraisal(appraisal.review_id, appraisal)}
                                                    style={{ backgroundColor: '#F44336' }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'probations' && (
                <div className="tab-content">
                    {loadingProbations ? (
                        <p>Loading probations...</p>
                    ) : filteredProbations.length === 0 ? (
                        <p className="no-appraisals">No probations found.</p>
                    ) : (
                        <div className="probations-list">
                            {filteredProbations.map((probation, idx) => {
                                const isProbationExpanded = !!expandedCards[`probation_${probation.probation_id}`];
                                return (
                                    <div key={idx} className="probation-card appraisal-card">
                                        <div className="appraisal-header">
                                            <h3>{probation.name}</h3>
                                            <span className="employee-id">Role: {probation.role}</span>
                                        </div>
                                        
                                        <div className="appraisal-details">
                                            <p><strong>Department:</strong> {probation.department}</p>
                                            <p><strong>Joining Date:</strong> {new Date(probation.date_of_joining).toLocaleDateString()}</p>
                                            <p><strong>Review Date:</strong> {new Date(probation.date_of_review).toLocaleDateString()}</p>
                                        </div>

                                        <button 
                                            className="action-btn details-toggle-btn"
                                            onClick={() => toggleExpandCard(`probation_${probation.probation_id}`)}
                                            style={{
                                                backgroundColor: 'transparent',
                                                color: '#2196F3',
                                                border: '1px solid #2196F3',
                                                padding: '6px 12px',
                                                borderRadius: '4px',
                                                fontSize: '0.85rem',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                marginBottom: '1rem',
                                                width: '100%',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {isProbationExpanded ? 'Hide Assessment Details ▲' : 'View Assessment Details ▼'}
                                        </button>

                                        {isProbationExpanded && (
                                            <div className="collapsible-content">
                                                <div className="probation-ratings" style={{ marginTop: '0.5rem' }}>
                                                    <h4>Probation Assessment</h4>
                                                    <div className="ratings-grid">
                                                        <div className="rating-item">
                                                            <span className="rating-label">Functional/Technical Skills</span>
                                                            <RatingBadge rating={probation.functional_technical_skills} />
                                                        </div>
                                                        <div className="rating-item">
                                                            <span className="rating-label">Result Orientation</span>
                                                            <RatingBadge rating={probation.result_orientation} />
                                                        </div>
                                                        <div className="rating-item">
                                                            <span className="rating-label">Creativity/Innovation</span>
                                                            <RatingBadge rating={probation.creativity_innovation} />
                                                        </div>
                                                        <div className="rating-item">
                                                            <span className="rating-label">Communication</span>
                                                            <RatingBadge rating={probation.communication} />
                                                        </div>
                                                        <div className="rating-item">
                                                            <span className="rating-label">Teamwork</span>
                                                            <RatingBadge rating={probation.teamwork} />
                                                        </div>
                                                        <div className="rating-item">
                                                            <span className="rating-label">Adaptability</span>
                                                            <RatingBadge rating={probation.adaptability} />
                                                        </div>
                                                        <div className="rating-item">
                                                            <span className="rating-label">Supervisory/Managerial</span>
                                                            <RatingBadge rating={probation.supervisory_managerial} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="comments-section" style={{ marginBottom: '1rem' }}>
                                                    <div className="comment-block">
                                                        <h5>Appraiser's Comments</h5>
                                                        <p>{probation.appraisers_comments || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="action-buttons">
                                            <button 
                                                className="action-btn edit-btn"
                                                onClick={() => navigate(`/probation?probation_id=${probation.probation_id}`)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="action-btn export-btn"
                                                onClick={() => exportProbationToPDF(probation)}
                                            >
                                                Export
                                            </button>
                                            <button 
                                                className="action-btn delete-btn"
                                                onClick={() => handleDeleteProbation(probation.probation_id, probation)}
                                                style={{ backgroundColor: '#F44336' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ManagerDashboard;
