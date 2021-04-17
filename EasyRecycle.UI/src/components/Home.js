import React, {Component} from "react";
import {Card} from "react-bootstrap";
import {Link} from "react-router-dom";

export default class HomeComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	makeCard = (title, imagePath, description, link) => {
		return <Link to={link} style={{textDecoration: 'none', color: 'black'}}>
			<Card className="h-100">
				<Card.Body>
					<Card.Title className="text-center">{title}</Card.Title>
					<Card.Img className="my-4" variant="top" src={imagePath} style={{filter: 'grayscale(100%)'}} />
					<Card.Text className="text-center">
						<h5 style={{fontWeight: 'normal'}}>{description}</h5>
					</Card.Text>
				</Card.Body>
			</Card>
		</Link>;
	}

	render () {
		return <div className="container h-100">
			<div className="row">
				<div className="col-md-4">
					{this.makeCard(
						"How to?",
						"/logo512.png",
						"Learn how to recycle different kinds of garbage",
						"/info/how"
					)}
				</div>
				<div className="col-md-4">
					{this.makeCard(
						"Where to?",
						"/logo512.png",
						"Learn where to bring your garbage, so that it can be recycled",
						"/info/where"
					)}
				</div>
				<div className="col-md-4">
					{this.makeCard(
						"Don't want to?",
						"/logo512.png",
						"Learn how to place a request, so that we can take care of everything",
						"/info/request"
					)}
				</div>
			</div>
		</div>;
	}
}
