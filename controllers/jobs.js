const { NotFoundError } = require("../errors");
const Job = require("../models/jobs");

const getAllJobs = async (req, res) => {
	const user = req.user.id;
	const jobs = await Job.find({
		createdBy: user,
	});
	res
		.status(200)
		.json({ jobs, count: jobs.length });
};

const createJob = async (req, res) => {
	const body = req.body;

	req.body.createdBy = req.user.id;

	const jobs = await Job.create(body);
	res.status(201).json(jobs);
};

const getJob = async (req, res) => {
	const user = req.user.id;
	const { id } = req.params;
	const job = await Job.findOne({
		_id: id,
		createdBy: user,
	});
	if (!job) {
		throw new NotFoundError(
			`No job with id of ${id} for this user`
		);
	}
	res.status(200).json(job);
};

const updateJob = async (req, res) => {
	const user = req.user.id;

	const {
		body: { company, position },
		params: { id },
	} = req;

	const job = await Job.findOneAndUpdate(
		{ _id: id, createdBy: user },

		req.body,

		{ new: true, runValidators: true }
	);

	if (!job) {
		throw new NotFoundError(
			`No job with id of ${id} for this user`
		);
	}
	res.status(200).json({ job, status: true });
};
const deleteJob = async (req, res) => {
	const user = req.user.id;

	const { id } = req.params;

	const job = await Job.findOneAndDelete({
		_id: id,
		createdBy: user,
	});

	if (!job) {
		throw new NotFoundError(
			`No job with id of ${id} for this user`
		);
	}
	res.status(200).json({ status: true });
};

module.exports = {
	createJob,
	getJob,
	updateJob,
	deleteJob,
	getAllJobs,
};
