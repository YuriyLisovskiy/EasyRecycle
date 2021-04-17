import React, {Component} from "react";
import UserService from "../../services/user";
import {getErrorMessage} from "../../utils/misc";
import SpinnerComponent from "../Spinner";
import Errors from "../Errors";

export default class ProfileComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			user: undefined,
			loading: true,
			currentUser: props.currentUser ? props.currentUser : UserService.getCurrentUser(),
			notFound: false
		};
	}

	componentDidMount() {
		let userId;
		let isMe = false;
		if (this.props.match.params.id) {
			userId = this.props.match.params.id;
		}
		else if (this.state.currentUser) {
			isMe = true;
			userId = this.state.currentUser.id;
		}
		else {
			userId = null;
		}

		this._loadUser(userId, isMe);
	}

	_loadUser = (id, isMe = false) => {
		if (!id) {
			this.setState({notFound: true});
			return;
		}

		if (!isMe) {
			this.props.history.push('/profile/' + id);
		}

		UserService.getUser(id, (user, err) => {
			if (err) {
				if (err.response && err.response.status === 404) {
					this.setState({
						notFound: true,
						loading: false
					});
				}
				else {
					// TODO:
					alert(getErrorMessage(err));
				}
			}
			else {
				this.setState({
					user: user,
					loading: false
				});
			}
		});
	}

	_toggleUserAction = (boolVal, methods, updatedUser) => {
		return _ => {
			let method = boolVal ? methods.ifTrue : methods.ifFalse;
			method(this.state.user.id, (resp, err) => {
				if (err) {
					// TODO:
					alert(getErrorMessage(err));
				}
				else {
					this.setState({
						user: updatedUser(this.state.user)
					});
				}
			});
		}
	}

	_onClickBanUser = (ban) => {
		return this._toggleUserAction(
			ban,
			{
				ifTrue: UserService.banUser,
				ifFalse: UserService.unbanUser
			},
			(user) => {
				user.is_banned = ban;
				return user;
			}
		);
	}

	render() {
		let user = this.state.user;
		let hasFirstAndLastName;
		if (user) {
			hasFirstAndLastName = ((
				this.state.currentUser && this.state.currentUser.id === user.id
			) || user.show_full_name) && user.first_name && user.last_name;
		}
		else {
			hasFirstAndLastName = false;
		}

		return <div className="container">
			{
				this.state.loading ? (<SpinnerComponent/>) : (
					this.state.notFound ? (<Errors.NotFound/>) : (
						<div className="row">
							<div className="col-md-4">
								<div className="mx-auto text-center text-muted mb-2">PROFILE</div>
								<img src={user.avatar_link} alt="Avatar"
								     className="img-thumbnail mx-auto d-block mb-2"/>
								{
									this.state.currentUser && this.state.currentUser.id !== user.id &&
									<div>
										{
											this.state.currentUser.is_superuser &&
											(user.is_banned ? (
												<button type="button"
												        className="btn btn-secondary btn-block btn-sm mb-2"
												        onClick={this._onClickBanUser(false)}>
													Unban
												</button>
											) : (
												<button type="button"
												        className="btn btn-danger btn-block btn-sm mb-2"
												        onClick={this._onClickBanUser(true)}>
													Ban
												</button>
											))
										}
									</div>
								}
								<div className="row">
									{
										hasFirstAndLastName ? (
											<div className="col-sm-12">
												<h4 className="mb-2 text-center">
													{user.first_name} {user.last_name}
												</h4>
											</div>
										) : (
											<h5 className="text-center">{user.username}</h5>
										)
									}
								</div>
							</div>
							<div className="col-md-8">
								{user.is_commercial ? (
									<div className="mx-auto text-center text-muted mb-2">
										ORDERS
									</div>
								) : (
									<div className="mx-auto text-center text-muted mb-2">
										TOTAL POINTS ACCUMULATED: {user.rating}
									</div>
								)}
							</div>
						</div>
					)
				)
			}
		</div>;
	}
}
