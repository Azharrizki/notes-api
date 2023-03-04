const { MongoClient } = require('mongodb')

const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)
const dbName = 'notesDB'

let db;

exports.connect = (callback) => {
    client.connect((err, client) => {
        db = client.db(dbName);
        return callback(err, client)
    })
}

exports.getDb = () => {
    return db;
}