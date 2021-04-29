import React, {Component} from "react";
import UserService from "../../services/user";

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
		if (this.state.nextPage)
		{
			UserService.getUsers(null, this.state.nextPage, 'rating', (data, err) => {
				if (err)
				{
					alert(err);
				}
				else
				{
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

	render () {
		return <h1>TODO: rating here!</h1>;
	}
}
