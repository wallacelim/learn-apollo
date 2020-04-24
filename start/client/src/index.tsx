import { ApolloClient } from "apollo-client";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import gql from "graphql-tag";
import { ApolloProvider } from "@apollo/react-hooks";
import React from "react";
import ReactDOM from "react-dom";
import Pages from "./pages";
import injectStyles from "./styles";

const cache = new InMemoryCache();

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache,
    link: new HttpLink({
        uri: "http://localhost:4000",
        headers: {
            authorization: localStorage.getItem("token"),
        },
    }),
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

injectStyles();
ReactDOM.render(
    <ApolloProvider client={client}>
        <Pages />
    </ApolloProvider>,
    document.getElementById("root")
);
