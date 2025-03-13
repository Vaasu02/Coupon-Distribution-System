import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';

import { CouponProvider } from './context/CouponContext';
import Layout from './components/layout/Layout';
import CouponContainer from './components/coupon/CouponContainer';

const App = () => {
  return (
    <CouponProvider>
      <Layout>
        <CouponContainer />
      </Layout>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </CouponProvider>
  );
};

export default App;
