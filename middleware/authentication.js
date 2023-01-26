const authenticationError = require("../errors/unauthenticated");
const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (
		!authHeader ||
		!authHeader.startsWith("Bearer")
	) {
		throw new authenticationError(
			"Invalid authentication"
		);
	}
	const token = authHeader.split(" ")[1];
	try {
		const payload = jwt.verify(
			token,
			process.env.JWT_SECRET
		);
		// console.log(payload);
		req.user = {
			id: payload.userId,
			email: payload.email,
		};

		next();
	} catch (err) {
		throw new authenticationError(
			"Invalid authentication"
		);
	}
};

module.exports = auth;
