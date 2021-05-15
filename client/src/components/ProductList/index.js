import React, { useEffect } from "react";
import { useQuery } from '@apollo/react-hooks';
import ProductItem from "../ProductItem";
import { QUERY_PRODUCTS } from "../../utils/queries";
import spinner from "../../assets/spinner.gif"
import { useSelector, useDispatch } from 'react-redux';
import { UPDATE_PRODUCTS } from "../../utils/actions";
import { idbPromise } from '../../utils/helpers';

function ProductList() {
  const dispatch = useDispatch();
  const state = useSelector(state => state);

  const { currentCategory } = state;

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {
    // once/if data is returned from QUERY_PRODUCTS
    if (data) {
      // store product data in global state
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products
      });

      // save each product to IndexedDB `products` Store using helper function
      data.products.forEach(product => {
        idbPromise('products', 'put', product);
      });
    // if we have no data and no loading, get products from iDB instead of useQuery
    } else if (!loading) {
      idbPromise('products', 'get').then(products => {
        // set global state for products to iDB response
        dispatch({
          type: UPDATE_PRODUCTS,
          products: products
        });
      });
    }
  }, [data, loading, dispatch]);

  function filterProducts() {
    if (!currentCategory) {
      return state.products;
    }

    return state.products.filter(product => product.category._id === currentCategory);
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {state.products.length ? (
        <div className="flex-row">
            {filterProducts().map(product => (
                <ProductItem
                  key= {product._id}
                  _id={product._id}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  quantity={product.quantity}
                />
            ))}
        </div>
      ) : (
        <h3>You haven&apos;t added any products yet!</h3>
      )}
      { loading ? 
      <img src={spinner} alt="loading" />: null}
    </div>
  );
}

export default ProductList;
