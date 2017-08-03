import {GraphQLUnionType} from 'graphql'
import {OutputLightType} from './light-type'

export default new GraphQLUnionType({
    name: 'SceneNodeContentType',
    types: [OutputLightType],
    resolveType: (data) => {
        if (data.ambient) {
            return OutputLightType;
        }
    }
});
