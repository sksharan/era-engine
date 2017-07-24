import {
    GraphQLList
} from 'graphql';

import {OutputLightType} from '../type/light-type'
import * as LightService from '../../service/light-service'

export default {
    type: new GraphQLList(OutputLightType),
    resolve() {
        return LightService.getAllLights();
    }
}
