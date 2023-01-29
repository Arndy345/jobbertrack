const Router = require("express").Router();
const Job = require("../models/jobs");
const {
	createJob,
	getJob,
	updateJob,
	deleteJob,
	getAllJobs,
} = require("../controllers/jobs");

Router.route("/jobs")
	.get(getAllJobs)
	.post(createJob);

Router.route("/jobs/:id")
	.get(getJob)
	.patch(updateJob)
	.delete(deleteJob);

module.exports = Router;
