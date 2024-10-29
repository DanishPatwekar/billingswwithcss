import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const Cart = ({ cartItems, onDecreaseQuantity, onIncreaseQuantity, onRemoveItem }) => {
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const navigate = useNavigate(); // Hook to navigate to another route

  // Function to generate the invoice
  const generateInvoice = async (invoiceData) => {
    try {
      const response = await fetch('http://localhost:8080/api/invoices', {  // Update with your backend URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers if needed, such as Authorization
        },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      const data = await response.json();
      console.log('Invoice generated successfully:', data);
      // Handle the response data as needed, e.g., display a confirmation message
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('There was an error generating the invoice. Please try again.');
    }
  };

  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in the cart.</p>
      ) : (
        cartItems.map((item) => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3>{item.name}</h3>
              <p>Price: ${item.price}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button onClick={() => onDecreaseQuantity(item.id)}>-</button>
              <span style={{ margin: '0 10px' }}>{item.quantity}</span>
              <button onClick={() => onIncreaseQuantity(item.id)}>+</button>
              <button onClick={() => onRemoveItem(item.id)} style={{ marginLeft: '10px' }}>x</button>
            </div>
          </div>
        ))
      )}
      <h3>Total: ${total.toFixed(2)}</h3>
      
      {/* PayPal Checkout Button */}
      {cartItems.length > 0 && (
        <PayPalScriptProvider options={{ "client-id": "AazsSDNx2He7HiR5Vv5xFWu9QVDvoEVnBJQuRWqs9pU9EbjDP4CfRpYt_4PEaPJ33voJQrpuGgnl8UPW" }}>
          <PayPalButtons
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: total.toFixed(2),
                  },
                }],
              });
            }}
            onApprove={async (data, actions) => {
              const details = await actions.order.capture();
              alert('Transaction completed by ' + details.payer.name.given_name);
              // Call your backend to generate the invoice
              await generateInvoice({
                customerId: 'exampleCustomerId', // Replace with actual customer ID
                products: cartItems.map(item => ({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                })),
                totalAmount: total,
              });
              // Optionally navigate to an invoice page or display a success message
              navigate('/invoice'); // Adjust this route as necessary
            }}
          />
        </PayPalScriptProvider>
      )}
    </div>
  );
}

// PropTypes validation
Cart.propTypes = {
  cartItems: PropTypes.array.isRequired,
  onDecreaseQuantity: PropTypes.func.isRequired,
  onIncreaseQuantity: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
};

export default Cart;
