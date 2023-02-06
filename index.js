const express = require("express");
const app = express();
const User = require("./models/user");
const userRoute = require("./routes/User");
const jobsRoute = require("./routes/Job");
require("express-async-errors");
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");
const auth = require("./middleware/authentication");
// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

app.set("trust proxy", 1);
app.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100, // limit each IP to 100 requests per windowMs
	})
);

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
app.use("/api/v1/auth", userRoute);
app.use("/api/v1", auth, jobsRoute);
app.get("/", async (req, res) => {
	res.status(200).end("Welcome to job api");
});
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
