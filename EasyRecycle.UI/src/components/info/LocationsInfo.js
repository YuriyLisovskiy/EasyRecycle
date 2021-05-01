import React, {Component} from "react";
import {Card} from "react-bootstrap";
import SpinnerComponent from "../Spinner";
import {Link} from "react-router-dom";
import UserService from "../../services/user";
import LocationService from "../../services/location";
import {GarbageTypeToIcon} from "../../utils/misc";

export default class LocationsComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			locations: undefined,
			currentLocationToDelete: undefined,
			confirmDeleteLocationIsOpen: false,
			nextPage: 1,
			nextPageLoading: false
		}
	}

	componentDidMount() {
		this.loadLocations();
	}

	loadLocations = () => {
		if (this.state.nextPage) {
			this.setState({nextPageLoading: true});
			LocationService.getLocations(this.state.nextPage, (data, err) => {
				if (err) {
					alert(err);
				}
				else {
					let locations = this.state.locations;
					this.setState({
						loading: false,
						locations: !locations ? data.results : locations.concat(data.results),
						nextPage: data.next ? this.state.nextPage + 1 : null,
						nextPageLoading: false
					});
				}
			});
		}
	}

	makeCard = (location, user) => {
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
					{location.garbage_types.map(type => <Link to="/info/recycling"
					                                          key={type.short}
					                                          title="Click to learn how to recycle different kinds of garbage">
						<img className="d-inline mx-1 my-1 cursor-pointer"
					         height={100}
					         src={GarbageTypeToIcon[type.short]}
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

	makeRows = (locations, user) => {
		let sz = locations.length - locations.length % 2;
		let result = [];
		let i;
		for (i = 0; i < sz; i += 2) {
			let loc1 = locations[i];
			let loc2 = locations[i + 1];
			result.push(<div className="row my-4" key={i}>
				<div className="col-md-6">
					{this.makeCard(loc1, user)}
				</div>
				<div className="col-md-6">
					{this.makeCard(loc2, user)}
				</div>
			</div>);
		}

		if (i < locations.length) {
			let loc = locations[i];
			result.push(<div className="row" key={i}>
				<div className={"col-md-" + (locations.length === 1 ? "12" : "6")}>
					{this.makeCard(loc, user)}
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
				{this.makeRows(this.state.locations, user)}
				{
					this.state.nextPage &&
					<div className="mx-auto text-center mt-3">
						<button className="btn btn-outline-secondary"
						        onClick={this.loadLocations}>
							{this.state.nextPageLoading &&
							<span className="spinner-border spinner-border-sm"/>} Load More
						</button>
					</div>
				}
			</div>
		);
	}
}
