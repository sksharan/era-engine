const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./config');
const onInit = require('./on-init');

/* Prevent deprecation warning when saving with Mongoose:
   http://stackoverflow.com/questions/38138445/node3341-deprecationwarning-mongoose-mpromise */
mongoose.Promise = global.Promise;

mongoose.connect(config.database.url);
const db = mongoose.connection;

db.on('error', function(err) {
    console.error('connection error:', err);
});
db.once('open', function() {
    console.log('Connected to database ' + config.database.url);

    app.use('/regions', require('./router/region-router'));

    app.listen(config.port, function() {
        console.log('Started server on port ' + config.port);
        onInit();
    });
});
