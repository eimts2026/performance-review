import express from "express" 
import mysql from "mysql2"
import dotenv from "dotenv"
dotenv.config()

// this is used to load the express web thingy
const app = express({ path: '../.env' })

app/use(express.json())

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

// Adding date into employees table
app.post("/users", (req, res) => {
    const q = "INSERT INTO employees (`employee_id`, `first_name`, `last_name`, `email`) VALUES (?)"
    const values = ["12234", "Jon", "De", "Joe@gmail.com"]

    db.query(q,[values], (err, data) => {
        if(err) return res.json(err)
        return res.json("user created")
    })
})

// this is to test whether the connection works and thec code works
app.listen(8800, () => {
    console.log("Connected to backend!")
})