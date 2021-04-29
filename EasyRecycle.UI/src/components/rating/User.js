import React, {Component} from "react";

export default class UserComponent extends Component {

	_getBadgeColor = (idx) => {
		switch (idx)
		{
			case 0:
				return 'gold';
			case 1:
				return 'silver';
			case 2:
				return 'bronze';
			default:
				return 'common';
		}
	}

	render () {
		let user = this.props.user;
		return <div className="card mb-3">
			<div className="row g-0 d-flex h-100">
				<div className="col-md-1 text-center align-self-center">
					{
						this.props.index < 3 ? (
							<span className="fa-stack" style={{marginRight: '-25px', marginTop: '-20px'}}>
								<i style={{fontSize: '48px'}}
								   className={"fa fa-trophy fa-stack-2x trophy-" + this._getBadgeColor(this.props.index)}/>
								<span className="fa fa-stack-1x font-weight-bold">
									<span style={{fontSize: '18px', marginLeft: '13px', display: 'block', color: 'white'}}>
										{this.props.index + 1}
									</span>
								</span>
							</span>
						) : (
							<div className="font-weight-bold" style={{marginRight: '-45px'}}>
								{this.props.index + 1}
							</div>
						)
					}
				</div>
				<div className="col-md-1 my-2 ml-3 text-center justify-content-center align-self-center">
					<img src={user.avatar_link}
					     alt="Avatar"
					     className="img-fluid" width={50}/>
				</div>
				<div className="col-md-5">
					{
						user.first_name && user.last_name && user.show_full_name ? (
							<div className="card-body">
								<div className="card-text">
									<h5 className="d-inline">
										{user.first_name} {user.last_name}
									</h5>
								</div>
								<small className="card-text text-muted font-weight-bold">{user.username}</small>
							</div>
						) : (
							<div className="card-body">
								<div className="card-text">
									<h5 className="d-inline">{user.username}</h5>
								</div>
							</div>
						)
					}
				</div>
				<div className="col-md-4 text-center justify-content-center align-self-center">
					<h2>{user.rating}</h2>
				</div>
			</div>
		</div>;
	}
}
