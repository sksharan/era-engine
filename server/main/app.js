import express from 'express';
import mongoose from 'mongoose';
import config from './config';

const app = express();

/* Prevent deprecation warning when saving with Mongoose:
   http://stackoverflow.com/questions/38138445/node3341-deprecationwarning-mongoose-mpromise */
mongoose.Promise = global.Promise;

mongoose.connect(config.database.url);
const db = mongoose.connection;

db.on('error', (err) => {
    console.error('connection error:', err);
});
db.once('open', () => {
    console.log('Connected to database ' + config.database.url);

    app.use('/regions', require('./router/region-router'));

    app.listen(config.port, () => {
        console.log('Started server on port ' + config.port);
    });
});

module.exports = app;
