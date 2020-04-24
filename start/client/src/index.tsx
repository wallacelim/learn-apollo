import React from "react";
import ReactDOM from "react-dom";
import { ApolloClient } from "apollo-client";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloProvider, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Pages from "./pages";
import Login from "./pages/login";
import injectStyles from "./styles";
import { resolvers, typeDefs } from "./resolvers";
import { GET_CART_ITEMS } from "./pages/cart";

const IS_LOGGED_IN = gql`
    query IsUserLoggedIn {
        isLoggedIn @client
    }
`;

const cache = new InMemoryCache();

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache,
    link: new HttpLink({
        uri: "http://localhost:4000",
        headers: {
            authorization: localStorage.getItem("token"),
        },
    }),
    resolvers,
    typeDefs,
});

client
    .query({
        query: gql`
            query GetLaunch {
                launch(id: 56) {
                    id
                    mission {
                        name
                    }
                }
            }
        `,
    })
    .then((result) => console.log(result));

cache.writeData({
    data: {
        isLoggedIn: !!localStorage.getItem("token"),
        cartItems: [],
    },
});

function IsLoggedIn() {
    const { data } = useQuery(IS_LOGGED_IN);
    return data.isLoggedIn ? <Pages /> : <Login />;
}

injectStyles();
ReactDOM.render(
    <ApolloProvider client={client}>
        <IsLoggedIn />
    </ApolloProvider>,
    document.getElementById("root")
);
