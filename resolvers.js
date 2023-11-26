const User = require("./models/user");
const Job = require("./models/jobs");
const auth = require("./controllers/auth");
const {
	BadRequestError,
	UnauthenticatedError,
} = require("./errors");
const getToken = require("./middleware/authentication");

const resolvers = {
	getUser: async ({ id }) => {
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
			throw new Error(err.message);
		}
	},
	updateUser: async (args, context) => {
		const { name, email, password } = args;
		const { id } = await getToken(context);
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
			throw new Error(err);
		}
	},
	deleteUser: async (args, context) => {
		const { id } = await getToken(context);
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
			throw new Error(err);
		}
	},
	login: async ({ email, password }, context) => {
		let userDetails = { email, password };
		const token = await auth.login(userDetails);
		return { token };
	},
	createJob: async (args, context) => {
		const { id } = await getToken(context);
		args.user = id;
		try {
			const job = await Job.create(args);
			return job;
		} catch (err) {
			throw new Error(err);
		}
	},

	getJob: async (args, context) => {
		const { jobId } = args;
		const { id } = await getToken(context);
		try {
			const job = await Job.findOne({
				user: id,
				_id: jobId,
			});
			return job;
		} catch (error) {}
	},

	getJobs: async (args, context) => {
		const { id } = await getToken(context);

		try {
			const jobs = await Job.find({ user: id });
			return jobs;
		} catch (error) {
			throw new Error(error);
		}
	},
	updateJob: async (args, context) => {
		const { id } = await getToken(context);
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
		} catch (error) {
			throw new Error(error);
		}
	},
	deleteJob: async (args, context) => {
		const { id } = await getToken(context);
		const { password, jobId } = args;
		try {
			const job = await Job.findOne({
				_id: jobId,
				user: id,
			});
			if (!job) {
				throw new UnauthenticatedError(
					"Job not found"
				);
			}
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
			await job.remove();
			return "Deleted Successfully";
		} catch (err) {
			throw new Error(err);
		}
	},
};
module.exports = resolvers;
