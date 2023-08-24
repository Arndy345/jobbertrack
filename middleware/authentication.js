const authenticationError = require("../errors/unauthenticated");
const jwt = require("jsonwebtoken");
const auth = async (req) => {
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
		const user = {
			id: payload.userId,
			email: payload.email,
		};
		return user;
	} catch (err) {
		throw new authenticationError(
			"Invalid authentication"
		);
	}
};

module.exports = auth;
