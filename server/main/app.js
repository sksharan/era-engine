import express from 'express';
import graphQLHTTP from 'express-graphql';
import cors from 'cors';
import config from './config';
import {connectDb} from './database'
import schema from './schema/index'

const app = express();

connectDb().then(() => {
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
