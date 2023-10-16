import express from "express";
import mysql from "mysql";
import cors from "cors";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "employee_db",
});

con.connect((err) => {
    if (err) throw new Error(err);
    console.log("Connected!");
});

app.get("/", (req, res) => {
  const page = req.query["page"] || 1;
  const itemsPerPage = 5; 
  const offset = (page - 1) * itemsPerPage;
  const countQuery = "SELECT COUNT(*) as count FROM employee";
  con.query(countQuery, (err, countData) => {
    if (err) throw err;
    const totalCount = countData[0].count;
    const query = `SELECT * FROM employee LIMIT ${itemsPerPage} OFFSET ${offset}`;
    con.query(query, (err, data) => {
      if (err) throw err;
    //   console.log(data);
      res.render('index.ejs', {
        title: 'Employee List',
        empData: data,
        currentPage: page,
        totalPages: Math.ceil(totalCount / itemsPerPage),
      });
    });
  });
});

app.get("/addemployee", (req, res) => {
    res.render("addemployee.ejs");
});
app.get("/updateemployee", (req, res) => {
    const id = req.query["id"];
    const query = `SELECT * FROM employee WHERE id = ${id}`;
    con.query(query, (err, data) => {
        if (err) throw err;
        console.log(data);
        res.render('updateemployee.ejs', {
            title: 'Employee List',
            empData: data[0],
        });
    });
});

app.post("/api/insert", (req, res) => {
    con.query("INSERT INTO employee SET ?", {
        full_name: req.body["fullname"],
        job_title: req.body["jobtitle"],
        phone_no: req.body["phoneno"],
        email: req.body["email"],
        address: req.body["address"],
        city: req.body["city"],
        state: req.body["state"],
        primary_emergency_contact: req.body["pec"],
        primary_contact_no: req.body["pecno"],
        primary_relationship: req.body["pecrelationship"],
        secondary_emergency_contact: req.body["sec"],
        secondary_contact_no: req.body["secno"],
        secondary_relationship: req.body["secrelationship"],
    }, (err) => {
        if (err) throw err;
        res.redirect("/");
    });
});

app.post("/api/update", (req, res) => {
    const id = req.query["id"];
    con.query(`UPDATE employee SET ? WHERE id = ${id}`, {
        full_name: req.body["fullname"],
        job_title: req.body["jobtitle"],
        phone_no: req.body["phoneno"],
        email: req.body["email"],
        address: req.body["address"],
        city: req.body["city"],
        state: req.body["state"],
        primary_emergency_contact: req.body["pec"],
        primary_contact_no: req.body["pecno"],
        primary_relationship: req.body["pecrelationship"],
        secondary_emergency_contact: req.body["sec"],
        secondary_contact_no: req.body["secno"],
        secondary_relationship: req.body["secrelationship"],
    }, (err) => {
        if (err) throw err;
        console.log("1 Record Updated!");
        res.redirect("/");
    });
});

app.get("/api/delete", (req, res) => {
    const id = req.query["id"];
    const query = `DELETE FROM employee WHERE id = ${id}`;
    con.query(query, (err, data) => {
        if (err) throw err;
        console.log("1 Record Deleted!");
        res.redirect("/");
    });
});

app.listen(3000, () => {
    console.log("Listening on port number 3000");
});

