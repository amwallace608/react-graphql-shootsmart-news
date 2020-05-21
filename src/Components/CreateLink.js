import React, {Component} from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

//mutation gql definition
const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }`

//class component for users to add new links
class CreateLink extends Component{
  //state mirrors mutation post
  state = {
    description: '',
    url: '',
  }

  render() {
    //destructure state to get link description and url
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
          onCompleted={() => this.props.history.push('/')}>
					{postMutation => <button onClick={postMutation}>Submit</button>}
				</Mutation>
			</div>
		);
  }
}

export default CreateLink