import React, { useEffect } from 'react';
import Jumbotron from '../components/Jumbotron';
import { useMutation } from '@apollo/react-hooks';
import { ADD_ORDER } from '../utils/mutations';
import { idbPromise } from '../utils/helpers';
// import { useStoreContext } from '../utils/GlobalState';



function Success() {
  const [addOrder] = useMutation(ADD_ORDER);

  useEffect(() => {
    async function saveOrder() {
      const cart = await idbPromise('cart', 'get');
      let products = [];
      cart.forEach(item => {
        for (let i = 0; i < item.purchaseQuantity; i++) {
          products.push(item._id);
        }
      })

      if (products.length) {
        const { data } = await addOrder({
          variables: { products }
        });

        const productData = data.addOrder.products;

        productData.forEach(item => {
          idbPromise('cart', 'delete', item);
        });
      }

      setTimeout(() => {
        window.location.assign('/')
      }, 4000);
    }
    
    saveOrder();
  },[addOrder])

  return (
    <div>
      <Jumbotron>
        <h1>Success!</h1>
        <h2>Thank you for your purchase!</h2>
        <h3>You will now be redirected back to the home page</h3>
      </Jumbotron>
    </div>
  );
};

export default Success;