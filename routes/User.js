const Router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

Router.route("/login").post(async (req, res) => {
	let token;
	const { email, password } = req.body;
	const user = await User.findOne(
		{
			email: email,
		},
		{ _id: 0, __v: 0 }
	);

	const checkPassword =
		await user.comparePasswords(password);
	if (checkPassword && user) {
		token = jwt.sign(
			{ user },
			process.env.JWT_SECRET,
			{
				expiresIn: "1h",
			}
		);
	}

	res
		.status(200)
		.json(
			`Welcome to your jobbertrack, ${user.name}`
		);
});

Router.route("/signup").post(async (req, res) => {
	const body = req.body;

	const user = await User.create(body);
	const token = jwt.sign(
		{ user: body },
		process.env.JWT_SECRET,
		{
			expiresIn: "1h",
		}
	);

	res
		.status(200)
		.json(
			`Welcome to your jobbertrack, ${user.name}`
		);
});
module.exports = Router;
