const User = require("./models/user");
// const authenticatedResolver =
// 	(resolveFunction) =>
// 	(parent, args, context) => {
// 		if (!context.user) {
// 			throw new Error("Authentication required");
// 		}
// 		return resolveFunction(parent, args, context);
// 	};
const resolvers = {
	getUser: async (
		args,
		{id}
	) => {
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
	updateUser: async (args,{id}) => {
		const {
			name,
			email,
			password,	
		}= args
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
	deleteUser: async (args,{ id }) => {
		try {
			const user = await User.findOneAndDelete({
				_id: id,
			});
			return user;
		} catch (err) {
			throw new Error("Error deleting user");
		}
	},
	login: async ({ email, password }) => {
		const user = await User.findOne(
			{
				email: email,
			},
			{ __v: 0 }
		);
		if (!user) {
			throw new UnauthenticatedError(
				"Wrong email/password"
			);
		}
		const checkPassword =
			await user.comparePasswords(password);
		if (!checkPassword) {
			throw new UnauthenticatedError(
				"Wrong email/password"
			);
		}
		token = await user.createToken();
		return { token };
	},
};
module.exports = resolvers;
