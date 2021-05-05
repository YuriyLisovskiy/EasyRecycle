import React, {Component} from "react";

/* istanbul ignore next */
class ErrorComponent extends Component {
	render() {
		return <div className="w-100">
			<h2 className="text-center">[{this.props.code}] Sorry :(</h2>
			<h4 className="text-center">{this.props.message}</h4>
		</div>;
	}
}

/* istanbul ignore next */
class NotFound extends Component {
	render() {
		return <ErrorComponent code={404} message={'This page does not exist'}/>
	}
}

/* istanbul ignore next */
class Forbidden extends Component {
	render() {
		return <ErrorComponent code={403} message={'Permission to this page is restricted'}/>
	}
}

let classes = {
	NotFound: NotFound,
	Forbidden: Forbidden
};

export default classes;
