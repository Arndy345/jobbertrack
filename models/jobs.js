const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema({
	company: { type: String, required: true },
	position: { type: String, required: true },
});

module.exports = mongoose.model("Job", jobSchema);
