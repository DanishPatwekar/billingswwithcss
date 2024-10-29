import { useState } from 'react';
import { recordPayment, getPaymentStatus } from '../../services/api';

function Payment() {
  const [invoiceId, setInvoiceId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentMessage, setPaymentMessage] = useState('');
  const [loading, setLoading] = useState(false); // New loading state

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const response = await recordPayment(invoiceId, { amount });
      setPaymentMessage(response.data.message); // Message from backend
      setPaymentStatus(''); // Clear previous status
    } catch (error) {
      console.error('Error recording payment:', error);
      setPaymentMessage('Failed to record payment.');
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleCheckStatus = async () => {
    setLoading(true); // Start loading
    try {
      const response = await getPaymentStatus(invoiceId);
      setPaymentStatus(response.data.status); // Status from backend
      setPaymentMessage(''); // Clear previous message
    } catch (error) {
      console.error('Error fetching payment status:', error);
      setPaymentStatus('Failed to fetch payment status.');
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div>
      <h2>Record Payment</h2>
      <form onSubmit={handleRecordPayment}>
        <label>
          Invoice ID:
          <input
            type="text"
            value={invoiceId}
            onChange={(e) => setInvoiceId(e.target.value)}
            required
          />
        </label>
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0" // Prevent negative amounts
          />
        </label>
        <button type="submit" disabled={loading}> {/* Disable button when loading */}
          {loading ? 'Processing...' : 'Record Payment'}
        </button>
      </form>
      <p>{paymentMessage}</p>

      <h2>Check Payment Status</h2>
      <label>
        Invoice ID:
        <input
          type="text"
          value={invoiceId}
          onChange={(e) => setInvoiceId(e.target.value)}
          required
        />
      </label>
      <button onClick={handleCheckStatus} disabled={loading}> {/* Disable button when loading */}
        {loading ? 'Checking...' : 'Check Status'}
      </button>
      <p>Payment Status: {paymentStatus}</p>
    </div>
  );
}

export default Payment;
