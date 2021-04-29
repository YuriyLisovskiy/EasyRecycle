import React, {Component} from "react";

export default class UserComponent extends Component {

	render () {
		let user = this.props.user;
		return <p>TODO: {user.first_name} {user.last_name}</p>;
	}
}
