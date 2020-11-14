import * as path from 'path';
import * as express from 'express';
import * as session from 'express-session';
import * as redis from 'redis';
import * as connectRedis from 'connect-redis';
import * as bodyParser from 'body-parser';
import * as graphqlHTTP from 'express-graphql';
import * as exphbs from 'express-handlebars';
import * as cors from 'cors';
import {GraphQLSchema, GraphQLObjectType, GraphQLString} from 'graphql';
import {appConfig, isTest} from './config/index';
import {connectDb} from './database/index';
import {
    FileRouter,
    FileRouterEndpoint,
    ObjectRouter,
    ObjectRouterEndpoint,
    SceneNodeRouter,
    SceneNodeRouterEndpoint,
    UserRouter,
    UserRouterEndpoint
} from './router/index';

export let app = express();
const RedisStore = connectRedis(session);

connectDb().then(() => {
    const redisClient = redis.createClient({
        port: appConfig.redis.port,
        host: appConfig.redis.host
    });

    redisClient.on('connect', function() {
        console.log('Redis client connected');
        app.use(
            session({
                store: new RedisStore({
                    client: redisClient
                }),
                secret: appConfig.redis.secret,
                resave: false,
                saveUninitialized: false
            })
        );

        app.use(
            cors({
                credentials: true,
                origin: 'http://localhost:8080'
            })
        );

        app.use(bodyParser.json());

        app.use(FileRouterEndpoint, FileRouter);
        app.use(ObjectRouterEndpoint, ObjectRouter);
        app.use(SceneNodeRouterEndpoint, SceneNodeRouter);
        app.use(UserRouterEndpoint, UserRouter);

        // TODO: add GraphQL API
        app.use(
            '/graphql',
            graphqlHTTP({
                schema: new GraphQLSchema({
                    query: new GraphQLObjectType({
                        name: 'PlaceholderType',
                        fields: {
                            foo: {
                                type: GraphQLString,
                                resolve() {
                                    return 'foo';
                                }
                            }
                        }
                    })
                }),
                graphiql: true
            })
        );

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

    redisClient.on('error', function(err) {
        console.log('Something went wrong ' + err);
    });
});
