import React from 'react';
import { useStoreContext } from '../../utils/GlobalState';
import { REMOVE_FROM_CART, UPDATE_CART_QUANTITY } from '../../utils/actions';
import { idbPromise } from '../../utils/helpers';

function CartItem({ item }) {
  const [, dispatch] = useStoreContext();

  const removeFromCart = () => {
    dispatch({
      type: REMOVE_FROM_CART,
      _id: item._id
    });
    idbPromise('cart', 'delete', { ...item });
  };

  const handleChangeQuantity = (e) => {
    const value = e.target.value;

    if (value === '0') {
      dispatch({
        type: REMOVE_FROM_CART,
        _id: item._id
      });
      idbPromise('cart', 'delete', { ...item });
    } else {
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: item._id,
        purchaseQuantity: Math.abs(parseInt(value))
      });
      idbPromise('cart', 'put', { ...item, purchaseQuantity: parseInt(value) });
    }
  };

  const handleBlurQuantity = (e) => {
    const value = e.target.value;

    if (value === '') {
      dispatch({
        type: REMOVE_FROM_CART,
        _id: item._id
      });
      idbPromise('cart', 'delete', { ...item });
    }
  }

  return (
    <div className="flex-row cart-item">
      <div className="item-name">{item.name}, ${item.price}</div>
      <img
        src={`/images/${item.image}`}
        alt=""
      />
      <div className="cart-item-details">
        <div className="d-flex">
          <span>Qty:</span>
          <input
            type="number"
            min="0"
            placeholder="1"
            value={item.purchaseQuantity}
            onChange={handleChangeQuantity}
            onBlur={handleBlurQuantity}
          />
          <span onClick={removeFromCart} role="img" aria-label="trash">
            🗑
            </span>
        </div>
        <hr />
      </div>
    </div>
  );
}

export default CartItem;