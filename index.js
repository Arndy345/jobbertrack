const express = require("express");
const app = express();
// const User = require("./models/user");
// const authenticationError = require("./errors/unauthenticated");
// const jwt = require("jsonwebtoken");

// const userRoute = require("./routes/User");
// const jobsRoute = require("./routes/Job");
// require("express-async-errors");
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");
const auth = require("./middleware/authentication");
// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
// const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const schema = require("./schema");
const resolvers = require("./resolvers");
const {
	graphqlHTTP,
} = require("express-graphql");
// const swaggerDocument = YAML.load(
// 	"./jobbertrack.yaml"
// );
const expressPlayground =
	require("graphql-playground-middleware-express").default;

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
// app.use(auth); // Apply authentication middleware
// get the user info from a JWT

// const auth = async (req) => {
// 	const authHeader = req.headers.authorization;
// 	if (
// 		!authHeader ||
// 		!authHeader.startsWith("Bearer")
// 	) {
// 		throw new authenticationError(
// 			"Invalid authentication"
// 		);
// 	}
// 	const token = authHeader.split(" ")[1];
// 	try {
// 		const payload = jwt.verify(
// 			token,
// 			process.env.JWT_SECRET
// 		);
// 		const user = {
// 			id: payload.userId,
// 			email: payload.email,
// 		};
// 		return user;
// 	} catch (err) {
// 		throw new authenticationError(
// 			"Invalid authentication"
// 		);
// 	}
// };

app.use(
	"/graphql",
	graphqlHTTP(async (req) => ({
		schema: schema,
		rootValue: resolvers,
		graphiql: true,
		context: req,
	}))
);

// app.get("/", async (req, res) => {
// 	res.send(
// 		"<h1 style='color: black;text-align: center'>Welcome to <span style='color: green'>Jobbertrack</span>!</h1>\
//      <br> <h3 style='color: black;text-align: center'>Click <a href='/api-docs'>here</a> to get started</h3>"
// 	);
// 	next();
// });
// app.use(
// 	"/api-docs",
// 	swaggerUI.serve,
// 	swaggerUI.setup(swaggerDocument)
// );
app.get(
	"/playground",
	expressPlayground({ endpoint: "/graphql" })
);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
