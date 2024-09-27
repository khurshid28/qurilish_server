const { InternalServerError, ForbiddenError } = require("../utils/errors.js");

module.exports = async (req, res, next) => {
	try {
		if (req.query && req.query.key == process.env.AUTH_KEY_API) {
			return next();
		}

		return next(new ForbiddenError(403, "You have no permission"));
	} catch (error) {
		return next(new InternalServerError(500, error.message));
	}
};