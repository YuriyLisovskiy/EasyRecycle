import BaseService from "./base";

class CommercialRequestService extends BaseService {

	constructor() {
		super();
		this._URL_COMMERCIAL_REQUESTS = this._BASE_URL + '/recycle/commercial-requests';
	}

	// returns:
	//  [
	//    {
	//      "id": <int>,
	//      "date": <string>,
	//      "garbage_type": <string>,
	//      "status": <string>,
	//      "service_id": <int>,
	//      "user_id": <int>
	//    }
	//  ]
	getCommercialRequests = (userPkFilter, servicePkFilter, handler) => {
		let url = this._URL_COMMERCIAL_REQUESTS;
		let query = "";
		if (userPkFilter)
		{
			query += "user_pk=" + userPkFilter.toString();
		}

		if (servicePkFilter)
		{
			query += "service_pk=" + servicePkFilter.toString();
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
	//    "date": <string>,
	//    "garbage_type": <string>,
	//    "status": <string>,
	//    "service_id": <int>,
	//    "user_id": <int>
	//  }
	getCommercialRequest = (id, handler) => {
		return this.get({url: this._URL_COMMERCIAL_REQUESTS + "/" + id.toString()}, handler);
	}

	// returns:
	//  {
	//    "id": <int>,
	//    "date": <string>,
	//    "garbage_type": <string>,
	//    "status": <string>,
	//    "service": <int>,
	//    "user": <int>
	//  }
	createCommercialRequest = (date, garbageType, serviceId, userId, handler) => {
		let data = {
			date: date,
			garbage_type: garbageType,
			status: 'Q',
			service: serviceId,
			user: userId
		};
		this.post({
			url: this._URL_COMMERCIAL_REQUESTS + '/create',
			data: data
		}, handler);
	}

    // Administration or garbage collector privileges are required.
    // returns:
    //  {
    //    "id": <int>,
    //    "date": <string>,
    //    "garbage_type": <string>,
    //    "status": <string>,
    //    "service": <int>,
    //    "user": <int>
    //  }
    editCommercialRequest = (id, date, garbageType, status, serviceId, userId, handler) => {
        let data = {};
        if (date !== null)
        {
            data['date'] = date;
        }

        if (garbageType !== null)
        {
            data['garbage_type'] = garbageType;
        }

        if (status !== null)
        {
            data['status'] = status;
        }

        if (serviceId !== null)
        {
            data['service'] = serviceId;
        }

        if (userId !== null)
        {
            data['user'] = userId;
        }

        this.put({
            url: this._URL_COMMERCIAL_REQUESTS + "/" + id.toString() + '/edit',
            data: data
        }, handler);
    }

	cancelCommercialRequest = (id, handler) => {
		this.delete_({
			url: this._URL_COMMERCIAL_REQUESTS + "/" + id.toString() + '/cancel'
		}, handler);
	}
}

export default new CommercialRequestService();
