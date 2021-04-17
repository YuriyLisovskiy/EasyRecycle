import React, {Component} from "react";
import {Button, Card} from "react-bootstrap";
import SpinnerComponent from "../Spinner";
import {Link} from "react-router-dom";
import UserService from "../../services/user";

export default class WhereToBringGarbageComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			locations: undefined
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
		this.setState({
			loading: false,
			locations: [
				{
					id: 1,
					address: 'City 1, Some st. 1',
					garbageTypes: ['Plastic', 'Glass'],
					open_time: '9:00',
					close_time: '18:00'
				},
				{
					id: 2,
					address: 'City 2, Some st. 7',
					garbageTypes: ['Paper', 'Metal'],
					open_time: '8:00',
					close_time: '18:00'
				},
				{
					id: 3,
					address: 'Lviv, Ivana Franka st. 47',
					garbageTypes: ['Organic', 'Glass', 'Metal', 'Paper', 'Plastic'],
					open_time: '11:00',
					close_time: '20:00'
				}
			]
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

	_makeLocationCard = (id, address, openTime, closeTime, garbageTypes, userIsCommercial = false) => {
		return <Card className="h-100">
			<Card.Header>
				<Link to={"/" + id.toString()}>{address}</Link>
			</Card.Header>
			<Card.Body>
				<h6 className="text-center">We collects</h6>
				<div className="text-center">
					{garbageTypes.map(type => <img className="d-inline mx-1 my-1" height={100}
												   src={this._getGarbageIcon(type)}
												   alt={type}
												   title={type}/>)}
				</div>
			</Card.Body>
			<Card.Footer className="text-muted">
				<p className="pull-left">Working hours: {openTime} - {closeTime}</p>
				{
					userIsCommercial &&
					<div className="ml-3 pull-right">
						<Button variant="success" className="btn-sm">Commercial Order</Button>
					</div>
				}
			</Card.Footer>
		</Card>;
	}

	_makeRows = (locations, userIsCommercial = false) => {
		let sz = locations.length - locations.length % 2;
		let result = [];
		let i;
		for (i = 0; i < sz; i += 2)
		{
			let loc1 = locations[i];
			let loc2 = locations[i + 1];
			result.push(<div className="row my-4" key={i}>
				<div className="col-md-6">
					{this._makeLocationCard(
						loc1.id, loc1.address, loc1.open_time, loc1.close_time, loc1.garbageTypes, userIsCommercial
					)}
				</div>
				<div className="col-md-6">
					{this._makeLocationCard(
						loc2.id, loc2.address, loc2.open_time, loc2.close_time, loc2.garbageTypes, userIsCommercial
					)}
				</div>
			</div>);
		}

		if (i < locations.length)
		{
			let loc = locations[i];
			result.push(<div className="row" key={i}>
				<div className="col-md-6">
					{this._makeLocationCard(
						loc.id, loc.address, loc.open_time, loc.close_time, loc.garbageTypes, userIsCommercial
					)}
				</div>
			</div>);
		}

		return result;
	}

	render () {
		let user = UserService.getCurrentUser();
		return this.state.loading ? (<SpinnerComponent/>) : (
			<div>{this._makeRows(this.state.locations, user && user.is_commercial)}</div>
		);
	}
}
