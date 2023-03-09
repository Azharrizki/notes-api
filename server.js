const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const router = require("./router");
const handleErrors = require("./middlewares/errorHandler");
const { connect } = require('./utils/dbConnection')


const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

connect((err, client) => {
	if (err) {
		console.log(err);
	}
})

app.use("/", router);

app.use(handleErrors);

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
