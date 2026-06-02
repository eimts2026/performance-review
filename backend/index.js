import express from "express" 
import mysql from "mysql2"
import dotenv from "dotenv"
import cors from "cors"
dotenv.config()

// this is used to load the express web thingy
const app = express({ path: '../.env' })

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
    const q = "SELECT * FROM employees"
    db.query(q, (err,data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
})

// Adding employee or manager to database (both use same employees table)
app.post("/users", (req, res) => {
    const { employee_id, first_name, last_name, email, position, date_joined, role } = req.body;
    
    const q = "INSERT INTO employees (`employee_id`, `first_name`, `last_name`, `email`, `position`, `date_joined`, `role`) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [employee_id, first_name, last_name, email, position, date_joined, role || 'staff'];

    db.query(q, values, (err, data) => {
        if(err) return res.json(err)
        return res.json("user created successfully")
    })
})

// Get all managers (employees with role='manager')
app.get("/managers", (req, res) => {
    const q = "SELECT * FROM employees WHERE role = 'manager'"
    db.query(q, (err, data) => {
        if(err) return res.json(err)
        return res.json(data)
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

// Adding appraisal data to database
app.post("/appraisals", (req, res) => {
    const { appraiser_name, employee_id, employee_name, position, review_period, date_joined, reviewed_date, manager, manager_email, attendance_rating, punctuality_rating, compliance_rating, engagement_rating, qualification_rating, comments } = req.body;
    
    const q = "INSERT INTO appraisals (`appraiser_name`, `employee_id`, `employee_name`, `position`, `review_period`, `date_joined`, `reviewed_date`, `manager`, `attendance_rating`, `punctuality_rating`, `compliance_rating`, `engagement_rating`, `qualification_rating`, `comments`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    const values = [appraiser_name, employee_id, employee_name, position, review_period, date_joined, reviewed_date, manager, attendance_rating, punctuality_rating, compliance_rating, engagement_rating, qualification_rating, comments];

    db.query(q, values, (err, data) => {
        if(err) return res.json(err)
        
        // Send email to manager about new appraisal
        const appraisalDate = new Date(reviewed_date).toLocaleDateString();
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

// this is to test whether the connection works and thec code works
app.listen(8800, () => {
    console.log("Connected to backend!")
})