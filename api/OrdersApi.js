import request from 'superagent';
import moment from 'moment';
import Config from '../config';

class OrdersApi {

  getOrdersForUser(userId) {
    const url = `${Config.restApi.baseUrl}/orderData/user/${userId}`;
    return request
      .get(url)
      .query({ts: moment().valueOf()});
  }

  getOrderLineItems(orderId) {
    const url = `${Config.restApi.baseUrl}/orderData/lineItems/${orderId}`;
    return request
      .get(url)
      .query({ts: moment().valueOf()});
  }

  getOrderLineItem(orderId, orderLineItemId) {
    const url = `${Config.restApi.baseUrl}/orderData/lineItem/${orderId}/${orderLineItemId}`;
    return request
      .get(url)
      .query({ts: moment().valueOf()});
  }

  getOrder(orderId) {
    const url = `${Config.restApi.baseUrl}/orderData/${orderId}`;
    return request
      .get(url)
      .query({ts: moment().valueOf()});
  }

  saveOrder(order) {
    const url = `${Config.restApi.baseUrl}/orderData/save`;
    return request
      .post(url)
      .send({ts: moment().valueOf()})
      .send(order);
  }

  // searches for orders using given criteria
  // search criteria should be sent in body, and formatted like this (replace order_id and YYYY-MM-DD with actual values):
  //   { id: order_id, createDateStart: 'YYYY-MM-DD', createDateEnd: 'YYYY-MM-DD' }
  searchOrders(criteria) {
    // alert(`criteria = ${JSON.stringify(criteria, null, 2)}`);
    const url = `${Config.restApi.baseUrl}/orderData/search`;
    return request
      .get(url)
      .query({ts: moment().valueOf()})
      .query(criteria);
  }

}

export default OrdersApi;
