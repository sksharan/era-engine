import path from 'path'
import express from 'express';
import bodyParser from 'body-parser'
import exphbs from 'express-handlebars';
import cors from 'cors';
import config, {isTest} from './config';
import {connectDb} from './database'
import {FileRouter, FileRouterEndpoint} from './router/file-router'
import {ObjectRouter, ObjectRouterEndpoint} from './router/object-router'
import {SceneNodeRouter, SceneNodeRouterEndpoint} from './router/scene-node-router'

const app = express();

connectDb().then(() => {
    app.use(cors());

    app.use(bodyParser.json());

    app.use(FileRouterEndpoint, FileRouter);
    app.use(ObjectRouterEndpoint, ObjectRouter);
    app.use(SceneNodeRouterEndpoint, SceneNodeRouter);

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
