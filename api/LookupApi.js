import request from 'superagent';
import moment from 'moment';
import Config from '../config';

class LookupApi {

  getColors() {
    const url = `${Config.restApi.baseUrl}/lookupData/colors`;
    return request
      .get(url)
      .query({ts: moment().valueOf()});
  }

  getProductTypes() {
    const url = `${Config.restApi.baseUrl}/lookupData/productTypes`;
    return request
      .get(url)
      .query({ts: moment().valueOf()});
  }

  getProductsForProductType(productTypeId) {
    const url = `${Config.restApi.baseUrl}/lookupData/products/${productTypeId}`;
    return request
      .get(url)
      .query({ts: moment().valueOf()});
  }

}

export default LookupApi;
