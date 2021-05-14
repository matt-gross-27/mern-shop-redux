import React, { useEffect } from 'react';
import CartItem from '../CartItem';
import './style.css';
import Auth from '../../utils/auth';
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from '../../utils/actions';
import { useStoreContext } from '../../utils/GlobalState';
import { idbPromise } from "../../utils/helpers";
import { QUERY_CHECKOUT } from '../../utils/queries';
import { useLazyQuery } from '@apollo/react-hooks';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

function Cart() {
  const [state, dispatch] = useStoreContext();

  useEffect(() => {
    async function getCart() {
      const cart = await idbPromise('cart', 'get');
      dispatch({
        type: ADD_MULTIPLE_TO_CART,
        products: [...cart]
      });
    }

    if (!state.cart.length) {
      getCart();
    }
  }, [state.cart.length, dispatch]);

  function toggleCart() {
    dispatch({ type: TOGGLE_CART });
  }

  function calculateTotal() {
    let sum = 0;
    state.cart.forEach(item => {
      sum += item.price * item.purchaseQuantity;
    });

    if (!sum) {
      return '$...'
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(sum);
  }

  // useLazyQuery HOOK for onclick queries (vs useQuery for on render);
  const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);

  function submitCheckout() {
    const productIds = [];

    state.cart.forEach(item => {
      for (let i = 0; i < item.purchaseQuantity; i++) {
        productIds.push(item._id);
      }
    });

    getCheckout({
      variables: { products: productIds }
    });
  }

  useEffect(() => {
    if (data) {
      stripePromise.then(res => {
        res.redirectToCheckout({ sessionId: data.checkout.session })
      })
    }
  }, [data]);

  if (!state.cartOpen) {
    return (
      <div className="cart-closed" onClick={toggleCart}>
        <span
          role="img"
          aria-label="open cart"
        >🛒</span>
      </div>
    )
  }

  return (
    <div className="cart">
      <span onClick={toggleCart} className="close" role="img" aria-label="close cart">❌</span>
      <h2>Shopping Cart</h2>

      {state.cart.length ? (
        <div>
          {state.cart.map(item => (
            <CartItem key={item._id} item={item} />
          ))}

          <strong className="cart-total">
            Total: {calculateTotal()}
          </strong>
          {
            Auth.loggedIn() ?
              <button className="checkout" onClick={submitCheckout}>
                Checkout
              </button>
              :
              <p className="checkout">(log in to check out)</p>
          }
        </div>
      ) : (
        <h4>
          <span role="img" aria-label="shocked">
            😱{' '}
          </span>
          No Items!
        </h4>
      )}
    </div>
  );
}

export default Cart;