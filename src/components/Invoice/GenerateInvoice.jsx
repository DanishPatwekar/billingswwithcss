import { useState } from 'react';
import { generateInvoice } from '../../services/api';

function GenerateInvoice() {
  const [formData, setFormData] = useState({ customerId: '' });
  const [message, setMessage] = useState('');
  const [productInputs, setProductInputs] = useState([{ id: '', price: '', quantity: 1 }]);
  const [loading, setLoading] = useState(false);

  const handleProductChange = (index, field, value) => {
    const updatedInputs = [...productInputs];
    updatedInputs[index][field] = value;
    setProductInputs(updatedInputs);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    setProductInputs([...productInputs, { id: '', price: '', quantity: 1 }]);
  };

  const handleRemoveProduct = (index) => {
    const updatedInputs = productInputs.filter((_, i) => i !== index);
    setProductInputs(updatedInputs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const invoiceData = {
      customer: { id: formData.customerId }, // Ensure customer ID is correctly structured
      products: productInputs.map(product => ({
        productId: product.id,
        price: parseFloat(product.price),
        quantity: parseInt(product.quantity, 10),
      })),
    };
  
    try {
      const response = await generateInvoice(invoiceData);
      setMessage(`Invoice generated successfully! ID: ${response.data.id}`);
      setProductInputs([{ id: '', price: '', quantity: 1 }]); // Reset products
      setFormData({ customerId: '' }); // Reset customer ID
    } catch (error) {
      if (error.response) {
        console.error('Error generating invoice:', error.response.data);
        setMessage(`Failed to generate invoice: ${error.response.data.message || 'Invalid data sent.'}`);
      } else {
        setMessage('Failed to generate invoice. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  

  const totalAmount = productInputs.reduce((total, product) => {
    const price = parseFloat(product.price) || 0;
    const quantity = parseInt(product.quantity, 10) || 0;
    return total + (price * quantity);
  }, 0);

  return (
    <div>
      <h2>Generate Invoice</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Customer ID"
          value={formData.customerId}
          onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
          required
        />
        {productInputs.map((input, index) => (
          <div key={index}>
            <input
              placeholder="Product ID"
              value={input.id}
              onChange={(e) => handleProductChange(index, 'id', e.target.value)}
              required
            />
            <input
              placeholder="Price"
              type="number"
              value={input.price}
              onChange={(e) => handleProductChange(index, 'price', e.target.value)}
              required
            />
            <input
              placeholder="Quantity"
              type="number"
              value={input.quantity}
              onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
              min="1"
              required
            />
            <button type="button" onClick={() => handleRemoveProduct(index)}>Remove</button>
          </div>
        ))}
        <button onClick={handleAddProduct}>Add Another Product</button>

        <p>Total Amount: ${totalAmount.toFixed(2)}</p>
        <button type="submit" disabled={loading}>{loading ? 'Generating...' : 'Generate Invoice'}</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default GenerateInvoice;
