import React, {Component} from "react";
import {Card} from "react-bootstrap";
import SpinnerComponent from "../Spinner";
import {Link} from "react-router-dom";
import UserService from "../../services/user";
import LocationService from "../../services/location";

export default class LocationsComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			locations: undefined,
			currentLocationToDelete: undefined,
			confirmDeleteLocationIsOpen: false
		}
		this.garbageTypeToIcon = {
			"organic": "/organic-waste-bin.png",
			"glass": "/glass-waste-bin.png",
			"metal": "/metal-waste-bin.png",
			"paper": "/paper-waste-bin.png",
			"plastic": "/plastic-waste-bin.png",
		}
	}

	componentDidMount() {
		LocationService.getLocations((data, err) => {
			if (err)
			{
				console.log(err);
			}
			else
			{
				this.setState({
					loading: false,
					locations: data.results
				});
				console.log(this.state.locations);
			}
		});
	}

	_getGarbageIcon = (garbageType) => {
		let gt = garbageType.toLowerCase();
		if (this.garbageTypeToIcon[gt])
		{
			return this.garbageTypeToIcon[gt];
		}

		return "/logo192.png";
	}

	_makeLocationCard = (location, user) => {
		return <Card className="h-100">
			<Card.Header>
				{
					user && (user.is_superuser || user.id === location.owner_id) &&
					<div className="d-inline float-right ml-1">
						<Link to={'/locations/' + location.id.toString() + "/edit"}>
							<i className="fa fa-edit text-secondary"
							   title="Click to edit this location"
							   aria-hidden="true"/>
						</Link>
					</div>
				}
				<div className="d-inline">{location.address}</div>
			</Card.Header>
			<Card.Body>
				<h6 className="text-center">We collects</h6>
				<div className="text-center">
					{location.garbage_types.map(type => <Link to="/info/how"
					                                          key={type.short}
					                                          title="Click to learn how to recycle different kinds of garbage">
						<img className="d-inline mx-1 my-1 cursor-pointer"
					         height={100}
					         src={this._getGarbageIcon(type.long)}
					         alt={type.long}/>
					</Link>)}
				</div>
			</Card.Body>
			<Card.Footer className="text-muted text-center">
				Working hours: {location.open_time} - {location.close_time}
			</Card.Footer>
			{
				user && user.is_commercial &&
				<Card.Footer>
					<p className="pull-left">${location.price_per_kg} / kg</p>
					<div className="ml-3 pull-right">
						<Link to="/info/collection" className="btn btn-primary btn-sm mr-2"
						      title="Learn what a commercial request is">
							<i className="fa fa-question" aria-hidden="true"/>
						</Link>
						<Link to={"/commercial-order/create?location=" + location.id.toString()}
						      className="btn btn-success btn-sm">
							Create Commercial Order
						</Link>
					</div>
				</Card.Footer>
			}
		</Card>;
	}

	_makeRows = (locations, user) => {
		let sz = locations.length - locations.length % 2;
		let result = [];
		let i;
		for (i = 0; i < sz; i += 2)
		{
			let loc1 = locations[i];
			let loc2 = locations[i + 1];
			result.push(<div className="row my-4" key={i}>
				<div className="col-md-6">
					{this._makeLocationCard(loc1, user)}
				</div>
				<div className="col-md-6">
					{this._makeLocationCard(loc2, user)}
				</div>
			</div>);
		}

		if (i < locations.length)
		{
			let loc = locations[i];
			result.push(<div className="row" key={i}>
				<div className={"col-md-" + (locations.length === 1 ? "12" : "6")}>
					{this._makeLocationCard(loc, user)}
				</div>
			</div>);
		}

		return result;
	}

	render () {
		let user = UserService.getCurrentUser();
		return this.state.loading ? (<SpinnerComponent/>) : (
			<div className="container">
				<div className="row">
					<h3 className="col-md-12 text-center mb-3">
						LOCATIONS
					</h3>
				</div>
				{this._makeRows(this.state.locations, user)}
			</div>
		);
	}
}
