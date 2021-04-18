import React, {Component} from "react";
import PasswordVerificationComponent from "./PasswordVerification";
import PropTypes from "prop-types";
import ChangeEmailComponent from "./ChangeEmail";
import ChangePasswordComponent from "./ChangePassword";
import UserService from "../../../services/user";
import AuthService from "../../../services/auth";
import {getErrorMessage} from "../../../utils/misc";

export default class AccountSettingsComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			deactivateDrawerIsOpen: false,
			becomeCommercialDrawerIsOpen: false
		};
		this.confirmDeactivateRef = React.createRef();
		this.confirmBecomeCommercialRef = React.createRef();
	}

	_onClickDeactivateToggle = () => {
		let {deactivateDrawerIsOpen} = this.state;
		this.setState({
			deactivateDrawerIsOpen: !deactivateDrawerIsOpen
		});
	}

	_onClickDeactivateConfirm = (_, password, finished) => {
		UserService.deactivateMe(this.props.user.id, password, (resp, err) => {
			if (err) {
				this.confirmDeactivateRef.current.setError(getErrorMessage(err));
			}
			else {
				AuthService.logout();
				window.location = '/';
			}

			finished();
		});
	}

	_onClickBecomeCommercialToggle = () => {
		let {becomeCommercialDrawerIsOpen} = this.state;
		this.setState({
			becomeCommercialDrawerIsOpen: !becomeCommercialDrawerIsOpen
		});
	}

	_onClickBecomeCommercialConfirm = (_, password, finished) => {
		UserService.becomeCommercial(this.props.user.id, password, (resp, err) => {
			if (err) {
				this.confirmBecomeCommercialRef.current.setError(getErrorMessage(err));
			}
			else {
				let user = UserService.getCurrentUser();
				user.is_commercial = true;
				UserService._setCurrentUser(user);
			}

			finished();
		});
	}

	render() {
		let user = UserService.getCurrentUser();
		console.log(user);
		return <div className="p-3">
			<div className="row">
				<div className="col-12 border-bottom mb-4">
					<small className="text-muted font-weight-bold">ACCOUNT PREFERENCES</small>
				</div>
				<div className="col-12">
					<ChangeEmailComponent user={this.props.user}/>
				</div>
				<div className="col-12 mt-4">
					<ChangePasswordComponent user={this.props.user}/>
				</div>
			</div>
			{
				!user.is_commercial &&
				<div className="row mt-4">
					<div className="col-12 border-bottom my-4">
						<small className="text-muted font-weight-bold">COMMERCIAL</small>
					</div>
					<div className="col-12 text-right">
						<PasswordVerificationComponent description={<div className="text-left text-justify">
								<p className="mt-3 text-center">This action is not recoverable.</p>
							</div>}
													   ref={this.confirmBecomeCommercialRef}
													   open={this.state.becomeCommercialDrawerIsOpen}
													   modalElementClass="container w-30 min-w-300"
													   onRequestClose={this._onClickBecomeCommercialToggle}
													   onClickConfirm={this._onClickBecomeCommercialConfirm}/>
						<button className="btn btn-outline-danger" onClick={this._onClickBecomeCommercialToggle}>
							BECOME A COMMERCIAL USER
						</button>
					</div>
				</div>
			}
			<div className="row mt-4">
				<div className="col-12 border-bottom my-4">
					<small className="text-muted font-weight-bold">DEACTIVATE ACCOUNT</small>
				</div>
				<div className="col-12 text-right">
					<PasswordVerificationComponent description={
						<div className="text-left text-justify">
							<p className="mt-3 text-center">Deactivated accounts are not recoverable!</p>
						</div>
					}
					                               ref={this.confirmDeactivateRef}
					                               open={this.state.deactivateDrawerIsOpen}
					                               modalElementClass="container w-30 min-w-300"
					                               onRequestClose={this._onClickDeactivateToggle}
					                               onClickConfirm={this._onClickDeactivateConfirm}/>
					<button className="btn btn-outline-danger" onClick={this._onClickDeactivateToggle}>
						DEACTIVATE ACCOUNT
					</button>
				</div>
			</div>
		</div>;
	}
}

PasswordVerificationComponent.propTypes = {
	user: PropTypes.object
}
