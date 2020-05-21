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
//react router import
import {BrowserRouter} from 'react-router-dom';
import { AUTH_TOKEN } from './Constants';

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
});

//Instantiate ApolloClient w/httpLink and new instance of InMemoryCache
const apolloClient = new ApolloClient({
  link: authorizationLink.concat(httpLink),
  cache: new InMemoryCache()
});

//Render root component - App wrapped w/ ApolloProvider
ReactDOM.render(
	<BrowserRouter>
		<ApolloProvider client={apolloClient}>
			<App />
		</ApolloProvider>
	</BrowserRouter>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
