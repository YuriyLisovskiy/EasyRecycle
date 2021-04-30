import React, {Component} from "react";
import CommercialOrderService from "../../services/commercial_order";
import SpinnerComponent from "../Spinner";
import {GarbageTypeToIcon} from "../../utils/misc";

export default class CommercialOrdersComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			orders: undefined,
			nextPage: 1,
			nextPageLoading: false,
			changeStatusLoading: false
		};
		this.statusToRowClass = {
			'A': 'table-warning',
			'B': 'table-info',
			'C': 'table-danger',
			'D': 'table-success'
		}
		this.statuses = {
			'A': 'Queued',
			'B': 'In Progress',
			'C': 'Rejected',
			'D': 'Done'
		}
	}

	componentDidMount() {
		this.loadOrders();
	}

	handleStatusChanged = (order) => {
		return (e) => {
			let newStatus = e.target.value;
			this.setState({
				changeStatusLoading: true
			})
			CommercialOrderService.editOrder({
				id: order.id,
				status: newStatus,
				handler: (data, err) => {
					if (err) {
						alert(err);
					}
					else {
						let orders = this.state.orders;
						let idx = orders.indexOf(order);
						orders[idx].status = newStatus;
						this.setState({
							orders: orders,
							changeStatusLoading: false
						});
						if (this.props.updateOrdersCount) {
							this.props.updateOrdersCount();
						}
					}
				}
			})
		};
	}

	loadOrders = () => {
		this.setState({nextPageLoading: true});
		CommercialOrderService.getOrders({
			locationFilter: true,
			orderByStatus: true,
			page: this.state.nextPage,
			handler: (data, err) => {
				if (err) {
					alert(err);
				}
				else {
					let nextPage = data.next ? this.state.nextPage + 1 : null;
					let orders = this.state.orders;
					orders = !orders ? data.results : orders.concat(data.results);
					this.setState({
						orders: orders,
						nextPage: nextPage,
						nextPageLoading: false,
						loading: false
					});
				}
			}
		});
	}

	render() {
		return this.state.loading ? (<SpinnerComponent/>) : (
			<div className="container">
				<div className="p-3 card">
					<table className="table">
						<thead>
						<tr>
							<th>Type</th>
							<th>Mass (kg)</th>
							<th>Address</th>
							<th>Date</th>
							<th>{this.state.changeStatusLoading &&
								<span className="spinner-border spinner-border-sm"/>
							} Status</th>
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
							<th className="align-middle min-w-150">
								<div className="form-group d-inline">
									<select className="form-control"
									        defaultValue={order.status}
									        onChange={this.handleStatusChanged(order)}
									        disabled={order.status === 'C' || order.status === 'D'}>
										{
											Object.keys(this.statuses).map(key => <option key={key} value={key}>
												{this.statuses[key]}
											</option>)
										}
									</select>
								</div>
							</th>
						</tr>)}
						</tbody>
					</table>
					{
						this.state.nextPage &&
						<div className="mx-auto text-center">
							<button className="btn btn-outline-secondary"
							        onClick={this.loadOrders}>
								{this.state.nextPageLoading &&
								<span className="spinner-border spinner-border-sm"/>} Load More
							</button>
						</div>
					}
				</div>
			</div>
		);
	}
}
