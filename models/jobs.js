const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema({
	company: { type: String, required: true },
	position: { type: String, required: true },
	status: {
		type: String,
		required: true,
		enum: ["pending", "interview", "declined"],
		default: "pending",
	},
});

module.exports = mongoose.model("Job", jobSchema);
