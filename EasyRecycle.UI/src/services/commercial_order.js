import BaseService from "./base";

class CommercialOrderService extends BaseService {

	constructor() {
		super();
		this._URL_COMMERCIAL_ORDERS = this._BASE_URL + '/recycle/commercial-orders';
	}

	// returns:
	//  [
	//    {
	//      "id": <int>,
	//      "address": <string>,
	//      "date": <string>,
	//      "garbage_type": <string>,
	//      "mass": <float>,
	//      "status": <string>,
	//      "location_id": <int>,
	//      "user_id": <int>
	//    }
	//  ]
	getOrders = (data) => {
		let url = this._URL_COMMERCIAL_ORDERS;
		let query = [];
		if (data.userPkFilter)
		{
			query.push("user_pk=" + data.userPkFilter.toString());
		}

		if (data.locationFilter)
		{
			query.push("location=true");
		}

		if (data.statusFilter)
		{
			for (let i = 0; i < data.statusFilter.length; i++)
			{
				query.push("status=" + data.statusFilter[i]);
			}
		}

		if (data.orderByStatus)
		{
			query.push("order_by_status=true");
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
	//    "address": <string>,
	//    "date": <string>,
	//    "garbage_type": <string>,
	//    "mass": <float>,
	//    "status": <string>,
	//    "location_id": <int>,
	//    "user_id": <int>
	//  }
	getOrder = (id, handler) => {
		return this.get({url: this._URL_COMMERCIAL_ORDERS + "/" + id.toString()}, handler);
	}

	// returns:
	//  {
	//    "id": <int>,
	//    "address": <string>,
	//    "date": <string>,
	//    "garbage_type": <string>,
	//    "mass": <float>,
	//    "status": <string>,
	//    "location": <int>,
	//    "user": <int>
	//  }
	createOrder = (address, date, garbageType, mass, locationId, userId, handler) => {
		let data = {
			address: address,
			date: date,
			garbage_type: garbageType,
			mass: mass,
			status: 'A',
			location: locationId,
			user: userId
		};
		this.post({
			url: this._URL_COMMERCIAL_ORDERS + '/create',
			data: data
		}, handler);
	}

    // Administration or garbage collector privileges are required.
    // returns:
    //  {
    //    "id": <int>,
    //    "address": <string>,
    //    "date": <string>,
    //    "garbage_type": <string>,
    //    "mass": <string>,
    //    "status": <string>,
    //    "location": <int>,
    //    "user": <int>
    //  }
    editOrder = (inputData) => {
        let data = {};
	    if (inputData.address !== null)
	    {
		    data['address'] = inputData.address;
	    }

        if (inputData.date !== null)
        {
            data['date'] = inputData.date;
        }

        if (inputData.garbageType !== null)
        {
            data['garbage_type'] = inputData.garbageType;
        }

	    if (inputData.mass !== null)
	    {
		    data['mass'] = inputData.mass;
	    }

        if (inputData.status !== null)
        {
            data['status'] = inputData.status;
        }

        if (inputData.locationId !== null)
        {
            data['location'] = inputData.locationId;
        }

        if (inputData.userId !== null)
        {
            data['user'] = inputData.userId;
        }

        this.put({
            url: this._URL_COMMERCIAL_ORDERS + "/" + inputData.id.toString() + '/edit',
            data: data
        }, inputData.handler);
    }

	cancelOrder = (id, handler) => {
		this.delete_({
			url: this._URL_COMMERCIAL_ORDERS + "/" + id.toString() + '/cancel'
		}, handler);
	}
}

export default new CommercialOrderService();
