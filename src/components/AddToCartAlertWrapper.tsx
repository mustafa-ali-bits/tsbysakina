'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import AddToCartAlert from './AddToCartAlert';

const AddToCartAlertWrapper: React.FC = () => {
  const { alert, closeAlert } = useCart();

  return (
    <AddToCartAlert
      productName={alert?.productName || ''}
      variant={alert?.variant}
      quantity={alert?.quantity || 0}
      show={alert?.show || false}
      productImage={alert?.productImage}
      onClose={closeAlert}
    />
  );
};

export default AddToCartAlertWrapper;
