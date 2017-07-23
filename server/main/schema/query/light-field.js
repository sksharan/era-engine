import {
    GraphQLList
} from 'graphql';

import {OutputLightType} from '../type/light-type'
import {db, LightCollection} from '../../database'

export default {
    type: new GraphQLList(OutputLightType),
    resolve() {
        return db.collection(LightCollection).find({}).toArray();
    }
}
