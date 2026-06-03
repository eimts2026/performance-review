import express from "express" 
import mysql from "mysql2"
import dotenv from "dotenv"
import cors from "cors"
dotenv.config()

// this is used to load the express web thingy
const app = express()

app.use(express.json())
app.use(cors())

// initialisation 
const db = mysql.createConnection({
    host: process.env.DB_SQL_HOST,
    user: process.env.DB_SQL_USER,
    password: process.env.DB_SQL_PASSWORD,
    database: process.env.DB_SQL_DATABASE_NAME
})

// Response to showing now you're in the backend
app.get("/", (req, res) => {
    res.json("hello this is the backend")
})

// Getting all employees from the DB
app.get("/users", (req, res) => {
    const q = "SELECT employee_id, first_name, last_name, email, department, job_title AS position, hire_date AS date_joined, role FROM employees"
    db.query(q, (err, data) => {
        if(err) {
            console.error("Error fetching employees:", err);
            return res.status(500).json({ error: "Failed to fetch employees", details: err.message })
        }
        return res.json(data)
    })
})

// Getting all managers from the DB
app.get("/managers", (req, res) => {
    const q = "SELECT employee_id, first_name, last_name, email, department, job_title AS position, hire_date AS date_joined, role FROM employees WHERE role = 'manager'"
    db.query(q, (err, data) => {
        if(err) {
            console.error("Error fetching managers:", err);
            return res.status(500).json({ error: "Failed to fetch managers", details: err.message })
        }
        return res.json(data)
    })
})

// Adding employee or manager to database (both use same employees table)
app.post("/users", (req, res) => {
    const { employee_id, first_name, last_name, email, position, date_joined, role, password } = req.body;
    
    const q = "INSERT INTO employees (`employee_id`, `first_name`, `last_name`, `email`, `job_title`, `hire_date`, `role`, `passwords`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [employee_id, first_name, last_name, email, position, date_joined, role || 'staff', password || ''];

    db.query(q, values, (err, data) => {
        if(err) {
            console.error("Error inserting employee:", err);
            return res.status(500).json(err);
        }
        return res.json("user created successfully")
    })
})

// Login endpoint
app.post("/login", (req, res) => {
    const { first_name, password } = req.body;
    
    // Trim spaces and tabs from inputs
    const cleanFirstName = first_name ? first_name.trim() : "";
    const cleanPassword = password ? password.trim() : "";
    
    // Safely compare with and without space/tab trimming to ensure match
    const q = "SELECT * FROM employees WHERE (TRIM(BOTH '\\t' FROM TRIM(first_name)) = ? OR first_name = ?) AND passwords = ?";
    
    db.query(q, [cleanFirstName, cleanFirstName, cleanPassword], (err, data) => {
        if(err) {
            console.error("Login database error:", err);
            return res.status(500).json(err);
        }
        if(data.length === 0) return res.status(401).json("Invalid credentials")
        
        const user = data[0];
        if (user.role !== 'HR' && user.role !== 'CEO' && user.role !== 'manager') {
            return res.status(403).json("Access denied: Only HR, CEO, and Managers are allowed to log in.");
        }
        
        return res.json({
            employee_id: user.employee_id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
            position: user.job_title
        })
    })
})

// Get all appraisals
app.get("/appraisals", (req, res) => {
    const q = "SELECT * FROM appraisals ORDER BY reviewed_date DESC"
    db.query(q, (err, data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
})

// Get appraisals for a specific manager (RBAC - Manager Only)
app.get("/appraisals/manager/:managerName", (req, res) => {
    const { managerName } = req.params;
    
    // Query to get appraisals where manager matches (including review_id)
    const q = "SELECT review_id, employee_id, employee_name, position, review_period, reviewed_date, attendance_rating, punctuality_rating, compliance_rating, engagement_rating, qualification_rating, comments, job_knowledge_rating, achieved_kpis_rating, work_quality_rating, initiative_rating, time_management_rating, accurate_records_rating, team_work_rating, organizing_planning_rating, work_attitude_rating, kpis_for_this_year, employee_comments_problems FROM appraisals WHERE manager = ? ORDER BY reviewed_date DESC";
    
    db.query(q, [managerName], (err, data) => {
        if(err) return res.status(500).json(err)
        return res.json(data)
    })
})

// Helper to convert empty string to NULL for database CHECK constraints
const nullIfEmpty = (val) => {
    if (val === undefined || val === null || val === "") return null;
    return val;
};

// Get a single appraisal by review_id
app.get("/appraisals/:review_id", (req, res) => {
    const { review_id } = req.params;
    const q = "SELECT * FROM appraisals WHERE review_id = ?";
    db.query(q, [review_id], (err, data) => {
        if(err) return res.status(500).json(err);
        if(data.length === 0) return res.status(404).json({ error: "Appraisal not found" });
        return res.json(data[0]);
    });
});

// Updating appraisal data in database (Complete / Edit Review)
app.put("/appraisals/:review_id", (req, res) => {
    const { review_id } = req.params;
    const {
        attendance_rating, punctuality_rating, compliance_rating, engagement_rating, qualification_rating, comments,
        job_knowledge_rating, achieved_kpis_rating, work_quality_rating, initiative_rating, time_management_rating,
        accurate_records_rating, team_work_rating, organizing_planning_rating, work_attitude_rating,
        kpis_for_this_year, employee_comments_problems
    } = req.body;

    const q = `UPDATE appraisals SET 
        attendance_rating = ?, punctuality_rating = ?, compliance_rating = ?, engagement_rating = ?, qualification_rating = ?, comments = ?,
        job_knowledge_rating = ?, achieved_kpis_rating = ?, work_quality_rating = ?, initiative_rating = ?, time_management_rating = ?,
        accurate_records_rating = ?, team_work_rating = ?, organizing_planning_rating = ?, work_attitude_rating = ?,
        kpis_for_this_year = ?, employee_comments_problems = ?
        WHERE review_id = ?`;

    const values = [
        nullIfEmpty(attendance_rating), nullIfEmpty(punctuality_rating), nullIfEmpty(compliance_rating), nullIfEmpty(engagement_rating), nullIfEmpty(qualification_rating), comments,
        nullIfEmpty(job_knowledge_rating), nullIfEmpty(achieved_kpis_rating), nullIfEmpty(work_quality_rating), nullIfEmpty(initiative_rating), nullIfEmpty(time_management_rating),
        nullIfEmpty(accurate_records_rating), nullIfEmpty(team_work_rating), nullIfEmpty(organizing_planning_rating), nullIfEmpty(work_attitude_rating),
        kpis_for_this_year, employee_comments_problems,
        review_id
    ];

    db.query(q, values, (err, data) => {
        if(err) {
            console.error("Error updating appraisal:", err);
            return res.status(500).json(err);
        }
        return res.json("appraisal updated successfully");
    });
});

// Adding appraisal data to database (Send for Review)
app.post("/appraisals", (req, res) => {
    const { appraiser_name, employee_id, employee_name, position, review_period, date_joined, reviewed_date, manager, manager_email, attendance_rating, punctuality_rating, compliance_rating, engagement_rating, qualification_rating, comments, job_knowledge_rating, achieved_kpis_rating, work_quality_rating, initiative_rating, time_management_rating, accurate_records_rating, team_work_rating, organizing_planning_rating, work_attitude_rating, kpis_for_this_year, employee_comments_problems } = req.body;
    
    // Safely format dates to handle strict SQL modes
    const finalReviewedDate = (reviewed_date && reviewed_date !== "") ? reviewed_date : new Date().toISOString().slice(0, 10);
    const finalDateJoined = (date_joined && date_joined !== "") ? new Date(date_joined).toISOString().slice(0, 10) : null;
    const finalReviewPeriod = review_period || null;

    // Corrected to exactly 25 columns and 25 placeholders
    const q = "INSERT INTO appraisals (`appraiser_name`, `employee_id`, `employee_name`, `position`, `review_period`, `date_joined`, `reviewed_date`, `manager`, `attendance_rating`, `punctuality_rating`, `compliance_rating`, `engagement_rating`, `qualification_rating`, `comments`, `job_knowledge_rating`, `achieved_kpis_rating`, `work_quality_rating`, `initiative_rating`, `time_management_rating`, `accurate_records_rating`, `team_work_rating`, `organizing_planning_rating`, `work_attitude_rating`, `kpis_for_this_year`, `employee_comments_problems`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    const values = [
        appraiser_name, employee_id, employee_name, position, finalReviewPeriod, finalDateJoined, finalReviewedDate, manager, 
        nullIfEmpty(attendance_rating), nullIfEmpty(punctuality_rating), nullIfEmpty(compliance_rating), nullIfEmpty(engagement_rating), nullIfEmpty(qualification_rating), comments, 
        nullIfEmpty(job_knowledge_rating), nullIfEmpty(achieved_kpis_rating), nullIfEmpty(work_quality_rating), nullIfEmpty(initiative_rating), nullIfEmpty(time_management_rating), nullIfEmpty(accurate_records_rating), nullIfEmpty(team_work_rating), nullIfEmpty(organizing_planning_rating), nullIfEmpty(work_attitude_rating), 
        kpis_for_this_year, employee_comments_problems
    ];

    db.query(q, values, (err, data) => {
        if(err) {
            console.error("Error inserting appraisal:", err);
            return res.status(500).json(err);
        }
        
        // Send email to manager about new appraisal
        const appraisalDate = new Date(finalReviewedDate).toLocaleDateString();
        const emailContent = `
            A new appraisal has been created for your review.
            
            Employee Name: ${employee_name}
            Employee ID: ${employee_id}
            Appraisal Date: ${appraisalDate}
            
            Please review the appraisal form in the system.
        `;

        // You can add email sending logic here using nodemailer or similar
        console.log(`Email would be sent to ${manager_email} with content:`, emailContent);
        
        return res.json("appraisal created successfully")
    })
})

// Adding probation data to database
app.post("/probation", (req, res) => {
    const {
        employee_id,
        name,
        department,
        role,
        date_of_joining,
        date_of_review,
        department_head,
        functional_technical_skills,
        result_orientation,
        creativity_innovation,
        communication,
        teamwork,
        adaptability,
        supervisory_managerial,
        appraisers_comments
    } = req.body;

    const finalDateOfReview = date_of_review || new Date().toISOString().slice(0, 10);

    const q = "INSERT INTO probation (`employee_id`, `name`, `department`, `role`, `date_of_joining`, `date_of_review`, `department_head`, `functional_technical_skills`, `result_orientation`, `creativity_innovation`, `communication`, `teamwork`, `adaptability`, `supervisory_managerial`, `appraisers_comments`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    const values = [
        employee_id,
        name,
        department,
        role,
        date_of_joining,
        finalDateOfReview,
        department_head,
        functional_technical_skills,
        result_orientation,
        creativity_innovation,
        communication,
        teamwork,
        adaptability,
        supervisory_managerial,
        appraisers_comments
    ];

    db.query(q, values, (err, data) => {
        if(err) {
            console.error("Error inserting probation record:", err);
            return res.status(500).json(err);
        }
        return res.json("probation record created successfully")
    })
})

// Get probations for a specific manager (RBAC - Manager Only)
app.get("/probation/manager/:departmentHead", (req, res) => {
    const { departmentHead } = req.params;
    
    // Query to get probation records where department_head matches
    const q = "SELECT employee_id, name, department, role, date_of_joining, date_of_review, functional_technical_skills, result_orientation, creativity_innovation, communication, teamwork, adaptability, supervisory_managerial, appraisers_comments FROM probation WHERE department_head = ? ORDER BY date_of_review DESC";
    
    db.query(q, [departmentHead], (err, data) => {
        if(err) return res.status(500).json(err)
        return res.json(data)
    })
})

// this is to test whether the connection works and thec code works
app.listen(8800, () => {
    console.log("Connected to backend!")
})