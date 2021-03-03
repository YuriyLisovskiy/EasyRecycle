import React, {Component} from 'react';
import {Link, Switch} from 'react-router-dom';

import './styles/app.css';

import dotenv from "dotenv";

export default class App extends Component {

	constructor(props) {
		super(props);

		dotenv.config();

		this.state = {
			currentUser: undefined,
			loginIsOpen: false,
			registerIsOpen: false
		};
	}

	render() {
		return <div id="body" className="pb-5">
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
					<ul className='navbar-nav ml-auto'>
						<li className="nav-item mr-2">
							<button className="btn btn-outline-success">
								LOGIN
							</button>
						</li>
						<li className="nav-item">
							<button className="btn btn-success">
								SIGN UP
							</button>
						</li>
					</ul>
				</div>
			</nav>
			<div className="container mt-3 w-65">
				<Switch>

				</Switch>
			</div>
		</div>;
	}
}
