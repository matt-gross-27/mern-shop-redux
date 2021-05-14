import React from "react";
import { Link } from "react-router-dom";

import { useQuery } from '@apollo/react-hooks';
import { QUERY_USER } from "../utils/queries";

function OrderHistory() {
  const { data } = useQuery(QUERY_USER);
  let user;

  if (data) {
    user = data.user;
  }

  const mergeLikeProducts = (products) => {
    const result = [];
    for (let i = 0; i < products.length; i++) {
    const duplicateItem = result.find(({ _id }) => products[i]._id === _id);
      if (duplicateItem) {
        duplicateItem.purchaseQty ++;
      } else {
        result.push({
          ...products[i], 
          purchaseQty: 1
        });
      }
    }
    return result;
  };

  const orderTotal = (products) => {
    return products.map(x => x.price).reduce((a, b) => a + b).toFixed(2);
  }

  return (
    <>
      <div className="container my-1">
        <Link to="/">
          ← Back to Products
          </Link>

        {user ? (
          <>
            <h2>Order History for {user.firstName} {user.lastName}</h2>
            {user.orders.map((order) => (
              <div key={order._id} className="my-2">
                <h4 style={{overflowX: 'scroll', flexWrap: 'none'}}>Order#_{order._id}</h4>
                <h5>Total: ${orderTotal(order.products)}</h5>
                <h5>Date: {new Date(parseInt(order.purchaseDate)).toLocaleDateString()}</h5>
                <div className="flex-row">
                  {mergeLikeProducts(order.products).map(({ _id, image, name, price, purchaseQty }, index) => (
                    <div key={index} className="card flex-column px-1 py-1">
                      <Link to={`/products/${_id}`}>
                        <img
                          alt={name}
                          src={`/images/${image}`}
                        />
                        <p>{name}</p>
                      </Link>
                      <div>
                        <div className="flex-row space-between">Price: <span>${price}</span></div>
                        <div className="flex-row space-between">Quantity:<span>{purchaseQty}</span></div>
                        <div className="bottom-line"></div>
                        <div className="flex-row space-between">Subtotal: <span>${(price * purchaseQty).toFixed(2)}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
                <hr />
              </div>
            ))}
          </>
        ) : null}

      </div>

    </>)

};

export default OrderHistory;
