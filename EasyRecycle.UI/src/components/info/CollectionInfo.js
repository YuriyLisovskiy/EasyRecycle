import React, {Component} from "react";
import {Link} from "react-router-dom";

export default class CollectionInfoComponent extends Component {

	render () {
		return <div className="container">
			<div className="row">
				<div className="col-md-12">
					<div className="card">
						<div className="card-body">
							<h5 className="card-title text-center">Ordinary User</h5>
							<p className="card-text">
								To become this king of user, you need to register on this web-site.
								You will be able to bring different kinds of garbage and receive points
								for it. Also you can view <Link to="/rating">Rating</Link> page to compare
								your results with other users.
							</p>
							<div className="card-text my-2">
								Steps for bringing the garbage for recycling:
								<ul className="list-group list-group-flush">
									<li className="list-group-item">
										1. Go to <Link to="/info/locations">Locations</Link> page.
									</li>
									<li className="list-group-item">
										2. Choose the address of the nearest location with the appropriate
										type of garbage:
										<img className="w-100 rounded mx-auto d-block mt-2"
										     src="/locations-demo.png"
										     alt="Locations Demo"/>
									</li>
									<li className="list-group-item">
										3. Bring all waste to selected location.
									</li>
									<li className="list-group-item">
										4. Show your QR-code to the garbage collector to increase your rating points.
										Find QR-code on navigation bar at the top:
										<img className="w-100 rounded mx-auto d-block mt-2"
										     src="/qr-code-demo.png"
										     alt="QR-code Demo"/>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="row mt-3">
				<div className="col-md-12">
					<div className="card">
						<div className="card-body">
							<h5 className="card-title text-center">Commercial User</h5>
							<p className="card-text">
								If you are a company or some organization and you produces mush garbage
								then this role is for you. Become a commercial user and create orders in
								available locations. Of course it is paid service because locations'
								management must use its own vehicles to remove waste from your organization.
								You will not receive any rating points for it.
							</p>
							<div className="card-text my-2">
								To become a commercial user:
								<ul className="list-group list-group-flush">
									<li className="list-group-item">
										1. Go to <Link to="/settings/account">User Settings > Account</Link> page.
									</li>
									<li className="list-group-item">
										2. Find section with title "Commercial":
										<img className="w-100 rounded mx-auto d-block mt-2"
										     src="/commercial-section-demo.png"
										     alt="Commercial Section Demo"/>
									</li>
									<li className="list-group-item">
										3. Click on "Become a commercial user" button and confirm this action with
										your password:
										<img className="w-65 rounded mx-auto d-block mt-2"
										     src="/become-a-commercial-demo.png"
										     alt="Become a Commercial Demo"/>
									</li>
								</ul>
							</div>
							<div className="card-text my-2">
								To create a commercial order:
								<ul className="list-group list-group-flush">
									<li className="list-group-item">
										1. Go to <Link to="/info/locations">Locations</Link> page.
									</li>
									<li className="list-group-item">
										2. Choose the address of the nearest location with the appropriate
										type of garbage and suitable price:
										<img className="w-100 rounded mx-auto d-block mt-2"
										     src="/commercial-locations-demo.png"
										     alt="Commercial Locations Demo"/>
									</li>
									<li className="list-group-item">
										3. Click on "Create Commercial Order" button, fill all required fields and
										click "Create":
										<img className="w-100 rounded mx-auto d-block mt-2"
										     src="/commercial-order-demo.png"
										     alt="Commercial Order Demo"/>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>;
	}
}
