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

// Adding employee to database
app.post("/users", (req, res) => {
    const { first_name, last_name, email, position, date_joined } = req.body;
    
    const q = "INSERT INTO employees (`first_name`, `last_name`, `email`, `position`, `date_joined`) VALUES (?, ?, ?, ?, ?)";
    const values = [first_name, last_name, email, position, date_joined];

    db.query(q, values, (err, data) => {
        if(err) return res.json(err)
        return res.json("employee created successfully")
    })
})

// Adding appraisal data to database
app.post("/appraisals", (req, res) => {
    const { appraiser_name, employee_name, position, review_period, date_joined, reviewed_date, manager, attendance_rating, punctuality_rating, compliance_rating, engagement_rating, qualification_rating, comments } = req.body;
    
    const q = "INSERT INTO appraisals (`appraiser_name`, `employee_name`, `position`, `review_period`, `date_joined`, `reviewed_date`, `manager`, `attendance_rating`, `punctuality_rating`, `compliance_rating`, `engagement_rating`, `qualification_rating`, `comments`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    const values = [appraiser_name, employee_name, position, review_period, date_joined, reviewed_date, manager, attendance_rating, punctuality_rating, compliance_rating, engagement_rating, qualification_rating, comments];

    db.query(q, values, (err, data) => {
        if(err) return res.json(err)
        return res.json("appraisal created successfully")
    })
})

// this is to test whether the connection works and thec code works
app.listen(8800, () => {
    console.log("Connected to backend!")
})