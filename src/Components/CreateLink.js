import React, {Component} from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { FEED_QUERY } from './LinkList';
import { LINKS_PER_PAGE, CURRENT_USER } from '../Constants';

//mutation gql definition
const POST_MUTATION = gql`
	mutation PostMutation($description: String!, $url: String!) {
		post(description: $description, url: $url) {
			id
			createdAt
			url
			description
			postedBy {
				id
				name
			}
		}
	}
`;

//class component for users to add new links
class CreateLink extends Component{
  //state mirrors mutation post
  state = {
    description: '',
    url: '',
  }

  render() {
    //destructure state to get link description url, and current user
    const {description, url} = this.state
    //return simple input fields for link description/url, and submit button (Post mutation)
    //automatically redirect on submit
    return (
			<div>
				<div className="flex flex-column mt3">
					<input
						className="mb2"
						value={description}
						onChange={(event) =>
							this.setState({ description: event.target.value })
						}
						type="text"
						placeholder="Link description"
					/>
					<input
						className="mb2"
						value={url}
						onChange={(event) => this.setState({ url: event.target.value })}
						type="text"
						placeholder="Link address (URL)"
					/>
				</div>
        <Mutation 
          mutation={POST_MUTATION} 
          variables={{ description, url }} 
          onCompleted={() => this.props.history.push('/new/1')}
          update={(store, { data: { post } }) => {
            //prepare variables for feed query on 'new' route/page
            const first = LINKS_PER_PAGE
            const skip = 0
            const orderBy = 'createdAt_DESC'
            //read current state of feed query in store
            const data = store.readQuery({ query: FEED_QUERY, variables: { first, skip, orderBy } })
            //insert new link at beginning of feed
            data.feed.links.unshift(post)
            //write feed query back to store
            store.writeQuery({
              query: FEED_QUERY,
              data,
              variables: { first, skip, orderBy }
            })
          }}
          >
					{postMutation => <button onClick={postMutation}>Submit</button>}
				</Mutation>
			</div>
		);
  }
}

export default CreateLink