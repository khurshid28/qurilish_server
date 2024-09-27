const mongoose = require("mongoose");
// mongoose.set("strictQuery", false);

mongoose
	.connect(process.env.MONGODB_URL, {

	})
	.then(() => console.log("MongoDB Connected"))
	.catch((err) => console.log("Database error: ", err.message));
