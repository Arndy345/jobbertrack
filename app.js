const app = require("./index");
require("dotenv").config();
const connect = require("./db/connection");
const port = process.env.port || 3000;

app.listen(port, async () => {
	await connect();
	console.log("Listening on port,", port);
});
