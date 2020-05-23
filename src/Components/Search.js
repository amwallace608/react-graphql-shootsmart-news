import React, {Component} from 'react';
import {withApollo} from 'react-apollo';
import gql from 'graphql-tag';
import Link from './Link';

//search query - filter = search constraint
const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      links {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }`

//class for link search feature
class Search extends Component{

  //state holds links to be rendered, filter term
  state = {
    links: [],
    filter: ''
  }

  //render search input field, button
  render() {
    return(
      <div>
        <div>
          Search
          <input
            type="text"
            onChange={event => this.setState({ filter: event.target.value })}
          />
          <button onClick ={() => this._executeSearch()}>Search</button>
        </div>
        {this.state.links.map((link, index) => (
          <Link key={link.id} link={link} index={index} />
        ))}
      </div>
    )
  }

  //execute search async function
  _executeSearch = async () => {
    //destructure state to get search filter term
    const { filter } = this.state
    //execute search query manually w/ apollo 
    const result = await this.props.client.query({
      query: FEED_SEARCH_QUERY,
      variables: { filter },
    })
    //get search result links
    const links = result.data.feed.links
    //set state links array to search result links
    this.setState({links})
  }
}

export default withApollo(Search)