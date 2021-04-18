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
    //      "user_id": <int>,
    //      "collector_id": <int>
    //    }
    //  ]
    getTransactions = (userPkFilter, collectorPkFilter, handler) => {
        let url = this._URL_TRANSACTIONS;
        let query = "";
        if (userPkFilter)
        {
            query += "user_pk=" + userPkFilter.toString();
        }

        if (collectorPkFilter)
        {
            query += "collector_pk=" + collectorPkFilter.toString();
        }

        if (query.length > 0)
        {
            url += "?" + query;
        }

        return this.get({url: url}, handler);
    }

    // returns:
    //  {
    //    "id": <int>,
    //    "datetime": <string>,
    //    "garbage_type": <string>,
    //    "points": <int>,
    //    "user_id": <int>,
    //    "collector_id": <int>
    //  }
    getTransaction = (id, handler) => {
        return this.get({url: this._URL_TRANSACTIONS + "/" + id.toString()}, handler);
    }

    // returns:
    //  {
    //    "id": <int>,
    //    "datetime": <string>,
    //    "garbage_type": <string>,
    //    "points": <int>,
    //    "user_id": <int>,
    //    "collector_id": <int>
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
