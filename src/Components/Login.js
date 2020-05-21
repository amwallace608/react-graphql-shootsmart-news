import React, {Component} from 'react';
import {AUTH_TOKEN} from '../Constants';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

//Sign up/create account mutation - used when state.login = false
const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!){
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }`
//Login mutation - used when state.login = true
const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!){
    login(email: $email, password: $password) {
      token
    }
  }`


class Login extends Component {
  //state contains login/signup, account details
	state = {
		login: true, //login = true (already have account), signup = false (need to create account)
		email: "",
		password: "",
		name: "",
	};

	//render login/sign up page
	render() {
		//destructure state
		const { login, email, password, name } = this.state;
		//return login/sign up page JSX - inputs, etc
		return (
			<div>
				<h4 className="mv3">{login ? "Login" : "Sign Up"}</h4>
				<div className="flex flex-column">
					{!login && (
						<input
							value={name}
							onChange={(event) => this.setState({ name: event.target.value })}
							type="text"
							placeholder="Full Name"
						/>
					)}
					<input
						value={email}
						onChange={(event) => this.setState({ email: event.target.value })}
						type="text"
						placeholder="Email Address"
					/>
					<input
						value={password}
						onChange={(event) =>
							this.setState({ password: event.target.value })
						}
						type="password"
						placeholder="Password"
					/>
				</div>
				<div className="flex mt3">
					<Mutation
						mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
						variables={{ email, password, name }}
						onCompleted={(data) => this._confirm(data)}
					>
						{(mutation) => (
							<div className="pointer mr2 button" onClick={mutation}>
								{login ? "Login" : "Create Account"}
							</div>
						)}
					</Mutation>
					<div
						className="pointer button"
						onClick={() => this.setState({ login: !login })}
					>
						{login ? "Need an account?" : "Already have an account?"}
					</div>
				</div>
			</div>
		)
	}

	//confirm async method - passed data returned by mutation
	_confirm = async (data) => {
    //save token returned from mutation - login/signup depending on which mutation triggered
    const { token } = this.state.login ? data.login : data.signup
    this._saveUserData(token)
    //return to main screen/links feed
    this.props.history.push(`/`)
  };

	//save user data method - using local storage for now
	_saveUserData = (token) => {
    //save auth token in local storage (temporary approach)
		localStorage.setItem(AUTH_TOKEN, token);
	};
}

export default Login