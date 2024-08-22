import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPalButton = ({ price, onSuccess }) => {
  const createOrder = (data, actions) => {
    // Validate form before creating order

    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: price, // Use the price prop as the value
            },
            merchant_name: "UniDorm", // Set the name of the store
          },
        ],
      })
      .then((orderId) => {
        // Return the order ID
        return orderId;
      });
  };

  const onApprove = (data, actions) => {
    const orderId = data.orderID;
    console.log("Order ID:", orderId);
    return actions.order.capture().then((details) => {
      console.log("Payment Approved:", details);
      onSuccess(orderId); // Update parent component with success state
    });
  };

  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "Adwl6ZiENEsYPbFB0YdOXEqJwx8FLJYdGZgdPqXYSCjwcYfI8X0Wb1B9uaMMyffYEF9PF3m2U5ahojFk",
      }}
    >
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        style={{
          layout: "horizontal",
          color: "blue",
          shape: "rect",
          label: "paypal",
          fundingicons: false, // Hide debit or credit card button
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
