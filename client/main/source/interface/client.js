import {createNetworkInterface} from 'apollo-client'
import {ApolloClient, addTypename} from 'react-apollo'
import {graphqlEndpoint} from '../config'

export default new ApolloClient({
    networkInterface: createNetworkInterface({uri: graphqlEndpoint}),
    queryTransformer: addTypename
});
