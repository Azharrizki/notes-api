const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");
const router = require("./router");
const handleErrors = require("./middlewares/errorHandler");
const { connect } = require('./utils/dbConnection')
const app = express();
const port = 3001;

app.use(bodyParser.json());

// Menggunakan cors agar dapat menghadnle port yang berbeda
app.use(cors());

connect((err, client) => {
	if (err) {
		console.log(err);
	}
})

// router
app.use("/", router);

// Menggunakan error handler
app.use(handleErrors);

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
