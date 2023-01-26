const { CustomAPIError } = require("../errors");
const {
	StatusCodes,
} = require("http-status-codes");
const errorHandlerMiddleware = (
	err,
	req,
	res,
	next
) => {
	let customError = {
		// set default
		statusCode:
			err.statusCode ||
			StatusCodes.INTERNAL_SERVER_ERROR,
		msg:
			err.message ||
			"Something went wrong try again later",
	};

	if (err.code && err.code === 11000) {
		customError.statusCode = 400;
		customError.msg = `Duplicate values entered for ${Object.keys(
			err.keyValue
		)} field, enter new value`;
	}
	if (err instanceof CustomAPIError) {
		return res
			.status(err.statusCode)
			.json({ msg: err.message });
	}
	// if
	if (err.name === "ValidationError") {
		customError.msg = Object.values(err.errors)
			.map((item) => item.message)
			.join(",");
		customError.statusCode = 400;
	}

	return res
		.status(customError.statusCode)
		.json({ err: customError.msg });
};

module.exports = errorHandlerMiddleware;
