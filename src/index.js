import React from 'react';
import ReactDOM from 'react-dom';
import './Styles/index.css';
import App from './Components/App';
import * as serviceWorker from './serviceWorker';
//Apollo imports
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { split, ApolloLink } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { onError } from 'apollo-link-error';
//react router import
import {BrowserRouter} from 'react-router-dom';
import { AUTH_TOKEN } from './Constants';
import { responsePathAsArray } from 'graphql';

//httpLink - connect ApolloClient instance w/ GraphQL Server/API on localhost:4000
const httpLink = createHttpLink({
  uri: 'http://localhost:4000'
});

//use apollo link for middleware to modify requests before sending to the server
const authorizationLink = setContext((_, { headers }) => {
  //get token from storage(if it exists)
  const token = localStorage.getItem(AUTH_TOKEN);
  //return headers to context so httpLink can read
  return{
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

//WebSocketLink for subscription endpoint  
const wsLink = new WebSocketLink({
  //websocket endpoint
  uri: `ws://localhost:4000`,
  options: {
    reconnect: true,
    connectionParams: {
      //authenticate ws connection w/ user's auth token from storage
      authToken: localStorage.getItem(AUTH_TOKEN)
    }
  }
})

//onError link for handling server, network, and GraphQL errors
const errorLink = onError(({operation, graphQLErrors, networkError, response }) => {
  if(graphQLErrors){
    //display errors to console
    graphQLErrors.map(({ message, locations, path }) => {
      console.log( `GraphQL ERROR- Message: ${message}, Location: ${locations}, Path: ${path}`)
    })
    //ignore error
    //response.errors = null;
    
  }
  if(networkError){
    console.log(`Network ERROR: ${networkError}`)
  }
})

//route request to middleware link w/ split
const link = split(
	({ query }) => {
		//get kind of operation & defintion
		const { kind, operation } = getMainDefinition(query);
		//return true = subscription, false = query/mutation
		return kind === "OperationDefinition" && operation === "subscription";
	},
	wsLink, //use websocket link for subscription
	ApolloLink.from([errorLink, authorizationLink, httpLink]) //use http link for query/mutation
);


//Instantiate ApolloClient w/link from split and new instance of InMemoryCache
const apolloClient = new ApolloClient({
  link: link,
  cache: new InMemoryCache()
})

//Render root component - App wrapped w/ ApolloProvider
ReactDOM.render(
	<body className="body background-gray" style={{height: "100vh"}}>
		<BrowserRouter>
			<ApolloProvider client={apolloClient}>
				<App />
			</ApolloProvider>
		</BrowserRouter>
	</body>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
