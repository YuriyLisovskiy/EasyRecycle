import React, {Component} from "react";
import UserService from "../../services/user";
import SpinnerComponent from "../Spinner";
import UserComponent from "./User";
import Errors from "../Errors";

export default class RatingComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			users: undefined,
			nextPage: 1,
			nextPageLoading: false,
		};
	}

	loadUsers = () => {
		if (this.state.nextPage) {
			this.setState({nextPageLoading: true});
			UserService.getUsers(null, this.state.nextPage, 'rating', (data, err) => {
				if (err) {
					alert(err);
				}
				else {
					let users = this.state.users;
					this.setState({
						users: !users ? data.results : users.concat(data.results),
						loading: false,
						nextPage: data.next ? this.state.nextPage + 1 : null,
						nextPageLoading: false
					});
				}
			});
		}
	}

	componentDidMount() {
		this.loadUsers();
	}

	render() {
		if (!UserService.getCurrentUser()) {
			return <Errors.Forbidden/>;
		}

		return this.state.loading ? (<SpinnerComponent/>) : (
			<div className="container">
				<div className="row">
					<h3 className="col-md-12 text-center mb-3">
						RATING
					</h3>
				</div>
				{this.state.users.map((user, idx) => <UserComponent user={user} index={idx}/>)}
				{
					this.state.nextPage &&
					<div className="mx-auto text-center">
						<button className="btn btn-outline-secondary"
						        onClick={this.loadUsers}>
							{this.state.nextPageLoading &&
							<span className="spinner-border spinner-border-sm"/>} Load More
						</button>
					</div>
				}
			</div>
		);
	}
}
