import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {withRouter} from 'react-router'
import { AUTH_TOKEN } from '../Constants'


//Class for navigation header
class Header extends Component{
  render() {
    //get auth token, won't display submit if user not logged in
    const authToken = localStorage.getItem(AUTH_TOKEN)
    //return header w/ (react router) Link components for the link feed, and create link
    return (
			<div className="flex outline pa1 justify-between nowrap background-olive-green">
				<div className="flex flex-fixed sand">
					<div className="fw7 mr1">ShootSmart News</div>
					<Link to="/" className="ml1 no-underline white">
						New
					</Link>
					<div className="ml1">|</div>
					<Link to="/top" className="ml1 no-underline white">
						Top
					</Link>
					<div className="ml1">|</div>
					<Link to="/search" className="ml1 no-underline white">
						Search
					</Link>
					{authToken && (
						<div className="flex">
							<div className="ml1">|</div>
							<Link to="/create" className="ml1 no-underline white">
								Submit
							</Link>
						</div>
					)}
				</div>
				<div className="flex flex-fixed">
					{authToken ? (
						<div
							className="ml1 pointer white"
							onClick={() => {
								localStorage.removeItem(AUTH_TOKEN);
								this.props.history.push(`/`);
							}}
						>
							Logout
						</div>
					) : (
						<Link to="/login" className="ml1 no-underline white">
							Login
						</Link>
					)}
				</div>
			</div>
		);
  }
}

export default withRouter(Header)