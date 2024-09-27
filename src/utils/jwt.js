const { InternalServerError } = require("../utils/errors.js");
const JWT = require("jsonwebtoken");

module.exports = {
	sign: (payload) => {
		console.log(">>>>" ,process.env.JWT_SECRET);
		console.log(">>>>" ,process.env.JWT_EXPIRATION_TIME);
		try {
			return JWT.sign(payload, process.env.JWT_SECRET, {
				expiresIn: process.env.JWT_EXPIRATION_TIME,
			});
		} catch (error) {
			return new InternalServerError(500, error.message);
		}
	},

	verify: (token) => {
		try {
			const decodedToken = JWT.verify(token, process.env.JWT_SECRET);
			return decodedToken;
		} catch (error) {
			throw error;
		}
	},
};
