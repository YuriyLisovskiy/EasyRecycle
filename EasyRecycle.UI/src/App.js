import React, {Component} from 'react';
import {Link, Route, Switch} from 'react-router-dom';
import {BrowserRouter} from "react-router-dom";

import './styles/app.css';
import './styles/common.css';

import dotenv from "dotenv";

import AuthService from "./services/auth";
import MyProfileComponent from "./components/user/MyProfile";
import ProfileComponent from "./components/user/Profile";
import HomeComponent from "./components/Home";
import IndexComponent from "./components/Index";
import Errors from "./components/Errors";
import LoginComponent from "./components/user/Login";
import RegisterComponent from "./components/user/Register";
import SettingsComponent from "./components/user/settings/Settings";
import UserService from "./services/user";
import HowToRecycleComponent from "./components/info/HowToRecycle";
import LocationsComponent from "./components/info/Locations";
import RequestInfoComponent from "./components/info/Request";
import RatingComponent from "./components/Rating";
import ScanQrCodeComponent from "./components/user/ScanQrCode";
import FinishTransactionComponent from "./components/user/FinishTransaction";
import CommercialRequestComponent from "./components/CommercialRequest";
import EditLocationComponent from "./components/EditLocation";

export default class App extends Component {

	constructor(props) {
		super(props);

		dotenv.config();

		this.state = {
			currentUser: undefined,
			loginIsOpen: false,
			registerIsOpen: false,
			scanQrCodeIsOpen: false,
		};
	}

	componentDidMount() {
		UserService.getMe((user, err) => {
			if (err) {
				// mute error
			}
			else {
				this.setState({
					currentUser: user
				});
			}
		});
	}

	_makeSubSettingRoute = (subPath) => {
		return <Route path={'/settings/' + subPath} render={
			(routeProps) => <SettingsComponent {...routeProps}
											   updateAvatar={this._onUpdateAvatar}
											   updateFullName={this._onUpdateFullName}
											   activeKey={subPath}/>
		} />
	}

	_onLoginSuccess = () => {
		window.location.reload();
	}

	_onRegisterSuccess = () => {
		window.location = '/';
	}

	_onUpdateAvatar = (avatarLink) => {
		let user = this.state.currentUser;
		if (user.avatar_link !== avatarLink) {
			user.avatar_link = avatarLink;
			this.setState({
				user: user
			});
		}
	}

	_onUpdateFullName = (first_name, last_name) => {
		let user = this.state.currentUser;
		if (first_name) {
			user.first_name = first_name;
		}

		if (last_name) {
			user.last_name = last_name;
		}

		if (first_name || last_name) {
			this.setState({
				user: user
			});
		}
	}

	_onClickLogOut = () => {
		AuthService.logout();
		window.location = '/';
	}

	_onClickLoginToggle = () => {
		let {loginIsOpen} = this.state;
		this.setState({
			loginIsOpen: !loginIsOpen,
			registerIsOpen: false
		});
	}

	_onClickRegisterToggle = () => {
		let {registerIsOpen} = this.state;
		this.setState({
			loginIsOpen: false,
			registerIsOpen: !registerIsOpen
		});
	}

	_onClickScanQrCodeToggle = () => {
		let {scanQrCodeIsOpen} = this.state;
		this.setState({
			scanQrCodeIsOpen: !scanQrCodeIsOpen
		});
	}

	render() {
		const user = this.state.currentUser;
		return <BrowserRouter>
			<div id="body" className="pb-5">
				<LoginComponent onLoginSuccess={this._onLoginSuccess}
								open={this.state.loginIsOpen}
								onRequestClose={this._onClickLoginToggle}
								onClickSwitchToRegister={this._onClickRegisterToggle}/>
				<RegisterComponent onRegisterSuccess={this._onRegisterSuccess}
								   open={this.state.registerIsOpen}
								   onRequestClose={this._onClickRegisterToggle}
								   onClickSwitchToLogin={this._onClickLoginToggle}/>
				<ScanQrCodeComponent open={this.state.scanQrCodeIsOpen}
								     onRequestClose={this._onClickScanQrCodeToggle}/>
				<nav className="navbar navbar-expand-md bg-light navbar-light">
					<Link className="navbar-brand" to='/'>
						<img height={50} src={process.env.PUBLIC_URL + '/logo225.png'} alt="LOGO"/>
						<div className="d-inline ml-2"> Easy Recycle</div>
					</Link>
					<button className="navbar-toggler" type="button" data-toggle="collapse"
							data-target="#collapsibleNavbar">
						<span className="navbar-toggler-icon"/>
					</button>
					<div className="collapse navbar-collapse" id="collapsibleNavbar">
						<ul className="navbar-nav ml-auto">
							<li className="nav-item mr-2">
								<Link to="/rating" className="mt-2 mx-2 text-success"
									  style={{fontSize: 34}} title="Show Rating">
									<i className="fa fa-trophy" aria-hidden="true"/>
								</Link>
							</li>
							{user && !user.is_commercial && !user.is_garbage_collector ? (
								<li className="nav-item mr-2 d-inline text-success cursor-pointer">
									<i className="fa fa-qrcode mt-2 mx-2" aria-hidden="true"
									   style={{fontSize: 34}} title="My QR-Code" onClick={this._onClickScanQrCodeToggle}/>
								</li>
							) : "" }
							{user ? (
								<li className="nav-item dropdown d-inline">
									<div id="navbardrop"
										 className="nav-link dropdown-toggle select-none cursor-pointer"
										 data-toggle="dropdown">
										<div className="d-inline">
											<div className="text-muted profile-photo d-inline">
												<img src={user.avatar_link}
													 alt="Avatar"
													 className="avatar-picture mr-2"/>
												<div className="d-inline font-weight-bold">{user.username}</div>
											</div>
										</div>
									</div>
									<div className="dropdown-menu dropdown-menu-right">
										{
											user.first_name && user.last_name &&
											<div>
												<div className="dropdown-item-text font-weight-bold white-space-nowrap">
													{user.first_name} {user.last_name}
												</div>
												<div className="dropdown-divider"/>
											</div>
										}
										<Link to={"/profile/me"} className="dropdown-item">
											<i className="fa fa-user-circle-o" aria-hidden="true"/> My Profile
										</Link>
										<Link to="/settings/account" className="dropdown-item">
											<i className="fa fa-cog" aria-hidden="true"/> User Settings
										</Link>
										<div className="dropdown-divider"/>
										<div className="dropdown-item select-none cursor-pointer"
											 onClick={this._onClickLogOut}>
											<i className="fa fa-sign-out" aria-hidden="true"/> Sign Out
										</div>
									</div>
								</li>
							) : (
								<span>
									<li className="nav-item mr-2 d-inline">
										<button className="btn btn-outline-success mt-1"
												onClick={this._onClickLoginToggle}>
											LOGIN
										</button>
									</li>
									<li className="nav-item d-inline">
										<button className="btn btn-success mt-1"
												onClick={this._onClickRegisterToggle}>
											SIGN UP
										</button>
									</li>
								</span>
							)}
						</ul>
					</div>
				</nav>
				<div className="container mt-3 w-65">
					<Switch>
						<Route path='/profile/me' component={MyProfileComponent} />
						<Route path='/profile/:id' component={ProfileComponent} />
						{this._makeSubSettingRoute('account')}
						{this._makeSubSettingRoute('profile')}
						{this._makeSubSettingRoute('privacy')}
						<Route path='/home' component={HomeComponent} />
						<Route path='/rating' component={RatingComponent} />
						<Route path='/info/how' component={HowToRecycleComponent} />
						<Route path='/info/locations' component={LocationsComponent} />
						<Route path='/info/request' component={RequestInfoComponent} />
						<Route path='/commercial-request' component={CommercialRequestComponent} />
						<Route path='/finish-transaction-for/:username' component={FinishTransactionComponent} />
						<Route path='/location/:id' component={EditLocationComponent} />
						<Route path='/page-not-found' component={Errors.NotFound} />
						<Route path={['/', '/index']} component={IndexComponent} />
					</Switch>
				</div>
			</div>
		</BrowserRouter>;
	}
}
