import {createNetworkInterface} from 'apollo-client'
import {ApolloClient, addTypename, IntrospectionFragmentMatcher} from 'react-apollo'
import {graphqlEndpoint} from '../config'

const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: {
        __schema: {
            types: [
                {
                    "kind": "UNION",
                    "name": "SceneNodeContentType",
                    "possibleTypes": [
                        {
                            "name": "Object"
                        },
                        {
                            "name": "ObjectRef"
                        },
                        {
                            "name": "Light"
                        }
                    ]
                }
            ],
        },
    }
})

export default new ApolloClient({
    networkInterface: createNetworkInterface({uri: graphqlEndpoint}),
    queryTransformer: addTypename,
    fragmentMatcher
});
