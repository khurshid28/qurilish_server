const path = require("path");
const multer = require("multer");
const { BadRequestError } = require("../utils/errors.js");

const fileFilter = (req, file, cb) => {

	if (file.mimetype.startsWith("image/")) {
		cb(null, true);
	} else {
		console.log(file.mimetype);
		cb(new BadRequestError(400, "Only image files are allowed!"), false);
	}
};

let storage =(path)=> multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path);
	},
	filename: function (req, file, cb) {
		let filename =  Date.now() + file.originalname;
		req.body.filename= filename
		cb(null, filename);
	},
});



let upload = (path)=> multer({ storage: storage(path), limits: { fileSize: 30 * 1024 * 1024 }, fileFilter });

module.exports = upload;
