import {gql} from 'react-apollo'
import LightSelect from './light-select'

export default gql`
    query getLights {
        light {
            ${LightSelect}
        }
    }
`;
