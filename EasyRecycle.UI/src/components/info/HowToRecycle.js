import React, {Component} from "react";

export default class HowToRecycleComponent extends Component {

	constructor(props) {
		super(props);
		this.placeImgLeft = false;
		this.garbageTypesData = [
			{
				text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vel eleifend ante. Duis efficitur auctor dui eu tempus. Nullam egestas libero a urna euismod, nec sagittis sapien facilisis. Nulla efficitur nibh viverra faucibus iaculis. Suspendisse fringilla commodo lectus in vehicula. Suspendisse accumsan quis erat et tincidunt. Donec ullamcorper semper auctor. Vivamus molestie dui a dolor fringilla, ac ornare urna accumsan. Nam tincidunt, lacus suscipit hendrerit gravida, urna lorem laoreet arcu, id pharetra tellus ex et justo. Phasellus eget tristique nulla. Duis nisl odio, euismod eu sapien id, varius faucibus leo.",
				image: "/organic-waste.png",
				placeImgLeft: false
			},
			{
				text: "Suspendisse potenti. Vivamus consequat tincidunt mattis. In nulla felis, aliquet eu arcu nec, mollis eleifend ex. Sed mi dui, rhoncus in dolor at, blandit malesuada dui. Aenean at viverra purus. Nulla condimentum sit amet quam in molestie. Donec iaculis purus nec interdum tristique. Phasellus sit amet egestas turpis. Maecenas imperdiet mattis lorem id blandit. Sed a orci turpis. Praesent gravida sem ligula, sit amet vehicula orci feugiat eu. Mauris vel aliquet ipsum. Ut euismod enim lobortis, fringilla nulla id, lacinia magna. Donec facilisis ultrices augue, et vulputate arcu vulputate vitae.",
				image: "/glass-waste.png",
				placeImgLeft: true
			},
			{
				text: "Nulla porttitor mauris non molestie accumsan. Nunc pharetra ligula nec lacus vehicula vehicula. Phasellus commodo orci eros, sed sodales enim commodo eu. Mauris eget felis finibus, pretium quam quis, facilisis tellus. Aliquam porta id ipsum ullamcorper semper. Nulla id quam et neque dignissim pellentesque id molestie tellus. Mauris a eros ultrices, finibus est sit amet, tincidunt sapien. Fusce pharetra turpis nisi. Nam in fringilla massa, quis venenatis ex. Cras odio eros, venenatis vel malesuada in, aliquam ut neque. Mauris mi arcu, mollis luctus efficitur a, finibus id sem. Pellentesque mauris eros, malesuada id nibh a, tempus interdum est. In ullamcorper massa eget diam tristique iaculis. Pellentesque eget luctus est. Donec pellentesque purus vel mauris convallis, ut ultrices mi feugiat.",
				image: "/metal-waste.png",
				placeImgLeft: false
			},
			{
				text: "Curabitur sed mauris gravida, tincidunt nunc at, facilisis tortor. Interdum et malesuada fames ac ante ipsum primis in faucibus. In nec nunc feugiat, volutpat diam quis, euismod nisi. Sed sed tincidunt mauris, quis condimentum orci. Maecenas mollis commodo orci in tristique. Nullam molestie felis enim, id suscipit mi condimentum ut. Vivamus elementum, lectus eget blandit congue, dui turpis tincidunt odio, non pretium turpis eros fringilla dolor. Sed dictum blandit turpis, sit amet tempus ligula commodo sit amet. Donec fermentum massa eget convallis ornare. Mauris ex dui, venenatis ac dolor at, efficitur porta magna. Suspendisse maximus lobortis arcu, id tincidunt mauris auctor eget.",
				image: "/paper-waste.png",
				placeImgLeft: true
			},
			{
				text: "Nulla sed cursus ex, sed consectetur nisl. Vestibulum at elit iaculis, porta lorem vel, pretium ligula. Morbi suscipit neque ac vulputate interdum. Nam rutrum purus eu arcu tempor, sed ultrices nisi lobortis. Phasellus cursus rhoncus leo, sit amet iaculis ligula iaculis nec. Sed congue, dui in eleifend dictum, diam mauris aliquet ex, at ultricies eros lorem in magna. Curabitur nec venenatis leo.",
				image: "/plastic-waste.png",
				placeImgLeft: false
			},
		];
	}

	makeRow = (text, imagePath, placeImgLeft) => {
		let imageDiv = <div className="col-md-3 text-center">
			<img alt="Garbage Type" src={imagePath} className="img-thumbnail bg-transparent border-0"/>
		</div>;
		let textDiv = <div className="col-md-9 p-3" style={{backgroundColor: '#fff', borderRadius: '15px'}}>{text}</div>;
		if (placeImgLeft) {
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
			{this.garbageTypesData.map(data => this.makeRow(data.text, data.image, data.placeImgLeft))}
		</div>;
	}
}
