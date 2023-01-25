const User = require("../models/user");

const {
	BadRequestError,
	UnauthenticatedError,
} = require("../errors");
require("express-async-errors");
const login = async (req, res) => {
	let token;
	const { email, password } = req.body;
	if (!email || !password) {
		throw new BadRequestError(
			"Provide email and password"
		);
	}
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
	res
		.status(200)
		.json(
			`Welcome to your jobbertrack, ${user.name} and token ${token}`
		);
};
const signup = async (req, res) => {
	const body = req.body;

	const user = await User.create(body);

	const token = await user.createToken();

	res
		.status(200)
		.json(
			`Welcome to your jobbertrack, ${user.name} and token ${token}`
		);
};

module.exports = { login, signup };
