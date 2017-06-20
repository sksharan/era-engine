import {
    GraphQLList
} from 'graphql';

import {OutputLightType} from '../type/light-type';
import {LightModel} from '../../model/index';

export default {
    type: new GraphQLList(OutputLightType),
    resolve: (root, args) => {
        return LightModel.find(args).exec();
    }
}
