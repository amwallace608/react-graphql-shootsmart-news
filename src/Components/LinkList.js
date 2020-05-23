import React, {Component, Fragment} from 'react';
import Link from './Link';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { LINKS_PER_PAGE } from '../Constants';


/**GraphQL query for link feed
 * skip = offset where query will start (first x number of items will be omitted from response)
 * first = limit for number of elements to load from the list of links
 * orderby = how the list should be sorted
 * - links: link id, time of posting, url, description, user who posted, votes
 * - postedBy: user id, user name
 * - votes: id, user (w/ user id)
*******************************/
export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
      links {
        id
        createdAt
        url
        description
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
      count
    }
  }`


//GQL subscription for new links
const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
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
  }`

//GQL subscription for new votes
const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      id
      link {
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
      user {
        id
      }
    }
  }`

//class for rendering a list of links
class LinkList extends Component {

  //update cached vote data after upvoting a link
  _updateCacheAfterVote = (store, createVote, linkId) => {
    //check if 'new' page/route
    const isNewPage = this.props.location.pathname.includes('new')
    //get page integer value (base 10)
    const page = parseInt(this.props.match.params.page, 10)
    //determine page offset - links to skip to get current page
    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
    //determine number of links to get from list
    const first = isNewPage ? LINKS_PER_PAGE : 100
    //determine order of links
    const orderBy = isNewPage ? 'createdAt_DESC' : null
    
    //read current state of cached FEED_QUERY data from store
    const data = store.readQuery({ query: FEED_QUERY, variables: { first, skip, orderBy } })

    //get upvoted link
    const votedLink = data.feed.links.find(link => link.id === linkId)

    //set link votes to votes retrieved from server
    votedLink.votes = createVote.link.votes

    //write data back to the store
    store.writeQuery({ query: FEED_QUERY, data })
    
  }

  //subscribe to new Link events - opens websocket connection to subscription server
  _subscribeToNewLinks = subscribeToMore => {
    subscribeToMore({
      //subscripton query - will fire every time new link created
      document: NEW_LINKS_SUBSCRIPTION,
      //retrieve new link from subscriptionData, and merge into list of links
      updateQuery: (prev, { subscriptionData }) => {
        //if no data, return previous state of feed
        if(!subscriptionData.data){return prev}
        const newLink = subscriptionData.data.newLink
        const exists = prev.feed.links.find(({ id }) => id === newLink.id)
        //if no new link exists in subscriptionData, return previous state of feed
        if(exists){return prev}

        //merge newLink into feed links list and return
        return Object.assign({}, prev, {
          feed: {
            links: [newLink, ...prev.feed.links],
            count: prev.feed.links.length + 1,
            __typename: prev.feed.__typename
          }
        })
      }
    })
  }

  //subscribe to new vote events - opens websocket connection to subscription server
  //apollo automatically updates link voted on when fired
  _subscribeToNewVotes = subscribeToMore => {
    subscribeToMore({
      document: NEW_VOTES_SUBSCRIPTION
    })
  }

  //get query variables (first, skip, orderBy)
  _getQueryVariables = () => {
    //check if page/route is 'New'
    const isNewPage = this.props.location.pathname.includes('new')
    const page = parseInt(this.props.match.params.page, 10)

    //calculate number of links to skip (offsett)
    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
    //number of links to load from list
    const first = isNewPage ? LINKS_PER_PAGE : 100
    //order by link submission time (descending) if 'New' page
    const orderBy = isNewPage ? 'createdAt_DESC' : null
    //return vars for feed query
    return { first, skip, orderBy }
  }

  //get page of links to render
  _getLinksToRender = data => {
    //check if ordering by new ('new' route/page)
    const isNewPage = this.props.location.pathname.includes('new')
    //if newPage, just return links from query (already in order)
    if(isNewPage){
      return data.feed.links
    }
    //order links by number of votes (for top page)
    const rankedLinks = data.feed.links.slice()
    rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length)
    //return links ordered by number of votes
    return rankedLinks
  }

  //navigate to next page method
  _nextPage = data => {
    //get current page 
    const page = parseInt(this.props.match.params.page, 10)
    //check if last page
    if(page <= data.feed.count / LINKS_PER_PAGE) {
      //if more pages, navigate to next
      const nextPage = page + 1
      this.props.history.push(`/new/${nextPage}`)
    }
  }

  //navigate to previous page method
  _previousPage = () => {
    //get current page
    const page = parseInt(this.props.match.params.page, 10)
    //check if first page
    if(page > 1) {
      //navigate to previous page if not first page
      const previousPage = page - 1
      this.props.history.push(`/new/${previousPage}`)
    }
  }

  render () {
    //return Query component, FEED_QUERY as prop, list of links to render
    return(
      <Query query={FEED_QUERY} variables={this._getQueryVariables()}>
        {({ loading, error, data, subscribeToMore }) => {
          //request ongoing, response not yet received
          if(loading){
            return <div>Loading...</div>
          }
          //error encountered
          if(error){
            return <div>Error</div>
          }
          //subscribe to new links 
          this._subscribeToNewLinks(subscribeToMore)
          //subscribe to new votes
          this._subscribeToNewVotes(subscribeToMore)

          //get links to render from server response data
          const linksToRender = this._getLinksToRender(data)
          //check if page/route is 'new'
          const isNewPage = this.props.location.pathname.includes('new')
          //get page index
          const pageIndex = this.props.match.params.page ? (this.props.match.params.page - 1) * LINKS_PER_PAGE : 0
          //check if there is a previous page (or if page index = 0)
          const isFirstPage = (pageIndex === 0)
          //check if there is a next page
          const isLastPage = !(this.props.match.params.page <= data.feed.count / LINKS_PER_PAGE)

          //return list of links to render
          return (
						<Fragment>
							{linksToRender.map((link, index) => (
								<Link
									key={link.id}
									link={link}
									index={index + pageIndex}
									updateStoreAfterVote={this._updateCacheAfterVote}
								/>
							))}
							{isNewPage && (
								<div className="flex justify-center ml4 mv3 f6 white">
									{!isFirstPage && (//don't render if first page
										<div
											className="pointer ph2"
											onClick={this._previousPage}
										>
											❮❮
										</div>
									)}
									<div> Page {this.props.match.params.page} </div>
									{!isLastPage && (//don't render if last page
										<div
											className="pointer ph2"
											onClick={() => this._nextPage(data)}
										>
											❯❯
										</div>
									)}
								</div>
							)}
						</Fragment>
					);
        }}
      </Query>
    )
  }
}

export default LinkList