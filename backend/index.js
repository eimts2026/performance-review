import express from "express" 
import mysql from "mysql"

// this is used to load the express web thingy
const app = express()

// initialisation 
const db = mysql.createConnection({
    host: process.env.VITE_SQL_HOST,
    user: process.env.VITE_SQL_USER,
    password: process.env.VITE_SQL_PASSWORD,
    database: process.env.VITE_SQL_DATABASE_NAME
})

app.get("/", (req, res) => {
    res.json("hello this is the backend")
})

// this is to test whether the connection works and thec code works
app.listen(8800, () => {
    console.log("Connected to backend!")
})