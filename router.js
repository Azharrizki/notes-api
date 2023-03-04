const express = require("express");

// express.router digunakan untuk mengelola router pada aplikasi express js
const router = express.Router();
const { register } = require('./utils/auth')

const {
	addNote,
	getAllNote,
	getNote,
	updateNote,
	deleteNote,
} = require("./handler");

router.post('/register', register)
router.post("/note", addNote);
router.get("/notes", getAllNote);
router.get("/note/:id", getNote);
router.put("/note/:id", updateNote);
router.delete("/note/:id", deleteNote);

module.exports = router;
