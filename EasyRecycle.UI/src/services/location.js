import BaseService from "./base";

class LocationService extends BaseService {

    constructor() {
        super();
        this._URL_LOCATIONS = this._BASE_URL + '/recycle/locations';
    }

    // returns:
    //  [
    //    {
    //      "id": <int>,
    //      "address": <string>,
    //      "open_time": <string>,
    //      "close_time": <string>,
    //      "owner_id": <int>
    //    }
    //  ]
    getLocations = (handler) => {
        return this.get({url: this._URL_LOCATIONS}, handler);
    }

    // returns:
    //  {
    //    "id": <int>,
    //    "address": <string>,
    //    "open_time": <string>,
    //    "close_time": <string>,
    //    "owner_id": <int>
    //  }
    getLocation = (id, handler) => {
        return this.get({url: this._URL_LOCATIONS + "/" + id.toString()}, handler);
    }

    // returns:
    //  {
    //    "id": <int>,
    //    "address": <string>,
    //    "open_time": <string>,
    //    "close_time": <string>,
    //    "owner": <int>
    //  }
    createLocation = (address, openTime, closeTime, ownerId, handler) => {
        let data = {
            address: address,
            open_time: openTime,
            close_time: closeTime,
            owner: ownerId
        };
        this.post({
            url: this._URL_LOCATIONS + '/create',
            data: data
        }, handler);
    }

    // returns:
    //  {
    //    "id": <int>,
    //    "address": <string>,
    //    "open_time": <string>,
    //    "close_time": <string>,
    //    "owner": <int>
    //  }
    editLocation = (id, address, openTime, closeTime, ownerId, handler) => {
        let data = {};
        if (address !== null)
        {
            data['address'] = address;
        }

        if (openTime !== null)
        {
            data['open_time'] = openTime;
        }

        if (closeTime !== null)
        {
            data['close_time'] = closeTime;
        }

        if (ownerId !== null)
        {
            data['owner'] = ownerId;
        }

        this.put({
            url: this._URL_LOCATIONS + "/" + id.toString() + '/manage',
            data: data
        }, handler);
    }

    cancelLocation = (id, handler) => {
        this.delete_({
            url: this._URL_LOCATIONS + "/" + id.toString() + '/manage'
        }, handler);
    }
}

export default new LocationService();
