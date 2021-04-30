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
			nextPage: 1
		};
	}

	_loadUsers = () => {
		if (this.state.nextPage) {
			UserService.getUsers(null, this.state.nextPage, 'rating', (data, err) => {
				if (err) {
					alert(err);
				} else {
					this.setState({
						users: data.results,
						loading: false,
						nextPage: data.next
					});

					// TODO: remove!
					console.log(this.state);
				}
			});
		}
	}

	componentDidMount() {
		this._loadUsers();
	}

	render() {
		if (!UserService.getCurrentUser())
		{
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
			</div>
		);
	}
}
