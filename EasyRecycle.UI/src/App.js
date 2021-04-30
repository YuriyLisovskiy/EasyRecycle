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
import CommerialOrderService from "./services/commercial_order";
import HowToRecycleComponent from "./components/info/HowToRecycle";
import LocationsInfoComponent from "./components/info/LocationsInfo";
import CollectionInfoComponent from "./components/info/CollectionInfo";
import RatingComponent from "./components/rating/Rating";
import ScanQrCodeComponent from "./components/user/ScanQrCode";
import FinishTransactionComponent from "./components/FinishTransaction";
import CommercialOrdersComponent from "./components/commercial/Orders";
import CreateCommercialOrderComponent from "./components/commercial/CreateOrder";
import EditLocationComponent from "./components/EditLocation";
import CreateLocationComponent from "./components/CreateLocation";

export default class App extends Component {

	constructor(props) {
		super(props);

		dotenv.config();

		this.state = {
			currentUser: undefined,
			loginIsOpen: false,
			registerIsOpen: false,
			scanQrCodeIsOpen: false,
			ordersCount: 0
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
				this.updateOrdersCount();
			}
		});
	}

	updateOrdersCount = () => {
		if (this.state.currentUser.is_garbage_collector) {
			CommerialOrderService.getOrders({
				locationFilter: true,
				statusFilter: ['A', 'B'],
				handler: (data, err) => {
					if (!err) {
						this.setState({ordersCount: data.count});
					}
				}
			});
		}
	}

	makeSubSettingRoute = (subPath) => {
		return <Route path={'/settings/' + subPath} render={
			(routeProps) => <SettingsComponent {...routeProps}
											   updateAvatar={this.onUpdateAvatar}
											   updateFullName={this.onUpdateFullName}
											   activeKey={subPath}/>
		} />
	}

	onLoginSuccess = () => {
		window.location.reload();
	}

	onRegisterSuccess = () => {
		window.location = '/';
	}

	onUpdateAvatar = (avatarLink) => {
		let user = this.state.currentUser;
		if (user.avatar_link !== avatarLink) {
			user.avatar_link = avatarLink;
			this.setState({
				user: user
			});
		}
	}

	onUpdateFullName = (first_name, last_name) => {
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

	onClickLogOut = () => {
		AuthService.logout();
		window.location = '/';
	}

	onClickLoginToggle = () => {
		let {loginIsOpen} = this.state;
		this.setState({
			loginIsOpen: !loginIsOpen,
			registerIsOpen: false
		});
	}

	onClickRegisterToggle = () => {
		let {registerIsOpen} = this.state;
		this.setState({
			loginIsOpen: false,
			registerIsOpen: !registerIsOpen
		});
	}

	onClickScanQrCodeToggle = () => {
		let {scanQrCodeIsOpen} = this.state;
		this.setState({
			scanQrCodeIsOpen: !scanQrCodeIsOpen
		});
	}

	render() {
		const user = this.state.currentUser;
		return <BrowserRouter>
			<div id="body" className="pb-5">
				<LoginComponent onLoginSuccess={this.onLoginSuccess}
								open={this.state.loginIsOpen}
								onRequestClose={this.onClickLoginToggle}
								onClickSwitchToRegister={this.onClickRegisterToggle}/>
				<RegisterComponent onRegisterSuccess={this.onRegisterSuccess}
								   open={this.state.registerIsOpen}
								   onRequestClose={this.onClickRegisterToggle}
								   onClickSwitchToLogin={this.onClickLoginToggle}/>
				<ScanQrCodeComponent open={this.state.scanQrCodeIsOpen}
								     onRequestClose={this.onClickScanQrCodeToggle}/>
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
							{user && !user.is_commercial && !user.is_garbage_collector ? (
								<li className="nav-item mr-2 d-inline text-success cursor-pointer">
									<i className="fa fa-qrcode mt-2 mx-2" aria-hidden="true"
									   style={{fontSize: 34}}
									   title="My QR-Code"
									   onClick={this.onClickScanQrCodeToggle}/>
								</li>
							) : "" }
							<li className="nav-item mr-2">
								<Link to="/info/locations" className="mx-2 text-success">
									<i className="fa fa-map-marker mt-2" aria-hidden="true"
									   style={{fontSize: 32}}/>
									<span className="ml-2 align-text-bottom font-weight-bold"
									      style={{fontSize: 16}}>
										LOCATIONS
									</span>
								</Link>
							</li>
							<li className="nav-item mr-2" title={!user ? "You must be logged in to view rating" : ""}>
								<Link to="/rating" className={"mx-2 text-success" + (!user ? " text-muted" : "")}
								      style={!user ? {fontSize: 32, pointerEvents: "none"} : {fontSize: 32}}>
									<i className="fa fa-trophy mt-2" aria-hidden="true"/>
									<span className="ml-2 align-middle font-weight-bold"
									      style={{fontSize: 16}}>
										RATING
									</span>
								</Link>
							</li>
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
										{
											user.is_superuser &&
											<div>
												<Link to="/locations/create" className="dropdown-item">
													<i className="fa fa-map-marker" aria-hidden="true"/> Add Location
												</Link>
												<div className="dropdown-divider"/>
											</div>
										}
										{
											user.is_garbage_collector &&
											<div>
												<Link to="/commercial-orders" className="dropdown-item">
													<i className="fa fa-tachometer" aria-hidden="true"/> Orders&nbsp;
													{
														this.state.ordersCount > 0 &&
														<sup>
															<span className="badge badge-pill badge-danger">
																{this.state.ordersCount}
															</span>
														</sup>
													}
												</Link>
												<div className="dropdown-divider"/>
											</div>
										}
										<div className="dropdown-item select-none cursor-pointer"
											 onClick={this.onClickLogOut}>
											<i className="fa fa-sign-out" aria-hidden="true"/> Sign Out
										</div>
									</div>
								</li>
							) : (
								<span>
									<li className="nav-item mr-2 d-inline">
										<button className="btn btn-outline-success mt-1"
												onClick={this.onClickLoginToggle}>
											LOGIN
										</button>
									</li>
									<li className="nav-item d-inline">
										<button className="btn btn-success mt-1"
												onClick={this.onClickRegisterToggle}>
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
						{this.makeSubSettingRoute('account')}
						{this.makeSubSettingRoute('profile')}
						{this.makeSubSettingRoute('privacy')}
						<Route path='/home' component={HomeComponent} />
						<Route path='/rating' component={RatingComponent} />
						<Route path='/info/how' component={HowToRecycleComponent} />
						<Route path='/info/locations' component={LocationsInfoComponent} />
						<Route path='/info/collection' component={CollectionInfoComponent} />
						<Route path='/commercial-orders' render={
							(props) => <CommercialOrdersComponent {...props}
							                                      updateOrdersCount={this.updateOrdersCount}/>
						} />
						<Route path='/commercial-order/create' component={CreateCommercialOrderComponent} />
						<Route path='/finish-transaction-for/:id' component={FinishTransactionComponent} />
						<Route path='/locations/create' component={CreateLocationComponent} />
						<Route path='/locations/:id/edit' component={EditLocationComponent} />
						<Route path='/page-not-found' component={Errors.NotFound} />
						<Route path={['/', '/index']} component={IndexComponent} />
					</Switch>
				</div>
			</div>
		</BrowserRouter>;
	}
}
