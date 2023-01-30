const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: [true, "Provide email"],
		// This value can either be `true` to use the default error
		// message or a non-empty string to use a custom one.
		unique: true,
		match: [
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			"Please provide a valid email",
		],
	},
	password: {
		type: String,
		required: [true, "Provide password"],
		minlength: [6, "Password too short"],
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
userSchema.methods.createToken = function () {
	return jwt.sign(
		{ email: this.email, userId: this._id },
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_LIFETIME,
		}
	);
};

module.exports = mongoose.model(
	"User",
	userSchema
);
