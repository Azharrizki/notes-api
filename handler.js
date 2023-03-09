const { ObjectId } = require("mongodb");
const passport = require("passport");
const { getDb } = require('./utils/dbConnection');
const { logger } = require('./utils/logger');
const jwt = require('jsonwebtoken');

exports.addNote = async (req, res, next) => {
	const db = getDb()
	const { title } = req.body;

	try {
		if (!title) {
			logger.error(`${req.originalUrl} - ${req.ip} - title is missing `);
			throw new Error("Title is empty");
		}

		const data = {
			...req.body,
			createdAt: new Date(Date.now()).toISOString(),
			updatedAt: new Date(Date.now()).toISOString(),
			username: req.user.username
		}

		const result = await db.collection('notes').insertOne(data);
		const objResult = JSON.parse(result);
		res.status(200).json({ message: "Data successfully saved", _id: objResult.insertedId });

	} catch (error) {
		next(error);
		logger.error(`${req.originalUrl} - ${req.ip} - ${error}`)
	}
};

exports.getAllNote = async (req, res, next) => {
	const db = getDb()

	try {
		const result = await db.collection('notes').find({ username: req.user.username }).sort({ _id: -1 }).toArray();
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
				message: 'Register successful',
				user: user
			})
		} else {
			res.status(200).json({
				message: 'Email already registered'
			})
		}
	})(req, res, next)
}

exports.login = async (req, res, next) => {
	passport.authenticate('login', async (err, user, info) => {
		try {
			if (err || !user) {
				const error = new Error('An error occurred.')

				return next(error)
			}

			req.login(user, { session: false }, async (error) => {
				if (error) return next(error)

				const body = { _id: user._id, username: user.username }
				const token = jwt.sign(body, 'mys3cret')

				return res.json({ user: body, token })
			})
		} catch (error) {
			return next(error)
		}
	})(req, res, next)
}