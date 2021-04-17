import React, {Component} from "react";

export default class HowToRecycleComponent extends Component {

	constructor(props) {
		super(props);
		this.placeImgLeft = false;
		this.garbageTypesData = [
			{
				text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vel eleifend ante. Duis efficitur auctor dui eu tempus. Nullam egestas libero a urna euismod, nec sagittis sapien facilisis. Nulla efficitur nibh viverra faucibus iaculis. Suspendisse fringilla commodo lectus in vehicula. Suspendisse accumsan quis erat et tincidunt. Donec ullamcorper semper auctor. Vivamus molestie dui a dolor fringilla, ac ornare urna accumsan. Nam tincidunt, lacus suscipit hendrerit gravida, urna lorem laoreet arcu, id pharetra tellus ex et justo. Phasellus eget tristique nulla. Duis nisl odio, euismod eu sapien id, varius faucibus leo.",
				image: "/plastic-waste.png",
				placeImgLeft: false
			},
			{
				text: "Curabitur sed mauris gravida, tincidunt nunc at, facilisis tortor. Interdum et malesuada fames ac ante ipsum primis in faucibus. In nec nunc feugiat, volutpat diam quis, euismod nisi. Sed sed tincidunt mauris, quis condimentum orci. Maecenas mollis commodo orci in tristique. Nullam molestie felis enim, id suscipit mi condimentum ut. Vivamus elementum, lectus eget blandit congue, dui turpis tincidunt odio, non pretium turpis eros fringilla dolor. Sed dictum blandit turpis, sit amet tempus ligula commodo sit amet. Donec fermentum massa eget convallis ornare. Mauris ex dui, venenatis ac dolor at, efficitur porta magna. Suspendisse maximus lobortis arcu, id tincidunt mauris auctor eget.",
				image: "/paper-waste.png",
				placeImgLeft: true
			},
			{
				text: "Vestibulum sed laoreet odio, quis dictum orci. Fusce vitae mauris dictum, tristique nulla ac, posuere leo. Morbi tincidunt justo quam, eget aliquet ante tempor at. Nam et orci est. Maecenas eu mi et nisl ultricies rutrum vel non odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Pellentesque cursus mi a felis fringilla volutpat. Aliquam a sollicitudin neque. Donec mattis arcu in mi consectetur pulvinar. Nunc ac egestas mi. Vestibulum quis ipsum sed mauris pretium aliquet. Suspendisse at lectus libero. Curabitur vitae ultrices libero.",
				image: "/glass-waste.png",
				placeImgLeft: false
			},
		];
	}

	_makeDataRow = (text, imagePath, placeImgLeft) => {
		let imageDiv = <div className="col-md-3 text-center">
			<img alt="Garbage Type" src={imagePath} className="img-thumbnail bg-transparent border-0"/>
		</div>;
		let textDiv = <div className="col-md-9 p-3" style={{backgroundColor: '#fff', borderRadius: '15px'}}>{text}</div>;
		if (placeImgLeft)
		{
			return <div className="row my-3">{imageDiv}{textDiv}</div>;
		}

		return <div className="row my-3">{textDiv}{imageDiv}</div>;
	}

	render () {
		return <div>
			<div className="row mb-3">
				<div className="col-md-12">
					<h2 className="w-100 text-center">How to recycle different kinds of garbage?</h2>
				</div>
			</div>
			{this.garbageTypesData.map(data => this._makeDataRow(data.text, data.image, data.placeImgLeft))}
		</div>;
	}
}
