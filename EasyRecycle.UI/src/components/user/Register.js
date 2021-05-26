import React, {Component} from "react";
import AuthService from "../../services/auth";
import {
	checkPassword, getErrorMessage, getMessage, strIsEmpty
} from "../../utils/misc";
import DrawerComponent from "../Drawer";
import PropTypes from "prop-types";

export default class RegisterComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			username: "",
			email: "",
			password: "",
			passwordRepeat: "",
			registerError: undefined,
			usernameError: undefined,
			emailError: undefined,
			passwordError: undefined,
			passwordRepeatError: undefined
		};
	}

	/* istanbul ignore next */
	setPasswordsError = (password, passwordRepeat) => {
		if (password !== passwordRepeat) {
			this.setState({
				passwordRepeatError: 'Passwords do not match.'
			});
		}
	}

	/* istanbul ignore next */
	setError = (err) => {
		let msg = getErrorMessage(err);
		if (msg.email) {
			msg = msg.email[0];
		}

		this.setState({
			loading: false,
			registerError: msg
		});
	}

	/* istanbul ignore next */
	getFieldError = (name, isNotValidFunc, res) => {
		let errMessage = isNotValidFunc();
		if (errMessage) {
			if (res === null) {
				res = {};
			}

			let currError = res[name + 'Error'];
			if (!currError) {
				res[name + 'Error'] = errMessage;
			}
		}

		return res;
	}

	/* istanbul ignore next */
	requiredFieldError = (field) => {
		if (strIsEmpty(field)) {
			return 'This field is required.';
		}

		return undefined;
	}

	/* istanbul ignore next */
	charIsAllowedInUsername = (char) => {
		let allowedChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789';
		return allowedChars.includes(char);
	}

	/* istanbul ignore next */
	usernameError = (username) => {
		if (username.length > 30 || username.length < 5) {
			return 'Username must be at least 5 and up to 30 characters long.';
		}

		for (let i = 0; i < username.length; i++) {
			if (!this.charIsAllowedInUsername(username.charAt(i))) {
				return 'Username must contain only upper and (or) lower case letters, numbers and underscore symbol.';
			}
		}

		return undefined;
	}

	/* istanbul ignore next */
	getUsernameError = (username, res) => {
		res = this.getFieldError(
			'username', _ => this.requiredFieldError(username), res
		);
		res = this.getFieldError(
			'username', _ => this.usernameError(username), res
		);
		return res;
	}

	/* istanbul ignore next */
	getPasswordError = (password, res) => {
		res = this.getFieldError(
			'password', _ => this.requiredFieldError(password), res
		);
		res = this.getFieldError(
			'password', _ => checkPassword(password), res
		);
		return res;
	}

	/* istanbul ignore next */
	getRegisterError = (username, email, password, passwordRepeat) => {
		let res = null;
		res = this.getUsernameError(username, res);
		res = this.getFieldError(
			'email', _ => this.requiredFieldError(email), res
		);
		res = this.getPasswordError(password, res);
		res = this.getFieldError(
			'passwordRepeat', _ => {
				return passwordRepeat !== password ? 'Passwords do not match.' : undefined;
			}, res
		);
		return res;
	}

	/* istanbul ignore next */
	onChangeMakeFor = (field, validationFunc) => {
		return e => {
			let state = {};
			let text = e.target.value;
			state[field] = text;
			state[field + 'Error'] = validationFunc ? validationFunc(text) : undefined;
			this.setState(state);
			return text;
		}
	}

	/* istanbul ignore next */
	onChangeUsername = (e) => {
		return this.onChangeMakeFor('username', this.usernameError)(e);
	}

	/* istanbul ignore next */
	onChangeEmail = (e) => {
		return this.onChangeMakeFor('email', text => {
			if (!text.includes('@')) {
				return 'Email is invalid.';
			}

			return undefined;
		})(e);
	}

	/* istanbul ignore next */
	onChangePassword = (e) => {
		this.setPasswordsError(
			this.onChangeMakeFor('password', checkPassword)(e), this.state.passwordRepeat
		);
	}

	/* istanbul ignore next */
	onChangePasswordRepeat = (e) => {
		this.setPasswordsError(
			this.state.password, this.onChangeMakeFor('passwordRepeat')(e)
		);
	}

	/* istanbul ignore next */
	onClickRegister = (_) => {
		this.setState({
			registerError: "",
			loading: true
		});
		let registerError = this.getRegisterError(
			this.state.username, this.state.email,
			this.state.password, this.state.passwordRepeat
		);
		if (!registerError) {
			let input = {
				username: this.state.username,
				email: this.state.email
			}
			AuthService.userExists(input, (data, err) => {
				if (err) {
					this.setError(err);
				}
				else {
					if (data.exists) {
						this.setState({
							registerError: getMessage(data),
							loading: false
						});
					}
					else {
						AuthService.register(
							this.state.username,
							this.state.email,
							this.state.password,
							(data, err) => {
								if (err) {
									if (err.response.data) {
										let errors = err.response.data;
										this.setState({
											usernameError: errors.username || undefined,
											emailError: errors.email || undefined,
											passwordError: errors.password || undefined,
											loading: false
										})
									}
									else {
										this.setError(err);
									}
								}
								else {
									this.props.onRegisterSuccess();
								}
							}
						);
					}
				}
			});
		}
		else {
			registerError.loading = false;
			this.setState(registerError);
		}
	}

	/* istanbul ignore next */
	onKeyDownLogin = (e) => {
		if (e.key.toLowerCase() === 'enter') {
			this.onClickRegister(e);
		}
	}

	render() {
		return <DrawerComponent title="REGISTER AN ACCOUNT"
		                        open={this.props.open}
		                        onRequestClose={this.props.onRequestClose}
		                        modalElementClass="container w-30 min-w-300">
			{
				this.state.registerError &&
				<div className="form-group">
					<div className="alert alert-danger" role="alert">
						{this.state.registerError}
					</div>
				</div>
			}
			<div className="row">
				<div className="col-md-12">
					<div className="form-group">
						<label className="control-label" htmlFor="username">
							Username <span className="text-danger">*</span></label>
						<input
							type="text"
							className="form-control"
							name="username"
							value={this.state.username}
							onChange={this.onChangeUsername}
							placeholder="Type text..."
							onKeyDown={this.onKeyDownLogin}
						/>
						{
							this.state.usernameError && <small className="form-text text-danger ml-1 mt-1">
								{this.state.usernameError}
							</small>
						}
					</div>
					<div className="form-group">
						<label className="control-label" htmlFor="email">
							Email <span className="text-danger">*</span></label>
						<input
							type="email"
							className="form-control"
							name="email"
							value={this.state.email}
							onChange={this.onChangeEmail}
							placeholder="Type text..."
							onKeyDown={this.onKeyDownLogin}
						/>
						{
							this.state.emailError && <small className="form-text text-danger ml-1 mt-1">
								{this.state.emailError}
							</small>
						}
					</div>
					<div className="form-group">
						<label className="control-label" htmlFor="password">
							Password <span className="text-danger">*</span></label>
						<input
							type="password"
							className="form-control"
							name="password"
							value={this.state.password}
							onChange={this.onChangePassword}
							placeholder="Type text..."
							onKeyDown={this.onKeyDownLogin}
						/>
						{
							this.state.passwordError && <small className="form-text text-danger ml-1 mt-1">
								{this.state.passwordError}
							</small>
						}
					</div>
					<div className="form-group">
						<label className="control-label" htmlFor="password_repeat">
							Repeat password <span className="text-danger">*</span></label>
						<input
							type="password"
							className="form-control"
							name="password_repeat"
							value={this.state.passwordRepeat}
							onChange={this.onChangePasswordRepeat}
							placeholder="Type text..."
							onKeyDown={this.onKeyDownLogin}
						/>
						{
							this.state.passwordRepeatError && <small className="form-text text-danger ml-1 mt-1">
								{this.state.passwordRepeatError}
							</small>
						}
					</div>
					<div className="form-group">
						<button
							className="btn btn-success btn-block"
							onClick={this.onClickRegister}
							disabled={this.state.loading}>
							{
								this.state.loading &&
								<span className="spinner-border spinner-border-sm"/>
							} Sign Up
						</button>
					</div>
					<div className="text-center">
						<div className="d-inline">Already on Easy Recycle?</div>
						<button className="btn btn-link d-inline mb-1"
						        onClick={_ => this.props.onClickSwitchToLogin()}>Sign In</button>
					</div>
				</div>
			</div>
		</DrawerComponent>;
	}
}

RegisterComponent.propTypes = {
	onRegisterSuccess: PropTypes.func,
	open: PropTypes.bool,
	onRequestClose: PropTypes.func,
	onClickSwitchToLogin: PropTypes.func
}
