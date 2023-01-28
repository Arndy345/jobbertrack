const express = require("express");
const app = express();
const User = require("./models/user");
const Job = require("./models/jobs");
const Router = require("./routes/User");

const jwt = require("jsonwebtoken");
app.use(express.json());

app.use("/", Router);
app.get("/", async (req, res) => {
	const user = await User.find({});

	res.status(200).json(user);
});
app
app.get("/jobs", async (req, res) => {
	const jobs = await Job.find({});

	res.status(200).json(jobs);
});

app.post("/jobs", async (req, res) => {
	const body = req.body;

	const jobs = await Job.create(body);

	res.status(201).json(jobs);
});

module.exports = app;
