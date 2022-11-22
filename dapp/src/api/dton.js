import {ApolloClient, InMemoryCache, ApolloProvider, gql} from '@apollo/client';
import {Address} from "ton3-core";
import {createHttpLink} from 'apollo-link-http';

export default class dTonAPI {
    constructor() {
        const defaultOptions = {
            watchQuery: {
                fetchPolicy: 'no-cache',
                errorPolicy: 'ignore',
            },
            query: {
                fetchPolicy: 'no-cache',
                errorPolicy: 'all',
            },
        }

        this.client = new ApolloClient({
            link: new createHttpLink(
                {
                    uri: "https://dton.io/graphql/"
                }
            ),
            fetchOptions: {
                mode: 'no-cors',
            },
            defaultOptions: defaultOptions,
            cache: new InMemoryCache({addTypename: false})
        });
    }

    getTransactionCount = (address) => {
        const tonAddress = new Address(address)
        const rawAddress = tonAddress.toString('raw');

        return this.client.query({
            query: gql`{
  accountTransactionCount(
    address: "${rawAddress.slice(2, rawAddress.length)}"
    workchain: ${tonAddress.workchain}
  )
}
    `,
        }, {fetchPolicy: "no-cache"})
    }
}