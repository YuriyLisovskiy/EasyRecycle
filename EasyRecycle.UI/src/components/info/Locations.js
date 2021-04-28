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
						<Link to={'/location/' + location.id.toString()}>
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
			<Card.Footer className="text-muted">
				<p className="pull-left">Working hours: {location.open_time} - {location.close_time}</p>
				{
					user && user.is_commercial &&
					<div className="ml-3 pull-right">
						<Link to="/commercial-request" className="btn btn-success btn-sm">Commercial Order</Link>
					</div>
				}
			</Card.Footer>
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
				<div className="col-md-6">
					{this._makeLocationCard(loc, user)}
				</div>
			</div>);
		}

		return result;
	}

	render () {
		let user = UserService.getCurrentUser();
		return this.state.loading ? (<SpinnerComponent/>) : (
			<div>
				<div className="row">
					<h2 className="col-md-12 text-center">
						Choose the nearest location with the appropriate garbage type and bring it for recycling
					</h2>
				</div>
				{this._makeRows(this.state.locations, user)}
			</div>
		);
	}
}
