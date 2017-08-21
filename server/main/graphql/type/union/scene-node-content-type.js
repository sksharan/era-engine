import {GraphQLUnionType} from 'graphql'
import {OutputObjectType} from '../object-type'
import {OutputObjectRefType} from '../object-ref-type'
import {OutputLightType} from '../light-type'

export default new GraphQLUnionType({
    name: 'SceneNodeContentType',
    types: [OutputObjectType, OutputObjectRefType, OutputLightType],
    resolveType: (data) => {
        if (data.objectSceneNodeId) {
            return OutputObjectRefType;
        }
        if (data.quadraticAttenuation) {
            return OutputLightType;
        }
        return OutputObjectType;
    }
});
