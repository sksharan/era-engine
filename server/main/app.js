import * as path from 'path'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as exphbs from 'express-handlebars'
import * as cors from 'cors'
import {appConfig, isTest} from './config/index'
import {connectDb} from './database/index'
import {
    FileRouter, FileRouterEndpoint,
    ObjectRouter, ObjectRouterEndpoint,
    SceneNodeRouter, SceneNodeRouterEndpoint
} from './router/index'

export let app = express();

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

    app.listen(appConfig.port, () => {
        if (!isTest) {
            console.log('Started server on port ' + appConfig.port);
        }
    });
});
