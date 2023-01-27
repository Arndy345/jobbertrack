const mongoose = require("mongoose");
const options = {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
};
const connect = () => {
	return mongoose
		.connect(process.env.MONGO_URI, options)
		.then((data) => {
			console.log(
				"Connected to",
				data.connections[0].name
			);
		})
		.catch((err) => {
			console.log(
				err.MongooseServerSelectionError,
				"here"
			);
		});
};

module.exports = connect;
