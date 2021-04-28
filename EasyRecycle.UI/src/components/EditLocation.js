import React, {Component} from "react";
import LocationService from "../services/location";
import UserService from "../services/user";
import SpinnerComponent from "./Spinner";
import history from "../services/history";
import DrawerComponent from "./Drawer";
import Errors from "./Errors";

export default class EditLocationComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			location: undefined,
			newGarbageTypes: [],
			hasChanges: false,
			confirmIsOpen: false,
			garbageTypesList: [
				{
					src: '/organic-waste-bin.png',
					value: 'OR'
				},
				{
					src: '/glass-waste-bin.png',
					value: 'GL'
				},
				{
					src: '/metal-waste-bin.png',
					value: 'ME'
				},
				{
					src: '/paper-waste-bin.png',
					value: 'PA'
				},
				{
					src: '/plastic-waste-bin.png',
					value: 'PL'
				}
			]
		};
	}

	componentDidMount() {
		LocationService.getLocation(this.props.match.params.id, (data, err) => {
			if (err)
			{
				alert(err);
			}
			else
			{
				this.setState({
					loading: false,
					location: data,
					newGarbageTypes: data.garbage_types.map(item => item.short)
				});
			}
		});
	}

	_handleSave = _ => {
		if (!this.state.hasChanges)
		{
			return;
		}

		let location = this.state.location;
		LocationService.editLocation(
			location.id, location.address,
			location.open_time, location.close_time,
			location.price_per_kg, this.state.newGarbageTypes, location.owner_id,
			(data, err) => {
				if (err)
				{
					alert(err);
				}
				else
				{
					this.setState({
						hasChanges: false
					});
				}
			}
		);
	}

	_handleDelete = _ => {
		let location = this.state.location;
		LocationService.deleteLocation(location.id, (data, err) => {
			if (err)
			{
				alert(err);
			}
			else
			{
				history.back();
			}
		});
	}

	_handleChange = (e, location) => {
		this.setState({
			location: location,
			hasChanges: true
		});
	}

	_handleAddressChange = e => {
		let loc = this.state.location;
		loc.address = e.target.value;
		this._handleChange(e, loc);
	}

	_handleOpenTimeChange = e => {
		let loc = this.state.location;
		loc.open_time = e.target.value;
		this._handleChange(e, loc);
	}

	_handleCloseTimeChange = e => {
		let loc = this.state.location;
		loc.close_time = e.target.value;
		this._handleChange(e, loc);
	}

	_handlePricePerKgChange = e => {
		let loc = this.state.location;
		loc.price_per_kg = e.target.value;
		this._handleChange(e, loc);
	}

	_handleWasteChange = e => {
		let newGarbageTypes = this.state.newGarbageTypes;
		if (!newGarbageTypes)
		{
			newGarbageTypes = [];
		}

		let value = e.target.value;
		let idx = newGarbageTypes.indexOf(value);
		if (e.target.checked)
		{
			if (idx === -1)
			{
				newGarbageTypes.push(value);
			}
		}
		else
		{
			if (idx !== -1)
			{
				newGarbageTypes.splice(idx, 1);
			}
		}

		this.setState({
			newGarbageTypes: newGarbageTypes,
			hasChanges: true
		});
	}

	_onClickConfirmToggle = () => {
		let {confirmIsOpen} = this.state;
		this.setState({
			confirmIsOpen: !confirmIsOpen
		});
	}

	render () {
		let user = UserService.getCurrentUser();
		if (user)
		{
			if (this.state.loading)
			{
				return <SpinnerComponent/>;
			}

			if (user.is_superuser || user.id === this.state.location.owner_id)
			{
				let {newGarbageTypes} = this.state;
				return <div className="container">
					<DrawerComponent title="CONFIRM"
					                 open={this.state.confirmIsOpen}
					                 onRequestClose={this._onClickConfirmToggle}
					                 modalElementClass="container w-25 min-w-250">
						<p>This action is not recoverable. Do you really want to delete the location?</p>
						<div className="text-center mt-4">
							<button className="btn btn-secondary mr-2" onClick={this._onClickConfirmToggle}>
								Cancel
							</button>
							<button className="btn btn-outline-danger" onClick={this._handleDelete}>
								Yes, I'm sure
							</button>
						</div>
					</DrawerComponent>
					<div className="row">
						<h4 className="col-md-12 text-center">
							EDIT LOCATION
						</h4>
					</div>
					<div className="row">
						<div className="col-md-12">
							<div className="form-group">
								<label htmlFor="address">Address:</label>
								<input type="text" className="form-control" id="address"
								       value={this.state.location.address}
								       onChange={this._handleAddressChange}/>
							</div>
						</div>
					</div>
					<div className="row my-3">
						<div className="col-md-6">
							<div className="form-group">
								<label htmlFor="open_time">Open time:</label>
								<input type="time" className="form-control" id="open_time"
								       value={this.state.location.open_time}
								       onChange={this._handleOpenTimeChange}/>
							</div>
						</div>
						<div className="col-md-6">
							<div className="form-group">
								<label htmlFor="close_time">Close time:</label>
								<input type="time" className="form-control" id="close_time"
								       value={this.state.location.close_time}
								       onChange={this._handleCloseTimeChange}/>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-md-12">
							<div className="form-group">
								<label htmlFor="price_per_kg">Price per kg (for commercial orders):</label>
								<input type="number" className="form-control" id="price_per_kg"
								       value={this.state.location.price_per_kg}
								       onChange={this._handlePricePerKgChange}/>
							</div>
						</div>
					</div>
					<div className="row my-3">
						<div className="col-md-12 text-center">
							{
								this.state.garbageTypesList.map(item => <label
									className="checkbox-inline cursor-pointer mx-4" key={item.value}>
									<input type="checkbox"
									       value={item.value}
									       onChange={this._handleWasteChange}
									       checked={newGarbageTypes.indexOf(item.value) !== -1}/>
									<img className="d-inline mx-1 my-1"
									     height={100}
									     src={item.src}
									     alt={item.value}/>
								</label>)
							}
						</div>
					</div>
					<div className="mt-5">
						<button className="btn btn-outline-secondary" title="Go Back"
						        onClick={history.back}>
							<i className="fa fa-chevron-left" aria-hidden="true"/>
						</button>
						<button className={"mx-2 btn btn-success"}
						        onClick={this._handleSave} disabled={(this.state.hasChanges ? "" : "disabled")}>
							Save
						</button>
						<button className="btn btn-outline-danger" onClick={this._onClickConfirmToggle}>
							Delete
						</button>
					</div>
				</div>;
			}
		}

		return <Errors.NotFound/>;
	}
}
