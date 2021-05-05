import BaseService from "./base";

class TransactionService extends BaseService {

    constructor() {
        super();
        this._URL_TRANSACTIONS = this._BASE_URL + '/recycle/transactions';
    }

    // returns:
    //  [
    //    {
    //      "id": <int>,
    //      "datetime": <string>,
    //      "garbage_type": <string>,
    //      "points": <int>,
    //      "mass": <float>,
    //      "user_id": <int>,
    //      "collector_id": <int>
    //    }
    //  ]
    getTransactions = (data) => {
        let url = this._URL_TRANSACTIONS;
        let query = [];
        if (data.userPkFilter)
        {
            query.push("user_pk=" + data.userPkFilter.toString());
        }

        if (data.collectorPkFilter)
        {
            query.push("collector_pk=" + data.collectorPkFilter.toString());
        }

        if (data.page)
        {
            query.push("page=" + data.page.toString());
        }

        if (query.length > 0)
        {
            url += "?" + query.join('&');
        }

        return this.get({url: url}, data.handler);
    }

    // returns:
    //  {
    //    "id": <int>,
    //    "datetime": <string>,
    //    "garbage_type": <string>,
    //    "points": <int>,
    //    "mass": <float>,
    //    "user_id": <int>,
    //    "collector_id": <int>
    //  }
    getTransaction = (id, handler) => {
        return this.get({url: this._URL_TRANSACTIONS + "/" + id.toString()}, handler);
    }

    // returns:
    //  {
    //    "id": <int>,
    //    "garbage_type": <string>,
    //    "mass": <float>,
    //    "user": <int>
    //  }
    createTransaction = (garbageType, mass, userId, handler) => {
        let data = {
            garbage_type: garbageType,
            mass: mass,
            user: userId
        };
        this.post({
            url: this._URL_TRANSACTIONS + '/create',
            data: data
        }, handler);
    }

    cancelTransaction = (id, handler) => {
        this.delete_({
            url: this._URL_TRANSACTIONS + "/" + id.toString() + '/delete'
        }, handler);
    }
}

export default new TransactionService();
