import React, {Component} from "react";
import {drawAvatar, GarbageTypeToIcon, getErrorMessage} from "../../utils/misc";
import SpinnerComponent from "../Spinner";
import Errors from "../Errors";

export default class ProfileComponent extends Component {

	constructor(props) {
		super(props);
		this.userService = this.props.userService;
		this.transactionsService = this.props.transactionsService;
		this.commercialOrderService = this.props.commercialOrderService;
		this.state = {
			user: undefined,
			loading: true,
			currentUser: props.currentUser ? props.currentUser : this.userService.getCurrentUser(),
			notFound: false,
			orders: undefined,
			nextPageOfOrders: 1,
			nextPageOrdersLoading: false,
			loadingOrders: true,
			transactions: undefined,
			nextPageOfTransactions: 1,
			nextPageTransactionLoading: false,
			loadingTransactions: true,
		};
		this.statusToRowClass = {
			'A': 'table-warning',
			'B': 'table-info',
			'C': 'table-danger',
			'D': 'table-success'
		};
		this.statuses = {
			'A': 'Queued',
			'B': 'In Progress',
			'C': 'Rejected',
			'D': 'Done'
		};
		this.avatarCanvas = React.createRef();
	}

	/* istanbul ignore next */
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

		this.loadUser(userId, isMe);
	}

	/* istanbul ignore next */
	loadUser = (id, isMe = false) => {
		if (!id) {
			this.setState({notFound: true});
			return;
		}

		if (!isMe) {
			this.props.history.push('/profile/' + id);
		}

		this.userService.getUser(id, (user, err) => {
			if (err) {
				if (err.response && err.response.status === 404) {
					this.setState({
						notFound: true,
						loading: false
					});
				}
				else {
					alert(getErrorMessage(err));
				}
			}
			else {
				this.setState({
					user: user,
					loading: false
				});

				drawAvatar(
					this.avatarCanvas,
					this.state.user.avatar_info.pixels,
					this.state.user.avatar_info.color,
					250
				);
				if (user.is_commercial) {
					this.loadMoreOrders();
				}
				else {
					this.loadMoreTransactions();
				}
			}
		});
	}

	/* istanbul ignore next */
	toggleUserAction = (boolVal, methods, updatedUser) => {
		return _ => {
			let method = boolVal ? methods.ifTrue : methods.ifFalse;
			method(this.state.user.id, (resp, err) => {
				if (err) {
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

	/* istanbul ignore next */
	onClickBanUser = (ban) => {
		return this.toggleUserAction(
			ban,
			{
				ifTrue: this.userService.banUser,
				ifFalse: this.userService.unbanUser
			},
			(user) => {
				user.is_banned = ban;
				return user;
			}
		);
	}

	/* istanbul ignore next */
	loadMoreOrders = () => {
		if (this.state.nextPageOfOrders) {
			let user = this.state.user;
			if (user && user.is_commercial) {
				this.setState({nextPageOrdersLoading: true});
				this.commercialOrderService.getOrders({
					userPkFilter: user.id,
					page: this.state.nextPageOfOrders,
					handler: (data, err) => {
						if (err) {
							alert(err);
						}
						else {
							let nextPage = data.next ? this.state.nextPageOfOrders + 1 : null;
							let orders = this.state.orders;
							orders = !orders ? data.results : orders.concat(data.results);
							this.setState({
								orders: orders,
								nextPageOfOrders: nextPage,
								loadingOrders: false,
								nextPageOrdersLoading: false
							})
						}
					}
				});
			}
		}
	}

	/* istanbul ignore next */
	loadMoreTransactions = () => {
		if (this.state.nextPageOfTransactions)
		{
			let user = this.state.user;
			if (user && !user.is_commercial)
			{
				this.setState({
					nextPageTransactionLoading: true
				});
				this.transactionsService.getTransactions({
					userPkFilter: user.id,
					page: this.state.nextPageOfTransactions,
					handler: (data, err) => {
						if (err) {
							alert(err);
						}
						else {
							let nextPage = data.next ? this.state.nextPageOfTransactions + 1 : null;
							let transactions = this.state.transactions;
							transactions = !transactions ? data.results : transactions.concat(data.results);
							this.setState({
								transactions: transactions,
								nextPageOfTransactions: nextPage,
								loadingTransactions: false,
								nextPageTransactionLoading: false
							})
						}
					}
				});
			}
		}
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
							<div className="col-md-3">
								<div className="mx-auto text-center text-muted mb-2">PROFILE</div>
								<canvas className="img-thumbnail mx-auto d-block mb-2"
								        ref={this.avatarCanvas}/>
								{
									this.state.currentUser && this.state.currentUser.id !== user.id &&
									<div>
										{
											this.state.currentUser.is_superuser &&
											(user.is_banned ? (
												<button type="button"
												        className="btn btn-secondary btn-block btn-sm mb-2"
												        onClick={this.onClickBanUser(false)}>
													Unban
												</button>
											) : (
												<button type="button"
												        className="btn btn-danger btn-block btn-sm mb-2"
												        onClick={this.onClickBanUser(true)}>
													Ban
												</button>
											))
										}
									</div>
								}
								<div className="row">
									<div className="col-sm-12">
									{
										hasFirstAndLastName ? (
											<h5 className="mb-2 text-center">
												{user.first_name} {user.last_name}
											</h5>
										) : (
											<h5 className="text-center">{user.username}</h5>
										)
									}
									</div>
								</div>
							</div>
							<div className="col-md-9">
								{user.is_commercial ? (
									<div>
										<div className="mx-auto text-center text-muted mb-2">
											ORDERS
										</div>
										{
											this.state.loadingOrders ? (<SpinnerComponent/>) : (
												(this.state.orders && this.state.orders.length < 1) ? (
													<div className="mx-auto text-center text-muted mt-5">
														NO ORDERS
													</div>
												) : (
													<div className="p-3 card">
														<div className="table-responsive">
															<table className="table">
															<thead>
															<tr>
																<th>Type</th>
																<th>Mass (kg)</th>
																<th>Address</th>
																<th>Date</th>
																<th>Status</th>
															</tr>
															</thead>
															<tbody>
															{this.state.orders.map(order => <tr key={order.id}
															                                    className={this.statusToRowClass[order.status]}>
																<th className="align-middle">
																	<img className="d-inline mx-1 my-1"
																	     height={80}
																	     src={GarbageTypeToIcon[order.garbage_type]}
																	     alt={order.garbage_type}/>
																</th>
																<th className="align-middle">{order.mass}</th>
																<th className="align-middle">{order.address}</th>
																<th className="align-middle min-w-120">{order.date}</th>
																<th className="align-middle min-w-120">
																	{this.statuses[order.status]}
																</th>
															</tr>)}
															</tbody>
														</table>
														</div>
														{
															this.state.nextPageOfOrders &&
															<div className="mx-auto text-center">
																<button className="btn btn-outline-secondary"
																        onClick={this.loadMoreOrders}>
																	{this.state.nextPageOrdersLoading &&
																	<span className="spinner-border spinner-border-sm"/>} Load More
																</button>
															</div>
														}
													</div>
												)
											)
										}
									</div>
								) : (
									<div>
										<div className="mx-auto text-center text-muted mb-2">
											TOTAL POINTS ACCUMULATED: {user.rating}
										</div>
										{
											this.state.loadingTransactions ? (<SpinnerComponent/>) : (
												(this.state.transactions && this.state.transactions.length < 1) ? (
													<div className="mx-auto text-center text-muted mt-5">
														NO TRANSACTIONS
													</div>
												) : (
													<div className="p-3 card">
														<table className="table">
															<thead>
															<tr>
																<th>Type</th>
																<th>Mass (kg)</th>
																<th>Time (UTC)</th>
																<th>Points</th>
															</tr>
															</thead>
															<tbody>
															{this.state.transactions.map(order => <tr key={order.id}
															                                          className={this.statusToRowClass[order.status]}>
																<th className="align-middle">
																	<img className="d-inline mx-1 my-1"
																	     height={80}
																	     src={GarbageTypeToIcon[order.garbage_type]}
																	     alt={order.garbage_type}/>
																</th>
																<th className="align-middle">{order.mass}</th>
																<th className="align-middle">{order.datetime}</th>
																<th className="align-middle min-w-120">{order.points}</th>
															</tr>)}
															</tbody>
														</table>
														{
															this.state.nextPageOfTransactions &&
															<div className="mx-auto text-center">
																<button className="btn btn-outline-secondary"
																        onClick={this.loadMoreTransactions}>
																	{this.state.nextPageTransactionLoading &&
																	<span className="spinner-border spinner-border-sm"/>} Load More
																</button>
															</div>
														}
													</div>
												)
											)
										}
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
