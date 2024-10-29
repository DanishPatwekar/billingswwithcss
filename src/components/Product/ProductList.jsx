import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../../services/api.js';
import './productlist.css'
import 'bootstrap/dist/css/bootstrap.min.css';

function ProductList({ role, onAddToCart = null }) {
  const [products, setProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([{ id: '', name: '', description: '', price: '', image: '' }]);
  const [editProduct, setEditProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showaddproduct, setShowaddproduct] = useState(false);
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch (error) {
        setErrorMessage('Error fetching products. Please try again.');
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    const invalidProduct = newProducts.find(
      (product) => !product.id || !product.name || !product.price || parseFloat(product.price) <= 0
    );
    if (invalidProduct) {
      setErrorMessage('Each product must have a valid ID, Name, and positive Price.');
      return;
    }

    setLoading(true);
    try {
      const response = await Promise.all(newProducts.map((product) => addProduct(product)));
      setProducts([...products, ...response.map((res) => res.data)]);
      setNewProducts([{ id: '', name: '', description: '', price: '', image: '' }]);
      setErrorMessage('');
      alert('Products added successfully.');
    } catch (error) {
      setErrorMessage('Failed to add products. Please try again.');
      console.error('Error adding products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNewProductField = () => {
    setNewProducts([...newProducts, { id: '', name: '', description: '', price: '', image: '' }]);
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = newProducts.map((product, idx) =>
      idx === index ? { ...product, [field]: value } : product
    );
    setNewProducts(updatedProducts);
  };

  const handleDeleteProduct = async (productId) => {
    setLoading(true);
    try {
      await deleteProduct(productId);
      setProducts(products.filter((p) => p.id !== productId));
      alert('Product deleted successfully.');
    } catch (error) {
      console.error('Error deleting product:', error);
      setErrorMessage('Failed to delete product. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const handleshowaddproduct=()=>{
    setShowaddproduct(true)
  }
  const handlecloseaddproduct=()=>{
    setShowaddproduct(false)
  }
  const handleUpdateProduct = async () => {
    if (!editProduct || parseFloat(editProduct.price) <= 0) {
      setErrorMessage('Price must be a positive number.');
      return;
    }

    setLoading(true);
    try {
      const response = await updateProduct(editProduct.id, editProduct);
      setProducts(products.map((p) => (p.id === editProduct.id ? response.data : p)));
      setEditProduct(null);
      alert('Product updated successfully.');
    } catch (error) {
      setErrorMessage('Failed to update product. Please try again.');
      console.error('Error updating product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      {loading && <p>Loading...</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <div className="container">
        <button type="button" onClick={handleshowaddproduct}>add product</button>
      <div className="row">
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="card d-flex col-mt-4 mb-4 ms-4" style={{width:'18rem'}}>
              <img src={product.image} alt={product.name} style={{objectFit:'contain',height:'200px',margin:'3px'}} />
              <div className="card-body">
                  <h3 className="card-title">{product.name.substring(0,20)}....</h3>
                  <p className="card-text">Description: {product.description.substring(0,50)}....</p>
                  <p>Price: {product.price}&#8377;</p>
                  <p>Product ID: {product.id}</p>
              {role === 'admin' && (
                <>
                  <div className="footerbox">
                    <button onClick={() => setEditProduct(product)} disabled={loading} className={`btn ${loading ? 'btn-secondary' : 'btn-primary'}`}  >Edit</button>
                    <button onClick={() => handleDeleteProduct(product.id)} disabled={loading} className="btn btn-primary" >Delete</button>
                  </div>
                </>
              )}
              </div>
              {role === 'customer' && onAddToCart && (
                <button onClick={() => onAddToCart(product)} disabled={loading}>Add to Cart</button>
              )}
              
            </div>
          ))
        )}
        </div>
      </div>

     {showaddproduct &&( <div className="customeradd">
      {role === 'admin' && (
        <div className='customeradd'>
          <h3>Add New Products</h3>
          {newProducts.map((product, index) => (
            <div key={index} className="product-form">
              <input
                placeholder="Product ID"
                value={product.id}
                onChange={(e) => handleProductChange(index, 'id', e.target.value)}
              />
              <input
                placeholder="Name"
                value={product.name}
                onChange={(e) => handleProductChange(index, 'name', e.target.value)}
              />
              <input
                placeholder="Description"
                value={product.description}
                onChange={(e) => handleProductChange(index, 'description', e.target.value)}
              />
              <input
                placeholder="Price"
                type="number"
                step="0.01"
                value={product.price}
                onChange={(e) => handleProductChange(index, 'price', e.target.value)}
              />
              <input
                placeholder="Image URL"
                value={product.image}
                onChange={(e) => handleProductChange(index, 'image', e.target.value)}
              />
            </div>
          ))}
          <div className="footet">
              <button onClick={addNewProductField}>Add Another Product</button>
              <button onClick={handleAddProduct}>Add Products</button>
          </div>
          <button id='close'onClick={handlecloseaddproduct} >Close</button>
          
        </div>
      )}

     </div>  )}

      {editProduct && (
        <div>
          <h3>Edit Product</h3>
          <input
            placeholder="Name"
            value={editProduct.name}
            onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
          />
          <input
            placeholder="Description"
            value={editProduct.description}
            onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
          />
          <input
            placeholder="Price"
            type="number"
            value={editProduct.price}
            onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
          />
          <button onClick={handleUpdateProduct}>Update Product</button>
          <button onClick={() => setEditProduct(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

ProductList.propTypes = {
  role: PropTypes.string.isRequired,
  onAddToCart: PropTypes.func,
};

export default ProductList;
