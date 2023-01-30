const Router = require("express").Router();
const {
	login,
	signup,
} = require("../controllers/auth");

Router.route("/login").post(login);

Router.route("/signup").post(signup);

module.exports = Router;
