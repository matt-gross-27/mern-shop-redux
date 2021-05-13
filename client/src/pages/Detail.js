import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';
import { QUERY_PRODUCTS } from "../utils/queries";
import spinner from '../assets/spinner.gif'
import Cart from '../components/Cart';
import { useStoreContext } from "../utils/GlobalState";
import { REMOVE_FROM_CART, UPDATE_CART_QUANTITY, ADD_TO_CART, UPDATE_PRODUCTS } from "../utils/actions";
import { idbPromise } from "../utils/helpers";


function Detail() {
  const [state, dispatch] = useStoreContext();
  const { cart, products } = state;
  
  const { id: idParam } = useParams();

  const [currentProduct, setCurrentProduct] = useState({});

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {
    // products already in global state
    if (products.length) {
      setCurrentProduct(products.find(product => product._id === idParam));
    // retrieved from the server
    } else if (data) {
      // save to global state
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products
      });
      // save to idb
      data.products.forEach(product => {
        idbPromise('products', 'put', product);
      });
    // get cache from idb server ain't serving
    } else if (!loading) {
      idbPromise('products', 'get')
        .then(indexedProducts => {
          // save idb products to global state
          dispatch({
            type: UPDATE_PRODUCTS,
            products: indexedProducts
          });
        });
    }
  }, [products, data, loading, dispatch, idParam]);

  const addToCart = () => {
    const itemInCart = cart.find(cartItem => cartItem._id === idParam);
    if (itemInCart) {
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: idParam,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
    } else {
      dispatch({
        type: ADD_TO_CART,
        product: { ...currentProduct, purchaseQuantity: 1 }
      });
    }
  };

  const removeFromCart = () => {
    dispatch({
      type: REMOVE_FROM_CART,
      _id: idParam
    })
  }

  return (
    <>
      {currentProduct ? (
        <div className="container my-1">
          <Link to="/">
            ← Back to Products
          </Link>

          <h2>{currentProduct.name}</h2>

          <p>
            {currentProduct.description}
          </p>

          <p>
            <strong>Price:</strong>
            ${currentProduct.price}
            {" "}
            <button onClick={addToCart}>
              Add to Cart
            </button>
            {cart.find(p => p._id === idParam) &&
              <button onClick={removeFromCart}>
                Remove from Cart
              </button>
            }
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {
        loading ? <img src={spinner} alt="loading" /> : null
      }

      <Cart />
    </>
  );
};

export default Detail;
