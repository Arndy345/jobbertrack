const User = require("./models/user");
const Job = require("./models/jobs");
const auth = require("./controllers/auth");
const {
	BadRequestError,
	UnauthenticatedError,
} = require("./errors");
const resolvers = {
	getUser: async (args, { id }) => {
		try {
			const user = await User.findOne({
				_id: id,
			});
			return user;
		} catch (err) {
			throw new Error("Error retrieving user");
		}
	},

	getUsers: async () => {
		try {
			const users = await User.find();
			return users;
		} catch (err) {
			throw new Error("Error retrieving users");
		}
	},
	createUser: async ({
		name,
		email,
		password,
	}) => {
		try {
			const user = await User.create({
				name,
				email,
				password,
			});
			const token = await user.createToken();
			return { token };
		} catch (err) {
			throw new Error("Error creating user");
		}
	},
	updateUser: async (args, { id }) => {
		const { name, email, password } = args;
		let body = {};
		name ? (body.name = name) : "";
		email ? (body.email = email) : "";
		password ? (body.password = password) : "";

		try {
			const user = await User.findOneAndUpdate(
				{ _id: id },
				{ $set: body },
				{ new: true }
			);
			return user;
		} catch (err) {
			throw new Error("Error updating user");
		}
	},
	deleteUser: async (args, { id }) => {
		const { password } = args;
		try {
			const user = await User.findOne({
				_id: id,
			});
			const checkPassword =
				await user.comparePasswords(password);
			if (!checkPassword) {
				throw new UnauthenticatedError(
					"Wrong password"
				);
			}
			user.remove();
			return user;
		} catch (err) {
			throw new Error("Error deleting user");
		}
	},
	login: async ({ email, password }, context) => {
		let userDetails = { email, password };
		const token = await auth.login(userDetails);
		return { token };
	},
	createJob: async (args, { id }) => {
		args.user = id;
		const job = await Job.create(args);
		return job;
	},

	getJob: async (args, { id }) => {
		const { jobId } = args;
		try {
			const job = await Job.findOne({
				user: id,
				_id: jobId,
			});
			return job;
		} catch (error) {}
	},

	getJobs: async (args, { id }) => {
		try {
			const jobs = await Job.find({ user: id });
			return jobs;
		} catch (error) {}
	},
	updateJob: async (args, { id }) => {
		let body = {};
		const { jobId, status } = args;
		body.status = status;
		try {
			const jobs = await Job.findOneAndUpdate(
				{
					user: id,
					_id: jobId,
				},
				{ $set: body },
				{ new: true }
			);
			return jobs;
		} catch (error) {}
	},
	deleteJob: async (args, { id }) => {
		const { password, jobId } = args;
		console.log(args);
		try {
			const job = await job.findOne({
				_id: jobId,
				user: id,
			});
			console.log(job);
			const user = await User.findOne({
				_id: id,
			});
			console.log(user);
			const checkPassword =
				await user.comparePasswords(password);
			if (!checkPassword) {
				throw new UnauthenticatedError(
					"Wrong password"
				);
			}
			console.log(job);
			await job.remove();
			return job;
		} catch (err) {
			throw new Error("Error deleting Job");
		}
	},
};
module.exports = resolvers;
