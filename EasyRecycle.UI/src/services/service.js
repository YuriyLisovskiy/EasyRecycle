import BaseService from "./base";

class ServiceService extends BaseService {

    constructor() {
        super();
        this._URL_SERVICES = this._BASE_URL + '/recycle/services';
    }

    // returns:
    //  [
    //    {
    //      "id": <int>,
    //      "garbage_type_name": <string>,
    //      "service_name": <string>,
    //      "price_per_kg": <float>,
    //      "location_id": <int>
    //    }
    //  ]
    getServices = (handler) => {
        return this.get({url: this._URL_SERVICES}, handler);
    }

    // returns:
    //  {
    //    "id": <int>,
    //    "garbage_type_name": <string>,
    //    "service_name": <string>,
    //    "price_per_kg": <float>,
    //    "location_id": <int>
    //  }
    getService = (id, handler) => {
        return this.get({url: this._URL_SERVICES + "/" + id.toString()}, handler);
    }

    // returns:
    //  {
    //    "id": <int>,
    //    "garbage_type_name": <string>,
    //    "service_name": <string>,
    //    "price_per_kg": <float>,
    //    "location_id": <int>
    //  }
    createService = (garbageType, serviceName, pricePerKg, locationId, handler) => {
        let data = {
            garbage_type: garbageType,
            service_name: serviceName,
            price_per_kg: pricePerKg,
            location: locationId
        };
        this.post({
            url: this._URL_SERVICES + '/create',
            data: data
        }, handler);
    }

    // returns:
    //  {
    //    "id": <int>,
    //    "garbage_type_name": <string>,
    //    "service_name": <string>,
    //    "price_per_kg": <float>,
    //    "location_id": <int>
    //  }
    editService = (id, garbageType, serviceName, pricePerKg, locationId, handler) => {
        let data = {};
        if (garbageType !== null)
        {
            data['garbage_type'] = garbageType;
        }

        if (serviceName !== null)
        {
            data['service_name'] = serviceName;
        }

        if (pricePerKg !== null)
        {
            data['price_per_kg'] = pricePerKg;
        }

        if (locationId !== null)
        {
            data['location'] = locationId;
        }

        this.put({
            url: this._URL_SERVICES + "/" + id.toString() + '/manage',
            data: data
        }, handler);
    }

    cancelService = (id, handler) => {
        this.delete_({
            url: this._URL_SERVICES + "/" + id.toString() + '/manage'
        }, handler);
    }
}

export default new ServiceService();
