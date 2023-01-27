const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");




const userSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
		min: [6, "Password too short"],
	},
});

// Encrypt password before saving to the database
userSchema.pre("save", async function (next) {
	const user = this;

	if (!user.isModified("password")) return next();
	const hash = await bcrypt.hash(
		this.password,
		10
	);

	this.password = hash;
	next();
});

userSchema.methods.comparePasswords =
	async function (password) {
		return await bcrypt.compare(
			password,
			this.password
		);
	};

module.exports = mongoose.model(
	"User",
	userSchema
);
