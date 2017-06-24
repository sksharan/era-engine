import express from 'express';
import mongoose from 'mongoose';
import graphQLHTTP from 'express-graphql';
import cors from 'cors';
import config from './config';
import schema from './schema/index'

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

    app.use(cors());

    app.use('/graphql', graphQLHTTP({
        schema,
        graphiql: true
    }));

    app.listen(config.port, () => {
        console.log('Started server on port ' + config.port);
    });
});

export default app;
