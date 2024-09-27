module.exports = (error, req, res, next) => {

	if (error.status <= 500 && error) {
		
		return res.status(error.status).json(error);
	} else {
		
		return next(error.message);
	}
};
