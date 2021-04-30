import React, {Component} from "react";
import {Card} from "react-bootstrap";
import {Link} from "react-router-dom";

export default class HomeComponent extends Component {

	makeCard = (title, imagePath, description, link) => {
		return <Link to={link} style={{textDecoration: 'none', color: 'black'}}>
			<Card className="h-100">
				<Card.Body>
					<Card.Title className="text-center">{title}</Card.Title>
					<Card.Img className="my-4" variant="top" src={imagePath} />
					<Card.Text className="text-center" style={{fontWeight: 'normal'}}>
						{description}
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
						"/how-to.png",
						"Learn how to recycle different kinds of garbage",
						"/info/how"
					)}
				</div>
				<div className="col-md-4">
					{this.makeCard(
						"Where to?",
						"/map.png",
						"Choose the nearest location with the appropriate garbage type and bring it for recycling",
						"/info/locations"
					)}
				</div>
				<div className="col-md-4">
					{this.makeCard(
						"Don't want to?",
						"/dont-want-to.png",
						"Learn how to place a request, so that we can take care of everything",
						"/info/collection"
					)}
				</div>
			</div>
		</div>;
	}
}
