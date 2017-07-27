import express from 'express';
import graphQLHTTP from 'express-graphql';
import cors from 'cors';
import config, {isTest} from './config';
import {connectDb} from './database'
import {Schema} from './graphql/index'
import {FileRouter, FileRouterEndpoint} from './router/file-router'

const app = express();

connectDb().then(() => {
    app.use(cors());
    app.use(FileRouterEndpoint, FileRouter);
    app.use('/graphql', graphQLHTTP({
        schema: Schema,
        graphiql: true
    }));
    app.listen(config.port, () => {
        if (!isTest) {
            console.log('Started server on port ' + config.port);
        }
    });
});

export default app;
