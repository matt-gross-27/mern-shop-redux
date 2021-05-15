import React, { useEffect } from 'react';
import Jumbotron from '../components/Jumbotron';

function Cancel() {
  useEffect(() => {
    setTimeout(() => {
      window.location.assign('/')
    }, 4000);
  });

  return (
    <div>
      <Jumbotron>
        <h1>Order Canceled 😢</h1>
        < hr />
        <h2>No Worries! Your Cart is saved if you change your mind.</h2>
        <h3>You will now be redirected back to the home page</h3>
      </Jumbotron>
    </div>
  );
}

export default Cancel;