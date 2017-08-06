import path from 'path'
import express from 'express';
import exphbs from 'express-handlebars';
import graphQLHTTP from 'express-graphql';
import cors from 'cors';
import config, {isTest} from './config';
import {connectDb} from './database'
import {Schema} from './graphql/index'
import {FileRouter, FileRouterEndpoint} from './router/file-router'
import {ObjectRouter, ObjectRouterEndpoint} from './router/object-router'

const app = express();

connectDb().then(() => {
    app.use(cors());

    app.use(FileRouterEndpoint, FileRouter);
    app.use(ObjectRouterEndpoint, ObjectRouter);

    app.use('/graphql', graphQLHTTP({
        schema: Schema,
        graphiql: true
    }));

    const viewDir = path.join(__dirname, 'view');
    app.set('views', viewDir);
    app.engine('handlebars', exphbs({defaultLayout: 'main', layoutsDir: path.join(viewDir, 'layout')}));
    app.set('view engine', 'handlebars');

    app.listen(config.port, () => {
        if (!isTest) {
            console.log('Started server on port ' + config.port);
        }
    });
});

export default app;
