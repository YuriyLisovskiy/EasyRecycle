import React, {Component} from "react";
import UserService from "../../services/user";
import CommercialOrderService from "../../services/commercial_order";
import LocationService from "../../services/location";
import Errors from "../Errors";
import SpinnerComponent from "../Spinner";
import queryString from 'query-string';
import {GarbageTypeToIcon, roundFloat} from "../../utils/misc";

export default class CreateCommercialOrderComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			createLoading: false,
			location: undefined,
			locationError: undefined,
			order: {
				address: '',
				date: '',
				garbageType: '',
				mass: 0.0,
				totalPrice: 0
			}
		};
	}

	componentDidMount() {
		let params = queryString.parse(this.props.location.search);
		if (!params.location)
		{
			this.setState({locationError: 'Unable to load location :('});
		}

		LocationService.getLocation(params.location, (data, err) => {
			if (err)
			{
				alert(err);
			}
			else
			{
				let order = this.state.order;
				order.garbageType = data.garbage_types[0].short;
				this.setState({
					location: data,
					loading: false,
					order: order
				});
			}
		});
	}

	_handleCreate = _ => {
		let order = this.state.order;
		let newState = {};
		let hasErrors = false;
		if (order.address === '')
		{
			newState.addressError = 'This field is required.';
			hasErrors = true;
		}

		if (order.date === '')
		{
			newState.dateError = 'This field is required.';
			hasErrors = true;
		}

		if (order.garbageType === '')
		{
			newState.garbageTypeError = 'This field is required.';
			hasErrors = true;
		}

		if (order.mass <= 0)
		{
			newState.massError = 'Mass must be positive.';
			hasErrors = true;
		}

		if (hasErrors)
		{
			this.setState(newState);
		}
		else
		{
			this.setState({createLoading: true});
			let user = UserService.getCurrentUser();
			CommercialOrderService.createOrder(
				order.address, order.date, order.garbageType, order.mass, this.state.location.id, user.id,
				(data, err) => {
					if (err)
					{
						alert(err);
						this.setState({createLoading: false});
					}
					else
					{
						// TODO: push profile with orders maybe
						this.props.history.push('/info/locations');
					}
				}
			);
		}
	}

	_handleAddressChange = e => {
		let order = this.state.order;
		order.address = e.target.value;
		this.setState({
			order: order,
			addressError: undefined
		});
	}

	_handleDateChange = e => {
		let order = this.state.order;
		order.date = e.target.value;
		this.setState({
			order: order,
			dateError: undefined
		});
	}

	_handleGarbageTypeChange = e => {
		let order = this.state.order;
		order.garbageType = e.target.value;
		this.setState({
			order: order,
			garbageTypeError: undefined
		});
	}

	_handleMassChange = e => {
		let order = this.state.order;
		order.mass = e.target.value;
		if (order.mass > 0)
        {
            order.totalPrice = roundFloat(order.mass * this.state.location.price_per_kg, 2);
            this.setState({
                order: order,
                massError: undefined
            });
        }
		else
        {
            this.setState({massError: 'Mass must be positive.'});
        }
	}

	render () {
		if (this.state.loading)
		{
			return <SpinnerComponent/>;
		}

		let user = UserService.getCurrentUser();
		if (user && (user.is_superuser || user.is_commercial))
		{
			return <div className="container">
				<div className="row">
					<h4 className="col-md-12 text-center">
						CREATE COMMERCIAL ORDER
					</h4>
				</div>
				<div className="row my-4">
					<div className="col-md-12">
						<div className="card text-center">
							<div className="card-body">
								<p className="card-text">
                                    {this.state.location.address}
								</p>
                                <p className="card-text">
                                    ${this.state.location.price_per_kg} / kg
                                </p>
							</div>
							<div className="card-footer text-muted">
                                Working hours: {this.state.location.open_time} {this.state.location.close_time}
							</div>
						</div>
					</div>
				</div>
				<div className="row my-4">
					<div className="col-md-6">
						<div className="form-group">
							<label htmlFor="date">
								Date when to pick up garbage <span className="text-danger">*</span>
							</label>
							<input type="date" className="form-control" id="date"
								   onChange={this._handleDateChange}/>
						</div>
						{
							this.state.dateError && <small className="form-text text-danger ml-1 mt-1">
								{this.state.dateError}
							</small>
						}
					</div>
					<div className="col-md-6">
						<div className="form-group">
							<label htmlFor="mass">
								Total mass of garbage (kg) <span className="text-danger">*</span>
							</label>
							<input type="number" className="form-control" id="mass" value={this.state.order.mass}
								   onChange={this._handleMassChange}/>
						</div>
						{
							this.state.massError && <small className="form-text text-danger ml-1 mt-1">
								{this.state.massError}
							</small>
						}
					</div>
				</div>
				<div className="row my-4">
					<div className="col-md-12">
						<div className="form-group">
							<label htmlFor="address">
								Your address <span className="text-danger">*</span>
							</label>
							<input type="text" className="form-control" id="address"
							       onChange={this._handleAddressChange}/>
						</div>
						{
							this.state.addressError && <small className="form-text text-danger ml-1 mt-1">
								{this.state.addressError}
							</small>
						}
					</div>
				</div>
				<div className="row my-3">
					<div className="col-md-12 text-center">
						{
							this.state.location.garbage_types.map((item, idx) => <label
								className="radio-inline cursor-pointer mx-4" key={item.short}>
								<input type="radio"
									   value={item.short}
									   onChange={this._handleGarbageTypeChange}
									   checked={this.state.order.garbageType === item.short}/>
								<img className="d-inline mx-1 my-1"
									 height={100}
									 src={GarbageTypeToIcon[item.short]}
									 alt={item.long}/>
							</label>)
						}
					</div>
					{
						this.state.garbageTypeError && <small className="form-text text-danger ml-1 mt-1">
							{this.state.garbageTypeError}
						</small>
					}
				</div>
				<div className="row">
					<div className="col-md-12 text-right" style={{fontSize: 26}}>
						Total: ${this.state.order.totalPrice}
					</div>
				</div>
				<div className="mt-5">
					<button className="btn btn-outline-secondary" title="Go Back"
							onClick={this.props.history.goBack}>
						<i className="fa fa-chevron-left" aria-hidden="true"/>
					</button>
					<button className={"mx-2 btn btn-success"} onClick={this._handleCreate}>
						{this.state.createLoading &&
						<span className="spinner-border spinner-border-sm"/>} Create
					</button>
				</div>
			</div>;
		}

		return <Errors.NotFound/>;
	}
}
