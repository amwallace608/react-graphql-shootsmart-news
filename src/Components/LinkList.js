import React, {Component} from 'react';
import Link from './Link';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';


//GraphQL query for link feed
const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        description
        url
      }
    }
  }`

//class for rendering a list of links
class LinkList extends Component {
  render () {
    //array of links to render
    const linksToRender = [
			{
				id: "1",
				description: "Trijicon Ventus rangefinder - Read the wind",
				url: "https://www.trijicon.com/products/category/trijicon-ventus",
			},
			{
				id: "2",
				description: "Thunder Ranch - Firearms training in the PNW",
				url: "https://thunderranchinc.com/",
			},
			{
				id: "3",
				description: "USPSA - US Practical Shooting Association",
				url: "https://uspsa.org/",
			},
    ];
    
    //return Query component, FEED_QUERY as prop, list of links to render
    return(
      <Query query={FEED_QUERY}>
        {({ loading, error, data }) => {
          //request ongoing, response not yet received
          if(loading){
            return <div>Loading...</div>
          }
          //error encountered
          if(error){
            return <div>Error</div>
          }
          //links to render from server response data
          const linksToRender = data.feed.links

          //return list of links to render
          return (
            <div>
              {linksToRender.map(link => <Link key={link.id} link={link} />)}
            </div>
          )
        }}
      </Query>
    )
  }
}

export default LinkList