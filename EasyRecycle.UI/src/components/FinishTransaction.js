import React, {Component} from "react";
import UserService from "../services/user";
import TransactionService from "../services/transaction";
import Errors from "./Errors"
import SpinnerComponent from "./Spinner";
import {GarbageTypes} from "../utils/misc";

export default class FinishTransactionComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			user: UserService.getCurrentUser(),
			targetUser: undefined,
			loading: true,
			discarded: false,
			confirmed: false,
			confirmLoading: false,
			transaction: {
				garbageType: 'OR',
				mass: 0,
				userId: this.props.match.params.id,
				pointsToAdd: 0
			}
		};
	}

	/* istanbul ignore next */
	componentDidMount() {
		UserService.getUser(this.props.match.params.id, (data, err) => {
			if (err) {
				alert(err);
			}
			else {
				this.setState({
					targetUser: data,
					loading: false
				});
			}
		});
	}

	/* istanbul ignore next */
	calculatePoints = (garbageType, mass) => {
		let result = mass;
		switch (garbageType) {
			case "OR":
				result *= 1;
				break;
			case "GL":
				result *= 2;
				break;
			case "ME":
				result *= 3;
				break;
			case "PA":
				result *= 4;
				break;
			case "PL":
				result *= 5;
				break;
		}

		return result;
	}

	/* istanbul ignore next */
	handleConfirm = () => {
		let transaction = this.state.transaction;
		let newState = {};
		let hasErrors = false;
		if (transaction.garbageType === '') {
			newState.garbageTypeError = 'This field is required.';
			hasErrors = true;
		}

		if (transaction.mass <= 0) {
			newState.massError = 'Mass must be positive.';
			hasErrors = true;
		}

		if (hasErrors) {
			this.setState(newState);
		}
		else {
			this.setState({confirmLoading: true});
			TransactionService.createTransaction(
				transaction.garbageType,
				transaction.mass,
				transaction.userId,
				(data, err) => {
					if (err) {
						alert(err);
					}
					else {
						this.setState({
							confirmLoading: false,
							confirmed: true
						});
					}
				}
			);
		}
	}

	/* istanbul ignore next */
	handleDiscard = () => {
		this.setState({discarded: true});
	}

	/* istanbul ignore next */
	handleMassChange = e => {
		let transaction = this.state.transaction;
		transaction.mass = e.target.value;
		transaction.pointsToAdd = Math.round(
			this.calculatePoints(transaction.garbageType, transaction.mass)
		);
		if (transaction.mass > 0) {
			this.setState({
				transaction: transaction,
				massError: undefined
			});
		}
		else {
			this.setState({massError: 'Mass must be positive.'});
		}
	}

	/* istanbul ignore next */
	handleGarbageTypeChange = e => {
		let transaction = this.state.transaction;
		transaction.garbageType = e.target.value;
		transaction.pointsToAdd = Math.round(
			this.calculatePoints(transaction.garbageType, transaction.mass)
		);
		this.setState({
			transaction: transaction,
			garbageTypeError: undefined
		});
	}

	render () {
		if (this.state.user.is_garbage_collector) {
			if (this.state.confirmed) {
				return <div className="row">
					<div className="col-md-6 text-center mx-auto">
						<div className="alert alert-primary" style={{fontSize: 20}}>
							<strong><i className="fa fa-check-circle" aria-hidden="true"/>&nbsp;
								Points has been added to user.
							</strong>
						</div>
					</div>
				</div>;
			}

			if (this.state.discarded) {
				return <div className="row">
					<div className="col-md-6 text-center mx-auto">
						<div className="alert alert-danger" style={{fontSize: 20}}>
							<strong><i className="fa fa-times-circle" aria-hidden="true"/>&nbsp;
								Transaction has been discarded.
							</strong>
						</div>
					</div>
				</div>;
			}

			return this.state.loading ? (<SpinnerComponent/>) : (
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<div className="card mx-auto">
								<h5 className="card-header text-center">Add points to {
									this.state.targetUser.first_name && this.state.targetUser.last_name ? (
										this.state.targetUser.first_name + " " + this.state.targetUser.last_name
									) : (this.state.targetUser.username)
								}: {this.state.transaction.pointsToAdd}</h5>
								<div className="card-body">
									<p className="card-text">
										<div className="row">
											<div className="col-md-12">
												<div className="form-group">
													<label htmlFor="mass" className="control-label">
														Mass of garbage (kg) <span className="text-danger">*</span>
													</label>
													<input type="text" className="form-control" id="mass"
													       value={this.state.transaction.mass}
														   onChange={this.handleMassChange}/>
												</div>
												{
													this.state.massError && <small className="form-text text-danger ml-1 mt-1">
														{this.state.massError}
													</small>
												}
											</div>
										</div>
										<div className="row my-3">
											<div className="col-md-12 text-center">
												{
													GarbageTypes.map((item, idx) => <label
														className="radio-inline cursor-pointer mx-4" key={item.value}>
														<input type="radio"
															   value={item.value}
															   onChange={this.handleGarbageTypeChange}
															   checked={this.state.transaction.garbageType === item.value}/>
														<img className="d-inline mx-1 my-1"
															 height={100}
															 src={item.src}
															 alt={item.value}/>
													</label>)
												}
											</div>
											{
												this.state.garbageTypeError && <small className="form-text text-danger ml-1 mt-1">
													{this.state.garbageTypeError}
												</small>
											}
										</div>
									</p>
									<div className="text-center mt-5">
										<button className="btn btn-success" onClick={this.handleConfirm}>
											{this.state.confirmLoading &&
											<span className="spinner-border spinner-border-sm"/>} Confirm
										</button>
										<button className="btn btn-outline-danger ml-2" onClick={this.handleDiscard}>
											Discard
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		}

		return <Errors.Forbidden/>;
	}
}
