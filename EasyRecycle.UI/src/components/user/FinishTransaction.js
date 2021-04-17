import React, {Component} from "react";
import UserService from "../../services/user";
import Errors from "../Errors"

export default class FinishTransactionComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: UserService.getCurrentUser()
        };
    }

    render () {
        if (this.state.user.is_garbage_collector)
        {
            return <h1>TODO: Increase points for [user]!</h1>;
        }

        return <Errors.Forbidden/>;
    }
}
