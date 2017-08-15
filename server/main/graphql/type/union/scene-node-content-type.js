import {GraphQLUnionType} from 'graphql'
import {OutputObjectType} from '../object-type'
import {OutputLightType} from '../light-type'

export default new GraphQLUnionType({
    name: 'SceneNodeContentType',
    types: [OutputObjectType, OutputLightType],
    resolveType: (data) => {
        if (data.positions) {
            return OutputObjectType;
        }
        if (data.quadraticAttenuation) {
            return OutputLightType;
        }
    }
});
