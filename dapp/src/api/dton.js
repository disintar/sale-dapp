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

    calculateJettonAddress = (jettonAddress, userAddress) => {
        return this.client.query({
            query: gql`{
  getJettonWalletAddress(
    minter_address: "${jettonAddress}"
    user_address: "${userAddress}"
  )
}
    `,
        }, {fetchPolicy: "no-cache"})
    }

    getNftOwner = (address) => {
        const tonAddress = new Address(address)
        const rawAddress = tonAddress.toString('raw');


        return this.client.query({
            query: gql`{
  transactions(
    address: "${rawAddress.slice(2, rawAddress.length)}"
    workchain: ${tonAddress.workchain}
    page_size: 1
  ) {
	   parsed_nft_owner_address_address
       parsed_nft_owner_address_workchain
  }
}`,
        }, {fetchPolicy: "no-cache"})
    }

    getContractInfo = (address) => {
        const tonAddress = new Address(address)
        const rawAddress = tonAddress.toString('raw');


        return this.client.query({
            query: gql`{
  transactions(
    address: "${rawAddress.slice(2, rawAddress.length)}"
    workchain: ${tonAddress.workchain}
    page_size: 1
  ) {
    account_storage_balance_grams
    account_state_state_init_code
  }
  
  accountTransactionCount(
    address: "${rawAddress.slice(2, rawAddress.length)}"
    workchain: ${tonAddress.workchain}
  )
}`,
        }, {fetchPolicy: "no-cache"})
    }


    getNftContent = (address) => {
        const tonAddress = new Address(address)
        const rawAddress = tonAddress.toString('raw');


        return this.client.query({
            query: gql`{
  transactions(
    address: "${rawAddress.slice(2, rawAddress.length)}"
    workchain: ${tonAddress.workchain}
    page_size: 1
  ) {
    parsed_nft_content_offchain_url
  }
}`,
        }, {fetchPolicy: "no-cache"})
    }

    runGetMethod = (address, method, stack) => {
        const tonAddress = new Address(address)
        const rawAddress = tonAddress.toString('raw');

        const stackSerialized = stack.map(x => `{value_type: "${x.type}", value: "${x.value}"}`).join(",")

        return this.client.query({
            query: gql`
mutation {
  run_method(
    stack: [${stackSerialized}]
  	method_name: "${method}"
    account_search_by_address: {address: "${rawAddress.slice(2, rawAddress.length)}", workchain: ${tonAddress.workchain}}
  ) {
    stack {
      value
      value_type
    }
    exit_code
  }
}`,
        }, {fetchPolicy: "no-cache"})
    }
}