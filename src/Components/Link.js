import React, {Component} from 'react'
import { AUTH_TOKEN } from '../Constants'
import {timeDifferenceForDate} from '../Utils'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

//upvote mutation
const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        id
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

//class for displaying single link elements
class Link extends Component {

  render () {
    //get auth token
    const authToken = localStorage.getItem(AUTH_TOKEN)
    //return link description, url, upvotes, vote button, time posted, posted by
    return (
			<div className="flex outline gray pa2 mt2 items-start">
				<div className="flex items-center">
					<span className="white">{this.props.index + 1}.</span>
					{authToken && (
						<Mutation
							//vote mutation
							mutation={VOTE_MUTATION}
							//pass link id
							variables={{ linkId: this.props.link.id }}
							onError={ (err) => {console.log(err)}}
							//update cache w/ apollo to display number of votes
							update={(store, { data: { vote } }) => {
								if(vote !== null){
									this.props.updateStoreAfterVote(
										store,
										vote,
										this.props.link.id
									);
								}
							}
							}
						>
							{(voteMutation) => (
								<div
									className="ml1 ph1 olive-green f6 vote"
									onClick={voteMutation}
								>
									▲
								</div>
							)}
						</Mutation>
					)}
				</div>
				<div className="ml1">
					<div>
						<a className="no-underline white" href={this.props.link.url}>
							{this.props.link.description}
						</a>{" "}
						<a className="gray f6" href={this.props.link.url}>
							({this.props.link.url})
						</a>
					</div>
					<div className="f6 lh-copy white">
						{this.props.link.votes.length} votes | by{" "}
						{this.props.link.postedBy
							? this.props.link.postedBy.name
							: "Unkown"}{" "}
						{timeDifferenceForDate(this.props.link.createdAt)}
					</div>
				</div>
			</div>
		);
	}
	
	
}

export default Link