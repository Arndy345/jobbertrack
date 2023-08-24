const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema(
	{
		company: { type: String, required: true },
		position: { type: String, required: true },
		status: {
			type: String,
			required: true,
			enum: ["PENDING", "INTERVIEW", "DECLINED"],
			default: "PENDING",
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: [true, "Please provide user"],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
