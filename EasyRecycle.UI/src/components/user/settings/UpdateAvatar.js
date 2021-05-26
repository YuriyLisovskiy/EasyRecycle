import React, {Component} from "react";
import PropTypes from "prop-types";
import {drawAvatar, getErrorMessage, random_sequence} from "../../../utils/misc";

export default class UpdateAvatarComponent extends Component {

	constructor(props) {
		super(props);
		this.userService = this.props.userService;
		this.state = {
			selectedFile: undefined,
			isSaved: true,
			fileError: undefined,
			selectedImageLink: undefined,
			user: this.props.user,
			currentColor: this.props.user.avatar_info.color,
			currentPixels: this.props.user.avatar_info.pixels
		};
		this.avatarCanvas = React.createRef();
	}

	componentDidMount() {
		this.redrawAvatarPreview(this.state.user.avatar_info);
	}

	redrawAvatarPreview = (avatarInfo) => {
		drawAvatar(this.avatarCanvas, avatarInfo.pixels, avatarInfo.color, 250);
	}

	/* istanbul ignore next */
	onClickRegenerateImage = (_) => {
		let pixels = random_sequence(0, 10, 25);
		this.setState({
			currentPixels: pixels,
			isSaved: false
		});
		this.redrawAvatarPreview({
			pixels: pixels,
			color: this.state.currentColor
		});
	}

	/* istanbul ignore next */
	onClickRegenerateColor = (_) => {
		let color = "#" + Math.floor(Math.random() * 16777215).toString(16);
		this.setState({
			currentColor: color,
			isSaved: false
		});
		this.redrawAvatarPreview({
			pixels: this.state.currentPixels,
			color: color
		});
	}

	/* istanbul ignore next */
	onChangeValue = (e) => {
		if (e.target.files.length > 0) {
			let file = e.target.files[0];
			this.setState({
				selectedFile: file,
				isSaved: false,
				fileError: undefined,
				selectedImageLink: URL.createObjectURL(file)
			});
		}
	}

	/* istanbul ignore next */
	onClickSave = (_) => {
		if (!this.state.isSaved) {
			let avatarInfo = {
				pixels: this.state.currentPixels,
				color: this.state.currentColor
			}
			this.userService.updateAvatar(
				this.state.user.id,
				this.state.currentPixels, this.state.currentColor,
				(data, err) => {
					if (err) {
						alert(getErrorMessage(err));
					}
					else {
						let user = this.state.user;
						user.avatar_info = avatarInfo;
						this.userService._setCurrentUser(user);
						this.setState({isSaved: true});
						this.props.updateAvatar(avatarInfo);
					}
				}
			);
		}
	}

	render() {
		return <div className="row">
			<div className="col-md-4"/>
			<div className="col-md-4 text-center mb-4">
				<button className="btn btn-primary mx-1" onClick={this.onClickRegenerateImage}>
					<i className="fa fa-refresh" aria-hidden="true"/> Image
				</button>
				<button className="btn btn-primary mx-1" onClick={this.onClickRegenerateColor}>
					<i className="fa fa-refresh" aria-hidden="true"/> Color
				</button>
			</div>
			<div className="col-md-4"/>
			<div className="col-md-12 text-center">
				<canvas className="img-thumbnail mx-auto d-block" ref={this.avatarCanvas}/>
			</div>
			<div className="col-md-4"/>
			<div className="col-md-4 text-center mt-4">
				<button className={"btn btn-block btn-" + (this.state.isSaved ? "success" : "warning")}
				        onClick={this.onClickSave}
				        disabled={this.state.isSaved}>
					<div className="d-inline">
						<i className={"fa " + (
							this.state.isSaved ? "fa-check-circle-o" : "fa-exclamation-triangle"
						)}
						   aria-hidden="true"/>
					</div>
					<div className="d-inline ml-2">Save</div>
				</button>
			</div>
			<div className="col-md-4"/>
		</div>;
	}
}

UpdateAvatarComponent.propTypes = {
	user: PropTypes.object,
	updateAvatar: PropTypes.func
}
