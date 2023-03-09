const express = require("express");
const passport = require('passport');
// express.router digunakan untuk mengelola router pada aplikasi express js
const router = express.Router();
require('./utils/auth')

const {
	addNote,
	getAllNote,
	getNote,
	updateNote,
	deleteNote,
	register,
	login
} = require("./handler");

router.post("/register", register);
router.post("/login", login)
router.post("/note", passport.authenticate('jwt', { session: false }), addNote);
router.get("/notes", passport.authenticate('jwt', { session: false }), getAllNote);
router.get("/note/:id", passport.authenticate('jwt', { session: false }), getNote);
router.put("/note/:id", passport.authenticate('jwt', { session: false }), updateNote);
router.delete("/note/:id", passport.authenticate('jwt', { session: false }), deleteNote);

module.exports = router;
