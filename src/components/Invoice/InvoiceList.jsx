import { useEffect, useState } from 'react';
import { getInvoices } from '../../services/api';
import jsPDF from 'jspdf';

function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await getInvoices();
        console.log('Raw API response:', response.data); // Log the raw response for debugging

        // Directly use the response data assuming it's already in the correct format
        const invoiceData = response.data; // No need to JSON.parse if it's already an object

        // Ensure it's an array and set state
        setInvoices(Array.isArray(invoiceData) ? invoiceData : []);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        setError('Failed to load invoices. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleDownloadInvoice = (invoice) => {
    const doc = new jsPDF();

    // Set document title
    doc.setFontSize(20);
    doc.text(`Invoice ID: ${invoice.id}`, 10, 10);
    
    // Add customer details
    doc.setFontSize(12);
    doc.text(`Customer Name: ${invoice.customer.name}`, 10, 20);
    doc.text(`Total Amount: $${invoice.totalAmount.toFixed(2)}`, 10, 30);
    doc.text(`Status: ${invoice.status}`, 10, 40);
    
    // Adding products to the PDF
    doc.text('Products:', 10, 50);
    let y = 60; // Starting y position for products
    invoice.products.forEach((product, index) => {
      doc.text(`${index + 1}. Product ID: ${product.productId}, Price: $${product.price}, Quantity: ${product.quantity}`, 10, y);
      y += 10; // Space between product lines
    });

    // Save the PDF
    doc.save(`Invoice_${invoice.id}.pdf`);
  };

  if (loading) {
    return <p>Loading invoices...</p>;
  }

  return (
    <div>
      <h2>Invoice List</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {invoices.length === 0 ? (
        <p>No invoices available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(invoice => (
              <tr key={invoice.id}>
                <td>{invoice.id}</td>
                <td>{invoice.customer.name}</td> {/* Accessing the customer's name correctly */}
                <td>${invoice.totalAmount.toFixed(2)}</td>
                <td>{invoice.status}</td>
                <td>
                  <button onClick={() => handleDownloadInvoice(invoice)}>Download PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default InvoiceList;
