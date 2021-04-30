import React, {Component} from "react";
import UserService from "../../services/user";
// import TransactionService from "../../services/transaction";
import Errors from "../Errors"
import SpinnerComponent from "../Spinner";

export default class FinishTransactionComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			user: UserService.getCurrentUser(),
            targetUser: undefined,
            loading: true,
            discarded: false,
            confirmed: false,
            confirmLoading: false,
            transaction: {
			    garbage_type: '',
                mass: 0,
                userId: this.props.match.params.id
            }
		};
	}

	componentDidMount() {
	    UserService.getUser(this.props.match.params.id, (data, err) => {
	        if (err)
            {
                alert(err);
            }
	        else
            {
                this.setState({
                    targetUser: data,
                    loading: false
                });
            }
        });
    }

    handleConfirm = () => {
	    this.setState({confirmLoading: true});
	    this.setState({confirmed: true});
	    // TODO: save transaction
        // TransactionService.createTransaction(1,1,1, (data, err) => {
        //     if (err)
        //     {
        //         alert(err);
        //     }
        //     else
        //     {
        //
        //     }
        // });
    }

    handleDiscard = () => {
        this.setState({discarded: true});
    }

    render () {
		if (this.state.user.is_garbage_collector)
		{
		    if (this.state.confirmed)
            {
                // TODO:
                return <h1>Confirmed</h1>
            }

		    if (this.state.discarded)
            {
                // TODO:
                return <h1>Discarded</h1>
            }

			return this.state.loading ? (<SpinnerComponent/>) : (
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card w-50 mx-auto">
                                <h5 className="card-header text-center">Add points to {
                                    this.state.targetUser.first_name && this.state.targetUser.last_name ? (
                                        this.state.targetUser.first_name + " " + this.state.targetUser.last_name
                                    ) : (this.state.targetUser.username)
                                }</h5>
                                <div className="card-body">
                                    <p className="card-text">
                                        With supporting text below as a natural lead-in to additional content.
                                    </p>
                                    <div className="text-center">
                                        <button className="btn btn-success" onClick={this.handleConfirm}>
                                            {this.state.confirmLoading &&
                                            <span className="spinner-border spinner-border-sm"/>} Confirm
                                        </button>
                                        <button className="btn btn-outline-danger ml-2" onClick={this.handleDiscard}>
                                            Discard
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
		}

		return <Errors.Forbidden/>;
	}
}
