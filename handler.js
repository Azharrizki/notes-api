const { ObjectId } = require("mongodb");
const passport = require("passport");
const { getDb } = require('./utils/dbConnection');
const { logger } = require('./utils/logger');

exports.addNote = async (req, res, next) => {
	const db = getDb()
	const { title } = req.body;

	try {
		// Melakukan pengecekan jika tidak ada title maka akan mengembalikan pesan error
		if (!title) {
			logger.error(`${req.originalUrl} - ${req.ip} - title is missing `);
			throw new Error("Title is empty");
		}

		const data = {
			...req.body,
			createdAt: new Date(Date.now()).toISOString(),
			updatedAt: new Date(Date.now()).toISOString()
		}

		// Dan jika ada title maka sistem akan menyimpan data ke collection notes
		const result = await db.collection('notes').insertOne(data);

		const objResult = JSON.parse(result);

		// kirim status dan pesan dalam format json ke client
		res.status(200).json({ message: "Data successfully saved", _id: objResult.insertedId });
	} catch (error) {
		next(error);
		logger.error(`${req.originalUrl} - ${req.ip} - ${error}`)
	}
};

exports.getAllNote = async (req, res, next) => {
	const db = getDb()

	try {
		// mengubah document menjadi sebuah array agar lebih mudah dibaca
		const result = await db.collection('notes').find().toArray();

		logger.info(`${req.originalUrl} - ${req.ip} - All notes retrieved`)

		res.status(200).json(result);
	} catch (error) {
		next(error);
		logger.error(`${req.originalUrl} - ${req.ip} - ${error}`)
	}
};

exports.getNote = async (req, res, next) => {
	const db = getDb()

	try {
		// Req.params digunakan untuk mendapatkan parameter yang ada di url
		const result = await db.collection('notes').findOne({
			_id: ObjectId(req.params.id),
		});

		logger.info(`${req.originalUrl} - ${req.ip} - Note retrieved`)

		res.status(200).json(result);
	} catch (error) {
		logger.error(`${req.originalUrl} - ${req.ip} - ${error}`)
		next(error);
	}
};

exports.updateNote = async (req, res, next) => {
	const db = getDb()

	try {
		// Melakukan update pada sebuah data collection
		const result = await db.collection('notes').updateOne(
			{ _id: ObjectId(req.params.id) },
			{
				$set: {
					title: req.body.title,
					note: req.body.note,
					updatedAt: new Date(Date.now()).toISOString()
				},
			},
		);

		logger.info(`${req.originalUrl} - ${req.ip} - Data successfully updated`);

		console.log(result);

		res.status(200).json("Data successfully updated");
	} catch (error) {
		next(error);
		logger.error(`${req.originalUrl} - ${req.ip} - ${error} `);
	}
};

exports.deleteNote = async (req, res, next) => {
	const db = getDb()

	try {
		// Menghapus salah satu data pada collection notes bedasarkan path id
		const result = await db.collection('notes').deleteOne({
			_id: ObjectId(req.params.id),
		});
		logger.info(`${req.originalUrl} - ${req.ip} - Data successfully deleted`);
		console.log(result);

		res.status(200).json("Data successfully deleted");
	} catch (error) {
		next(error);
		logger.error(`${req.originalUrl} - ${req.ip} - ${error} `);

	}
};

exports.register = async (req, res, next) => {
	passport.authenticate('register', { session: false }, async (err, user, info) => {
		if (user) {
			res.status(200).json({
				message: 'Register Successful',
				user: user
			})
		} else {
			res.status(200).json({
				message: 'Email already registered'
			})
		}
	})(req, res, next)
}