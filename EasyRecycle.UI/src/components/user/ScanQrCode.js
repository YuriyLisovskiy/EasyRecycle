import React, {Component} from "react";
import DrawerComponent from "../Drawer";
import PropTypes from "prop-types";
import "../../styles/common.css";
import UserService from "../../services/user";
import QRCode from "qrcode.react";

export default class ScanQrCodeComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			user: UserService.getCurrentUser()
		};
	}

	render() {
		let user = this.state.user;
		if (user)
		{
			let user_title;
			if (user.first_name && user.last_name)
			{
				user_title = user.first_name + " " + user.last_name;
			}
			else
			{
				user_title = user.username
			}

			let hostName = window.location.href.replace(window.location.pathname, "");
			return <DrawerComponent title="QR-CODE"
									open={this.props.open}
									onRequestClose={this.props.onRequestClose}
									modalElementClass="container w-25 min-w-250">
				<div className="row">
					<div className="col-md-12">
						<div className="text-center">
							Let garbage collector scan this code to give you points.
						</div>
						<div className="text-center h-100 mt-3">
							<QRCode value={hostName + "/finish-transaction-for/" + user.username} />
						</div>
					</div>
				</div>
			</DrawerComponent>
		}

		return <div/>;
	}
}

ScanQrCodeComponent.propTypes = {
	open: PropTypes.bool,
	onRequestClose: PropTypes.func
}
