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
	//      "price_per_kg": <float>,
	//      "garbage_types": [<string>, ...],
	//      "owner_id": <int>
	//    }
	//  ]
	getLocations = (page, handler) => {
		let query = [];
		if (page)
		{
			query.push("page=" + page.toString());
		}

		return this.get({url: this._URL_LOCATIONS + (
			query.length > 0 ? ("?" + query.join('&')) : ""
		)}, handler);
	}

	// returns:
	//  {
	//    "id": <int>,
	//    "address": <string>,
	//    "open_time": <string>,
	//    "close_time": <string>,
	//    "price_per_kg": <float>,
	//    "garbage_types": [<string>, ...],
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
	//    "price_per_kg": <float>,
	//    "garbage_types": [<string>, ...],
	//    "owner": <int>
	//  }
	createLocation = (address, openTime, closeTime, pricePerKg, garbageTypes, ownerId, handler) => {
		let data = {
			address: address,
			open_time: openTime,
			close_time: closeTime,
			price_per_kg: pricePerKg,
			garbage_types: garbageTypes,
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
	//    "price_per_kg": <float>,
	//    "garbage_types": [<string>, ...],
	//    "owner": <int>
	//  }
	editLocation = (id, address, openTime, closeTime, pricePerKg, garbageTypes, ownerId, handler) => {
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

		if (pricePerKg !== null)
		{
			data['price_per_kg'] = pricePerKg;
		}

		if (garbageTypes !== null)
		{
			data['garbage_types'] = garbageTypes;
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

	deleteLocation = (id, handler) => {
		this.delete_({
			url: this._URL_LOCATIONS + "/" + id.toString() + '/manage'
		}, handler);
	}
}

export default new LocationService();
