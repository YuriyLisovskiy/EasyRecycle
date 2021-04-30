import React, {Component} from "react";
import LocationService from "../services/location";
import UserService from "../services/user";
import Errors from "./Errors";
import {GarbageTypes} from "../utils/misc";
import SpinnerComponent from "./Spinner";

export default class CreateLocationComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			createLoading: false,
			loadingUsers: true,
			users: undefined,
			location: {
				address: '',
				open_time: '',
				close_time: '',
				price_per_kg: 0,
				garbage_types: [],
				owner_id: 0
			}
		};
	}

	componentDidMount() {
		UserService.getUsers(true, null, 'name', (data, err) => {
			if (err) {
				alert(err);
			}
			else {
				this.setState({
					users: data.results,
					loadingUsers: false
				})
			}
		});
	}

	handleCreate = _ => {
		let location = this.state.location;
		let newState = {};
		let hasErrors = false;
		if (location.address === '') {
			newState.addressError = 'This field is required.';
			hasErrors = true;
		}

		if (location.open_time === '') {
			newState.openTimeError = 'This field is required.';
			hasErrors = true;
		}

		if (location.close_time === '') {
			newState.closeTimeError = 'This field is required.';
			hasErrors = true;
		}

		if (location.garbage_types.length === 0) {
			newState.garbageTypesError = 'At least one type should be selected.';
			hasErrors = true;
		}

		if (location.price_per_kg < 0) {
			newState.pricePerKgError = 'Price must be non-negative.';
			hasErrors = true;
		}

		if (location.owner_id === 0) {
			newState.ownerError = 'This field is required.';
			hasErrors = true;
		}

		if (hasErrors) {
			this.setState(newState);
		}
		else {
			this.setState({createLoading: true});
			LocationService.createLocation(
				location.address, location.open_time, location.close_time,
				location.price_per_kg, location.garbage_types, location.owner_id,
				(data, err) => {
					if (err) {
						alert(err);
						this.setState({createLoading: false});
					}
					else {
						this.props.history.push('/info/locations');
					}
				}
			);
		}
	}

	handleAddressChange = e => {
		let loc = this.state.location;
		loc.address = e.target.value;
		this.setState({
			location: loc,
			addressError: undefined
		});
	}

	handleOpenTimeChange = e => {
		let loc = this.state.location;
		loc.open_time = e.target.value;
		this.setState({
			location: loc,
			openTimeError: undefined
		});
	}

	handleCloseTimeChange = e => {
		let loc = this.state.location;
		loc.close_time = e.target.value;
		this.setState({
			location: loc,
			closeTimeError: undefined
		});
	}

	handlePricePerKgChange = e => {
		let loc = this.state.location;
		loc.price_per_kg = e.target.value;
		this.setState({
			location: loc,
			pricePerKgError: undefined
		});
	}

	handleOwnerChange = e => {
		let loc = this.state.location;
		loc.owner_id = e.target.value;
		this.setState({
			location: loc,
			ownerError: undefined
		});
	}

	handleWasteChange = e => {
		let location = this.state.location;
		let value = e.target.value;
		let idx = location.garbage_types.indexOf(value);
		if (e.target.checked) {
			if (idx === -1) {
				location.garbage_types.push(value);
			}
		}
		else {
			if (idx !== -1) {
				location.garbage_types.splice(idx, 1);
			}
		}

		this.setState({
			location: location,
			garbageTypesError: undefined
		});
	}

	render () {
		let user = UserService.getCurrentUser();
		if (user && user.is_superuser) {
			return <div className="container">
				<div className="row">
					<h4 className="col-md-12 text-center">
						ADD NEW LOCATION
					</h4>
				</div>
				<div className="row">
					<div className="col-md-12">
						<div className="form-group">
							<label htmlFor="address" className="control-label">
								Address <span className="text-danger">*</span>
							</label>
							<input type="text" className="form-control" id="address"
							       onChange={this.handleAddressChange}/>
						</div>
						{
							this.state.addressError && <small className="form-text text-danger ml-1 mt-1">
								{this.state.addressError}
							</small>
						}
					</div>
				</div>
				<div className="row my-4">
					<div className="col-md-6">
						<div className="form-group">
							<label htmlFor="open_time">
								Open time <span className="text-danger">*</span>
							</label>
							<input type="time" className="form-control" id="open_time"
							       onChange={this.handleOpenTimeChange}/>
						</div>
						{
							this.state.openTimeError && <small className="form-text text-danger ml-1 mt-1">
								{this.state.openTimeError}
							</small>
						}
					</div>
					<div className="col-md-6">
						<div className="form-group">
							<label htmlFor="close_time">
								Close time <span className="text-danger">*</span>
							</label>
							<input type="time" className="form-control" id="close_time"
							       onChange={this.handleCloseTimeChange}/>
						</div>
						{
							this.state.closeTimeError && <small className="form-text text-danger ml-1 mt-1">
								{this.state.closeTimeError}
							</small>
						}
					</div>
				</div>
				<div className="row">
					<div className="col-md-6">
						<div className="form-group">
							<label htmlFor="price_per_kg">
								Price per kg (for commercial orders) <span className="text-danger">*</span>
							</label>
							<input type="number" className="form-control" id="price_per_kg"
							       value={this.state.location.price_per_kg}
							       onChange={this.handlePricePerKgChange}/>
						</div>
						{
							this.state.pricePerKgError && <small className="form-text text-danger ml-1 mt-1">
								{this.state.pricePerKgError}
							</small>
						}
					</div>
					<div className="col-md-6">
						<div className="form-group">
							<label htmlFor="owner">
								{this.state.loadingUsers ? "" : "Owner "}
								{!this.state.loadingUsers && <span className="text-danger">*</span>}
							</label>
						{
							this.state.loadingUsers ? (<SpinnerComponent/>) : (
								<select className="form-control"
								        id="owner"
								        onChange={this.handleOwnerChange}
								        defaultValue={0}>
									<option disabled value={0}>None</option>
									{this.state.users && this.state.users.map(u => <option value={u.id} key={u.id}>{
										u.first_name && u.last_name ? (
											u.first_name + " " + u.last_name + " (" + u.username + ")"
										) : u.username
									}</option>)}
								</select>
							)
						}
						</div>
						{
							this.state.ownerError && <small className="form-text text-danger ml-1 mt-1">
								{this.state.ownerError}
							</small>
						}
					</div>
				</div>
				<div className="row my-3">
					<div className="col-md-12 text-center">
						{
							GarbageTypes.map(item => <label
								className="checkbox-inline cursor-pointer mx-4" key={item.value}>
								<input type="checkbox"
								       value={item.value}
								       onChange={this.handleWasteChange}/>
								<img className="d-inline mx-1 my-1"
								     height={100}
								     src={item.src}
								     alt={item.value}/>
							</label>)
						}
					</div>
					{
						this.state.garbageTypesError && <small className="form-text text-danger ml-1 mt-1">
							{this.state.garbageTypesError}
						</small>
					}
				</div>
				<div className="mt-5">
					<button className="btn btn-outline-secondary" title="Go Back"
					        onClick={this.props.history.goBack}>
						<i className="fa fa-chevron-left" aria-hidden="true"/>
					</button>
					<button className={"mx-2 btn btn-success"} onClick={this.handleCreate}>
						{this.state.createLoading &&
						<span className="spinner-border spinner-border-sm"/>} Create
					</button>
				</div>
			</div>;
		}

		return <Errors.NotFound/>;
	}
}
