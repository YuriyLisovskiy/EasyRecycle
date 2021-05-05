import React, {Component} from "react";
import PasswordVerificationComponent from "./PasswordVerification";
import PropTypes from "prop-types";
import ToggleSettingComponent from "./ToggleSetting";
import UserService from "../../../services/user";

export default class PrivacySettingsComponent extends Component {

	/* istanbul ignore next */
	onToggleShowFullName = (value, handler) => {
		UserService.editUser(
			this.props.user.id, null, null, value, null, (data, err) => {
				if (!err) {
					let user = this.props.user;
					user.show_full_name = data.show_full_name;
					UserService._setCurrentUser(user);
					handler(data.show_full_name);
				}
				else {
					handler(!value);
				}
			}
		);
	}

	render() {
		return <div className="p-3">
			<div className="row">
				<div className="col-12 border-bottom mb-4">
					<small className="text-muted font-weight-bold">PRIVACY</small>
				</div>
				<div className="col-12">
					<ToggleSettingComponent title="Show full name"
					                        subtitle="Display first and last name on your account page."
					                        initialValue={this.props.user.show_full_name}
					                        onToggle={this.onToggleShowFullName}/>
				</div>
			</div>
		</div>;
	}
}

PasswordVerificationComponent.propTypes = {
	user: PropTypes.object
}
